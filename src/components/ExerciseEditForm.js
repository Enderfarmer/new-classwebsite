import { useState } from "react";
import { update, ref } from "firebase/database";
import { Alert } from "react-bootstrap";
import db from "../db";

export default function ExerciseEditForm({ exercise, subject }) {
    const [success, setSuccess] = useState(false);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const title = e.target.title.value;
                const content = e.target.content.value;
                update(ref(db, `exercises/${subject}/${exercise.id}`), {
                    title,
                    content,
                    answer: e.target.answer.value,
                }).then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 5000);
                });
            }}
        >
            <br />
            <h4>Bearbeiten</h4>
            {success && (
                <Alert
                    variant="success"
                    onClose={() => {
                        setSuccess(false);
                    }}
                    dismissible
                >
                    Änderungen erfolgreich
                </Alert>
            )}
            <br />
            <div className="form-group form-floating">
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="form-control"
                    defaultValue={exercise.title}
                />
                <label htmlFor="title">Name der Übung</label>
            </div>
            <br />
            <div className="form-group form-floating">
                <textarea
                    id="content"
                    name="content"
                    required
                    defaultValue={exercise.content}
                    className="form-control"
                />
                <label htmlFor="content">Inhalt der Übung</label>
            </div>
            <br />
            <div className="form-group form-floating">
                <textarea
                    type="text"
                    id="answer"
                    name="answer"
                    className="form-control"
                    defaultValue={exercise.answer}
                />
                <label htmlFor="answer">Antwort (optional)</label>
            </div>
            <button type="submit" className="btn btn-primary m-2">
                Änderungen bestätigen
            </button>
        </form>
    );
}
