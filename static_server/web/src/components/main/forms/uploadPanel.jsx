import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { request } from "../../../helpers/request";

const UploadPanel = ({ isUploadPanelVisible, setIsUploadPanelVisible }) => {
    const [image, setImage] = useState(null);
    const [label, setLabel] = useState("");
    const [imgPublic, setImgPublic] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (isUploadPanelVisible) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        // Clean up on unmount or when the panel visibility changes
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [isUploadPanelVisible]);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleLabelChange = (event) => {
        setLabel(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('image', image);
        formData.append('fileLabel', label);
    
        try {
            if (!image) {
                console.error('No image selected');
                return;
            }

            const response = await request('/storage/upload', 'POST', formData, { 'X-File-Label': label, 'X-Public': imgPublic }, true);
    
            if (response.ok) {
                console.log('Upload success:', response);
                setImageUrl(`/image/${response.image_address}`);

                if (localStorage.getItem('authorized')) {
                    sessionStorage.getItem('ownedImages') && sessionStorage.setItem('ownedImages', JSON.stringify([response, ...JSON.parse(sessionStorage.getItem('ownedImages'))]));
                }
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const closePanel = () => {
        setTimeout(() => setIsUploadPanelVisible(false), 100);
    };

    return (
        isUploadPanelVisible && (
            <>
                <div className="upload-panel-overlay" onClick={closePanel}>
                    <div className="box p-5" style={{ minWidth: "500px", maxWidth: "80vw", overflowY: "auto", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSubmit}>
                            <div>
                            <label className="load-image-button">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUpload} />
                                    <span className="file-label">Choose an image…</span>
                                </span>
                            </label>
                            </div>
                            <div className="field mt-4">
                                <div className="mb-3 is-flex is-justify-content-space-between">
                                    <label style={{ fontSize: "18px", fontWeight: "bold"}}>Image Label (optional)</label>
                                    <div className="is-flex">
                                        <label style={{ fontSize: "18px", fontWeight: "bold"}}>Post to gallery?</label>
                                        <input onChange={() => setImgPublic(!imgPublic)} type="checkbox" className="checkbox ml-2" checked={imgPublic} />
                                    </div>
                                </div>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Enter a label for the image"
                                        value={label}
                                        onChange={handleLabelChange}
                                    />
                                </div>
                            </div>
                            <div className="control mt-4">
                                <button className="button is-primary" type="submit">
                                    Upload Image
                                </button>
                            </div>
                        </form>

                        {image && (
                            <div className="mt-5">
                                <h2 className="subtitle">Preview:</h2>
                                <div className="uploaded-image">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Uploaded Preview"
                                        // style={{ maxWidth: "100%", maxHeight: "40vh" }}
                                        className="loaded-image"
                                    />
                                </div>
                                <p className="mt-3">Label: {label}</p>
                            </div>
                        )}

                        {imageUrl && (
                            <div className="mt-5">
                                <h2 className="subtitle">File uploaded successfully!</h2>
                                <div className="buttons is-flex is-align-items-center">
                                    <button onClick={() => window.open(imageUrl)} className="button is-primary">
                                        Open page with image
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(`http://localhost/${imageUrl}`)}   // change in production
                                        className="button"
                                    >
                                        Copy Image URL: http://localhost/{imageUrl}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    );
};

export default React.memo(UploadPanel);