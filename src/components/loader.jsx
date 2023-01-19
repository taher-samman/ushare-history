import { Bars } from 'react-loader-spinner';
import React from 'react';
import { useSelector } from 'react-redux';
function Loader() {
    const loaderVisibility = useSelector((state) => state.loader.visible);
    const loaderStype = {
        backgroundColor: 'rgb(255 255 255 / 84%)',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '999999999'
    }
    return (
        <Bars
            height="80"
            width="80"
            color="red"
            ariaLabel="bars-loading"
            wrapperStyle={loaderStype}
            wrapperClass=""
            visible={loaderVisibility}
        />
    );
}

export default Loader;