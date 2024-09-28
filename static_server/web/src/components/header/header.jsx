import React, { useState, useEffect } from "react";
import AccountPanel from "./auth_accout/accountPanel";
import AuthPanel from "./auth_accout/authPanel";
import '../../static/css/header.css';
import { amIAuthorized } from "./auth_accout/authLogic";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({setIsUploadPanelVisible}) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(async () => {
        const request = await amIAuthorized();
        if (request) {
            setIsAuthorized(true);
            setUserData(request);
            console.log('User data:', request);
        } else {
            console.log("Error while refreshing");
        }
    }, []);

    return (
        <header className="container">
            <nav className="navbar is-spaced">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/"><h3 className="title is-4">Img.Nation</h3></Link>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-start">
                        <Link className="navbar-item" to="/gallery">Gallery</Link>
                        <Link className="navbar-item" to="/documentation">Documentation</Link>
                        <Link className="navbar-item" to="/terms">Terms</Link>
                    </div>
                    <div className="navbar-end">
                        <a className="navbar-item button is-primary" onClick={() => setIsPanelVisible(!isPanelVisible)}>
                            Account {isPanelVisible ? <FontAwesomeIcon icon={faClose} />: <FontAwesomeIcon icon={faBars} />} 
                        </a>
                    </div>
                </div>
            </nav>
            {isPanelVisible && (
                isAuthorized 
                ? <AccountPanel setIsAuthorized={setIsAuthorized} setIsPanelVisible={setIsPanelVisible} userData={userData} setUserData={setUserData} setIsUploadPanelVisible={setIsUploadPanelVisible} /> 
                : <AuthPanel setIsAuthorized={setIsAuthorized} setIsPanelVisible={setIsPanelVisible} setUserData={setUserData} />
            )}
        </header>
    );
};

export default React.memo(Header);