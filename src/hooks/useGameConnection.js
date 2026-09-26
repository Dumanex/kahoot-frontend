import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useGameStore from "../stores/gameStore";
import { translateMessage, extractTakenNickname } from "../utils/errorMessages";
import useAuthStore from "../stores/authStore"
import { saveResults } from "../utils/resultsStorage";

export function useGameConnection(pinCode, { isHost = false } = {}) {
    const clientRef = useRef(null);
    const questionStartRef = useRef(null);
    const navigate = useNavigate();

    const setPlayerId = useGameStore((s) => s.setPlayerId);
    const setPlayers = useGameStore((s) => s.setPlayers);
    const setCurrentQuestion = useGameStore((s) => s.setCurrentQuestion);
    const setTimer = useGameStore((s) => s.setTimer);
    const setLeaderboard = useGameStore((s) => s.setLeaderboard);
    const setStatus = useGameStore((s) => s.setStatus);
    const setAnsweredCount = useGameStore((s) => s.setAnsweredCount);
    const setLastAnswerResult = useGameStore((s) => s.setLastAnswerResult);
    const addRoundResult = useGameStore((s) => s.addRoundResult);

    useEffect(() => {
        if (!pinCode) return;

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,

            beforeConnect: (stompClient) => {
                if (!isHost) return;

                const token = useAuthStore.getState().token;
                stompClient.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};
            },

            onConnect: () => {
                client.subscribe(`/topic/game/${pinCode}/players`, (msg) => {
                    const players = JSON.parse(msg.body);
                    setPlayers(players);

                    const { playerId, nickname } = useGameStore.getState();
                    if (!playerId && nickname) {
                        const me = players.find((p) => p.nickname === nickname);

                        if (me) setPlayerId(me.id);
                    }
                });

                client.subscribe(`/topic/game/${pinCode}/question`, (msg) => {
                    const question = JSON.parse(msg.body);
                    setCurrentQuestion(question);
                    setTimer(question.timeLimitSeconds);
                    setAnsweredCount(0);
                    setLastAnswerResult(null);
                    useGameStore.setState({ roundResults: [] });
                    questionStartRef.current = null;
                });

                client.subscribe(`/topic/game/${pinCode}/leaderboard`, (msg) => {
                    setLeaderboard(JSON.parse(msg.body));
                });

                client.subscribe(`/topic/game/${pinCode}/answer-result`, (msg) => {
                    const result = JSON.parse(msg.body);
                    const { playerId, answeredCount } = useGameStore.getState();
                    setAnsweredCount(answeredCount + 1);
                    addRoundResult(result);

                    if (result.playerId === playerId) {
                        setLastAnswerResult(result);
                    }
                });

                client.subscribe(`/topic/game/${pinCode}/started`, () => {
                    setStatus('playing');
                });

                client.subscribe(`/topic/game/${pinCode}/ended`, (msg) => {
                    const result = JSON.parse(msg.body);
                    saveResults(pinCode, result.leaderboard);
                    setStatus('results');
                    setLeaderboard(result.leaderboard);
                });

                client.subscribe(`/topic/game/${pinCode}/error`, (msg) => {
                    const error = JSON.parse(msg.body);
                    const translated = translateMessage(error.message);
                    console.error('Greška iz igre:', translated);

                    if (isHost) return;

                    const takenNickname = extractTakenNickname(error.message);
                    const { nickname: myNickname, playerId } = useGameStore.getState();

                    if (takenNickname && takenNickname === myNickname && playerId == null) {
                        useGameStore.getState().reset();
                        navigate('/join', { state: { pin: pinCode, joinError: translated } });
                    }
                });

                if (!isHost) {
                    const { nickname } = useGameStore.getState();
                    client.publish({
                        destination: `/app/game/${pinCode}/join`,
                        body: JSON.stringify({ nickname })
                    });
                }
            },

            onStompError: (frame) => {
                console.error('STOMP greska:', frame.headers.message);

                if (isHost) {
                    client.deactivate();
                    useAuthStore.getState().logout();
                }
            }
        });

        client.activate();
        clientRef.current = client;

        return () => client.deactivate();
    }, [pinCode, isHost]);

    const markAnswerStart = () => {
        questionStartRef.current = Date.now();
    };

    const finalizeQuestion = () => {
        clientRef.current?.publish({
            destination: `/app/game/${pinCode}/finalize`,
            body: ''
        });
    };

    const sendAnswer = (questionId, answerId) => {
        const responseTimeMs = questionStartRef.current ? Date.now() - questionStartRef.current : 0;

        const { playerId } = useGameStore.getState();

        clientRef.current?.publish({
            destination: `/app/game/${pinCode}/answer`,
            body: JSON.stringify({playerId, questionId, answerId, responseTimeMs})
        });
    };

    return { sendAnswer, markAnswerStart, finalizeQuestion };
}
