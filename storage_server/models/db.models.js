// table gallery
// id | owner_id | owner_name | image_address | created_at | views | file_label
const { DataTypes } = require('sequelize');
const db = require('../controllers/db.init.contrroller');

const Gallery = db.define('gallery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'owner_id',
    },
    owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'owner_name',
    },
    image_address: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'image_address',
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'views',
    },
    file_label: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'file_label',
    },
    public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'public',
    },
}, {
    tableName: 'gallery',
    freezeTableName: true,
    timestamps: false,
    createdAt: 'created_at',
});

module.exports = Gallery;