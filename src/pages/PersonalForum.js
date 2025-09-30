import { onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../db";
import { Spinner } from "react-bootstrap";
import nameFromEMail from "../utils";

export default function PersonalForum() {
    const [forum, setForum] = useState(null);
    const [posts, setPosts] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const dbRef = ref(db, `personal-forums/${id}`);
        onValue(dbRef, (snapshot) => {
            setForum(snapshot.val());
        });
        const postsRef = ref(db, `personal-forums/${id}/posts`);
        onValue(query(postsRef, orderByChild("posted_at")), (snapshot) => {
            const posts = [];
            snapshot.forEach((childSnapshot) => {
                posts.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            setPosts(posts.reverse());
        });
    }, [id]);

    if (!forum) {
        return <Spinner />;
    }
    return (
        <div className="container">
            <h1>{forum.name}</h1>
            <p>{forum.description}</p>
            <hr />
            <h2>Forum-Nachrichten</h2>
            {posts.length
                ? posts.map((post) => (
                      <div
                          key={post.id}
                          className="border border-1 p-4 rounded rounded-3 my-3"
                      >
                          <h3>{nameFromEMail(post.author)}:</h3>
                          <br />
                          <h4>{post.title}</h4>
                          <p>{post.content}</p>
                      </div>
                  ))
                : "Keine Nachrichten in diesem Forum vorhanden"}
        </div>
    );
}
