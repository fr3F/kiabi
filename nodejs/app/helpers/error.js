class ErrorCode extends Error {
    constructor(message, code = 400) {
      super(message);
      this.code = code;
      this.name = "ErrorCode"; // Ajoutez cette ligne pour définir le nom de l'erreur

    }
}

module.exports = {
    ErrorCode
}