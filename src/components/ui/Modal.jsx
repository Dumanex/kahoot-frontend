import Card from "./Card";
import Button from "./Button";

function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
            <Card className="w-full max-w-sm p-6 text-center">
                {title && <h2 className="mb-3 font-display text-lg">{title}</h2>}
                <p className="mb-5 text-sm text-ink/80">{children}</p>
                <Button onClick={onClose} className="w-full justify-center">U redu</Button>
            </Card>
        </div>
    );
}

export default Modal;
