function QuestionDisplay({question}) {
    return (
        <div>
            <h2>{question.questionText}</h2>
            {question.imageUrl && <img src={question.imageUrl} alt="" width="300" />}
            {question.audioUrl && <audio src={question.audioUrl} controls />}
        </div>
    );
}

export default QuestionDisplay;