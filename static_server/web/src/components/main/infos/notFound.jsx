import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="container has-text-centered" style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 className="title">404 - Page Not Found</h1>
            <p className="subtitle">Sorry, the page you are looking for does not exist.</p>
            <img src="/storage/images/server_images/not_found.png" alt="404 Not Found" className="not-found-image" />
            <div className="mt-5">
                <Link to="/" className="button is-primary is-large">Go Back to Home</Link>
            </div>
        </div>
    );
}

export default React.memo(NotFound);