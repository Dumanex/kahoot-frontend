import { Trophy, Medal, Award } from "lucide-react";

const RANK_STYLES = [
    { icon: Trophy, iconClass: "text-moss", height: "h-40" },
    { icon: Medal, iconClass: "text-ink/50", height: "h-32" },
    { icon: Award, iconClass: "text-ink/40", height: "h-24" },
];

function Podium({leaderboard}) {
    const top3 = leaderboard.slice(0, 3);
    const order = [top3[1], top3[0], top3[2]];

    return (
        <div>
            <h2 className="mb-6 text-center font-display text-2xl">Top 3</h2>
            <div className="flex items-end justify-center gap-4">
                {order.map((entry, position) => {
                    if (!entry) return null;
                    const rank = position === 1 ? 0 : position === 0 ? 1 : 2;
                    const { icon: Icon, iconClass, height } = RANK_STYLES[rank];
                    return (
                        <div
                            key={entry.playerId}
                            className={`flex w-28 flex-col items-center justify-end gap-2 rounded-md border border-line bg-mist p-4 ${height}`}
                        >
                            <Icon size={28} className={iconClass} />
                            <span className="font-display text-lg">{rank + 1}</span>
                            <span className="text-center text-sm">{entry.nickname}</span>
                            <span className="font-display font-semibold">{entry.score}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Podium;
