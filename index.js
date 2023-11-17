const express = require("express");
const connectToDatabase = require("./src/database/database")
const app = express();
const usuario = require("./src/router/usuario.router");
const authService = require("./src/service/auth.service");
const jwt = require("webtoken");


connectToDatabase();

const port = 3003;

const segredo = "633f30ad77f0000";

app.use(express.json());

app.use("/usuario", usuario);

app.get("/", (request, response) => {
    console.log(token());
    response.send("Olá Universo, aqui á da Terra ...");
});

app.get("/contato", (request, response) => {
    response.send("Nosso contato email@email.com");
});

app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await authService.loginService(email);

        if (!user) {
            return res.status(400).send({ message: "Usuario não encontrado, tente novamente." })
        }

        if (senha != user.senha) {
            return res.status(400).send({ message: "Senha invalida." })
        }

        const token = authService.generateToken(user, segredo);

        res.status(200).send({
            user, token
        });
    }
    catch (err) {
        console.log(` erro: ${err}`);
    }

});

app.post("/validar", async (req, res) => {
    const { email, token } = req.body;
    const user = await authService.loginService(email);

    if (!user) {
        return res.status(400).send({ message: "Usuario não encontrado, tente novamente" });
    }
    if (token != user.token) {
        return res.status(400).send({ message: "Token incorreto ou expirado, tente novamente" });
    }

    user.token = "";
    await authService.updateToken(user);

    res.status(200).send(user);
    console.log("Token Validado com Sucesso!");
});

app.get("/teste-token", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: "O token não foi informado!" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).send({ message: "O token informado é INVÁLIDO!" });
    }

    const [schema, token] = parts;

    if (!/^Bearer$/i.test(schema)) {
        return res.status(401).send({ message: "token malformatado!" });
    }

    jwt.verify(token, segredo, (err, decoded) => {

        if (err) {
            console.log(`erro: ${err}`);
            return res.status(500).send({ message: `erro interno, tente novamente.` })
        }

        console.log(decoded);
        res.send(decoded);
    });

});

const token = function () {
    let token = Math.random().toString(36).substring(2);
    return token;
}

app.listen(port, () => {
    console.log(`Servidor iniciado e rodando em http://localhost:${port}`);
});