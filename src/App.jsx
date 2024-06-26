import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Root from "./pages/root";
import NotFound from "./pages/404.page"
import Home from "./pages/home.page"
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";

export const UserContext = createContext({})

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
        ]
    },
    // editor route
    {
        path: "editor",
        element: <Editor />
    }
]);

const App = () => {

    const [userAuth, setUserAuth] = useState({})

    useEffect(() => {
        let userInSession = lookInSession("User")
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    }, [])

    // console.log(userAuth, "Auth")


    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <RouterProvider router={router} />
        </UserContext.Provider>
    )
}

export default App;