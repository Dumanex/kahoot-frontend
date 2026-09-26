import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, LogIn, CircleAlert, ArrowLeft } from "lucide-react";
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
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const authLogin = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const response = await login(username, password);
            const {token, id, username: name, email} = response.data;
            authLogin({id, username: name, email}, token);
            navigate('/dashboard');
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageShell center>
            <div className="mb-2 w-full max-w-sm">
                <Button to="/" variant="ghost" icon={ArrowLeft} className="-ml-4">Nazad na početnu</Button>
            </div>

            <Card className="w-full max-w-sm p-6">
                <h1 className="mb-6 text-center font-display text-2xl">Prijava</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        icon={User}
                        placeholder="Korisničko ime"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Lozinka"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" icon={LogIn} className="w-full" disabled={submitting}>Prijavi se</Button>
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
