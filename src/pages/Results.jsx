import { useParams } from "react-router-dom";
import { Inbox, Home } from "lucide-react";
import useGameStore from "../stores/gameStore";
import { loadResults } from "../utils/resultsStorage";
import Leaderboard from "../components/game/Leaderboard";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function Results() {
    const { pin } = useParams();
    const storeLeaderboard = useGameStore((state) => state.leaderboard);
    const leaderboard = loadResults(pin) ?? storeLeaderboard;

    return (
        <PageShell center>
            <div className="w-full max-w-md">
                <h1 className="mb-6 text-center font-display text-2xl">Konačni rezultati</h1>

                {leaderboard.length === 0 ? (
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
