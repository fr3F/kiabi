// module.exports = (sequelize, Sequelize) => {
//     const Resp = sequelize.define("produit", {
//         idproduit: {
//             type: Sequelize.INTEGER,
//         },
//         code: {
//             type: Sequelize.STRING(18),
//             primaryKey: true
//         },
//         designation: {
//             type: Sequelize.STRING(20),
//         },
//         prixventeht: {
//             type: Sequelize.DOUBLE,
//         },
//         prixventettc: {
//             type: Sequelize.DOUBLE,
//         },
//         lastupdate: {
//             type: Sequelize.DATE,
//         },
//         famille: {
//             type: Sequelize.STRING(35),
//         },
//         datedebutprom: {
//             type: Sequelize.DATE,
//         },
//         datefinprom: {
//             type: Sequelize.DATE,
//         },
//         tauxvip: {
//             type: Sequelize.DOUBLE,
//         },
//         tauxremisemag: {
//             type: Sequelize.DOUBLE,
//         },
//         magasin: {
//             type: Sequelize.STRING(45),
//         },
//         articlelocaux: {
//             type: Sequelize.INTEGER,
//         },
//         codecategorie: {
//             type: Sequelize.STRING(3),
//         },
//         codegamme: {
//             type: Sequelize.STRING(3),
//         },
//         codeunivers: {
//             type: Sequelize.STRING(3),
//         },
//         codegifi: {
//             type: Sequelize.STRING(13),
//         },
//         libellecourt: {
//             type: Sequelize.STRING(20),
//         },
//         tauxtva: {
//             type: Sequelize.INTEGER,
//         },
//         dateModification: {
//             type: Sequelize.DATE,
//         },
//         prixhtprincipal: {
//             type: Sequelize.DOUBLE,
//         },
//         prixttcprincipal: {
//             type: Sequelize.DOUBLE,
//         },
//         fulldesignation: {
//             type: Sequelize.STRING(69),
//         },
//     },
//     {
//         tableName: "produit",
//         timestamps: false
//     }
//     );

//     return Resp;
// };
