import { onValue, ref, query, limitToFirst } from "firebase/database";
import { useEffect, useState } from "react";
import db from "../db";

export default function TopUsers() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const dbRef = ref(db, "users");
        onValue(query(dbRef, limitToFirst(5)), (snapshot) => {
            setData(snapshot.val());
        });
    }, []);
    if (!data) {
        return null;
    }
    return (
        <div className="container">
            <h2>Top 5 Benutzer</h2>
            <ol>
                {Object.values(data).map((user) => (
                    <li key={user.name}>
                        {user.name} - {user.level} Level ({user.xp} XP)
                    </li>
                ))}
            </ol>
        </div>
    );
}
