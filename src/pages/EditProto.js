import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import db, { auth } from "../db";
import { beginWithCapital } from "../utils";
import DeleteIcon from "../components/DeleteIcon";

export default function EditProto() {
    const [proto, setProto] = useState(null);
    const [paragraphs, setParagraphs] = useState([""]);
    const { subject, id } = useParams();
    const [wasAt, setWasAt] = useState(new Date());
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
        const dbRef = ref(db, `protocols/${subject}/${id}`);
        onValue(dbRef, (snapshot) => {
            console.log(snapshot.val());
            setProto({ id: snapshot.key, ...snapshot.val() });
            setParagraphs(snapshot.val().content);
            setWasAt(new Date(snapshot.val().was_at));
        });
    }, [id, subject]);
    if (!proto) return <Spinner />;
    console.log(proto);
    const editFormSubmit = (e) => {
        e.preventDefault();
        set(ref(db, `protocols/${subject}/${id}`), {
            was_at: wasAt.getTime(),
            content: paragraphs,
            author: auth.currentUser.email,
        })
            .then(() => {
                window.location.hash = `protokoll/${subject}/${id}`;
            })
            .catch(() => setError(true));
    };

    return (
        <div className="container">
            <form onSubmit={editFormSubmit}>
                <h1>Dieses Protokoll bearbeiten</h1>
                <span className="text-danger">
                    {error &&
                        "Das Protokoll konnte nicht geändert werden. Hast du es wirklich geschrieben?"}
                </span>
                <h3>Die Paragraphen</h3>
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
                                className="cursor-pointer text-danger"
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
                        Wann war die {`${beginWithCapital(subject)}stunde?`}
                    </label>
                    <input
                        type="date"
                        id="was_at"
                        defaultValue={`${wasAt.getFullYear()}-${
                            wasAt.getMonth() + 1 < 10
                                ? `0${wasAt.getMonth() + 1}`
                                : wasAt.getMonth() + 1
                        }-${
                            wasAt.getDate() + 1 < 10
                                ? `0${wasAt.getDate() + 1}`
                                : wasAt.getDate() + 1
                        }`}
                        onChange={(e) => setWasAt(e.currentTarget.valueAsDate)}
                    />
                </div>

                <button type="submit" className="btn btn-primary m-3">
                    Änderungen bestätigen
                </button>
            </form>
        </div>
    );
}
