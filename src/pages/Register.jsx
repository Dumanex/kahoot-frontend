import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';
import useAuthStore from '../stores/authStore';
import { translateErrorResponse } from '../utils/errorMessages';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await register(username, email, password);
      const { token, id, username: name, email: mail } = response.data;
      authLogin({ id, username: name, email: mail }, token);
      navigate('/dashboard');
    } catch (err) {
      setError(translateErrorResponse(err.response?.data));
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registruj se</button>
      </form>
      {error && <p>{error}</p>}
      <Link to="/login">Imaš nalog? Prijavi se</Link>
    </div>
  );
}

export default Register;
