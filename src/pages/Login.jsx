import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, LogIn, CircleAlert } from "lucide-react";
import { login } from "../api/authApi";
import useAuthStore from "../stores/authStore";
import { translateErrorResponse } from "../utils/errorMessages";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const authLogin = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(username, password);
            const {token, id, username: name, email} = response.data;
            authLogin({id, username: name, email}, token);
            navigate('/dashboard');
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        }
    };

    return (
        <PageShell center>
            <Card className="w-full max-w-sm p-6">
                <h1 className="mb-6 text-center font-display text-2xl">Prijava</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        icon={User}
                        placeholder="Korisničko ime"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Lozinka"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" icon={LogIn} className="w-full">Prijavi se</Button>
                </form>

                {error && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-rust">
                        <CircleAlert size={16} />
                        {error}
                    </p>
                )}

                <Link to="/register" className="mt-4 block text-center text-sm text-ink/60 hover:text-moss underline-offset-2 hover:underline">
                    Nemaš nalog? Registruj se
                </Link>
            </Card>
        </PageShell>
    );
}

export default Login;
