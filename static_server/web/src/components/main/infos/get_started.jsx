import React from "react";

function GetStarted({ setIsUploadPanelVisible }) {
    return (
        <div className="container mt-6 mb-6">
            <div className="columns">
                <div className="column is-6" style={{ display: 'flex', alignItems: 'stretch', height: '70vh', borderRadius: '10px' }}>
                    <img 
                        src="/storage/images/server_images/wallpaper5.jpg" 
                        alt="Decorative Image" 
                        style={{ objectFit: 'cover', height: '100%', width: '100%', borderRadius: '6px' }}
                    />
                </div>

                <div className="column is-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '70vh' }}>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="box p-4" style={{ flex: '1' }}>
                            <h2 className="title is-5">1. Unauthenticated User</h2>
                            <p>As an unauthenticated user, you can upload up to 2 images with a maximum size of 512x512 pixels. To access more features, please sign in or become a subscriber.</p>
                        </div>

                        <div className="box p-4" style={{ flex: '1' }}>
                            <h2 className="title is-5">2. Authenticated User</h2>
                            <p>Authenticated users can upload up to 10 images with a maximum size of 2048x2048 pixels. Your images will be saved in your profile gallery, allowing you to easily manage and share them.</p>
                        </div>

                        <div className="box p-4" style={{ flex: '1' }}>
                            <h2 className="title is-5">3. Service Subscriber</h2>
                            <p>Subscribers have unlimited upload capabilities with a maximum image size of up to 8192x8192 pixels. This is ideal for professionals who need to store and share high-resolution images without any restrictions.</p>
                        </div>

                        <div className="box p-4" style={{ flex: '1' }}>
                            <h2 className="title is-5">4. Additional Features</h2>
                            <p>We also offer a user-friendly interface for managing your images and creating an online portfolio. Regardless of your access level, we are committed to ensuring the security and convenience of storing your images.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="columns mt-6">
                <div className="column is-12">
                    <div className="box p-4 has-text-centered">
                        <h2 className="title is-4">What Our Users Say</h2>
                        <div className="columns is-multiline">
                            <div className="column is-4">
                                <div className="p-4">
                                    <p>"This service is fantastic! The interface is intuitive and the upload process is seamless." - Alex R.</p>
                                </div>
                            </div>
                            <div className="column is-4">
                                <div className="p-4">
                                    <p>"I love the high-resolution support. It’s perfect for my professional needs." - Jamie L.</p>
                                </div>
                            </div>
                            <div className="column is-4">
                                <div className="p-4">
                                    <p>"Excellent service with great features and very reliable." - Taylor S.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="columns mt-6">
                <div className="column is-12">
                    <div className="box p-4 has-text-centered">
                        <h2 className="title is-4">Feature Highlights</h2>
                        <div className="columns is-multiline">
                            <div className="column is-4">
                                <div className="p-4">
                                    <h3 className="title is-5">Free Hosting</h3>
                                    <p>Upload and store your images without any cost.</p>
                                </div>
                            </div>
                            <div className="column is-4">
                                <div className="p-4">
                                    <h3 className="title is-5">User-Friendly</h3>
                                    <p>Enjoy an intuitive and easy-to-use platform.</p>
                                </div>
                            </div>
                            <div className="column is-4">
                                <div className="p-4">
                                    <h3 className="title is-5">Secure Storage</h3>
                                    <p>Your images are safe with us, accessible anytime.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns mt-6">
                <div className="column is-12 has-text-centered">
                    <button className="button is-large is-primary" onClick={() => setIsUploadPanelVisible(true)}>
                        Start Uploading Images
                    </button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(GetStarted);