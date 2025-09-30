import { useState } from "react";
import { push, ref } from "firebase/database";
import db, { auth } from "../db"; // Adjust the import according to your project structure
import DeleteIcon from "../components/DeleteIcon";

export default function NewNew() {
    const [title, setTitle] = useState("");
    const [paragraphs, setParagraphs] = useState([""]);

    const handleAddParagraph = () => {
        setParagraphs([...paragraphs, ""]);
    };

    const handleParagraphChange = (index, value) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index] = value;
        setParagraphs(newParagraphs);
    };

    return (
        <div className="container">
            <h1>Neuer News-Artikel</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    if (title && paragraphs.length) {
                        push(ref(db, "news"), {
                            name: title,
                            content: paragraphs,
                            posted_at: Date.now(),
                            author: auth.currentUser.email,
                        }).then((value) => {
                            window.location.hash = `/news/${value.key}`;
                        });
                    }
                }}
                id="form"
            >
                <div className="form-group form-floating m-3">
                    <input
                        type="text"
                        id="title"
                        placeholder=" "
                        value={title}
                        className="form-control"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="title">Die Kopfzeile</label>
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
                <button type="submit" className="btn btn-primary">
                    Hinzufügen
                </button>
            </form>
        </div>
    );
}
