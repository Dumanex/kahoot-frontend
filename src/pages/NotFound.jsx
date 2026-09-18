import { Compass, Home } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import Button from "../components/ui/Button";

function NotFound() {
    return (
        <PageShell center>
            <div className="flex flex-col items-center gap-4 text-center">
                <Compass size={48} className="text-ink/30" />
                <h1 className="font-display text-2xl">Stranica nije pronađena</h1>
                <Button to="/" variant="secondary" icon={Home}>Nazad na početnu</Button>
            </div>
        </PageShell>
    );
}

export default NotFound;
