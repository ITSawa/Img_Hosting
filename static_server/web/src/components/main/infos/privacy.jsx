import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="section mb-6 mt-6">
            <div className="container">
                <h1 className="title">Privacy Policy</h1>

                <p className="content">
                    At [Your Company Name], we are committed to protecting your privacy. This Privacy Policy explains how we handle your data and what measures we take to safeguard your information.
                </p>

                <h2 className="subtitle">Information We Do Not Collect</h2>
                <p className="content">
                    We do not collect, store, or process any personal data from our users. Our services are designed to provide image hosting without the need for user accounts or personal information. We do not track, monitor, or collect data related to your usage of our services.
                </p>

                <h2 className="subtitle">Image Hosting and Usage</h2>
                <p className="content">
                    Our platform serves as a hosting tool for images. We do not sell or share any images hosted on our platform. Our sole purpose is to provide a reliable and efficient service for storing and displaying images for various websites and applications.
                </p>

                <h2 className="subtitle">Security Measures</h2>
                <p className="content">
                    While we do not collect personal data, we implement industry-standard security measures to protect the integrity of the images hosted on our platform. This includes safeguarding against unauthorized access and maintaining the confidentiality of the hosted content.
                </p>

                <h2 className="subtitle">Changes to Our Privacy Policy</h2>
                <p className="content">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
                </p>

                <h2 className="subtitle">Contact Us</h2>
                <p className="content">
                    If you have any questions or concerns regarding this Privacy Policy or our practices, please contact us. We are here to assist you and address any inquiries you may have.
                </p>

            </div>
        </div>
    );
};

export default React.memo(PrivacyPolicy);