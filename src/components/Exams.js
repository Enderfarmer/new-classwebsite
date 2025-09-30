import React, { useState, useEffect } from "react";
import { onValue, ref, remove } from "firebase/database";
import db, { auth } from "../db";
import { formatDate } from "../utils";

export default function Exams() {
    const [exams, setExams] = useState([]);
    useEffect(() => {
        const examsRef = ref(db, "exams");
        onValue(examsRef, (snapshot) => {
            let examsList = [];
            snapshot.forEach((childSnapshot) => {
                const now = new Date(Date.now());
                const date = new Date(childSnapshot.val().is_at);
                if (
                    date.getFullYear() > now.getFullYear() ||
                    (date.getFullYear() === now.getFullYear() &&
                        (date.getMonth() > now.getMonth() ||
                            (date.getMonth() === now.getMonth() &&
                                date.getDate() >= now.getDate())))
                ) {
                    examsList.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val(),
                    });
                } else {
                    if (auth.currentUser) {
                        remove(ref(db, `exams/${childSnapshot.key}`));
                    }
                }
            });
            setExams(examsList);
        });
    }, []);
    return (
        <div className="container">
            <h2>Unsere Tests & Klassenarbeiten:</h2>
            <ul>
                {exams.length ? (
                    exams.map((exam) => (
                        <li key={exam.id}>
                            {exam.subject}-{exam.type} <br />
                            <small>
                                {formatDate(new Date(exam.is_at), true, false)}
                            </small>
                        </li>
                    ))
                ) : (
                    <div>Keine Tests oder Klassenarbeiten angekündigt</div>
                )}
            </ul>
        </div>
    );
}
