const key = (pin) => `results-${pin}`;

export function saveResults(pin, leaderboard) {
    try {
        sessionStorage.setItem(key(pin), JSON.stringify(leaderboard));
        return true;
    } catch {
        return false;
    }
}

export function loadResults(pin) {
    try {
        const saved = sessionStorage.getItem(key(pin));
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}
