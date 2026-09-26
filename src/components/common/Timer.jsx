import { useEffect } from "react";
import { Clock } from "lucide-react";
import useGameStore from "../../stores/gameStore";

function Timer({ deadline }) {
    const timeRemaining = useGameStore((s) => s.timeRemaining);
    const setTimer = useGameStore((s) => s.setTimer);

    useEffect(() => {
        const tick = () => {
            const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setTimer(remaining);
            return remaining;
        };

        if (tick() <= 0) return;

        const interval = setInterval(() => {
            if (tick() <= 0) {
                clearInterval(interval);
            }
        }, 250);

        return () => clearInterval(interval);
    }, [deadline, setTimer]);

    const urgent = timeRemaining <= 3;

    return (
        <div className={`flex flex-col items-center gap-1 ${urgent ? 'text-rust' : 'text-ink'}`}>
            <Clock size={20} />
            <p className="font-display text-5xl md:text-6xl">{timeRemaining}</p>
            <p className="text-sm text-ink/60">sekundi</p>
        </div>
    );
}

export default Timer;
