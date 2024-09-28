import React, { useEffect, useState } from "react";
import { request } from "../../../helpers/request";
import Search from "./elements/search";

const Gallery = () => {
    const [popularImages, setPopularImages] = useState([]);
    const [latestImages, setLatestImages] = useState([]);
    const [availablePopularImages, setAvailablePopularImages] = useState([]);
    const [availableLatestImages, setAvailableLatestImages] = useState([]);
    const [showImgFull, setShowImgFull] = useState(null);
    const [isMainGalleryVisible, setIsMainGalleryVisible] = useState(true);

    useEffect(() => {
        const loadFromCache = () => {
            const popular = sessionStorage.getItem("popularImages");
            const latest = sessionStorage.getItem("latestImages");

            if (popular) {
                setPopularImages(JSON.parse(popular));
            }
            if (latest) {
                setLatestImages(JSON.parse(latest));
            }
        };

        const fetchData = async () => {
            try {
                const popular = await request("storage/gallery/popular", "GET", null, {}, true);
                const latest = await request("storage/gallery/latest", "GET", null, {}, true);

                if (popular) {
                    setPopularImages(popular);
                    // sessionStorage.setItem("popularImages", JSON.stringify(popular));
                }
                if (latest) {
                    setLatestImages(latest);
                    // sessionStorage.setItem("latestImages", JSON.stringify(latest));
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadFromCache();
        if (!sessionStorage.getItem("popularImages") || !sessionStorage.getItem("latestImages")) {
            fetchData();
        }
    }, []);

    useEffect(() => {
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

        const updateAvailableImages = async () => {
            const availablePopular = await checkImagesAvailability(popularImages);
            sessionStorage.setItem("popularImages", JSON.stringify(availablePopular));
            setAvailablePopularImages(availablePopular);

            const availableLatest = await checkImagesAvailability(latestImages);
            sessionStorage.setItem("latestImages", JSON.stringify(availableLatest));
            setAvailableLatestImages(availableLatest);
        };

        updateAvailableImages();
    }, [popularImages, latestImages]);

    const handleClose = () => setShowImgFull(null);

    const renderImageGrid = (images) => {
        return images.map((image) => (
            <div key={image.id} className="square-item">
                <img
                    src={`image/${image.image_address}`}
                    alt={image.file_label}
                    onClick={() => setShowImgFull(image)}
                />
                {(image.file_label || image.views > 0) && (
                    <div className="image-overlay">
                        {image.file_label && <p className="image-title">{image.file_label}</p>}
                        {image.views > 0 && <p className="image-subtitle">Views: {image.views}</p>}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <>  
            <Search setIsMainGalleryVisible={setIsMainGalleryVisible} setShowImgFull={setShowImgFull} />
            {isMainGalleryVisible &&
                <div className="section mb-6">
                    <div className="container">
                        <h1 className="title">Gallery</h1>

                        <div className="mb-6">
                            <h2 className="subtitle">Most Popular Images</h2>
                            <div className="square-grid">
                                {availablePopularImages.length && renderImageGrid(availablePopularImages)}
                            </div>
                        </div>

                        <div>
                            <h2 className="subtitle">Latest Images</h2>
                            <div className="square-grid">
                                {availableLatestImages.length && renderImageGrid(availableLatestImages)}
                            </div>
                        </div>
                    </div>
                </div>
            }

            {showImgFull && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`image/${showImgFull.image_address}`}
                            alt={showImgFull.file_label}
                        />
                        {showImgFull.file_label && <p className="image-title pos-top-left">{showImgFull.file_label}</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default React.memo(Gallery);