import { CheckCircle2, XCircle, Flame, Triangle, Diamond, Circle, Square } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const COLOR_MAP = {
    RED: '#a9603f',
    BLUE: '#46647a',
    YELLOW: '#a9863f',
    GREEN: '#4b5d46',
};

const SYMBOL_ICONS = {
    TRIANGLE: Triangle,
    DIAMOND: Diamond,
    CIRCLE: Circle,
    SQUARE: Square,
};

function QuestionStats({roundResults, answers}) {
    const counts = answers.map((answer) => ({
        ...answer,
        count: roundResults.filter((r) => r.chosenAnswerId === answer.id).length
    }));
    const total = roundResults.length || 1;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <h3 className="mb-3 font-medium">Raspodela odgovora</h3>
                <div className="flex flex-col gap-2">
                    {counts.map((a) => {
                        const Icon = SYMBOL_ICONS[a.symbol] || Circle;
                        const color = COLOR_MAP[a.color] || '#6b6b6b';
                        return (
                            <div key={a.id} className="flex items-center gap-3">
                                <span
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white"
                                    style={{ backgroundColor: color }}
                                >
                                    <Icon size={16} fill="currentColor" />
                                </span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-mist">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${(a.count / total) * 100}%`, backgroundColor: color }}
                                    />
                                </div>
                                <span className="w-8 shrink-0 text-right text-sm text-ink/60">{a.count}</span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card>
                <h3 className="mb-3 font-medium">Rezultati ovog kruga</h3>
                <div className="flex flex-col">
                    {roundResults.map((r) => (
                        <div
                            key={r.playerId}
                            className="flex items-center justify-between border-b border-line py-2 last:border-0"
                        >
                            <div className="flex items-center gap-2">
                                {r.isCorrect ? (
                                    <CheckCircle2 size={18} className="text-moss" />
                                ) : (
                                    <XCircle size={18} className="text-rust" />
                                )}
                                <span>{r.nickname}</span>
                                {r.streak > 1 && (
                                    <Badge tone="moss" icon={Flame}>{r.streak}</Badge>
                                )}
                            </div>
                            <span className="font-display font-semibold">+{r.pointsEarned}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

export default QuestionStats;
