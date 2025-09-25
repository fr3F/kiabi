module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("item_parametrage_clotures", {
    }, {
        timestamps: false,
        indexes:[
            { fields: ['idMagasin'], unique:true}
        ]
    });

    return Resp;
};
