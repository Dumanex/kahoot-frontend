import { Volume2 } from "lucide-react";
import Card from "../ui/Card";

function QuestionDisplay({question, phase}) {
    return (
        <Card className="flex flex-col items-center gap-4 p-6 text-center md:p-8">
            <h2 className="font-display text-2xl md:text-3xl">{question.questionText}</h2>
            {question.imageUrl && (
                <img src={question.imageUrl} alt="" width="300" className="rounded-md border border-line" />
            )}
            {question.audioUrl && phase === 'answering' && (
                <div className="flex items-center gap-2 text-ink/60">
                    <Volume2 size={18} />
                    <audio key={question.id} src={question.audioUrl} autoPlay controls />
                </div>
            )}
        </Card>
    );
}

export default QuestionDisplay;
