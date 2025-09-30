import { subjects } from "./SubjectForums";
import { Link } from "react-router-dom";

export default function ProtosList() {
    return (
        <ul>
            {subjects.map((subject) => (
                <li
                    key={subject.id}
                    className="border border-1 rounded rounded-3 d-flex subject-item"
                >
                    <div
                        className={`h-100 w-25 d-flex align-items-center justify-content-center p-2 pe-0 ${
                            [
                                "NWT",
                                "Mathe",
                                "Englisch",
                                "Eth/Reli",
                                "Geo",
                            ].includes(subject.name)
                                ? "text-white"
                                : "text-dark"
                        }`}
                        style={{ background: subject.color }}
                    >
                        {subject.name}
                    </div>
                    <div className="p-2 ps-0">
                        <Link
                            to={`/proto/${subject.id}`}
                            className="d-inline me-3"
                        >
                            Unterrichtsprotokolle
                        </Link>
                    </div>
                </li>
            ))}
        </ul>
    );
}
