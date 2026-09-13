import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSession, startGame, nextQuestion, endGame } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import useGameStore from "../stores/gameStore";
import { useGameConnection } from "../hooks/useGameConnection";
import QuestionDisplay from "../components/game/QuestionDisplay";
import Leaderboard from "../components/game/Leaderboard";

function HostGame() {
    const { pin } = useParams();
    const [quizTitle, setQuizTitle] = useState('');
    const [error, setError] = useState('');

    const players = useGameStore((state) => state.players);
    const status = useGameStore((state) => state.status);
    const currentQuestion = useGameStore((state) => state.currentQuestion);
    const answeredCount = useGameStore((state) => state.answeredCount);
    const leaderboard = useGameStore((state) => state.leaderboard);

    useGameConnection(pin, { isHost: true });

    useEffect(() => {
        getSession(pin).then((response) => setQuizTitle(response.data.quizTitle));
    }, [pin]);

    const handleStart = async () => {
      setError('');
      try {
        await startGame(pin);
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      }
    };

     const handleNext = async () => {
      setError('');
      try {
        await nextQuestion(pin);
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      }
    };

    const handleEnd = async () => {
      setError('');
      try {
        await endGame(pin);
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      }
    };

    if (status === 'results') {
      return (
        <div>
          <h1>Igra je završena</h1>
          <Leaderboard entries={leaderboard} />
        </div>
      );
    }

    if (status !== 'playing') {
      return (
        <div>
          <h1>{quizTitle}</h1>
          <h2>PIN: {pin}</h2>
          {error && <p>{error}</p>}
          <h3>Igrači ({players.length}):</h3>
          <ul>
            {players.map((p) => (
              <li key={p.id}>{p.nickname}</li>
            ))}
          </ul>
          <button onClick={handleStart} disabled={players.length === 0}>Počni igru</button>
        </div>
      );
    }

    return (
      <div>
        {error && <p>{error}</p>}
        {currentQuestion && <QuestionDisplay question={currentQuestion} />}
        <p>Odgovorilo: {answeredCount} / {players.length}</p>
        <button onClick={handleNext}>Sledeće pitanje</button>
        <button onClick={handleEnd}>Završi igru</button>
      </div>
    );
}

export default HostGame;