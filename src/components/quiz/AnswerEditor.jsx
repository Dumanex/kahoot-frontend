function AnswerEditor({ answer, index, onTextChange, onMarkCorrect, onRemove, canRemove }) {
    return (
      <div>
        <input
          type="radio"
          name="correctAnswer"
          checked={answer.isCorrect}
          onChange={() => onMarkCorrect(index)}
        />
        <input
          type="text"
          placeholder={`Odgovor ${index + 1}`}
          value={answer.answerText}
          onChange={(e) => onTextChange(index, e.target.value)}
          required
        />
        {canRemove && (
          <button type="button" onClick={() => onRemove(index)}>Ukloni</button>
        )}
      </div>
    );
}

export default AnswerEditor;