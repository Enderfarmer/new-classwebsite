// a basic component that renders a link to the forum for each subject

import "../styles/SubjectForums.css";
import React from "react";
import { Link } from "react-router-dom";

export const subjects = [
    { id: "deutsch", name: "Deutsch", color: "red" },
    { id: "mathe", name: "Mathe", color: "blue" },
    { id: "englisch", name: "Englisch", color: "green" },
    { id: "geschichte", name: "Gesch.", color: "yellow" },
    { id: "bio", name: "Biologie", color: "lime" },
    { id: "physik", name: "BNT-T", color: "cyan" },
    // { id: 'chemie', name: 'Chemie' },
    // { id: 'informatik', name: 'Informatik' },
    { id: "musik", name: "Musik", color: "skyblue" },
    { id: "kunst", name: "BK", color: "pink" },
    { id: "NWT", name: "NWT", color: "black" },
    { id: "ethik", name: "Eth/Reli", color: "purple" },
    { id: "geographie", name: "Geo", color: "brown" },
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
                            className={`h-100 w-25 d-flex align-items-center justify-content-center p-2 ${
                                [
                                    "NWT",
                                    "Mathe",
                                    "Englisch",
                                    "Eth/Reli",
                                    "Geo",
                                ].includes(subject.name)
                                    ? "text-white"
                                    : "text-dark"
                            }`}
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
