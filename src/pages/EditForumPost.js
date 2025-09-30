// a component that allows the user to edit a forum post

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import db from "../db";
import { Spinner } from "react-bootstrap";

export default function EditForumPost() {
    const { subject, key } = useParams();
    const [post, setPost] = useState({});
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [error, setError] = useState(false);
    useEffect(() => {
        const dbRef = ref(db, `forum/${subject}/${key}`);
        onValue(dbRef, (snapshot) => {
            setPost(snapshot.val());
            setContent(snapshot.val().content);
            setTitle(snapshot.val().title);
        });
    }, [subject, key]);
    if (!post) {
        return <Spinner />;
    }
    return (
        <div className="container">
            <h1>Einen Forum-Post bearbeiten</h1>
            <form
                className="container"
                onSubmit={(e) => {
                    e.preventDefault();
                    const dbRef = ref(db, `forum/${subject}/${key}`);
                    update(dbRef, {
                        title,
                        content,
                        posted_at: Date.now(),
                    })
                        .then(() => {
                            window.location.hash = `/forum/${subject}/${key}`;
                        })
                        .catch(() => {
                            setError(true);
                        });
                }}
            >
                {error && (
                    <p className="text-danger">
                        Bist du dir sicher, dass du diesen Post bearbeiten
                        darfst?
                    </p>
                )}
                <div className="form-floating form-group">
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="title">Titel</label>
                </div>
                <br />
                <div className="form-floating form-group">
                    <textarea
                        className="form-control"
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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
