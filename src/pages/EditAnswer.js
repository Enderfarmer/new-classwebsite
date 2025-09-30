import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../db";
import { Spinner } from "react-bootstrap";

export default function EditAnswer() {
    const { subject, key, akey } = useParams();
    const [answer, setAnswer] = useState(null);
    const [content, setContent] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const dbRef = ref(db, `forum/${subject}/${key}/answers/${akey}`);
        onValue(dbRef, (snapshot) => {
            setAnswer(snapshot.val());
            setContent(snapshot.val().content);
        });
    }, [subject, key, akey]);
    if (!answer) {
        return <Spinner />;
    }
    return (
        <div className="container">
            <h1>Eine Antwort zu einem Forum-Post bearbeiten</h1>
            <form
                className="container"
                onSubmit={(e) => {
                    e.preventDefault();
                    const dbRef = ref(
                        db,
                        `forum/${subject}/${key}/answers/${akey}`
                    );
                    update(dbRef, {
                        content,
                        posted_at: Date.now(),
                    })
                        .then(() => {
                            window.location.hash = `/forum-post/${subject}/${key}`;
                        })
                        .catch(() => {
                            setError(true);
                        });
                }}
            >
                {error && (
                    <p className="text-danger">
                        Bist du dir sicher, dass du diese Antwort bearbeiten
                        darfst?
                    </p>
                )}
                <div className="form-group form-floating">
                    <textarea
                        className="form-control"
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.currentTarget.value)}
                    />
                    <label htmlFor="content">Inhalt</label>
                </div>
                <button type="submit" className="btn btn-primary m-3">
                    Speichern
                </button>
            </form>
        </div>
    );
}
