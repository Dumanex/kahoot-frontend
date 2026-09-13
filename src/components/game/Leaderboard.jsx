function Leaderboard({entries}) {
    return (
        <ol>
            {entries.map((entry) => (
                <li key={entry.playerId}>{entry.nickname} - {entry.score} poena</li>
            ))}
        </ol>
    );
}

export default Leaderboard;