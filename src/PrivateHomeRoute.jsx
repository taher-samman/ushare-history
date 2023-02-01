import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { useState } from "react";
import { useEffect } from "react";
export const PrivateHomeRoute = () => {
    const [render, setRender] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
            } else {
                setRender(true);
            }
        });
    }, [navigate]);
    if (render) {
        return <Outlet />;
    }
};