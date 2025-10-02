import { useState } from "react";
import { push, ref } from "firebase/database";
import db, { auth } from "../db"; // Adjust the import according to your project structure
import { subjects } from "./SubjectForums";
import DeleteIcon from "../components/DeleteIcon";
import { addXP } from "../utils";

export default function NewProto() {
    const [paragraphs, setParagraphs] = useState([""]);
    const [wasAt, setWasAt] = useState(null);
    const [subject, setSubject] = useState("deutsch");
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
            <h1>Neues Unterrichtsprotokoll</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    push(ref(db, `protocols/${subject}`), {
                        was_at: wasAt.getTime(),
                        content: paragraphs,
                        author: auth.currentUser.email,
                    }).then((value) => {
                        addXP(auth.currentUser, 500);
                        window.location.hash = `/protokoll/${subject}/${value.key}`;
                    });
                }}
                id="form"
            >
                <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                        Das Fach:
                    </label>
                    <select
                        id="subject"
                        className="form-control form-select"
                        onChange={(e) => {
                            setSubject(e.currentTarget.value);
                        }}
                    >
                        {subjects.map((subject) => (
                            <option value={subject.id} key={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
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
                            required
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
                <div className="form-group">
                    <label htmlFor="was_at">
                        Wann war die Unterrichtsstunde?
                    </label>
                    <input
                        type="date"
                        id="was_at"
                        className="form-control"
                        required
                        onChange={(e) => {
                            setWasAt(e.currentTarget.valueAsDate);
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Hinzufügen
                </button>
            </form>
        </div>
    );
}
