// a basic component that renders a link to the forum for each subject

import "../styles/SubjectForums.css";
import React from "react";
import { Link } from "react-router-dom";

export const subjects = [
    { id: "deutsch", name: "Deutsch", color: "red", text: "white" },
    { id: "mathe", name: "Mathe", color: "blue", text: "white" },
    { id: "englisch", name: "Englisch", color: "green", text: "white" },
    { id: "geschichte", name: "Gesch.", color: "yellow", text: "black" },
    { id: "bio", name: "Biologie", color: "lime", text: "black" },
    { id: "physik", name: "Physik", color: "cyan", text: "black" },
    { id: "chemie", name: "Chemie", color: "black", text: "white" },
    { id: "informatik", name: "Informatik", color: "orange", text: "black" },
    { id: "musik", name: "Musik", color: "skyblue", text: "black" },
    { id: "kunst", name: "BK", color: "pink", text: "black" },
    { id: "NWT", name: "NWT", color: "black", text: "white" },
    { id: "ethik", name: "Eth/Reli", color: "purple", text: "white" },
    { id: "geographie", name: "Geo", color: "brown", text: "white" },
    { id: "gesellschaftskunde", name: "GK", color: "magenta", text: "white" },
    { id: "spanish", name: "Spanisch", color: "gold", text: "black" },
    { id: "french", name: "Französisch", color: "silver", text: "black" },
    { id: "latin", name: "Latein", color: "teal", text: "white" },
];
export default function SubjectForums() {
    return (
        <div className="container">
            <h1>Ein Forum + Hausaufgabenliste + Übungen für jedes Fach</h1>
            <div className="d-flex flex-wrap">
                {subjects.map((subject) => (
                    <div
                        key={subject.id}
                        className="border border-1 rounded rounded-3 d-flex subject-item"
                    >
                        <div
                            className={`h-100 w-25 d-flex align-items-center justify-content-center p-2 text-${subject.text}`}
                            style={{ background: subject.color }}
                        >
                            {subject.name}
                        </div>
                        <div className="p-2">
                            <Link
                                to={`/forum/${subject.id}`}
                                className="d-inline me-3"
                            >
                                Forum
                            </Link>
                            {!["Sport", "Kunst", "Ethik/Reli"].includes(
                                subject.name
                            ) && (
                                <Link
                                    to={`/hausaufgaben/${subject.id}`}
                                    className="d-inline m-2"
                                >
                                    Hausis
                                </Link>
                            )}
                            <Link to={`/exercises/${subject.id}`}>Übungen</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
