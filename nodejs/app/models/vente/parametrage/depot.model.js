module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("depot", {
        iddepot: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        nomdepot: {
            type: Sequelize.STRING(45)
        },
        numdepot: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.TEXT
        },
        dateModification: {
            type: Sequelize.DATE,
        }
    },
    {
        tableName: "depot",
        timestamps: false
    });

    return Resp;
};
