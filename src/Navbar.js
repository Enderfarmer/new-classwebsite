import { useState } from "react";
import "./styles/hamburgers.min.css";
import "./styles/Navbar.css";
import { Link } from "react-router-dom";
import { auth } from "./db";
import { onAuthStateChanged } from "firebase/auth";
import { useCurrentTheme } from "./context";
import nameFromEMail from "./utils";
import { Dropdown } from "react-bootstrap";
export default function Navbar() {
    const [active, setActive] = useState(false);
    const [theme, setTheme] = useCurrentTheme();
    const [authenticated, setAuthenticated] = useState(false);
    const customColor = localStorage.getItem("customColor");
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setAuthenticated(true);
        }
    });
    document.body.setAttribute("data-bs-theme", theme);
    return (
        <nav
            className={`navbar border-bottom border-1 border-dark mb-2 ${theme} ${
                !customColor && "default"
            }`}
            style={customColor ? { backgroundColor: customColor } : {}}
        >
            <a className="navbar-brand px-2" href="#/">
                8D
            </a>
            <span>
                {!authenticated ? (
                    <Link
                        to="/login"
                        className="text-white text-decoration-none"
                    >
                        Anmelden
                    </Link>
                ) : (
                    <Dropdown className="d-inline">
                        <Dropdown.Header className="text-white d-inline">
                            {nameFromEMail(auth.currentUser.email)}
                        </Dropdown.Header>
                        <Dropdown.Toggle className="bg-transparent d-inline p-0 m-1 border-0" />
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Link to="/neues-passwort">
                                    Passwort ändern
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => window.location.reload()}
                            >
                                Abmelden
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
                <button
                    className="p-2 d-inline border border-0 bg-transparent"
                    onClick={() => {
                        setTheme(
                            localStorage.getItem("theme") === "light"
                                ? "dark"
                                : "light"
                        );
                    }}
                    aria-label="Theme umschalten"
                >
                    <img
                        src={`/${theme}-theme.svg`}
                        className="d-inline"
                        alt={`${
                            localStorage.getItem("theme") === "light"
                        } theme`}
                    />
                </button>
                <button
                    className={` hamburger hamburger--spin ${
                        active ? "is-active" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => {
                        setActive(!active);
                    }}
                >
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
                </button>
            </span>

            <div
                className="collapse navbar-collapse border-top border-1 border-dark"
                id="navbarSupportedContent"
            >
                <ul className="navbar-nav mr-auto px-2">
                    <li className="nav-item">
                        <Link to={"/witzeseite"} className="nav-link">
                            Witzeseite
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={"/fachforen"} className="nav-link">
                            Forum + Hausaufgaben + Übungen für jedes Fach
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={"/neue-news"} className="nav-link">
                            Eine News schreiben
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={"/neue-pruefung"} className="nav-link">
                            Klassenarbeit ankündigen
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/neues-event"}>
                            Ein Event ankündigen
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={`/protokolle`}>
                            Unterrichtsprotokolle
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/rätselspaßmitarti">
                            Rätselspaß mit Arti
                        </Link>
                    </li>
                    <li>
                        <span className="nav-link">Navbarfarbe anpassen: </span>
                        <input
                            type="color"
                            id="customColor"
                            defaultValue={customColor || "#00c6de"}
                            onInput={(e) => {
                                localStorage.setItem(
                                    "customColor",
                                    e.target.value
                                );
                                document.querySelector(
                                    ".navbar"
                                ).style.backgroundColor = e.target.value;
                            }}
                        />
                    </li>
                </ul>
            </div>
        </nav>
    );
}
