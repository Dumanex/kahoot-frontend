function QuestionDisplay({question}) {
    return (
        <div>
            <h2>{question.questionText}</h2>
            {question.imageUrl && <img src={question.imageUrl} alt="" width="300" />}
            {question.audioUrl && <audio key={question.id} src={question.audioUrl} autoPlay />}
        </div>
    );
}

export default QuestionDisplay;