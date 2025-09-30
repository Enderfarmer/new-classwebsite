// a forum that takes a subject as a prop and renders a list of posts

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import db, { auth } from "../db";
import {
    onValue,
    ref,
    // startAt,
    query,
    // limitToFirst,
    orderByChild,
    // set,
    // orderByValue,
} from "firebase/database";
import { formatDate } from "../utils";
import { useCurrentTheme } from "../context";
export default function Forum({ subject }) {
    // the list of posts
    const [posts, setPosts] = useState([]);
    const [pages, setPages] = useState(0);
    const page = parseInt(useParams().page) || 1;
    const setPage = (page) =>
        (window.location.hash = `forum/${subject}/${page}`);
    const [theme] = useCurrentTheme();
    const [startAtKey, setStartAtKey] = useState(null);
    // get all posts for the subject from the database and update the state
    useEffect(() => {
        const dbRef = ref(db, `forum/${subject}`);
        onValue(query(dbRef, orderByChild("posted_at")), (snapshot) => {
            setPages(Math.ceil(snapshot.size / 8));
            const obj = Object.values(snapshot.val()).reverse()[(page - 1) * 8];
            if (obj) {
                console.log("Setting startAtKey: ", obj.posted_at);
                setStartAtKey(obj.posted_at);
            }
        });
    }, [subject, page]);
    useEffect(() => {
        if (startAtKey !== null) {
            const dbRef = ref(db, `forum/${subject}`);
            onValue(query(dbRef, orderByChild("posted_at")), (snapshot) => {
                let dataGot = [];
                snapshot.forEach((child) => {
                    dataGot.push({ ...child.val(), id: child.key });
                });
                console.log(dataGot);
                setPosts(dataGot.reverse().slice((page - 1) * 8, page * 8));
            });
        }
    }, [subject, page, startAtKey, pages]);

    return (
        <div className="forum">
            <div className="text-end">
                {auth.currentUser ? (
                    <button
                        onClick={() =>
                            (window.location.hash = `neuer-post/${subject}`)
                        }
                        className="btn"
                    >
                        <i
                            className="text-success cursor-pointer border rounded-circle d-inline-block"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderColor: "lime !important",
                            }}
                        >
                            <img src="/add.svg" alt="Neuen Witz hinzufügen" />
                        </i>{" "}
                        Neuen Post hinzufügen
                    </button>
                ) : (
                    "Du musst angemeldet sein, um einen Post schreiben zu können."
                )}
            </div>
            {posts.length
                ? posts.map((post) => (
                      <div
                          key={post.id}
                          className="border border-1 rounded rounded-3 post p-4 w-50"
                      >
                          <Link to={`/forum-post/${subject}/${post.id}`}>
                              {post.title}
                          </Link>
                          <small className="d-block">
                              {formatDate(new Date(-post.posted_at))}
                              <br />
                          </small>
                      </div>
                  ))
                : "Noch keine Forum-Posts hier."}
            {pages > 1 && (
                <div className="">
                    <nav aria-label="Pagination">
                        <ul className="pagination d-flex justify-content-center">
                            {page > 1 && (
                                <li className="d-inline bg-transparent">
                                    <button
                                        className="btn"
                                        onClick={() => setPage(page - 1)}
                                        aria-label="Vorherige Seite"
                                    >
                                        <img
                                            src={`/arrow-left.${
                                                theme === "dark"
                                                    ? "light"
                                                    : "dark"
                                            }.svg`}
                                            alt="Vorherige Seite"
                                        />
                                    </button>
                                </li>
                            )}
                            {Array.from({ length: pages }, (_, i) => (
                                <li className="d-inline" key={i}>
                                    <button
                                        className={`btn p-2 ${
                                            page === i + 1 && "btn-primary"
                                        }`}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            {page < pages && (
                                <li className="d-inline bg-transparent">
                                    <button
                                        className="btn"
                                        onClick={() => setPage(page + 1)}
                                        aria-label="Nächste Seite"
                                    >
                                        <img
                                            src={`/arrow-right.${
                                                theme === "dark"
                                                    ? "light"
                                                    : "dark"
                                            }.svg`}
                                            alt="Nächste Seite"
                                        />
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}
