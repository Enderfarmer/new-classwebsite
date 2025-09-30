import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import db, { auth } from "../db";
import DeleteIcon from "../components/DeleteIcon";

export default function EditNew() {
    const key = useParams().id;
    const [news, setNews] = useState({});
    const [paragraphs, setParagraphs] = useState([""]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState(false);

    const handleAddParagraph = () => {
        setParagraphs([...paragraphs, ""]);
    };

    const handleParagraphChange = (index, value) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index] = value;
        setParagraphs(newParagraphs);
    };
    useEffect(() => {
        const dbRef = ref(db, `news/${key}`);
        onValue(dbRef, (snapshot) => {
            setNews({ id: snapshot.key, ...snapshot.val() });
            setTitle(snapshot.val().name);
            setParagraphs(snapshot.val().content);
        });
    }, [key]);
    if (!news) return <Spinner />;
    const editFormSubmit = (e) => {
        e.preventDefault();
        set(ref(db, `news/${key}`), {
            name: title,
            posted_at: Date.now(),
            content: paragraphs,
            author: auth.currentUser.email,
        })
            .then(() => {
                window.location.hash = `news/${key}`;
            })
            .catch(() => setError(true));
    };

    return (
        <div className="container">
            <form onSubmit={editFormSubmit}>
                <h1>Einen News-Artikel bearbeiten</h1>
                <span className="text-danger">
                    {error &&
                        "Die Neuigkeit konnte nicht geändert werden. Hast du sie wirklich geschrieben?"}
                </span>
                <div className="form-group form-floating m-3">
                    <input
                        type="text"
                        id="title"
                        placeholder=" "
                        value={title}
                        className="form-control"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="title">Die Kopfzeile (Überschrift)</label>
                </div>
                {paragraphs.map((paragraph, index) => (
                    <div key={index} className="form-group m-3 form-floating">
                        <textarea
                            value={paragraph}
                            id={`p-${index + 1}`}
                            onChange={(e) =>
                                handleParagraphChange(index, e.target.value)
                            }
                            placeholder=" "
                            className="form-control"
                        />
                        <label htmlFor={`p-${index + 1}`}>
                            Paragraph {index + 1}
                        </label>
                        {index !== 0 && (
                            <span
                                onClick={() => {
                                    setParagraphs(
                                        paragraphs
                                            .slice(0, index)
                                            .concat(
                                                ...paragraphs.slice(index + 1)
                                            )
                                    );
                                }}
                                className="text-danger cursor-pointer"
                            >
                                <DeleteIcon /> Paragraph entfernen
                            </span>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddParagraph}
                    className="btn btn-outline-success"
                >
                    Paragraph hinzufügen
                </button>
                <button type="submit" className="btn btn-primary m-3">
                    Änderungen bestätigen
                </button>
            </form>
        </div>
    );
}
