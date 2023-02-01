import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { hide } from './reducers/loaderState';
import { useEffect } from "react";
export const PrivateLoginRoute = () => {
    const [render, setRender] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/')
            } else {
                dispatch(hide());
                setRender(true);
            }
        });
    }, [navigate, dispatch]);
    if (render) {
        return <Outlet />;
    }
};