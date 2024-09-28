import React, { useState } from "react";
import { request } from "../../../../helpers/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose } from "@fortawesome/free-solid-svg-icons";

const Search = ({ setIsMainGalleryVisible, setShowImgFull }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedData, setSearchedData] = useState([]);
    const [openSearchedDataPanel, setOpenSearchedDataPanel] = useState(false);
    const [nothingFound, setNothingFound] = useState(false);

    const handleSearch = async (value) => {
        if (!value) return;

        try {
            const result = await request(`/search/`, "GET", null, { "x-search-value": value.toLowerCase() }, true);
            setNothingFound(false);
            if (result && result.length > 0) {
                setSearchedData(result);
                setOpenSearchedDataPanel(true);
                setIsMainGalleryVisible(false);
            } else {
                setSearchedData([]);
                setOpenSearchedDataPanel(false);
                setIsMainGalleryVisible(true);
                setNothingFound(true);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchedData([]);
            setOpenSearchedDataPanel(false);
            setIsMainGalleryVisible(true);
        }
    };

    return (
        <>
            <div className="container mb-4 is-flex is-justify-content-space-between gap-2">
                <input
                    type="text"
                    placeholder="Search images..."
                    value={searchTerm}
                    className="input mr-4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button
                    className="button is-primary"
                    onClick={() => handleSearch(searchTerm)}
                >
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            {nothingFound && 
                <div className="container box mb-4 mt-5 is-flex is-justify-content-space-between">
                    <p className="is-bold is-size-4" style={{ color: '#00d1b2' }}>Nothing were found</p>
                    <button onClick={() => setNothingFound(false)} className="mr-2" style={{ fontSize: '28px'}}><FontAwesomeIcon icon={faClose} /></button>
                </div>
            }

            {openSearchedDataPanel && (
                <div className="searched-data-panel">
                    <div className="container">
                        <div className="container is-flex">
                            <h2 className="subtitle mt-5">Search Results</h2>
                            <button
                                className="ml-4 mr-4 is-size-4"
                                // style={{ fontSize: '24px'}}
                                onClick={() => (setOpenSearchedDataPanel(false), setIsMainGalleryVisible(true), setSearchedData([]), setSearchTerm(""))}
                            >
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>
                        <div className="square-grid">
                            {searchedData.map((image, index) => (
                                <div
                                    className="square-item"
                                    key={index}
                                    onClick={() => {
                                        // setIsMainGalleryVisible(true);
                                        // setOpenSearchedDataPanel(false);
                                        setShowImgFull(image);
                                    }}
                                >
                                        <img
                                            src={`image/${image.image_address}`}
                                            alt={image.file_label}
                                            className="searched-data-image"
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
                    </div>
                </div>
            )}
        </>
    );
};

export default React.memo(Search);