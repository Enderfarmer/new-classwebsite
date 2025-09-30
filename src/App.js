import { Routes, Route, HashRouter } from "react-router-dom";
import Wrapper from "./Wrapper";
import Login from "./pages/Login";
import { ThemeContext } from "./context";
import Index from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Jokes from "./pages/Jokes";
import SubjectForums from "./pages/SubjectForums";
import SubjectForum from "./pages/SubjectForum";
import NewForumPost from "./pages/NewForumPost";
import ForumPost from "./pages/ForumPost";
import "./styles/float-label.css";
import "./styles/slick.css";
import Homework from "./pages/Homework";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import NewNew from "./pages/NewNew";
import Exercises from "./pages/Exercises";
import NewExam from "./pages/NewExam";
import NewEvent from "./pages/NewEvent";
import EditNew from "./pages/EditNew";
import ClassProtos from "./pages/ClassProtos";
import ClassProto from "./pages/ClassProto";
import NewProto from "./pages/NewProto";
import EditProto from "./pages/EditProto";
import EditQuiz from "./pages/EditQuiz";
import ProtosList from "./pages/ProtosList";
import EditForumPost from "./pages/EditForumPost";
import EditAnswer from "./pages/EditAnswer";
import ArtisQFun from "./pages/ArtisQFun";
import NewRiddle from "./pages/NewRiddle";

const TestPage = function () {
    return <h1>Test</h1>;
};

function App() {
    return (
        <ThemeContext.Provider value={localStorage.getItem("theme") || "light"}>
            <HashRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Wrapper component={<Index />} />}
                    />
                    <Route path="/test" element={<TestPage />} />
                    <Route
                        path="/login"
                        element={
                            <Wrapper component={<Login />} notLoggedInOnly />
                        }
                    />
                    <Route
                        path="/news/:id"
                        element={<Wrapper component={<NewsDetail />} />}
                    />
                    <Route
                        path="/witzeseite"
                        element={<Wrapper component={<Jokes />} />}
                    />
                    <Route
                        path="/fachforen"
                        element={<Wrapper component={<SubjectForums />} />}
                    />
                    <Route
                        path="forum/:subject"
                        element={<Wrapper component={<SubjectForum />} />}
                    />
                    <Route
                        path="forum/:subject/:page"
                        element={<Wrapper component={<SubjectForum />} />}
                    />
                    <Route
                        path="neuer-post/:subject"
                        element={
                            <Wrapper
                                component={<NewForumPost />}
                                loggedInOnly
                            />
                        }
                    />
                    <Route
                        path="forum-post/:subject/:key"
                        element={<Wrapper component={<ForumPost />} />}
                    />
                    <Route
                        path="hausaufgaben/:subject"
                        element={<Wrapper component={<Homework />} />}
                    />
                    <Route
                        path="passwort-vergessen"
                        element={
                            <Wrapper
                                component={<ResetPassword />}
                                notLoggedInOnly
                            />
                        }
                    />
                    <Route
                        path="neues-passwort"
                        element={
                            <Wrapper component={<NewPassword />} loggedInOnly />
                        }
                    />
                    <Route
                        path="neue-news"
                        element={
                            <Wrapper component={<NewNew />} loggedInOnly />
                        }
                    />
                    <Route
                        path="exercises/:subject"
                        element={<Wrapper component={<Exercises />} />}
                    />
                    <Route
                        path="neue-pruefung"
                        element={
                            <Wrapper component={<NewExam />} loggedInOnly />
                        }
                    />
                    <Route
                        path="neues-event"
                        element={
                            <Wrapper component={<NewEvent />} loggedInOnly />
                        }
                    />
                    <Route
                        path="edit-news/:id"
                        element={
                            <Wrapper component={<EditNew />} loggedInOnly />
                        }
                    />
                    <Route
                        path="proto/:subject"
                        element={<Wrapper component={<ClassProtos />} />}
                    />
                    <Route
                        path="protokoll/:subject/:id"
                        element={<Wrapper component={<ClassProto />} />}
                    />
                    <Route
                        path="neues-protokoll"
                        element={
                            <Wrapper component={<NewProto />} loggedInOnly />
                        }
                    />
                    <Route
                        path="edit-proto/:subject/:id"
                        element={
                            <Wrapper component={<EditProto />} loggedInOnly />
                        }
                    />
                    <Route
                        path="edit-quiz/:subject/:id"
                        element={
                            <Wrapper component={<EditQuiz />} loggedInOnly />
                        }
                    />
                    <Route
                        path="protokolle"
                        element={<Wrapper component={<ProtosList />} />}
                    />
                    <Route
                        path="edit-post/:subject/:key"
                        element={
                            <Wrapper
                                component={<EditForumPost />}
                                loggedInOnly
                            />
                        }
                    />
                    <Route
                        path="edit-postantwort/:subject/:key/:akey"
                        element={
                            <Wrapper component={<EditAnswer />} loggedInOnly />
                        }
                    />
                    <Route
                        path="rätselspaßmitarti"
                        element={<Wrapper component={<ArtisQFun />} />}
                    />
                    <Route
                        path="rätselspaßmitarti/new-riddle"
                        element={<Wrapper component={<NewRiddle />} />}
                    />
                </Routes>
            </HashRouter>
        </ThemeContext.Provider>
    );
}
export default App;
