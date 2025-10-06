// import AOS from "aos";
// import "aos/dist/aos.css";
import Events from "../components/Events";
import Exams from "../components/Exams";
import TopUsers from "../components/TopUsers";
import { auth } from "../db";
import News from "../pages/News";
import { JokesForHomePage } from "./Jokes";
import "../styles/Home.css";

const Index = function () {
    // AOS.init();

    return (
        <main>
            <div
                id="image"
                className="d-flex m-5 px-3 flex-column justify-content-center align-items-center"
            >
                Die neugierigste Klasse am Stifts.
                <div className="text-center">
                    <b>8D</b>
                </div>
            </div>
            {auth.currentUser &&
                auth.currentUser.email === "artem.kort@stiftsgymnasium.de" && (
                    <TopUsers />
                )}
            <div data-aos="fade-right" className="container">
                <h2>Unsere Neuigkeiten:</h2>
                <div>
                    <News />
                </div>
            </div>
            <Events />
            <Exams />
            <JokesForHomePage />
        </main>
    );
};
export default Index;
