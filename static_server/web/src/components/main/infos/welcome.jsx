import React, { useState } from "react";
import { Link } from "react-router-dom";

function Welcome({ setIsUploadPanelVisible }) {

    return (
        <>
            <div className="container columns mb-6">
                <div className="column is-5">
                    <div className="upload-background">
                        <img src="/storage/images/server_images/wallpaper1.webp" alt="Upload Background" className="upload-background-image" />
                        <button className="button is-large is-primary" onClick={() => setIsUploadPanelVisible(true)}>Upload Image</button>
                    </div>
                </div>

                <div className="column is-7">
                    <div className="notification aboutus">
                        <div className="p-5 h-100">
                            <h1 className="title">About Us</h1>
                            <p>
                                Welcome to our image hosting service. We provide a simple and free platform for hosting your images. Whether you’re a professional photographer or just need a place to store your favorite pictures, we’ve got you covered.
                                You can upload images up to 2000x2000 pixels in size completely free of charge. Our service is user-friendly, reliable, and designed to give you peace of mind when storing your images.
                            </p>

                            <div className="mt-5 mb-5">
                                <h2 className="subtitle">Our Mission</h2>
                                <p>
                                    Our mission is to empower creativity by providing an accessible and free image hosting service. We believe that everyone should have a place to store and share their visual ideas without worrying about cost or complexity.
                                    We are committed to maintaining a platform that is secure, fast, and easy to use, ensuring that your images are always available when you need them.
                                </p>
                            </div>

                            <div className="mt-5 mb-5">
                                <h2 className="subtitle">Our Vision</h2>
                                <p>
                                    We envision a world where everyone has the freedom to share their creativity through images. By offering a free, user-friendly service, we aim to remove barriers to entry for aspiring artists, photographers, and creators of all kinds.
                                    Our platform is built with the goal of fostering a community where visual expression is celebrated and easily accessible to everyone.
                                </p>
                            </div>

                            <div className="mt-5">
                                <h2 className="subtitle">Important Information</h2>
                                <p>
                                    If you upload an image while logged in, it will be linked to your account. You will be able to find this image in your gallery and manage it easily in the future.
                                    This feature allows you to keep all your images organized and accessible, making it simple to share them or manage your online portfolio.
                                </p>
                            </div>
                        </div>

                        <div className="aboutus-image-container">
                            <img src="/storage/images/server_images/wallpaper2.jpg" alt="About Us" className="aboutus-image" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container p-3 mt-6">
                {/* Why Choose Us Block */}
                <div className="columns mb-6 mt-6">
                    <div className="column is-4">
                        <div className="box has-text-centered">
                            <h2 className="title">Free Hosting</h2>
                            <p>Upload and store your images without any cost.</p>
                        </div>
                    </div>
                    <div className="column is-4">
                        <div className="box has-text-centered">
                            <h2 className="title">User-Friendly</h2>
                            <p>Enjoy an intuitive and easy-to-use platform.</p>
                        </div>
                    </div>
                    <div className="column is-4">
                        <div className="box has-text-centered">
                            <h2 className="title">Secure Storage</h2>
                            <p>Your images are safe with us, accessible anytime.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container p-3">
                <div className="container mb-6">
                    <div className="columns mb-6">
                        <div className="column is-12">
                            <div className="notification join-community-container has-text-centered">
                                <img
                                    src="/storage/images/server_images/wallpaper3.png"
                                    alt="Community Background"
                                />
                                <div className="join-community-content">
                                    <h2 className="title">Join Our Community</h2>
                                    <p className="subtitle font-weight-large">Sign up today and start sharing your creativity with the world.</p>
                                    <Link to="/get_started" className="button is-large join-community-button">Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="columns mb-6 mt-6">
                    <div className="column is-6">
                        <div className="notification">
                            <h2 className="title">Latest News</h2>
                            <p>We’ve just added new features to enhance your experience. Check out our blog for more details!</p>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="notification">
                            <h2 className="title">User Feedback</h2>
                            <p>"This service has been a game-changer for me. I can easily upload and share my images!" - Jane Doe</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(Welcome);