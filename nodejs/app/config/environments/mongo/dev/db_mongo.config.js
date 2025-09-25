const { ErrorCode } = require("../../../../helpers/error");
const { URL_DB } = require("./environment");
const mongoose = require("mongoose");

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose erreur de connexion :', err);
});

async function connectMongoDB() {
  try {
    await mongoose.connect(URL_DB);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    throw error;
  }
}

async function checkMongoConnection() {
  if (mongoose.connection.readyState !== 1) { 
    try {
      await connectMongoDB();
      console.log("MongoDB connecté");  
    } catch (error) {
      console.log("MongoDB non connecté");
      throw new ErrorCode("MongoDB non connecté");
    }    
  }
}

module.exports = {
  connectMongoDB,
  checkMongoConnection
};
