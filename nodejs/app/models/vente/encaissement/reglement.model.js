module.exports = (sequelize, Sequelize) => {
    const Resp = sequelize.define("reglement", {
        idreglement: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        idticket: {
            type: Sequelize.INTEGER
        },
        montant: {
            type: Sequelize.DOUBLE        
        },
        modepaiement: {
            type: Sequelize.STRING(45)        
        },
        typepaiement: {
            type: Sequelize.STRING(45)        
        },
        numerocheque: {
            type: Sequelize.STRING(45)        
        },
        codejournal: {
            type: Sequelize.STRING(45)        
        },
        nomodereglement: {
            type: Sequelize.INTEGER        
        },
        dateModification: {
            type: Sequelize.DATE
        },
        numreglement: {
            type: Sequelize.STRING(17)
        },
        amountValue: {
            type: Sequelize.DOUBLE,
            allowNull: true
        }
    },{
        timestamps: false,
        tableName: "reglement"
    });

    return Resp;
};
