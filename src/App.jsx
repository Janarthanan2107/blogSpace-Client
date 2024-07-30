import { createContext, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// sessions
import { lookInSession } from "./common/session";

// pages
import Root from "./pages/root";
import NotFound from "./pages/404.page"
import Home from "./pages/home.page"
import UserAuthForm from "./pages/userAuthForm.page";
import Editor from "./pages/editor.pages";
import SearchPage from "./pages/search.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNavbar from "./components/side-navbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";

export const UserContext = createContext({});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            // auth
            {
                path: "signIn",
                element: <UserAuthForm type="sign-in" />
            },
            {
                path: "signUp",
                element: <UserAuthForm type="sign-up" />
            },
            {
                path: "search/:query",
                element: <SearchPage />
            },
            {
                path: "user/:id",
                element: <ProfilePage />
            },
            {
                path: "blog/:blog_id",
                element: <BlogPage />
            },
            // settings route
            {
                path: "settings",
                element: <SideNavbar />,
                children: [
                    {
                        path: "edit-profile",
                        element: <EditProfile />,
                    },
                    {
                        path: "change-password",
                        element: <ChangePassword />,
                    },
                ]
            },
        ]
    },
    // editor route
    {
        path: "editor",
        element: <Editor />,
        children: [
            {
                path: ":id",
                element: <Editor />,
            },
        ]
    }
]);

const App = () => {
    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("User");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
    }, []);

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <RouterProvider router={router} />
        </UserContext.Provider>
    );
}

export default App;
