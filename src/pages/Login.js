import db, { auth } from "../db";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { ref, onValue, update, set } from "firebase/database";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import nameFromEMail, { addXP, updateLevel } from "../utils";

export default function Login() {
    const [hasError, setHasError] = useState(false);
    const [isInputActive, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    if (loading) return <Spinner />;
    return (
        <main className="d-flex justify-content-center align-items-center">
            <form
                action={
                    /** @param {FormData} formData*/ (formData) => {
                        setLoading(true);
                        setPersistence(auth, browserLocalPersistence).then(
                            () => {
                                signInWithEmailAndPassword(
                                    auth,
                                    formData.get("email"),
                                    formData.get("pwd")
                                )
                                    .then((userCredential) => {
                                        const user = userCredential.user;
                                        const today = new Date()
                                            .toISOString()
                                            .slice(0, 10); // "YYYY-MM-DD"
                                        const userRef = ref(
                                            db,
                                            `users/${user.uid}`
                                        );

                                        onValue(userRef, (snapshot) => {
                                            const userData = snapshot.val();
                                            if (!userData) {
                                                // new user — set initial profile
                                                set(userRef, {
                                                    name: nameFromEMail(
                                                        user.email
                                                    ),
                                                    email: user.email,
                                                    xp: 10,
                                                    level: 1,
                                                    badges: [],
                                                    lastLoginDate: today,
                                                    loginStreak: 1,
                                                });
                                            } else {
                                                // existing user — check lastLoginDate
                                                if (
                                                    userData.lastLoginDate !==
                                                    today
                                                ) {
                                                    // user hasn't logged in today yet
                                                    let newStreak = 1;
                                                    // if lastLoginDate == yesterday => streak +1
                                                    const yesterday = new Date(
                                                        Date.now() -
                                                            24 * 60 * 60 * 1000
                                                    )
                                                        .toISOString()
                                                        .slice(0, 10);
                                                    if (
                                                        userData.lastLoginDate ===
                                                        yesterday
                                                    ) {
                                                        newStreak =
                                                            userData.loginStreak +
                                                            1;
                                                    }
                                                    addXP(user, 10 * newStreak); // addXP also calls updateLevel
                                                    update(userRef, {
                                                        lastLoginDate: today,
                                                        loginStreak: newStreak,
                                                    });
                                                }
                                            }
                                        });
                                        updateLevel(user);
                                        window.history.back();
                                    })
                                    .catch((error) => {
                                        setHasError(true);
                                        setLoading(false);
                                        console.error(error);
                                    });
                            }
                        );
                    }
                }
                className="w-50 h-75 border border-1 rounded rounded-3 border-success text-center"
            >
                <h1 className="m-3">Zuerst anmelden, dann alles andere!</h1>
                <p style={{ color: "red" }}>
                    {hasError
                        ? "Entweder ist die E-Mail oder das Passwort falsch. Versuche es noch mal."
                        : ""}
                </p>
                <div className="form-floating">
                    <input
                        className={"rounded rounded-2 p-2 form-control".concat(
                            isInputActive ? " float-label-active" : ""
                        )}
                        placeholder=" "
                        type="email"
                        id="uname"
                        name="email"
                        onBlur={(e) => {
                            if (document.getElementById("uname").value) {
                                setActive(true);
                            } else setActive(false);
                        }}
                        aria-labelledby="uname-label"
                        required
                        autoComplete="username"
                        autoFocus
                    />
                    <label id="uname-label" htmlFor="uname">
                        E-Mail Addresse
                    </label>
                </div>

                <div className="form-floating mt-5">
                    <input
                        className="rounded rounded-2 p-2 form-control"
                        type="password"
                        id="pwd"
                        name="pwd"
                        aria-labelledby="pwd-label"
                        required
                        placeholder=" "
                        autoComplete="current-password"
                    />
                    <label id="pwd-label" htmlFor="pwd">
                        Passwort
                    </label>
                </div>
                <Link
                    to="/passwort-vergessen"
                    title="Passwort zurücksetzen"
                    className="d-block my-3"
                >
                    Passwort vergessen?
                </Link>
                <button className="w-75 btn btn-success my-3">Anmelden</button>
            </form>
        </main>
    );
}
