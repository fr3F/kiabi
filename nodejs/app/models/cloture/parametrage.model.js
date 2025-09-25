module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("parametrage_clotures", {
        designation: {
            type: Sequelize.STRING(255),
            unique: true
        },
    });

    return Resp;
};
