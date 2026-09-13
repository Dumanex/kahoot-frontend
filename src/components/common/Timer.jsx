import { useEffect, useState } from "react";

function Timer({seconds}) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        setRemaining(seconds);

        const interval = setInterval(() => {
            setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    return <p>Preostalo vreme: {remaining}s</p>;
}

export default Timer;