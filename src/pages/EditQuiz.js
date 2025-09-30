import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db, { auth } from "../db";
import { Spinner } from "react-bootstrap";

export default function EditQuiz() {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [what, setWhat] = useState("");
    const [dummyState, setDummyState] = useState(false);
    const { subject, id } = useParams();

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", answers: [] }]);
    };

    const handleQuestionTextChange = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].question = text;
        setQuestions(newQuestions);
    };
    const handleQuestionAnswerAdd = (index) => {
        const newQuestions = [...questions];

        newQuestions[index].answers.push({ right: false, text: "" });
        setQuestions(newQuestions);
    };
    const handleQuestionAnswerChange = (index, qindex, right, text) => {
        const newQuestions = [...questions];
        newQuestions[index].answers[qindex] = { right, text };
        setQuestions(newQuestions);
    };

    useEffect(() => {
        const dbRef = ref(db, `exercises/${subject}/${id}`);
        onValue(dbRef, (snapshot) => {
            setQuestions(snapshot.val().questions);
            setQuiz({ id: snapshot.key, ...snapshot.val() });
            setWhat(snapshot.val().title);
        });
    }, [subject, id]);
    if (!quiz) return <Spinner />;
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    update(ref(db, `exercises/${subject}/${id}`), {
                        questions,
                        title: what,
                        author: auth.currentUser.email,
                        type: "quiz",
                    }).then(() => {
                        window.history.back();
                    });
                }}
            >
                <div className="form-group form-floating">
                    <input
                        type="text"
                        id="what"
                        value={what}
                        onChange={(e) => setWhat(e.currentTarget.value)}
                        placeholder=" "
                        className="form-control"
                    />
                    <label htmlFor="what">Was wird geübt?</label>
                </div>
                <div>
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="border border-1 rounded rounded-3 p-3"
                        >
                            <h2>Frage {index + 1}</h2>
                            <div className="form-group form-floating mt-4">
                                <input
                                    type="text"
                                    defaultValue={q.question}
                                    id={`${index}-q`}
                                    className="form-control"
                                    placeholder=" "
                                    onChange={(e) =>
                                        handleQuestionTextChange(
                                            index,
                                            e.currentTarget.value
                                        )
                                    }
                                    required
                                />
                                <label htmlFor={`${index}-q`}>Die Frage</label>
                            </div>
                            <hr />
                            <fieldset className="p-2 my-3">
                                <legend>Antwortoptionen</legend>
                                {q.answers.map((a, i) => (
                                    <div
                                        key={i}
                                        className="border border-1 rounded rounded-3 p-3"
                                    >
                                        <h4>Antwort {i + 1}</h4>
                                        <div className="form-group form-floating mb-3">
                                            <input
                                                type="text"
                                                defaultValue={a.text}
                                                className="form-control"
                                                placeholder=" "
                                                id={`${index}-answer${i}`}
                                                onChange={(e) =>
                                                    handleQuestionAnswerChange(
                                                        index,
                                                        i,
                                                        !!a.right,
                                                        e.currentTarget.value
                                                    )
                                                }
                                                required
                                            />
                                            <label
                                                htmlFor={`${index}-answer${i}`}
                                            >
                                                Textinhalt
                                            </label>
                                        </div>
                                        <div className="form-group form-check">
                                            <input
                                                type="checkbox"
                                                id={`${index}-answer${i}-right`}
                                                className="form-control form-check-input mx-1"
                                                defaultChecked={a.right}
                                                onChange={(e) =>
                                                    handleQuestionAnswerChange(
                                                        index,
                                                        i,
                                                        e.currentTarget.checked,
                                                        a.text ? a.text : ""
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor={`${index}-answer${i}-right`}
                                                className="form-label form-check-label"
                                            >
                                                Richtig
                                            </label>
                                        </div>
                                        {i > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger m-3"
                                                onClick={() => {
                                                    let newQuestions =
                                                        questions.map(
                                                            (
                                                                question,
                                                                qIndex
                                                            ) => {
                                                                if (
                                                                    qIndex ===
                                                                    index
                                                                ) {
                                                                    return {
                                                                        ...question,
                                                                        answers:
                                                                            question.answers.filter(
                                                                                (
                                                                                    _,
                                                                                    answerIndex
                                                                                ) =>
                                                                                    answerIndex !==
                                                                                    i
                                                                            ),
                                                                    };
                                                                }
                                                                return question;
                                                            }
                                                        );

                                                    console.log(
                                                        "Before deletion:",
                                                        questions[index].answers
                                                    );
                                                    console.log(
                                                        "After deletion:",
                                                        newQuestions[index]
                                                            .answers
                                                    );

                                                    setQuestions(newQuestions);
                                                    setDummyState(!dummyState);
                                                    console.log(questions);
                                                }}
                                            >
                                                Diese Antwortmöglichkeit löschen
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuestionAnswerAdd(index)
                                    }
                                    className="btn btn-outline-success m-3"
                                >
                                    Antwort hinzufügen
                                </button>
                            </fieldset>
                            <button
                                type="button"
                                className="btn btn-outline-danger m-3"
                                onClick={() => {
                                    console.log("hello");
                                    let newQuestions = questions;
                                    newQuestions.splice(index, 1);
                                    console.log(newQuestions);
                                    setQuestions(newQuestions);
                                    setDummyState(!dummyState);
                                }}
                            >
                                Diese Frage löschen
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="btn btn-outline-success m-3"
                    >
                        Frage hinzufügen
                    </button>
                    <button type="submit" className="btn btn-primary m-2">
                        Bearbeitung bestätigen
                    </button>
                </div>
            </form>
        </div>
    );
}
