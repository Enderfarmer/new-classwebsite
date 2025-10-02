import { onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db, { auth } from "../db";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { beginWithCapital, formatDate, removeXP } from "../utils";
import DeleteIcon from "../components/DeleteIcon";
import EditLink from "../components/EditLink";

export default function ClassProtos() {
    const subject = useParams().subject;
    const [data, setData] = useState(null);
    useEffect(() => {
        const dbRef = ref(db, `protocols/${subject}`);
        onValue(dbRef, (snapshot) => {
            const dataGot = [];
            snapshot.forEach((child) => {
                dataGot.push({ id: child.key, ...child.val() });
            });
            setData(dataGot);
        });
    }, [subject]);
    if (data === null) return <Spinner />;
    return (
        <div className="m-4">
            <h1>{beginWithCapital(subject)}unterrichtsprotokolle</h1>
            <div className="d-flex justify-content-end">
                {auth.currentUser ? (
                    <Link className="btn" to={"/neues-protokoll"}>
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
                        Neues Unterrichtsprotokoll hinzufügen
                    </Link>
                ) : (
                    "Du musst angemeldet sein, um Unterrichtsprotokolle hinzufügen zu können"
                )}
            </div>
            {data.length
                ? data.map((proto) => (
                      <div
                          key={proto.id}
                          className="w-75 border border-1 rounded rounded-3 p-4"
                      >
                          <Link to={`/protokoll/${subject}/${proto.id}`}>
                              <h4>
                                  {beginWithCapital(subject)}unterricht{" "}
                                  {formatDate(
                                      new Date(proto.was_at),
                                      true,
                                      false
                                  ).replace("Am", "vom")}
                              </h4>
                          </Link>
                          {auth.currentUser &&
                              auth.currentUser.email === proto.author && (
                                  <>
                                      <br />
                                      <EditLink
                                          to={`/edit-proto/${subject}/${proto.id}`}
                                          className="m-3"
                                      />
                                      <DeleteIcon
                                          onClick={() => {
                                              removeXP(auth.currentUser, 500);
                                              remove(
                                                  ref(
                                                      db,
                                                      `protocols/${subject}/${proto.id}`
                                                  )
                                              );
                                          }}
                                          className="m-3"
                                      />
                                  </>
                              )}
                      </div>
                  ))
                : "Keine Unterrichtsprotokolle vorhanden"}
        </div>
    );
}
