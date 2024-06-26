import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAiBlh0_PiycKMqj6AdeDrUEsJl_YiZ61g",
    authDomain: "blog-space-user.firebaseapp.com",
    projectId: "blog-space-user",
    storageBucket: "blog-space-user.appspot.com",
    messagingSenderId: "490161596052",
    appId: "1:490161596052:web:0baab3d7f9f90d17c0b681"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider).then((result) => {
        user = result.user
    }).catch((err) => {
        console.log(err)
    })

    return user
}

export { authWithGoogle, firebase }

