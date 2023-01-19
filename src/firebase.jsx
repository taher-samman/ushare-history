import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { toast } from 'react-toastify';
const firebaseConfig = {
    apiKey: "AIzaSyCUe6cmXuFIHdcetsNcjxuQZe6JuBR_nVw",
    authDomain: "ushare-history.firebaseapp.com",
    projectId: "ushare-history",
    storageBucket: "ushare-history.appspot.com",
    messagingSenderId: "853208174592",
    appId: "1:853208174592:web:af7cb4977d5005ca2b88e5"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const logInWithEmailAndPassword = async (email, password) => {
//     try {
//         await signInWithEmailAndPassword(auth, email, password);
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
// };
export const logInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    signOut(auth);
};

export const getServices = () => {
    return getDocs(collection(db, 'services'));
}
export const clearAll = (update) => {
    getServices().then(d => {
        d.docs.forEach(async (element) => {
            const docRef = doc(db, "services", element.id);
            await deleteDoc(docRef)
                .then(() => toast.success(`${element.data().number} deleted!`))
                .catch((e) => toast.error(`Error delete document: ${e}`));;
            update();
        });
    })
}
export default app;