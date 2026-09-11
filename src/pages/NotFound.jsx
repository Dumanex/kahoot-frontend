import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h1>Stranica nije pronadjena</h1>
            <Link to="/">Nazad na pocetnu</Link>
        </div>
    );
}

export default NotFound;