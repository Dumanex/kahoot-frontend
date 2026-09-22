import Card from "../ui/Card";
import { withRanks } from "../../utils/ranking";

function Leaderboard({entries}) {
    return (
        <Card className="p-0">
            {withRanks(entries).map((entry) => (
                <div
                    key={entry.playerId}
                    className="flex items-center justify-between border-b border-line px-4 py-3 last:border-0"
                >
                    <div className="flex items-center gap-3">
                        <span className="font-display text-lg text-ink/50">{entry.rank}</span>
                        <span>{entry.nickname}</span>
                    </div>
                    <span className="font-display font-semibold">{entry.score} poena</span>
                </div>
            ))}
        </Card>
    );
}

export default Leaderboard;
