const COLOR_MAP = {
    RED: '#e21b3c',
    BLUE: '#1368ce',
    YELLOW: '#d89e00',
    GREEN: '#26890c'
};

function AnswerButton({answer, onClick, disabled}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{backgroundColor: COLOR_MAP[answer.color] || "#ccc", color: "white", padding: "20px", minHeight: "60px"}}
        >
            {answer.answerText}
        </button>
    );
}

export default AnswerButton;