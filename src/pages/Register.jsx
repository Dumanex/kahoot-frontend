import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, CircleAlert } from 'lucide-react';
import { register } from '../api/authApi';
import useAuthStore from '../stores/authStore';
import { translateErrorResponse } from '../utils/errorMessages';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
      const response = await register(username, email, password);
      const { token, id, username: name, email: mail } = response.data;
      authLogin({ id, username: name, email: mail }, token);
      navigate('/dashboard');
    } catch (err) {
      setError(translateErrorResponse(err.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell center>
      <Card className="w-full max-w-sm p-6">
        <h1 className="mb-6 text-center font-display text-2xl">Registracija</h1>
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
            icon={Mail}
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Lozinka"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" icon={UserPlus} className="w-full" disabled={submitting}>Registruj se</Button>
        </form>

        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-rust">
            <CircleAlert size={16} />
            {error}
          </p>
        )}

        <Link to="/login" className="mt-4 block text-center text-sm text-ink/60 hover:text-moss underline-offset-2 hover:underline">
          Imaš nalog? Prijavi se
        </Link>
      </Card>
    </PageShell>
  );
}

export default Register;
