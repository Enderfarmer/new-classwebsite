import { push, ref } from "firebase/database";
import db, { auth } from "../db";

export default function NewRiddle() {
    return (
        <div className="container">
            <h1>Neues Rätsel erstellen</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const text = e.target.question.value;
                    const answer = e.target.answer.value;
                    push(ref(db, "arti-qs"), {
                        text,
                        answer,
                        author: auth.currentUser.email,
                    }).then(() => {
                        window.history.back();
                    });
                }}
            >
                <div className="mb-3 form-group form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="question"
                        placeholder=" "
                        name="question"
                        required
                    />
                    <label htmlFor="question" className="form-label">
                        Frage
                    </label>
                </div>
                <div className="mb-3 form-group form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="answer"
                        name="answer"
                        placeholder=" "
                        required
                    />
                    <label htmlFor="answer" className="form-label">
                        Antwort
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Rätsel erstellen
                </button>
            </form>
        </div>
    );
}
