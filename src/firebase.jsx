import { initializeApp } from "firebase/app";
import CardTypes from './cards-types.json';
import { getFirestore, getDocs, collection, addDoc, doc, deleteDoc, query, where, updateDoc } from "firebase/firestore";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import CryptoJS from "crypto-js";
import { toast } from 'react-toastify';
import Status from './cards-status.json';
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
const cardsStatuses = Status;
const hashEncrypt = "04/01/2000";
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

export const getDocuments = (label) => {
    return getDocs(collection(db, label));
}
export const getAvailableStatus = () => {
    return cardsStatuses.find(s => s.label === 'Available');
}
export const getUsedStatus = () => {
    return cardsStatuses.find(s => s.label === 'Used');
}
export const getRemovedStatus = () => {
    return cardsStatuses.find(s => s.label === 'Removed');
}
export const clearAll = (update) => {
    getServices().then(d => {
        d.docs.forEach(async (element) => {
            const docRef = doc(db, "services", element.id);
            await deleteDoc(docRef)
                .then(() => toast.success(`${element.data().number} deleted!`, { autoClose: 200 }))
                .catch((e) => toast.error(`Error delete document: ${e}`));
        });
    }).finally(() => update());
}

export const encryptData = (code) => {
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(code),
        hashEncrypt
    ).toString();
    return data;
};
export const formatPrice = (price, currentcy = 'LBP') => {
    return `${currentcy} ${price}`;
    let pounds = Intl.NumberFormat('en-LB', {
        style: 'currency',
        currency: currentcy,
        // maximumSignificantDigits: 3,
    });

    return pounds.format(price);
}
export const decryptData = (code) => {
    const bytes = CryptoJS.AES.decrypt(code, hashEncrypt);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data;
};
export const clearAllCards = (update) => {
    getDocuments('cards').then(d => {
        d.docs.forEach(async (element) => {
            if (element.data().status === getAvailableStatus().type) {
                const docRef = doc(db, "cards", element.id);
                await addDoc(collection(db, "cards-backup"),
                    {
                        code: element.data().code,
                        date: element.data().date,
                        type: element.data().type,
                        status: getRemovedStatus().type,
                        takedAt: element.data().takedAt
                    }
                )
                    .then(() => {
                        deleteDoc(docRef)
                            .then(() => toast.success(`${decryptData(element.data().code)} deleted!`, { autoClose: 200 }))
                            .catch((e) => toast.error(`Error delete document: ${e}`));
                    })
                    .catch((e) => toast.error(`Error backup document: ${e}`));

            }
        });
    }).finally(() => update());
}
export const deleteDocumentWithBackup = (collectionName, document, update = () => console.log('update function')) => {
    var documentObject = { ...document };
    delete documentObject.id;
    const docRef = doc(db, collectionName, document.id);
    addDoc(collection(db, `${collectionName}-backup`),
        documentObject
    )
        .then(() => {
            deleteDoc(docRef)
                .then(() => toast.success(`Document deleted!`))
                .catch((e) => toast.error(`Error delete document: ${e}`))
                .finally(() => update());
        })
        .catch((e) => toast.error(`Error backup document: ${e}`));
}
export const getCardTypeLabel = (type) => {
    const cardType = CardTypes.find(i => i.type === type);
    if (cardType instanceof Object && cardType.hasOwnProperty('label')) {
        return cardType.label;
    }
    return 'Unknown';
}
export const calculateUserTotal = (userRef, update = () => console.log('update function')) => {
    var totalDebit = 0;
    getDocs(
        query(
            collection(db, 'debits'),
            where('user', '==', userRef)
        )
    ).then(d => {
        d.docs.forEach(element => {
            totalDebit += parseInt(element.data().debit);
        });
        var totalPaid = 0;
        getDocs(
            query(
                collection(db, 'paids'),
                where('user', '==', userRef)
            )
        ).then(d => {
            d.docs.forEach(paid => {
                totalPaid += parseInt(paid.data().paid);
            });
            // if (totalDebit >= totalPaid) {
            // } else {
            //     toast.error(`Ekhd mno zyede`)
            // }
            updateDoc(userRef, { total: totalDebit - totalPaid })
                    .then(() => toast.success(`Total Calculated!`))
                    .finally(update)
                    .catch((e) => toast.error(`Error update total document: ${e}`));
        }).catch((e) => toast.error(`Error find debits document: ${e}`));
    }).catch((e) => toast.error(`Error find debits document: ${e}`));
}
export default app;