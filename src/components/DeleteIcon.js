import TrashCanIcon from "./TrashCanIcon";
export default function DeleteIcon(props) {
    return (
        <TrashCanIcon
            width="25"
            height="25"
            fill="red"
            {...props}
            style={{ cursor: "pointer" }}
        />
    );
}
