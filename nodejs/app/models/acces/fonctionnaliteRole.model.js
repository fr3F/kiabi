module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("fonctionnalite_role", {
    },  
    {
        timestamps: false
    });

    return Resp;
};
