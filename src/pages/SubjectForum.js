// a forum for a specific subject specified by the URL parameter
import React from "react";
import { useParams } from "react-router-dom";
import Forum from "../components/Forum";
import { beginWithCapital } from "../utils";
export default function SubjectForum() {
    // get the subject from the URL parameter
    const { subject } = useParams();
    // render a forum for the subject
    return (
        <div className="container">
            <h1>{beginWithCapital(subject)}-Forum</h1>
            <Forum subject={subject} />
        </div>
    );
}
