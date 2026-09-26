import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, ArrowRight, CircleAlert } from "lucide-react";
import { joinGame } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import { savePlayer } from "../utils/playerStorage";
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
    const [error, setError] = useState(location.state?.joinError || '');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const resetGame = useGameStore((state) => state.reset);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const response = await joinGame(pin, nickname);
            const player = { playerId: response.data.id, nickname: response.data.nickname, rejoinToken: response.data.rejoinToken };

            resetGame();
            useGameStore.setState({ pinCode: pin, ...player });
            savePlayer(pin, player);
            navigate(`/play/${pin}`);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        } finally {
            setSubmitting(false);
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
                    <Button type="submit" size="lg" icon={ArrowRight} className="w-full" disabled={submitting}>Pridruži se</Button>
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
