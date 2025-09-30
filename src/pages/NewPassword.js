// a component that allows the user to change their password
//
import React, { useState } from "react";
import { auth } from "../db";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";

export default function NewPassword() {
    const [newPwd, setNewPwd] = useState("");
    const [oldPwd, setOldPwd] = useState("");
    const [hasError, setHasError] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasError(false);

        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, oldPwd);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPwd);
            window.history.back();
        } catch (error) {
            setHasError(true);
        }
    };

    return (
        <div className="container">
            <h1>Das Passwort ändern</h1>
            <form onSubmit={handleSubmit}>
                <p className="text-danger">
                    {hasError
                        ? "Das Passwort konnte nicht geändert werden. Versuche es noch mal und überprüfe das alte Passwort."
                        : ""}
                </p>
                <div className="form-group form-floating m-3">
                    <input
                        type="password"
                        id="old-pwd"
                        placeholder=" "
                        name="old-pwd"
                        autoComplete="current-password"
                        onChange={(e) => {
                            setOldPwd(e.currentTarget.value);
                        }}
                        required
                        className="form-control"
                    />
                    <label htmlFor="old-pwd">
                        Altes Passwort (für Sicherheit)
                    </label>
                </div>
                <div className="form-group form-floating m-3">
                    <input
                        type="password"
                        id="pwd"
                        name="pwd"
                        placeholder=" "
                        onChange={(e) => setNewPwd(e.target.value)}
                        required
                        autoComplete="new-password"
                        minLength={7}
                        className="form-control"
                    />
                    <label htmlFor="pwd">Neues Passwort</label>
                </div>
                <button type="submit" className="btn btn-primary m-3">
                    Passwort ändern
                </button>
            </form>
        </div>
    );
}
