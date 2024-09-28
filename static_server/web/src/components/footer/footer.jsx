import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-5 py-5 mb-3">
            <div className="content has-text-centered">
                <p>
                    <strong>Img.Nation</strong> by <a href="https://yourwebsite.com">Savely.corp</a>. 
                    © {new Date().getFullYear()} All rights reserved.
                </p>
                <p>
                    <Link to="/terms">Terms of Service</Link> | <Link to="/privacy_policy">Privacy Policy</Link>
                </p>
            </div>
        </footer>
    );
};

export default React.memo(Footer);