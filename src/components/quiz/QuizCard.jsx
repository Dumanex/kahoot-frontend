import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Play, Trash2, ListOrdered } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function QuizCard({quiz, onDelete, onHost, hostDisabled}) {
    const [isPublic, setIsPublic] = useState(false);

    return (
      <Card className="flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-lg">{quiz.title}</h3>
          {quiz.description && <p className="text-sm text-ink/60">{quiz.description}</p>}
        </div>

        <Badge icon={ListOrdered} className="self-start">{quiz.questions?.length ?? 0} pitanja</Badge>

        <Link to={`/quiz/${quiz.id}/edit`} className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-moss">
          <Pencil size={16} />
          Uredi
        </Link>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-moss"
          />
          Javna partija
        </label>

        <div className="flex items-center justify-between border-t border-line pt-3">
          <Button icon={Play} onClick={() => onHost(quiz.id, isPublic)} disabled={hostDisabled}>Host</Button>
          <Button variant="danger" icon={Trash2} onClick={() => onDelete(quiz.id)}>Obriši</Button>
        </div>
      </Card>
    );
}

export default QuizCard;
