import { push, ref } from "firebase/database";
import db, { auth } from "../db";
export default function NewEvent() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const title = e.currentTarget.title.value;
        const description = e.currentTarget.description.value;
        const is_at = e.currentTarget.is_at.valueAsDate.getTime();
        push(ref(db, "events"), {
            title,
            description,
            is_at,
            author: auth.currentUser.email,
        }).then(() => window.history.back());
    };
    return (
        <main className="d-flex align-items-center justify-content-center">
            <form onSubmit={handleSubmit} className="w-75 h-75">
                <h1>Neues Event hinzufügen</h1>
                <div className="form-group form-floating m-3">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="form-control"
                        required
                        placeholder=" "
                    />
                    <label htmlFor="title">Der "Name" des Events</label>
                </div>
                <div className="form-group form-floating m-3">
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="form-control"
                        required
                        placeholder=" "
                    />
                    <label htmlFor="description">
                        Die Beschreibung des Events
                    </label>
                </div>
                <div className="form-group m-3">
                    <label htmlFor="is_at">Es ist am </label>
                    <input
                        type="date"
                        name="is_at"
                        id="is_at"
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Hinzufügen
                </button>
            </form>
        </main>
    );
}
