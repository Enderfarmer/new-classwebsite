import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, onValue, push, remove } from "firebase/database";
import db, { auth } from "../db";
import { formatDate } from "../utils";
import Spinner from "react-bootstrap/Spinner";
import DeleteIcon from "../components/DeleteIcon";
import EditLink from "../components/EditLink";

export default function ForumPost() {
    const [post, setPost] = useState(null);
    const [answers, setAnswers] = useState([]);
    const subject = useParams().subject;
    const key = useParams().key;
    useEffect(() => {
        const dbRef = ref(db, `forum/${subject}/${key}`);
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            setPost(data);
        });
        const answersRef = ref(db, `forum/${subject}/${key}/answers`);
        onValue(answersRef, (snapshot) => {
            let dataGot = [];
            snapshot.forEach((childSnapshot) => {
                dataGot.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            setAnswers(dataGot);
        });
    }, [subject, key]);
    if (!post) {
        return <Spinner />;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const text = document.getElementById("new-post-text").value;
        push(ref(db, `forum/${subject}/${key}/answers`), {
            content: text,
            author: auth.currentUser.email,
            posted_at: Date.now(),
        });
    };
    return (
        <div className="forum-post container">
            <div className="fw-bolder">
                <button onClick={() => window.history.back()} className="btn">
                    ← Zurück
                </button>
            </div>
            <h1>{post.title}</h1>
            <small>
                {formatDate(new Date(post.posted_at))}
                <br />
            </small>
            <br />
            <div>{post.content}</div>
            {auth.currentUser && post.author === auth.currentUser.email && (
                <div>
                    <EditLink to={`/edit-post/${subject}/${key}`} />
                    <DeleteIcon
                        onClick={() => {
                            remove(ref(db, `forum/${subject}/${key}`)).then(
                                () => {
                                    window.history.back();
                                }
                            );
                        }}
                    />
                </div>
            )}
            <div style={{ marginTop: "10%" }} />

            <h4>Antworten zu diesem Post:</h4>
            <div>
                {answers.length
                    ? answers.map((val, index) => {
                          return (
                              <div key={index} className="mb-4">
                                  {val.content} <br />
                                  <small>
                                      {formatDate(new Date(val.posted_at))}
                                  </small>
                                  <br />
                                  {auth.currentUser &&
                                      auth.currentUser.email === val.author && (
                                          <>
                                              <EditLink
                                                  to={`/edit-answer/${subject}/${key}/${val.id}`}
                                              />
                                              <DeleteIcon
                                                  onClick={() => {
                                                      remove(
                                                          ref(
                                                              db,
                                                              `forum/${subject}/${key}/${val.id}`
                                                          )
                                                      );
                                                  }}
                                              />
                                          </>
                                      )}
                              </div>
                          );
                      })
                    : "Noch keine Antworten zu diesem Post."}
                <hr />
                {auth.currentUser ? (
                    <form onSubmit={handleSubmit} className="mt-5">
                        <h4>Neue Antwort zu diesem Post</h4>
                        <div className="form-group form-floating">
                            <textarea
                                name="new-post-text"
                                id="new-post-text"
                                placeholder=" "
                                className="form-control"
                                required
                            ></textarea>
                            <label htmlFor="new-post-text">
                                Der Inhalt der neuen Antwort
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Antwort hinzufügen
                        </button>
                    </form>
                ) : (
                    "Du musst angemeldet sein, um eine Antwort schreiben zu können."
                )}
                <br />
                <br />
            </div>
        </div>
    );
}
//
