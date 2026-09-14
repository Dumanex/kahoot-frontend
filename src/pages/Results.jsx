import { Link } from "react-router-dom";
import useGameStore from "../stores/gameStore";
import Leaderboard from "../components/game/Leaderboard";

function Results() {
    const leaderboard = useGameStore((state) => state.leaderboard);

    return (
        <div>
            <h1>Konačni rezultati</h1>
            {leaderboard.length === 0 ? (
                <p>Nema podataka - otvori ovu stranicu preko dugmeta na kraju partije.</p>
            ) : (
                <Leaderboard entries={leaderboard} />
            )}
            <Link to={"/"}>Nazad na početnu</Link>
        </div>
    );
}

export default Results;