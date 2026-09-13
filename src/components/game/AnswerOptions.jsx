import AnswerButton from "./AnswerButton";

function AnswerOptions({answers, onSelect, disabled}) {
    return (
        <div>
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