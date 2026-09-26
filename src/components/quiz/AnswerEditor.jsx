import { Trash2 } from "lucide-react";

function AnswerEditor({ answer, index, onTextChange, onMarkCorrect, onRemove, canRemove }) {
    return (
      <label className="flex items-center gap-3 rounded-md border border-line p-3 has-[:checked]:border-moss has-[:checked]:bg-moss-soft">
        <input
          type="radio"
          name="correctAnswer"
          checked={answer.isCorrect}
          onChange={() => onMarkCorrect(index)}
          className="accent-moss"
        />
        <input
          type="text"
          placeholder={`Odgovor ${index + 1}`}
          value={answer.answerText}
          onChange={(e) => onTextChange(index, e.target.value)}
          required
          className="flex-1 bg-transparent focus:outline-none"
        />
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Ukloni odgovor ${index + 1}`}
            title={`Ukloni odgovor ${index + 1}`}
            className="cursor-pointer text-ink/40 hover:text-rust"
          >
            <Trash2 size={16} />
          </button>
        )}
      </label>
    );
}

export default AnswerEditor;
