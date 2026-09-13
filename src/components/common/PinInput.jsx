function PinInput({value, onChange}) {
    const handleChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
        
        onChange(digitsOnly);
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={value}
            onChange={handleChange}
            required
        />
    );
}

export default PinInput;