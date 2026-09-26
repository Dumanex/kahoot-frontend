import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Inbox, Home } from "lucide-react";
import { getGameState } from "../api/gameApi";
import Leaderboard from "../components/game/Leaderboard";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

function Results() {
    const { pin } = useParams();
    const [leaderboard, setLeaderboard] = useState(null);

    useEffect(() => {
        getGameState(pin)
            .then((response) => setLeaderboard(response.data.status === 'COMPLETED' ? response.data.leaderboard : []))
            .catch(() => setLeaderboard([]));
    }, [pin]);

    return (
        <PageShell center>
            <div className="w-full max-w-md">
                <h1 className="mb-6 text-center font-display text-2xl">Konačni rezultati</h1>

                {leaderboard === null ? (
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                ) : leaderboard.length === 0 ? (
                    <Card className="flex items-center gap-2 text-ink/50">
                        <Inbox size={18} />
                        <span>Rezultati ove partije nisu dostupni.</span>
                    </Card>
                ) : (
                    <Leaderboard entries={leaderboard} />
                )}

                <div className="mt-6 flex justify-center">
                    <Button to="/" variant="ghost" icon={Home}>Nazad na početnu</Button>
                </div>
            </div>
        </PageShell>
    );
}

export default Results;
