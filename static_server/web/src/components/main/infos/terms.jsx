import React from "react";

const Terms = () => {
    return (
        <div className="section mb-6 mt-6">
            <div className="container">
                <h1 className="title">Terms of Service</h1>

                <p className="content">
                    By using our image hosting service, you agree to comply with the following terms and conditions. Please read them carefully.
                </p>

                <h2 className="subtitle">Prohibited Content</h2>
                <p className="content">
                    You are strictly prohibited from uploading, sharing, or otherwise distributing any content that:
                </p>
                <ul className="content">
                    <li>Contains pornography, explicit sexual content, or nudity.</li>
                    <li>Violates any applicable laws, regulations, or legal rights of others.</li>
                    <li>Includes copyrighted material without proper authorization.</li>
                    <li>Contains hate speech, violence, or content that incites discrimination or harassment.</li>
                    <li>Is defamatory, abusive, or threatening.</li>
                    <li>Contains malware, viruses, or any harmful software.</li>
                </ul>

                <h2 className="subtitle">Legal Compliance</h2>
                <p className="content">
                    You must ensure that all content uploaded to our platform complies with all applicable laws and regulations. Any content found to be in violation of these terms may be removed without notice, and your account may be suspended or terminated.
                </p>

                <h2 className="subtitle">Content Ownership</h2>
                <p className="content">
                    By uploading content to our service, you confirm that you own the rights to the content or have obtained the necessary permissions to use and share it. You retain ownership of your content but grant us the right to host, display, and share it as necessary to provide our services.
                </p>

                <h2 className="subtitle">Account Responsibility</h2>
                <p className="content">
                    You are responsible for all activities conducted through your account. Please ensure that your login credentials are kept secure and not shared with unauthorized individuals.
                </p>

                <h2 className="subtitle">Consequences of Violations</h2>
                <p className="content">
                    Violation of these terms may result in the removal of your content, suspension, or termination of your account, and potential legal action. We reserve the right to cooperate with law enforcement authorities in the investigation of any alleged illegal activity.
                </p>

                <h2 className="subtitle">Speed and Location Disclaimer</h2>
                <p className="content">
                    Please be aware that we do not accept responsibility for the speed at which images are uploaded or downloaded from our service. Our hosting infrastructure is located in Central Europe, and users who are geographically distant from this region may experience slower upload or download speeds.
                </p>

                <h2 className="subtitle">Changes to Terms</h2>
                <p className="content">
                    We may update these terms from time to time. It is your responsibility to review them regularly. Continued use of our service after any changes constitutes acceptance of the new terms.
                </p>

                <p className="content">
                    If you have any questions about these terms, please contact us for further clarification.
                </p>
            </div>
        </div>
    );
};

export default React.memo(Terms);