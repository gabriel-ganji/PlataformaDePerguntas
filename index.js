const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const xmlparser = require("express-xml-bodyparser");
const cors = require("cors");

//Database
const connection = require("./database/database");

connection.authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados");
    })
    .catch((error) => {
        console.log(error)
    });

const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Estou dizendo para o express usar o EJS como view engine
app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(cors());
app.use(xmlparser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({type: 'text/*' }));
app.use(express.json());

app.get("/login", function (req, res) {
    res.render("html/login")
});

app.get("/notFound", function(req, res) {
    res.render("html/notFound")
})

app.get("/", function (req, res) {
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC'] //DESC = Decrescente || ASC = Crescente
    ] }).then(perguntas => {
        res.render("html/home", {
            perguntas: perguntas
        });

    });
    
});

app.get("/perguntar", function(req, res){
    res.render("html/perguntar");
});

app.post("/salvarPergunta", function(req, res) {
    const title = req.body.titulo;
    const description = req.body.descricao;
    console.log(req.body);
   
    Pergunta.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });

});

app.get("/pergunta/:id", function(req ,res) {
    const id = req.params.id;

    Pergunta.findOne({ raw: true,
        where: {id: id}
    
    }).then((pergunta) => {

        if(pergunta == undefined) {
            res.redirect("/notFound");

        } else {
            res.render("html/pergunta", {
                pergunta
            });
        }
    });
});

app.listen(3000, () => {console.log("Server running on port 3000!")});