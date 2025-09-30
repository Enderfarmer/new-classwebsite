// A component that renders a form to create a new forum post
//
import React, { useState } from "react";
import db, { auth } from "../db";
import { push, ref } from "firebase/database";
import { useParams } from "react-router-dom";
export default function NewForumPost() {
    const { subject } = useParams();

    // the title and content of the post
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // the history object to navigate back after creating the post
    // create a new post in the database and navigate back

    const createPost = () => {
        const newPost = {
            title,
            content,
            author: auth.currentUser.email,
            posted_at: Date.now(),
        };
        push(ref(db, `forum/${subject}`), newPost);
        window.history.back();
    };
    if (!subject) {
        return null;
    }
    return (
        <div className="container">
            <h1>Neuer Forum-Post</h1>
            <div className="mb-3 form-floating">
                <input
                    required
                    placeholder=" "
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="title" className="form-label">
                    Titel
                </label>
            </div>
            <div className="mb-3 form-floating">
                <textarea
                    id="content"
                    placeholder=" "
                    className="form-control"
                    value={content}
                    required
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                ></textarea>
                <label htmlFor="content" className="form-label">
                    Inhalt
                </label>
            </div>
            <button className="btn btn-primary" onClick={createPost}>
                Hinzufügen
            </button>
        </div>
    );
}
