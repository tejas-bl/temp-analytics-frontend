import React from "react";
import { Oval } from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Loader({ width }) {

    return (
        <div width={width} className="LoaderCard card bg-disabled mb-5 text-center">
            <div className="body d-flex justify-content-center" >
                <Oval
                    heigth="50"
                    width="50"
                    color='blue'
                    ariaLabel='loading'
                />
            </div>
        </div>
    )
}



export function RouteLoader({ width }) {

    return (
        <div width={width} className="routeLoaderCard bg-disabled mb-5 text-center">
            <div className="body d-flex routeLoader" >
                <Oval
                    heigth="50"
                    width="50"
                    color='blue'
                    ariaLabel='loading'
                />
            </div>
        </div>
    )
}


export default Loader;