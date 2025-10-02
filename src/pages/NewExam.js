import { push, ref } from "firebase/database";
import { subjects } from "./SubjectForums";
import db, { auth } from "../db";
import { addXP } from "../utils";
export default function NewExam() {
    return (
        <div className="container">
            <h1>Neuen Test / neue Klassenarbeit ankündigen</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const subject = e.target.subject.value;
                    const type = e.target.type.value;
                    const date = new Date(e.target.date.value).getTime();
                    push(ref(db, "exams"), {
                        subject,
                        type,
                        is_at: date,
                        author: auth.currentUser,
                    }).then(() => {
                        addXP(auth.currentUser, 125);
                        window.history.back();
                    });
                }}
            >
                <div className="form-group m-3">
                    <label htmlFor="subject" className="form-label">
                        Fach:
                    </label>
                    <select
                        name="subject"
                        id="subject"
                        className="form-control form-select"
                        required
                    >
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.name}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group m-3">
                    <label htmlFor="type" className="form-label">
                        Art:
                    </label>
                    <select
                        name="type"
                        id="type"
                        className="form-control form-select"
                        required
                    >
                        <option value="Diktat">Diktat</option>
                        <option value="Test">Test</option>
                        <option value="Klassenarbeit">Klassenarbeit</option>
                    </select>
                </div>
                <div className="form-group m-3">
                    <label htmlFor="isAt">Datum: </label>
                    <input
                        type="date"
                        name="date"
                        id="isAt"
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Ankündigen
                </button>
            </form>
        </div>
    );
}
