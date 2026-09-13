import { useParams } from "react-router-dom";
import useGameStore from "../stores/gameStore";
import { useGameConnection } from "../hooks/useGameConnection";

function PlayerGame() {
    const { pin } = useParams();
    const nickname = useGameStore((state) => state.nickname);
    const players = useGameStore((state) => state.players);
    const status = useGameStore((state) => state.status);

    useGameConnection(pin);

    return (
        <div>
            <h1>Player Game</h1>
            <p>PIN: {pin}</p>
            <p>Nadimak: {nickname}</p>
            <p>Status: {status}</p>
            <h2>Igrači u igri:</h2>
            <ul>
                {players.map((p) => (
                    <li key={p.id}>{p.nickname} - {p.score} poena</li>
                ))}
            </ul>
        </div>
    );
}

export default PlayerGame;