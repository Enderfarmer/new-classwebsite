import React, { useState, useEffect } from "react";
import db, { auth } from "../db";
import {
    limitToLast,
    onValue,
    query,
    ref,
    remove,
    set,
} from "firebase/database";
import CreateJoke from "../components/CreateJoke";
import { Spinner } from "react-bootstrap";
import PencilIcon from "../components/PencilIcon";
import DeleteIcon from "../components/DeleteIcon";
function Joke({ joke, index }) {
    const [editFormVisible, setEditFormVisible] = useState(false);
    const editFormSubmit = (e) => {
        e.preventDefault();
        const text = e.currentTarget.newtext.value;
        set(ref(db, `jokes/${joke.id}`), { text, author: joke.author }).then(
            () => {
                setEditFormVisible(false);
            }
        );
    };
    const deleteFormSubmit = () => {
        remove(ref(db, `jokes/${joke.id}`));
    };
    return (
        <li
            key={index}
            className="card border border-1 p-3 rounded rounded-3 w-50"
        >
            <div className="card-body">
                <q>{joke.text}</q>
                {auth.currentUser && auth.currentUser.email === joke.author && (
                    <>
                        {editFormVisible && (
                            <form onSubmit={editFormSubmit} className="m-3">
                                <div className="form-group form-floating mb-3">
                                    <textarea
                                        type="text"
                                        name="newtext"
                                        rows={3}
                                        id={"newtext"}
                                        defaultValue={joke.text}
                                        className="form-control"
                                        placeholder=" "
                                    />
                                    <label htmlFor="newtext">
                                        Der Witztext
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Änderungen bestätigen
                                </button>
                            </form>
                        )}
                        <PencilIcon
                            strokeWidth="2"
                            fill="orange"
                            width="25"
                            height="25"
                            className="mx-2 cursor-pointer"
                            aria-label="Witz ändern"
                            onClick={() => setEditFormVisible(!editFormVisible)}
                        />
                        <DeleteIcon
                            aria-label="Witz löschen"
                            onClick={deleteFormSubmit}
                        />
                    </>
                )}
            </div>
        </li>
    );
}
function Jokes() {
    const [jokes, setJokes] = useState([]);
    useEffect(() => {
        const jokesRef = ref(db, "jokes");
        onValue(jokesRef, (snapshot) => {
            const jokesList = [];
            snapshot.forEach((child) => {
                jokesList.push({ id: child.key, ...child.val() });
            });
            setJokes(jokesList.reverse());
        });
    }, []);

    return (
        <div className="container">
            <div>
                {auth.currentUser ? (
                    <CreateJoke />
                ) : (
                    <p>Bitte melde dich an, bevor du Witze schreiben kannst.</p>
                )}
            </div>
            <div>
                <h1 key={"title"}>Witzeseite</h1>
                <h2 className="mb-4" key={"newest-jokes"}>
                    Unsere neuesten Witze:
                </h2>
            </div>
            <ul>
                {jokes.map((joke, index) => (
                    <>{index < 10 && <Joke joke={joke} index={index} />}</>
                ))}
                {jokes.length >= 10 && <h2>Die schon älteren</h2>}
                {jokes.map((joke, index) => (
                    <>{index >= 10 && <Joke joke={joke} index={index} />}</>
                ))}
            </ul>
        </div>
    );
}
export function JokesForHomePage() {
    const [loading, setLoading] = useState(true);
    const [jokes, setJokes] = useState([]);
    useEffect(() => {
        const jokesRef = ref(db, "jokes");
        onValue(query(jokesRef, limitToLast(7)), (snapshot) => {
            const jokesList = [];
            snapshot.forEach((child) => {
                jokesList.push({ id: child.key, ...child.val() });
            });
            setJokes(jokesList);
            setLoading(false);
        });
    }, []);
    if (loading) return <Spinner />;
    return (
        <div className="container">
            <h2>Unsere neuesten Witze:</h2>
            <ul>
                {jokes.map((val, index) => (
                    <li key={`joke-${index}`}>
                        <q>{val.text}</q> <br />{" "}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Jokes;
