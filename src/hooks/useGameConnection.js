import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useGameStore from "../stores/gameStore";
import useAuthStore from "../stores/authStore"
import { getGameState, rejoinGame } from "../api/gameApi";
import { API_URL } from "../api/axios";
import { translateMessage, translateErrorResponse } from "../utils/errorMessages";
import { loadPlayer, clearPlayer } from "../utils/playerStorage";

const REVEAL_MS = 3000;

function applyQuestion(question) {
    const offset = question.serverTime ? Date.now() - question.serverTime : 0;
    const startedAt = question.questionStartedAt ? question.questionStartedAt + offset : Date.now();
    const revealEndsAt = startedAt + REVEAL_MS;
    const questionDeadline = revealEndsAt + question.timeLimitSeconds * 1000;
    const secondsLeft = Math.ceil((questionDeadline - Date.now()) / 1000);

    const isNewQuestion = useGameStore.getState().currentQuestion?.id !== question.id;

    useGameStore.setState({
        status: 'playing',
        currentQuestion: question,
        revealEndsAt,
        questionDeadline,
        timeRemaining: Math.min(question.timeLimitSeconds, Math.max(0, secondsLeft)),
        ...(isNewQuestion && {
            answeredCount: 0,
            chosenAnswerId: null,
            lastAnswerResult: null,
            roundResults: [],
            questionFinalized: false,
            serverError: '',
        }),
    });
}

export function useGameConnection(pinCode, { isHost = false } = {}) {
    const clientRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!pinCode) return;

        if (!isHost) {
            const { pinCode: storedPin, playerId } = useGameStore.getState();

            if (storedPin !== pinCode || !playerId) {
                const saved = loadPlayer(pinCode);

                if (!saved) {
                    navigate('/join', { replace: true, state: { pin: pinCode } });
                    return;
                }

                useGameStore.getState().reset();
                useGameStore.setState({
                    pinCode,
                    playerId: saved.playerId,
                    nickname: saved.nickname,
                    rejoinToken: saved.rejoinToken,
                });
            }
        }

        const leaveAsPlayer = (message) => {
            clearPlayer(pinCode);
            useGameStore.getState().reset();
            navigate('/join', { replace: true, state: { joinError: message } });
        };

        const syncState = async () => {
            let state;

            try {
                state = (await getGameState(pinCode)).data;
            } catch (err) {
                const message = translateErrorResponse(err.response?.data);

                if (isHost) {
                    navigate('/dashboard', { replace: true, state: { modalError: message } });
                } else {
                    leaveAsPlayer(message);
                }
                return;
            }

            useGameStore.setState({
                quizTitle: state.quizTitle,
                players: state.players,
                leaderboard: state.leaderboard,
            });

            if (state.status === 'COMPLETED') {
                useGameStore.setState({ status: 'results' });
                return;
            }

            if (state.status === 'IN_PROGRESS' && state.currentQuestion) {
                applyQuestion(state.currentQuestion);
                useGameStore.setState({
                    answeredCount: state.answeredCount,
                    questionFinalized: state.questionFinalized,
                    ...(state.roundResults && { roundResults: state.roundResults }),
                });
            } else {
                useGameStore.setState({ status: 'idle' });
            }

            if (isHost) return;

            const { playerId, rejoinToken } = useGameStore.getState();

            try {
                const player = (await rejoinGame(pinCode, playerId, rejoinToken)).data;
                useGameStore.setState({
                    playerId: player.id,
                    nickname: player.nickname,
                    chosenAnswerId: player.chosenAnswerId,
                    lastAnswerResult: player.currentAnswerResult,
                });
            } catch (err) {
                const statusCode = err.response?.status;

                if (statusCode === 403 || statusCode === 404) {
                    leaveAsPlayer(translateErrorResponse(err.response?.data));
                }
            }
        };

        const client = new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws`),
            reconnectDelay: 5000,

            beforeConnect: (stompClient) => {
                if (isHost) {
                    const token = useAuthStore.getState().token;
                    stompClient.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};
                    return;
                }

                const { playerId, rejoinToken } = useGameStore.getState();
                stompClient.connectHeaders = playerId ? { playerId: String(playerId), rejoinToken } : {};
            },

            onConnect: () => {
                client.subscribe(`/topic/game/${pinCode}/players`, (msg) => {
                    useGameStore.setState({ players: JSON.parse(msg.body) });
                });

                client.subscribe(`/topic/game/${pinCode}/question`, (msg) => {
                    applyQuestion(JSON.parse(msg.body));
                });

                client.subscribe(`/topic/game/${pinCode}/leaderboard`, (msg) => {
                    useGameStore.setState({ leaderboard: JSON.parse(msg.body) });
                });

                client.subscribe(`/topic/game/${pinCode}/answered`, (msg) => {
                    useGameStore.setState({ answeredCount: JSON.parse(msg.body).answeredCount });
                });

                client.subscribe('/user/queue/errors', (msg) => {
                    useGameStore.setState({ serverError: translateMessage(JSON.parse(msg.body).message) });
                });

                if (!isHost) {
                    client.subscribe('/user/queue/answer-accepted', (msg) => {
                        const accepted = JSON.parse(msg.body);

                        if (accepted.questionId === useGameStore.getState().currentQuestion?.id) {
                            useGameStore.setState({ chosenAnswerId: accepted.chosenAnswerId });
                        }
                    });

                    client.subscribe('/user/queue/answer-result', (msg) => {
                        useGameStore.setState({ lastAnswerResult: JSON.parse(msg.body) });
                    });
                }

                client.subscribe(`/topic/game/${pinCode}/round-results`, (msg) => {
                    const results = JSON.parse(msg.body);
                    const { playerId } = useGameStore.getState();
                    const mine = results.find((r) => r.playerId === playerId);

                    useGameStore.setState({
                        roundResults: results,
                        questionFinalized: true,
                        ...(mine && { lastAnswerResult: mine }),
                    });
                });

                client.subscribe(`/topic/game/${pinCode}/started`, () => {
                    useGameStore.setState({ status: 'playing' });
                });

                client.subscribe(`/topic/game/${pinCode}/ended`, (msg) => {
                    const result = JSON.parse(msg.body);
                    useGameStore.setState({ status: 'results', leaderboard: result.leaderboard });
                });

                syncState();
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
    }, [pinCode, isHost, navigate]);

    const finalizeQuestion = () => {
        clientRef.current?.publish({
            destination: `/app/game/${pinCode}/finalize`,
            body: ''
        });
    };

    const sendAnswer = (questionId, answerId) => {
        const { playerId, rejoinToken } = useGameStore.getState();

        clientRef.current?.publish({
            destination: `/app/game/${pinCode}/answer`,
            body: JSON.stringify({ playerId, rejoinToken, questionId, answerId })
        });
    };

    return { sendAnswer, finalizeQuestion };
}
