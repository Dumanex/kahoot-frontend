import { Link } from "react-router-dom"

function Home() {
    return (
        <div>
            <h1>Kahoot</h1>
            <Link to="/join">Pridruži se igri</Link>
            <br />
            <Link to="/login">Prijavi se</Link>
            <br />
            <Link to="/register">Registruj se</Link>
            <br />
        </div>
    );
}

export default Home