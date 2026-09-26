const key = (pin) => `player-${pin}`;

export function savePlayer(pin, player) {
    try {
        sessionStorage.setItem(key(pin), JSON.stringify(player));
        return true;
    } catch {
        return false;
    }
}

export function loadPlayer(pin) {
    try {
        const saved = sessionStorage.getItem(key(pin));
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export function clearPlayer(pin) {
    try {
        sessionStorage.removeItem(key(pin));
        return true;
    } catch {
        return false;
    }
}
