// module.exports = (sequelize, Sequelize) => {
//     const ParamNumClient = sequelize.define("param_num_clients", {
//         currentNumero: {
//             type: Sequelize.STRING(12)
//         },
//         minNumero: {
//             type: Sequelize.STRING(12)
//         },
//         maxNumero: {
//             type: Sequelize.STRING(12)
//         }
//     });

//     return ParamNumClient;
// };

// models/param_num_client.js
module.exports = (sequelize, DataTypes) => {
  const ParamNumClient = sequelize.define('param_num_clients', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '000000',
    },
    utiliser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    tableName: 'param_num_clients',
    timestamps: false, 
  });

  return ParamNumClient;
};
