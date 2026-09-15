import { useEffect } from "react";
import useGameStore from "../../stores/gameStore";

function Timer({seconds}) {
    const timeRemaining = useGameStore((s) => s.timeRemaining);
    const setTimer = useGameStore((s) => s.setTimer);

    useEffect(() => {
        const deadline = Date.now() + seconds * 1000;
        setTimer(seconds);

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
            setTimer(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    return <p>Preostalo vreme: {timeRemaining}s</p>;
}

export default Timer;