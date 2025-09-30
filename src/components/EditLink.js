import { Link } from "react-router-dom";
import PencilIcon from "./PencilIcon";

export default function EditLink({ to, className }) {
    return (
        <Link to={to}>
            <PencilIcon
                width="25"
                height="25"
                fill="orange"
                style={{ cursor: "pointer" }}
                className={className}
            />
        </Link>
    );
}
