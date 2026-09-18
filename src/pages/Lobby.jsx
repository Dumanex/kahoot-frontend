import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, ArrowRight, CircleAlert } from "lucide-react";
import { getSession } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import useGameStore from "../stores/gameStore";
import PinInput from "../components/common/PinInput";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Lobby() {
    const location = useLocation();
    const prefilledPin = location.state?.pin || '';
    const prefilledTitle = location.state?.quizTitle;

    const [pin, setPin] = useState(prefilledPin);
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setPinCode = useGameStore((state) => state.setPinCode);
    const setNicknameInStore = useGameStore((state) => state.setNickname);
    const resetGame = useGameStore((state) => state.reset);

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

            resetGame();
            setPinCode(pin);
            setNicknameInStore(nickname);
            navigate(`/play/${pin}`);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        }
    };

    return (
        <PageShell center>
            <Card className="w-full max-w-sm p-6 text-center">
                <h1 className="mb-6 font-display text-2xl">Pridruži se igri</h1>
                {prefilledTitle && <p className="mb-4 text-ink/60">Pridružuješ se: {prefilledTitle}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {!prefilledPin && <PinInput value={pin} onChange={setPin} />}
                    <Input
                        icon={User}
                        placeholder="Nadimak"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        minLength={2}
                        maxLength={30}
                        required
                    />
                    <Button type="submit" size="lg" icon={ArrowRight} className="w-full">Pridruži se</Button>
                </form>

                {error && (
                    <p className="mt-4 flex items-center justify-center gap-2 text-sm text-rust">
                        <CircleAlert size={16} />
                        {error}
                    </p>
                )}
            </Card>
        </PageShell>
    );
}

export default Lobby;
