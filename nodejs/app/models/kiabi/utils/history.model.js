module.exports = (sequelize, Sequelize) => {
    const DataHistory = sequelize.define("data_histories", {
        folder: {
            type: Sequelize.STRING(20)
        },
        designation: {
            type: Sequelize.STRING(20)
        },
        file: {
            type: Sequelize.STRING(30)
        },
        status: {
            type: Sequelize.STRING(20)
        },
        type: {
            type: Sequelize.STRING(20)
        }
    });

    return DataHistory;
};
