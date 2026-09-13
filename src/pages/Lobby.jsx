import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import useGameStore from "../stores/gameStore";
import PinInput from "../components/common/PinInput";

function Lobby() {
    const [pin, setPin] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setPinCode = useGameStore((state) => state.setPinCode);
    const setNicknameInStore = useGameStore((state) => state.setNickname);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await getSession(pin);

            if (response.data.status !== 'WAITING') {
                if (response.data.status !== 'IN_PROGRESS') {
                    setError('Igra je završena');
                    return;
                }
                setError('Igra je već počela');
                return;
            }

            setPinCode(pin);
            setNicknameInStore(nickname);
            navigate(`/play/${pin}`);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        }
    };

    return (
        <div>
            <h1>Pridruži se igri</h1>
            <form onSubmit={handleSubmit}>
                <PinInput value={pin} onChange={setPin} />
                <input
                    type="text"
                    placeholder="Nadimak"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    minLength={2}
                    maxLength={30}
                    required
                />
                <button type="submit">Pridruži se</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Lobby;