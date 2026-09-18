import AnswerButton from "./AnswerButton";

function AnswerOptions({answers, onSelect, disabled}) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {answers.map((answer) => (
                <AnswerButton
                    key={answer.id}
                    answer={answer}
                    onClick={() => onSelect(answer.id)}
                    disabled={disabled}
                />
            ))}
        </div>
    );
}

export default AnswerOptions;
