function QuestionStats({roundResults, answers}) {
    const counts = answers.map((answer) => ({
        ...answer,
        count: roundResults.filter((r) => r.chosenAnswerId === answer.id).length
    }));

    return (
        <div>
            <h3>Raspodela odgovora</h3>
            <ul>
                {counts.map((a) => (
                    <li key={a.id}>{a.answerText}: {a.count}</li>
                ))}
            </ul>

            <h3>Rezultati ovog kruga</h3>
            <ul>
                {roundResults.map((r) => (
                    <li key={r.playerId}>
                        {r.nickname} - {r.isCorrect ? 'Tačno' : 'Netačno'} - +{r.pointsEarned} poena (streak: {r.streak})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuestionStats;