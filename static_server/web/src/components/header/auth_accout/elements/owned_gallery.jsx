import React, { useState, useEffect } from "react";
import { request } from "../../../../helpers/request";

function OwnedGallery({ ownedGalleryPanelVisible, setOwnedGalleryPanelVisible }) {
    const [ownedImages, setOwnedImages] = useState([]);
    const [showImgFull, setShowImgFull] = useState(null);

    useEffect(() => {
        const fetchOwnedImages = async () => {
            try {
                const storedImages = sessionStorage.getItem("ownedImages");
                
                if (storedImages) {
                    setOwnedImages(JSON.parse(storedImages));
                } else {
                    const result = await request(`/search/owned`, "GET", null, {}, true);
                    if (result && result.length > 0) {
                        const availableImages = await checkImagesAvailability(result);
                        setOwnedImages(availableImages);
                        sessionStorage.setItem("ownedImages", JSON.stringify(availableImages));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch owned images:", error);
            }
        };

        if (ownedGalleryPanelVisible) {
            fetchOwnedImages();
        }
    }, [ownedGalleryPanelVisible]);

    const checkImagesAvailability = async (images) => {
        const availableImages = await Promise.all(images.map(async (image) => {
            const exists = await checkImageExists(image.image_address);
            return exists ? image : null;
        }));

        return availableImages.filter(image => image !== null);
    };

    const checkImageExists = async (imageAddress) => {
        try {
            const response = await fetch(`image/${imageAddress}`, { method: 'HEAD' });
            return response.status !== 404;
        } catch (error) {
            console.error(`Error checking image ${imageAddress}:`, error);
            return false;
        }
    };

    const handleClose = () => setShowImgFull(null);

    const handleDownloadImage = async (address) => {
        console.log("Downloading image:", address);   
    
        try {
            const response = await fetch('/download/', {
                method: 'GET',
                headers: {
                    'X-File-Address': address
                }
            });
    
            if (!response.ok) {
                console.error("Download error:", response.statusText);
                return;
            }
    
            const blob = await response.blob();
    
            const link = document.createElement("a");
            const url = window.URL.createObjectURL(blob);
    
            link.href = url;
            link.download = address;
            document.body.appendChild(link);
            link.click();
    
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error during file download:", error);
        }
    };

    const handleDeleteImage = async (id) => {
        const response = await request(`/delete/`, "DELETE", null, { 'X-Image-Id': id }, true);
        if (response) {
            const updatedImages = ownedImages.filter((image) => image.id !== id);
            setOwnedImages(updatedImages);
            sessionStorage.setItem("ownedImages", JSON.stringify(updatedImages));
        }
    }

    const handleImageError = (image) => {
        const updatedImages = ownedImages.filter((ownedImage) => ownedImage.id !== image.id);
        setOwnedImages(updatedImages);
        sessionStorage.setItem("ownedImages", JSON.stringify(updatedImages));
    };

    return (
        <>
            {ownedGalleryPanelVisible && (
                <div className="pl-5 pr-5" style={{ overflowY: "auto", overflowX: "hidden", width: "100%", height: "100%" }}>
                    <label className="label">Your Uploaded Images</label>

                    {ownedImages.length ? (
                        <div className="square-grid">
                            {ownedImages.map((image) => (
                                <div key={image.id} className="square-item">
                                    <img
                                        src={`image/${image.image_address}`}
                                        alt={image.file_label}
                                        onClick={() => setShowImgFull(image)}
                                        onError={() => handleImageError(image)} // Обработка ошибки для изображения
                                    />
                                    {(image.file_label || image.views > 0) && (
                                        <div className="image-overlay">
                                            {image.file_label && <p className="image-title">{image.file_label}</p>}
                                            {image.views > 0 && <p className="image-subtitle">Views: {image.views}</p>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No images found in your gallery.</p>
                    )}
                </div>
            )}

            {showImgFull && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`image/${showImgFull.image_address}`}
                            alt={showImgFull.file_label}
                            onError={() => handleImageError(showImgFull)} // Обработка ошибки для изображения в модальном окне
                        />
                        {showImgFull.file_label && <p className="image-title pos-top-left">{showImgFull.file_label}</p>}
                        <div className="is-flex mt-3">
                            <button className="button mr-3" onClick={() => navigator.clipboard.writeText(`http://localhost/image/${showImgFull.image_address}`)}>Copy url</button>
                            <button className="button" onClick={() => handleDownloadImage(showImgFull.image_address)}>Save on device</button>
                            <button className="button ml-3 is-danger" onClick={() => handleDeleteImage(showImgFull.id)}>Delete image</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default React.memo(OwnedGallery);