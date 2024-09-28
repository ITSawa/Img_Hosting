import React, { useEffect, useState, useRef } from "react";
import { logout } from "./authLogic";
import OwnedGalleryPanel from "./elements/owned_gallery";

const AccountPanel = ({ setIsAuthorized, setIsPanelVisible, userData, setUserData, setIsUploadPanelVisible }) => {
    const panelRef = useRef(null);
    const [ownedGalleryPanelVisible, setOwnedGalleryPanelVisible] = useState(false);

    useEffect(() => {
        const savedState = sessionStorage.getItem('ownedGalleryPanelVisible');
        if (savedState !== null) {
            setOwnedGalleryPanelVisible(JSON.parse(savedState));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('ownedGalleryPanelVisible', JSON.stringify(ownedGalleryPanelVisible));
    }, [ownedGalleryPanelVisible]);

    const handleLogout = async () => {
        const request = await logout();

        if (request) {
            setIsAuthorized(false);
            setIsPanelVisible(false);
            setUserData({});
            sessionStorage.removeItem('ownedGalleryPanelVisible'); // Очистка состояния при выходе из аккаунта
        } else {
            console.log("Error while logout");
        }
    };

    const handleClickOutside = (event) => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
            setTimeout(() => setIsPanelVisible(false), 100);
        }
    };

    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    const dynamicStyles = ownedGalleryPanelVisible
        ? { minWidth: '300px', maxWidth: '500px', display: 'block', margin: '0 !important', padding: '0 !important' }
        : null;

    const closeDisplay = ownedGalleryPanelVisible ? { display: 'none' } : null;
    const paddingX = ownedGalleryPanelVisible ? { justifyContent: 'none', alignItems: 'stretch', padding: '10vh 10vw' } : null;

    return (
        <>
            <div className="close-account-panel-wrapper" onClick={() => setIsPanelVisible(false)}>
                <button className="close-account-panel" />
            </div>
            <div className="account-panel-overlay" style={paddingX}>
                <div ref={panelRef} className="account-panel-content box" style={dynamicStyles}>
                    <h1 className="title has-text-centered">Welcome {userData.name}!</h1>

                    <div className="columns" style={dynamicStyles}>
                        <div className="column has-text-centered" style={closeDisplay}>
                            <div className="box p-6">
                                <h2 className="subtitle">Gallery Management</h2>
                                <p>Manage your uploaded images. Keep your portfolio organized and easily accessible.</p>
                                <button onClick={() => setOwnedGalleryPanelVisible(true)} className="button is-link mt-3">Go to Gallery</button>
                            </div>
                        </div>

                        <div className="column has-text-centered">
                            <div className="box p-6">
                                <h2 className="subtitle">Upload New Images</h2>
                                <p>Ready to add more content? Use the button below to upload new images to your gallery.</p>
                                <button onClick={() => setIsUploadPanelVisible(true)} className="button is-primary mt-3">Upload Image</button>
                            </div>
                        </div>
                    </div>

                    <div className="columns" style={dynamicStyles}>
                        <div className="column has-text-centered">
                            <div className="box p-6">
                                <h2 className="subtitle">Account Settings</h2>
                                <p>Manage your account settings, change your password, or update your profile information.</p>
                                <button className="button is-info mt-3">Account Settings</button>
                            </div>
                        </div>

                        <div className="column has-text-centered">
                            <div className="box p-6">
                                <h2 className="subtitle">Logout</h2>
                                <p>If you want to log out, click the button below. You can log back in anytime using your credentials.</p>
                                <button className="button is-danger mt-3" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
                <OwnedGalleryPanel ownedGalleryPanelVisible={ownedGalleryPanelVisible} setOwnedGalleryPanelVisible={setOwnedGalleryPanelVisible} />
            </div>
        </>
    );
};

export default React.memo(AccountPanel);