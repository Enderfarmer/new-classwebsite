// a component that takes a subject from the URL and renders a list of exercises fetched from the firebase realtime db

import { useEffect, useState } from "react";
import { ref, onValue, limitToLast, query } from "firebase/database";
import db from "../db";
import "../styles/Exercises.css";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { beginWithCapital } from "../utils";

import Exercise from "../components/Exercise";
import CreateExercise from "../components/CreateExercise";

export default function Exercises() {
    const [exercises, setExercises] = useState(null);
    const subject = useParams().subject;

    useEffect(() => {
        const exercisesListRef = ref(db, `exercises/${subject}`);
        onValue(query(exercisesListRef, limitToLast(8)), (snapshot) => {
            let dataGot = [];
            snapshot.forEach((child) => {
                dataGot.push({
                    id: child.key,
                    ...child.val(),
                });
            });
            setExercises(dataGot);
        });
    }, [subject]);
    if (exercises === null) {
        return <Spinner />;
    }
    return (
        <div className="container">
            <h1>{beginWithCapital(subject)}-Übungen</h1>
            <CreateExercise subject={subject} />
            <div id="exercises">
                {exercises.map((exercise) => (
                    <Exercise exercise={exercise} subject={subject} />
                ))}
            </div>
        </div>
    );
}
