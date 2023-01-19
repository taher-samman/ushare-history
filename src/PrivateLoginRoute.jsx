import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { hide } from './reducers/loaderState';
export const PrivateLoginRoute = ({children}) => {
    const [render, setRender] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate('/')
        } else {
            dispatch(hide());
            setRender(true);
        }
    });
    if (render) {
        return children;
    }
};