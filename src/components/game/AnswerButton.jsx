import { Triangle, Diamond, Circle, Square } from "lucide-react";

const COLOR_MAP = {
    RED: '#a9603f',
    BLUE: '#46647a',
    YELLOW: '#a9863f',
    GREEN: '#4b5d46',
};

const SYMBOL_ICONS = {
    TRIANGLE: Triangle,
    DIAMOND: Diamond,
    CIRCLE: Circle,
    SQUARE: Square,
};

function AnswerButton({answer, onClick, disabled}) {
    const Icon = SYMBOL_ICONS[answer.symbol] || Circle;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{ backgroundColor: COLOR_MAP[answer.color] || '#6b6b6b' }}
            className="flex items-center gap-3 rounded-md p-4 text-left text-white transition-transform hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <Icon size={22} fill="currentColor" />
            <span>{answer.answerText}</span>
        </button>
    );
}

export default AnswerButton;
