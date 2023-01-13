const Sequelize = require("sequelize");

const connection = new Sequelize("appperguntasdb", "root", "Ganji01011010.", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;