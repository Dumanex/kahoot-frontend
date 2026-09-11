import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";
import useAuthStore from "../stores/authStore";
import { translateErrorResponse } from "../utils/errorMessages";

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Korisnicko ime" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input 
                    type="password" 
                    placeholder="Lozinka" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Prijavi se</button>
            </form>
            {error && <p>{error}</p>}
            <Link to="/register">Nemas nalog? Registruj se</Link>
        </div>
    );
}

export default Login;