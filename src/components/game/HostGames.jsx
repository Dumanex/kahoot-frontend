import { Play, Users, Globe, Lock, Trophy, ListOrdered, History } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const pad = (value) => String(value).padStart(2, '0');

function formatDate(value) {
    const date = new Date(value);
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}. ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ActiveGames({ games }) {
    if (games.length === 0) return null;

    return (
        <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Partije u toku</h2>
            <div className="flex flex-col gap-3">
                {games.map((game) => (
                    <Card key={game.pinCode} className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="font-medium">{game.quizTitle} <span className="text-ink/60">· PIN {game.pinCode}</span></p>
                            <div className="flex flex-wrap gap-2">
                                <Badge tone="moss">
                                    {game.status === 'WAITING'
                                        ? 'Čeka igrače'
                                        : `U toku, pitanje ${game.currentQuestionIndex + 1} od ${game.totalQuestions}`}
                                </Badge>
                                <Badge icon={Users}>{game.playerCount} igrača</Badge>
                                <Badge icon={game.visibility === 'PUBLIC' ? Globe : Lock}>
                                    {game.visibility === 'PUBLIC' ? 'Javna' : 'Privatna'}
                                </Badge>
                            </div>
                        </div>
                        <Button to={`/host/${game.pinCode}`} icon={Play}>Nastavi</Button>
                    </Card>
                ))}
            </div>
        </section>
    );
}

export function GameHistory({ games }) {
    return (
        <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Istorija partija</h2>

            {games.length === 0 ? (
                <Card className="flex items-center gap-2 text-ink/50">
                    <History size={18} />
                    <span>Još nema završenih partija</span>
                </Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {games.map((game) => (
                        <Card key={game.pinCode} className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="font-medium">{game.quizTitle} <span className="text-ink/60">· {formatDate(game.endedAt ?? game.createdAt)}</span></p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge icon={Users}>{game.playerCount} igrača</Badge>
                                    <Badge icon={Trophy} tone={game.winnerNickname ? 'moss' : 'neutral'}>
                                        {game.winnerNickname
                                            ? `Pobednik: ${game.winnerNickname} (${game.winnerScore} poena)`
                                            : 'Bez pobednika'}
                                    </Badge>
                                </div>
                            </div>
                            <Button to={`/results/${game.pinCode}`} variant="secondary" icon={ListOrdered}>Rezultati</Button>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
