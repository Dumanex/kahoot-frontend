const key = (pin) => `player-${pin}`;

function read(storage, pin) {
    try {
        const saved = storage.getItem(key(pin));
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export function savePlayer(pin, player) {
    try {
        sessionStorage.setItem(key(pin), JSON.stringify(player));
        localStorage.setItem(key(pin), JSON.stringify(player));
        return true;
    } catch {
        return false;
    }
}

export function loadPlayer(pin) {
    return read(sessionStorage, pin);
}

export function loadSavedPlayer(pin) {
    return read(localStorage, pin);
}

export function clearPlayer(pin) {
    try {
        sessionStorage.removeItem(key(pin));
        localStorage.removeItem(key(pin));
        return true;
    } catch {
        return false;
    }
}
