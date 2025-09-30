import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./db";
import Navbar from "./Navbar";

export default function Wrapper({
    component,
    loggedInOnly = false,
    notLoggedInOnly = false,
}) {
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInOnly && !auth.currentUser) {
            navigate("/login");
        } else if (notLoggedInOnly && auth.currentUser) {
            navigate(-1); // Go back to the previous page
        }
    }, [loggedInOnly, notLoggedInOnly, navigate]);

    return (
        <>
            <Navbar />
            {component}
        </>
    );
}
