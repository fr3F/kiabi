module.exports = (sequelize, Sequelize) => {
  const UserMagasin = sequelize.define("user_magasins", {
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true
    // },
    idUser: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    idMagasin: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'user_magasins'
  });

  return UserMagasin;
};
