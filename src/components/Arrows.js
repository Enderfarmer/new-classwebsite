export const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <img
            src="/prev.svg"
            className={`bg-primary d-inline ${className} custom-prev-arrow`}
            style={{ ...style, display: "block" }}
            onClick={onClick}
            alt="Zurück"
            width={30}
            height={30}
        />
    );
};
export const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <img
            src="/next.svg"
            className={`bg-primary d-inline ${className} custom-next-arrow`}
            style={{ ...style, display: "block" }}
            onClick={onClick}
            alt="Vorwärts"
            width={30}
            height={30}
        />
    );
};
