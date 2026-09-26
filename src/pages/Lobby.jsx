import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, ArrowRight, CircleAlert } from "lucide-react";
import { joinGame } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import { savePlayer, loadSavedPlayer } from "../utils/playerStorage";
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
    const [joinAsNew, setJoinAsNew] = useState(false);
    const navigate = useNavigate();
    const resetGame = useGameStore((state) => state.reset);

    const savedPlayer = pin.length === 6 && !joinAsNew ? loadSavedPlayer(pin) : null;

    const handlePinChange = (value) => {
        setPin(value);
        setJoinAsNew(false);
    };

    const enterGame = (player) => {
        resetGame();
        useGameStore.setState({ pinCode: pin, ...player });
        savePlayer(pin, player);
        navigate(`/play/${pin}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (savedPlayer) {
            enterGame(savedPlayer);
            return;
        }

        setSubmitting(true);

        try {
            const response = await joinGame(pin, nickname);
            enterGame({ playerId: response.data.id, nickname: response.data.nickname, rejoinToken: response.data.rejoinToken });
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
                    {!prefilledPin && <PinInput value={pin} onChange={handlePinChange} />}

                    {savedPlayer ? (
                        <>
                            <p className="text-ink/70">
                                Već si u ovoj partiji kao <span className="font-semibold text-ink">{savedPlayer.nickname}</span>
                            </p>
                            <Button type="submit" size="lg" icon={ArrowRight} className="w-full">Nastavi</Button>
                            <button
                                type="button"
                                onClick={() => setJoinAsNew(true)}
                                className="cursor-pointer text-sm text-ink/60 underline-offset-2 hover:text-moss hover:underline"
                            >
                                Uđi kao novi igrač
                            </button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
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
