import { KeyRound } from "lucide-react";

function PinInput({value, onChange}) {
    const handleChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);

        onChange(digitsOnly);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <KeyRound size={20} className="text-ink/50" />
            <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={value}
                onChange={handleChange}
                required
                className="w-full max-w-xs border-b-2 border-line bg-transparent text-center font-display text-4xl tracking-[0.3em] text-ink placeholder:text-ink/20 focus:outline-none focus:border-moss"
            />
        </div>
    );
}

export default PinInput;
