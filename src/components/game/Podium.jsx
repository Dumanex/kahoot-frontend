import { Trophy, Medal } from "lucide-react";
import { withRanks } from "../../utils/ranking";

const RANK_STYLES = [
    { icon: Trophy, iconClass: "text-moss", height: "h-24" },
    { icon: Medal, iconClass: "text-ink/50", height: "h-16" },
    { icon: Medal, iconClass: "text-ink/40", height: "h-10" },
];

function Podium({leaderboard}) {
    const top3 = withRanks(leaderboard).slice(0, 3);
    const order = [top3[1], top3[0], top3[2]];

    return (
        <div>
            <div className="flex items-end justify-center gap-4">
                {order.map((entry) => {
                    if (!entry) return null;
                    const { icon: Icon, iconClass, height } = RANK_STYLES[entry.rank - 1];
                    return (
                        <div key={entry.playerId} className="flex w-28 flex-col items-center">
                            <div className="flex flex-col items-center gap-2 rounded-t-md border border-b-0 border-line bg-mist p-4">
                                <Icon size={28} className={iconClass} />
                                <span className="font-display text-lg">{entry.rank}</span>
                                <span className="text-center text-sm">{entry.nickname}</span>
                                <span className="font-display font-semibold">{entry.score}</span>
                            </div>
                            <div className={`w-full rounded-b-md border border-line bg-mist ${height}`} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Podium;
