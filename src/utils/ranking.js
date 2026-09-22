export function withRanks(entries) {
    let rank = 0;

    return entries.map((entry, index) => {
        if (index === 0 || entry.score !== entries[index - 1].score) {
            rank = index + 1;
        }

        return { ...entry, rank };
    });
}

export function everyoneScoredZero(entries) {
    return entries.length > 0 && entries.every((entry) => entry.score === 0);
}
