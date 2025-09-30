import { ref, remove } from "firebase/database";
import db, { auth } from "../db";
import ExerciseEditForm from "../components/ExerciseEditForm";
import DeleteIcon from "../components/DeleteIcon";
import EditLink from "../components/EditLink";
import { Accordion } from "react-bootstrap";

export default function Exercise({ exercise, subject }) {
    return (
        <div
            key={exercise.id}
            className="border border-1 rounded rounded-3 post p-4 w-50"
        >
            <h4>{exercise.title}</h4>
            <hr />
            {!(exercise.type && exercise.type === "quiz") ? (
                exercise.content
            ) : (
                <>
                    {exercise.questions.map((question, i) => (
                        <div
                            key={i}
                            className="border border-1 rounded rounded-3 p-4"
                        >
                            {question.question}
                            {question.answers.map((option, index) => {
                                return (
                                    <div className="d-flex">
                                        <input
                                            type="radio"
                                            name={`${i}-answer`}
                                            id={`${question.question}-answer-${index}`}
                                            onClick={(e) => {
                                                const img =
                                                    e.currentTarget.nextSibling
                                                        .nextSibling;
                                                const span = img.nextSibling;
                                                img.src = option.right
                                                    ? "/right.svg"
                                                    : "/wrong.svg";
                                                img.hidden = false;
                                                span.textContent = option.right
                                                    ? "Richtig!"
                                                    : "Falsch.";
                                                span.setAttribute(
                                                    "class",
                                                    `fs-5 ${
                                                        option.right
                                                            ? "text-success"
                                                            : "text-danger"
                                                    }`
                                                );
                                            }}
                                        />
                                        <label
                                            htmlFor={`${question.question}-answer-${index}`}
                                        >
                                            {option.text}
                                        </label>
                                        <img
                                            src={null}
                                            alt="Richtig oder falsch"
                                            hidden
                                        />
                                        <span className="fs-5"></span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </>
            )}
            <br />
            {auth.currentUser && (
                <div>
                    <hr />
                    {exercise.type && exercise.type === "quiz" && (
                        <EditLink
                            to={`/edit-quiz/${subject}/${exercise.id}`}
                            className="mx-2"
                        />
                    )}
                    <span
                        className="text-danger cursor-pointer"
                        onClick={() => {
                            remove(
                                ref(db, `exercises/${subject}/${exercise.id}`)
                            );
                        }}
                    >
                        <DeleteIcon className="m-2 me-1" /> löschen
                    </span>
                </div>
            )}
            {!(exercise.type && exercise.type === "quiz") && (
                <Accordion>
                    {auth.currentUser && (
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Übung bearbeiten
                            </Accordion.Header>
                            <Accordion.Body>
                                <ExerciseEditForm
                                    exercise={exercise}
                                    subject={subject}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Antwort überprüfen</Accordion.Header>
                        <Accordion.Body>
                            {exercise.answer
                                ? exercise.answer
                                : "Keine Antwort gegeben"}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}
        </div>
    );
}
