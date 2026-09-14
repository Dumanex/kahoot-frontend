import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicGames } from "../../api/gameApi";

function PublicGamesList({excludeHostName}) {
    const [query, setQuery] = useState('');
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    const loadGames = async (search) => {
        try {
            const response = await getPublicGames(search);
            setGames(response.data.content);
        } catch (err) {
            // empty list
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => loadGames(query), 300);
        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        const interval = setInterval(() => loadGames(query), 30000);
        return () => clearInterval(interval);
    }, [query]);

    const visibleGames = excludeHostName ? games.filter((g) => g.hostName !== excludeHostName) : games;

    const handleJoin = (game) => {
        navigate('/join', {state: {pin: game.pinCode, quizTitle: game.quizTitle}});
    };

    return (
        <div>
            <h2>Javne partije</h2>
            <input
                type="text"
                placeholder="Pretraži po nazivu kviza, hostu ili PIN-u"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {visibleGames.length === 0 && <p>Trenutno nema aktivnih javnih partija</p>}

            {visibleGames.map((game) => (
                <div key={game.pinCode}>
                    <p>{game.pinCode} | {game.quizTitle} - host: {game.hostName} - {game.totalQuestions} pitanja - {game.playerCount} igrača</p>
                    <button onClick={() => handleJoin(game)}>Pridruži se</button>
                </div>
            ))}
        </div>
    );
}

export default PublicGamesList;