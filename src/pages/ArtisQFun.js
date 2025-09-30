import { useEffect } from "react";
import { useState } from "react";
import db, { auth } from "../db";
import { onValue, ref, remove, update } from "firebase/database";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteIcon from "../components/DeleteIcon";

export default function ArtisQFun() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const dbRef = ref(db, "arti-qs");
        onValue(dbRef, (snapshot) => {
            const questions = [];
            snapshot.forEach((childSnapshot) => {
                questions.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            setQuestions(questions);
        });
    }, []);

    return (
        <div className="container">
            <h1>Rätselspaß mit Arti!</h1>
            {auth.currentUser &&
                auth.currentUser.email === "artem.kort@stiftsgymnasium.de" && (
                    <div className="d-flex justify-content-end">
                        <Link to={"new-riddle"}>Neues Rätsel erstellen</Link>
                    </div>
                )}
            {auth.currentUser && auth.currentUser.displayName}
            <div>
                {questions.length
                    ? questions.map((question) => (
                          <div
                              key={question.id}
                              className="border p-3 my-3 border-1 rounded rounded-3 w-75"
                          >
                              {question.text}
                              <hr className="mb-3" />
                              <DeleteIcon
                                  onClick={() => {
                                      remove(ref(db, `arti-qs/${question.id}`));
                                  }}
                              />
                              <Accordion>
                                  <Accordion.Item eventKey="0">
                                      <Accordion.Header>
                                          Vorgesehene Antwort
                                      </Accordion.Header>
                                      <Accordion.Body>
                                          {question.answer}
                                      </Accordion.Body>
                                  </Accordion.Item>
                                  {auth.currentUser &&
                                      auth.currentUser.email ===
                                          "artem.kort@stiftsgymnasium.de" && (
                                          <Accordion.Item eventKey="1">
                                              <Accordion.Header>
                                                  Bearbeiten
                                              </Accordion.Header>
                                              <Accordion.Body>
                                                  <form
                                                      onSubmit={(e) => {
                                                          e.preventDefault();
                                                          const text =
                                                              e.target.question
                                                                  .value;
                                                          const answer =
                                                              e.target.answer
                                                                  .value;
                                                          update(
                                                              ref(
                                                                  db,
                                                                  `arti-qs/${question.id}`
                                                              ),
                                                              {
                                                                  text,
                                                                  answer,
                                                              }
                                                          );
                                                      }}
                                                  >
                                                      <div className="mb-3 form-group form-floating">
                                                          <input
                                                              type="text"
                                                              className="form-control"
                                                              id="question"
                                                              placeholder=" "
                                                              name="question"
                                                              defaultValue={
                                                                  question.text
                                                              }
                                                              required
                                                          />
                                                          <label
                                                              htmlFor="question"
                                                              className="form-label"
                                                          >
                                                              Frage
                                                          </label>
                                                      </div>
                                                      <div className="mb-3 form-group form-floating">
                                                          <input
                                                              type="text"
                                                              className="form-control"
                                                              id="answer"
                                                              name="answer"
                                                              defaultValue={
                                                                  question.answer
                                                              }
                                                              placeholder=" "
                                                              required
                                                          />
                                                          <label
                                                              htmlFor="answer"
                                                              className="form-label"
                                                          >
                                                              Antwort
                                                          </label>
                                                      </div>
                                                      <button
                                                          type="submit"
                                                          className="btn btn-primary"
                                                      >
                                                          Speichern
                                                      </button>
                                                  </form>
                                              </Accordion.Body>
                                          </Accordion.Item>
                                      )}
                              </Accordion>
                          </div>
                      ))
                    : "Noch keine Rätsel vorhanden"}
            </div>
        </div>
    );
}
