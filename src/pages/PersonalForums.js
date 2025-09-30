import { useEffect, useState } from "react";
import db from "../db";
import { onValue } from "firebase/database";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PersonalForums() {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const dbRef = ref(db, "personal-forums");
        onValue(dbRef, (snapshot) => {
            const forums = [];
            snapshot.forEach((childSnapshot) => {
                forums.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            setForums(forums);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Spinner />;
    }
    return (
        <div>
            <h1>Foren für dich</h1>
            {forums.map((forum) => (
                <div
                    key={forum.id}
                    className="border border-1 p-4 rounded rounded-3 my-3"
                >
                    <Link to={`/deine-forums/${forum.id}`}>
                        <h2>{forum.name}</h2>
                    </Link>
                    <p>{forum.description}</p>
                </div>
            ))}
        </div>
    );
}
