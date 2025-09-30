// a password resetting page
import React, { useState } from "react";
import { auth } from "../db";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [messageSent, setMessageSent] = useState(false);

    if (!messageSent) {
        return (
            <div className="container">
                <h1>Passwort zurücksetzen</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendPasswordResetEmail(auth, email)
                            .then(() => {
                                setMessageSent(true);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }}
                >
                    <div className="form-group form-floating">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder=" "
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control"
                        />
                        <label htmlFor="email">E-Mail</label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Passwort zurücksetzen
                    </button>
                </form>
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1>Passwort zurücksetzen</h1>
                <p>
                    Eine E-Mail wurde an {email} gesendet. Folge den Anweisungen
                    in der E-Mail, um dein Passwort zurückzusetzen.
                    <button
                        onClick={() => sendPasswordResetEmail(auth, email)}
                        className="btn btn-primary"
                    >
                        E-Mail erneut senden an {email}
                    </button>
                </p>
            </div>
        );
    }
}
