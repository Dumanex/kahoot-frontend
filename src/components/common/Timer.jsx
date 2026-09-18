import { useEffect } from "react";
import { Clock } from "lucide-react";
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
