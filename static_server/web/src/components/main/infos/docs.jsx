import React from "react";

const Documentation = () => {
    return (
        <div className="section mb-4 mt-6">
            <div className="container">
                <h1 className="title">Image Upload Documentation</h1>

                <p className="content">
                    Our image hosting service allows you to upload images and receive a direct link to use the image in your projects. This link can be embedded in websites, applications, or any platform that supports image URLs.
                </p>

                <h2 className="subtitle">How to Upload an Image</h2>
                <ol className="content ml-5">
                    <li>Click on the "Upload Image" button on the main page.</li>
                    <li>Select the image you want to upload from your device. Ensure that the image size does not exceed 1000x1000 pixels.</li>
                    <li>After the upload is complete, you will receive a direct link to the image.</li>
                </ol>

                <h2 className="subtitle">Using the Image Link</h2>
                <p className="content">
                    Once you've uploaded your image, you'll receive a URL that you can use to display the image online. Here are some common use cases:
                </p>
                <ul className="content ml-2">
                    <li><strong>On your website:</strong> Use the image URL in the <code>&lt;img&gt;</code> tag to display the image.</li>
                    <li><strong>In a blog post:</strong> Insert the URL into the editor that supports images via URLs.</li>
                    <li><strong>In an application:</strong> Use the URL wherever your application accepts image links, such as in chat apps, social media platforms, or design tools.</li>
                </ul>

                <h2 className="subtitle">Example Usage</h2>
                <pre className="content">
{`<img src="https://img.nation.com/your image url (address)" alt="Your Image Description" />`}
                </pre>

                <p className="content">
                    Simply copy and paste the provided link into your HTML or relevant input fields in your application to display the image.
                </p>

                <h2 className="subtitle">Important Notes</h2>
                <p className="content">
                    If you upload an image while logged in, the image will be linked to your account. This allows you to easily manage your images in your personal gallery and access them at any time.
                </p>

                <p className="content">
                    Ensure that you do not share the link with unauthorized parties if you want to keep your images private.
                </p>
            </div>
        </div>
    );
};

export default React.memo(Documentation);