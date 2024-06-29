// src/redux/firebaseAuth.ts
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseConfig";
import { setUser, clearUser } from "../redux/store"
import { AppDispatch } from "../redux/store"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
const extractUserData = (user: any) => {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        // Add any other serializable properties you need
    };
};

export const signInWithGoogle = async (dispatch: AppDispatch, router: string[] | AppRouterInstance) => {


    // await setPersistence(auth, browserLocalPersistence)
    //     .then(async () => {
    //         provider.setCustomParameters({
    //             prompt: 'select_account',
    //         })
    //         const result = await signInWithPopup(auth, provider);
    //         const user = result.user;
    //         dispatch(setUser(extractUserData(user)));
    //         // Check if router is defined before using it
    //         if (user && router) {
    //             router.push("/"); // Redirect to home page after successful sign-in
    //         }
    //         return result
    //     }).catch((error) => {
    //         // Handle Errors here.
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         console.log(errorCode, errorMessage)
    //         return error
    //     });

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        dispatch(setUser(extractUserData(user)));
        // Check if router is defined before using it
        if (user && router) {
            router.push("/pages/home"); // Redirect to home page after successful sign-in
        }
        return result
    } catch (error) {
        console.log(error)
    }
};

export const signOutUser = async (dispatch: AppDispatch) => {
    try {
        await signOut(auth);
        dispatch(clearUser());
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};



// setPersistence(auth, browserSessionPersistence)
//     .then(() => {
//         // Existing and future Auth states are now persisted in the current
//         // session only. Closing the window would clear any existing state even
//         // if a user forgets to sign out.
//         // ...
//         // New sign-in will be persisted with session persistence.
//         return signInWithEmailAndPassword(auth, email, password);
//     })
//     .catch((error) => {
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//     });