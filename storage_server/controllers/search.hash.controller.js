const { galleryDBRequest: { selectAllGallery } } = require('./db.request.controller');
const { StatusCodeError } = require('../models/errors');

const gallery_id_map = new Map();
const gallery_label_map = new Map();
const gallery_owner_name_map = new Map();
const gallery_owner_id_map = new Map();

const limit_of_loading = 100_000; // may change pc performance, increases the load on the ram

async function initGalleryIdMap() {
    try {
        const gallery = await selectAllGallery();

        gallery.forEach((item) => {
            if (gallery_id_map.size < limit_of_loading) {
                gallery_id_map.set(item.id, { id: item.id, file_label: item.file_label, image_address: item.image_address });
            }

            if (gallery_label_map.size < limit_of_loading && item.file_label) {
                const currentArray = gallery_label_map.get(item.file_label.toLowerCase()) || [];
                currentArray.push({ id: item.id, image_address: item.image_address, file_label: item.file_label });
                gallery_label_map.set(item.file_label.toLowerCase(), currentArray);
            }

            if (gallery_owner_name_map.size < limit_of_loading) {
                const currentArray = gallery_owner_name_map.get(item.owner_name.toLowerCase()) || [];
                currentArray.push({ id: item.id, image_address: item.image_address, file_label: item.file_label });
                gallery_owner_name_map.set(item.owner_name.toLowerCase(), currentArray);
            }

            if (gallery_owner_id_map.size < limit_of_loading) {
                const currentArray = gallery_owner_id_map.get(item.owner_id) || [];
                currentArray.push({ id: item.id, image_address: item.image_address, file_label: item.file_label });
                gallery_owner_id_map.set(item.owner_id, currentArray);
            }
        });

        console.log('Gallery maps initialized');
    } catch (error) {
        console.error('Error initializing gallery maps:', error);
        throw error;
    }
}

async function initGalleryFull(logging = false) {
    await initGalleryIdMap();

    if (logging) {
        console.log("Gallery ID Map:");
        gallery_id_map.forEach((value, key) => console.log(key, value));

        console.log("Gallery Label Map:");
        gallery_label_map.forEach((value, key) => {
            console.log(key, value);
        });

        console.log("Gallery Owner Name Map:");
        gallery_owner_name_map.forEach((value, key) => {
            console.log(key, value);
        });

        console.log("Gallery Owner ID Map:");
        gallery_owner_id_map.forEach((value, key) => {
            console.log(key, value);
        });
    }
}

function getGalleryMap(param) {
    switch (param) {
        case 'id':
            return gallery_id_map;
        case 'label':
        case 'file_label':
            return gallery_label_map;
        case 'owner_name':
            return gallery_owner_name_map;
        case 'owner_id':
            return gallery_owner_id_map;
        default:
            throw new StatusCodeError(400, 'Invalid param');
    }
}

function selectFromGalleryMaps(value, param) {
    return getGalleryMap(param).get(value);
}

function inputSearch(value) {
    return gallery_label_map.get(value.toLowerCase()) || [];
}

function ownedSearch(id) {
    return gallery_owner_id_map.get(id) || [];
}

// Updaters

function deleteFromGalleryMap(id) {
    try {
        const item = gallery_id_map.get(Number(id));
        if (item) {
            gallery_id_map.delete(Number(id));

            if (item.file_label) {
                const labelMap = gallery_label_map.get(item.file_label.toLowerCase());
                if (labelMap) {
                    gallery_label_map.set(item.file_label.toLowerCase(), labelMap.filter(entry => entry.id !== Number(id)));
                }
            }

            if (item.owner_name) {
                const nameMap = gallery_owner_name_map.get(item.owner_name.toLowerCase());
                if (nameMap) {
                    gallery_owner_name_map.set(item.owner_name.toLowerCase(), nameMap.filter(entry => entry.id !== Number(id)));
                }
            }

            if (item.owner_id !== undefined) {
                const ownerIdMap = gallery_owner_id_map.get(Number(item.owner_id));
                if (ownerIdMap) {
                    gallery_owner_id_map.set(Number(item.owner_id), ownerIdMap.filter(entry => entry.id !== Number(id)));
                }
            }

            console.log('Gallery map item successfully deleted:', item);
        } else {
            console.error('Error deleting gallery: item wasn\'t found in gallery map:', id);
        }
    } catch (error) {
        console.error('Error deleting gallery map item:', error);
    }
}

function appendGalleryItemMap({ id, file_label, image_address, owner_name, owner_id }) {
    try {
        if (!id || !image_address || !owner_name || !owner_id) {
            console.error('Error appending gallery map:', { id, file_label, image_address, owner_name, owner_id });
            return;
        }

        gallery_id_map.set(Number(id), { id, file_label, image_address });

        if (file_label) {
            const labelArray = gallery_label_map.get(file_label.toLowerCase()) || [];
            labelArray.push({ id, image_address, file_label });
            gallery_label_map.set(file_label.toLowerCase(), labelArray);
        }

        const nameArray = gallery_owner_name_map.get(owner_name.toLowerCase()) || [];
        nameArray.push({ id, image_address, file_label });
        gallery_owner_name_map.set(owner_name.toLowerCase(), nameArray);

        const ownerIdArray = gallery_owner_id_map.get(Number(owner_id)) || [];
        ownerIdArray.push({ id, image_address, file_label });
        gallery_owner_id_map.set(Number(owner_id), ownerIdArray);

        console.log('Gallery map item successfully appended:', { id, file_label, image_address, owner_name, owner_id });
    } catch (error) {
        console.error('Error appending gallery map:', error);
    }
}

console.log('Module search.hash.controller loaded');

module.exports = {
    initGalleryFull,
    selectFromGalleryMaps,
    inputSearch,
    ownedSearch,
    deleteFromGalleryMap,
    appendGalleryItemMap
};