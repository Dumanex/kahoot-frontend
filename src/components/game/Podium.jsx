function Podium({leaderboard}) {
    const top3 = leaderboard.slice(0, 3);

    return (
        <div>
            <h2>Top 3</h2>
            <ol>
                {top3.map((entry) => (
                    <li key={entry.playerId}>{entry.nickname} - {entry.score} poena</li>
                ))}
            </ol>
        </div>
    );
}

export default Podium;