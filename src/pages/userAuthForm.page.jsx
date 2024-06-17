import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import InputText from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { domain } from "../constants/domain";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {

    const { userAuth: { access_token }, setUserAuth } = useContext(UserContext)
    // log access token
    // console.log(access_token)

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(domain + serverRoute, formData).then(({ data }) => {
            storeInSession("User", JSON.stringify(data))
            setUserAuth(data)
        }).catch(({ response }) => {
            toast.error(response.data.error)
        });
        try {
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.error); // Handle error response from server
            } else {
                toast.error("Network error. Please try again."); // Handle other errors
            }
        }
    };

    const validateForm = () => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // Validate fullname (if applicable)
        if (type !== "sign-in" && fullname.length < 3) {
            toast.error("Full name must be at least 3 letters long");
            return false;
        }

        // Validate email
        if (!email) {
            toast.error("Enter email");
            return false;
        } else if (!emailRegex.test(email)) {
            toast.error("Enter a valid email address");
            return false;
        }

        // Validate password
        if (!passwordRegex.test(password)) {
            toast.error("Password should be 6 to 20 characters long with at least one numeric, one uppercase, and one lowercase letter");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const serverRoute = type === "sign-in" ? "/signin" : "/signup";

        if (!validateForm()) {
            return;
        }

        // Create formData object
        const formData = type === "sign-in" ? { email, password } : { fullname, email, password };

        // If all validations pass, proceed with server authentication
        try {
            await userAuthThroughServer(serverRoute, formData);
        } catch (error) {
            console.error("Error handling form submission:", error);
        }
    };

    // google auth
    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle().then((user) => {
            let serverRoute = "/google-auth";

            let formData = {
                access_token: user.accessToken,
                profile_img: user.photoURL
            }

            userAuthThroughServer(serverRoute, formData)
        }).catch((err) => {
            console.log("Trouble with login through google!")
            console.log(err)
        });
    }

    useEffect(() => {
        setFullname("");
        setEmail("");
        setPassword("");
    }, [type]);

    return (
        access_token ?
            <Navigate to={"/"} />
            :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster /> {/* Toast notifications container */}
                    <form className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                        {/* Heading */}
                        <h1 className="text-4xl font-sans capitalize text-center mb-24">{type === "sign-in" ? "Welcome Back" : "Join Us Today"}</h1>

                        {/* Full name input field (conditional based on type) */}
                        {type !== "sign-in" && (
                            <InputText name="fullname" type="text" placeholder="Full Name" icon="fi-rr-user" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        )}

                        {/* Email and Password input fields */}
                        <InputText name="email" type="email" placeholder="Email" icon="fi-rr-envelope" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputText name="password" type="password" placeholder="Password" icon="fi-rr-key" value={password} onChange={(e) => setPassword(e.target.value)} />

                        {/* Submit button */}
                        <button className="btn-dark center mt-14" type="submit">
                            {type.replace("-", " ")}
                        </button>

                        {/* Separator and "or" text */}
                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />
                        </div>

                        {/* Continue with Google button */}
                        <button className="btn-dark flex items-center justify-center gap-4 center" onClick={(e) => handleGoogleAuth(e)}>
                            <img src={googleIcon} alt="Google Icon" className="w-5" />
                            Continue with Google
                        </button>

                        {/* Conditional text based on type (sign-in or sign-up) */}
                        {type === "sign-in" ? (
                            <p className="mt-6 text-dark-gray text-xl text-center">
                                Don't have an account?{" "}
                                <Link to="/signUp" className="underline underline-offset-4 text-black text-xl ml-1">
                                    Join us today
                                </Link>
                            </p>
                        ) : (
                            <p className="mt-6 text-dark-gray text-xl text-center">
                                Already a member?{" "}
                                <Link to="/signIn" className="underline underline-offset-4 text-black text-xl ml-1">
                                    Sign in
                                </Link>
                            </p>
                        )}
                    </form>
                </section>
            </AnimationWrapper>
    );
};

export default UserAuthForm;
