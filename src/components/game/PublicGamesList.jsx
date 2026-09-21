import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, ListOrdered, LogIn, Inbox } from "lucide-react";
import { getPublicGames } from "../../api/gameApi";
import Input from "../ui/Input";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function PublicGamesList({excludeHostName}) {
    const [query, setQuery] = useState('');
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    const loadGames = async (search) => {
        try {
            const response = await getPublicGames(search);
            setGames(response.data.content);
        } catch {
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
        <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl">Javne partije</h2>
            <Input
                icon={Search}
                placeholder="Pretraži po nazivu kviza, hostu ili PIN-u"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {visibleGames.length === 0 && (
                <Card className="flex items-center gap-2 text-ink/50">
                    <Inbox size={18} />
                    <span>Trenutno nema aktivnih javnih partija</span>
                </Card>
            )}

            <div className="flex flex-col gap-3">
                {visibleGames.map((game) => (
                    <Card key={game.pinCode} className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-medium">{game.quizTitle}</p>
                            <p className="text-sm text-ink/60">PIN: {game.pinCode} · host: {game.hostName}</p>
                            <div className="mt-2 flex gap-2">
                                <Badge icon={ListOrdered}>{game.totalQuestions} pitanja</Badge>
                                <Badge icon={Users}>{game.playerCount} igrača</Badge>
                            </div>
                        </div>
                        <Button icon={LogIn} onClick={() => handleJoin(game)}>Pridruži se</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default PublicGamesList;
