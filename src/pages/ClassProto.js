import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import db from "../db";
import { Spinner } from "react-bootstrap";
import { beginWithCapital, formatDate } from "../utils";

export default function ClassProto() {
    const subject = useParams().subject;
    const id = useParams().id;
    const [data, setData] = useState(null);
    useEffect(() => {
        const dbRef = ref(db, `protocols/${subject}/${id}`);
        onValue(dbRef, (snapshot) => {
            setData(snapshot.val());
        });
    }, [subject, id]);
    if (data === null) return <Spinner />;
    const formattedDate = formatDate(new Date(data.was_at), true, false);
    return (
        <div className="container">
            <h1>
                {beginWithCapital(subject)}unterrichtsprotokoll{" "}
                {formattedDate.replace("Am", "vom")}
            </h1>
            <div className="fw-bolder">
                <Link to={`/proto/${subject}`}>← Zurück</Link>
            </div>
            <div className="container">
                {typeof data.content !== "string"
                    ? data.content.map((val) => <p>{val}</p>)
                    : data.content}
            </div>
        </div>
    );
}
