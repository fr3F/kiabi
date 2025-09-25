module.exports = (sequelize, Sequelize) => {
    const DernierNumero = sequelize.define("dernier_numeros", {
        numero: {
            type: Sequelize.STRING(45)
        },
        type: {
            type: Sequelize.STRING(45),
            unique: true
        },
    });

    return DernierNumero;
};
