const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    username: { type: String },
    nome: { type: String, required: true },
    email: { type: String },
    cpf: { type: Number, unique: true, required: true },
    categoria: { type: String },
    token: { type: String, required: true },
    senha: { type: String, required: true }
});

const usuario = mongoose.model("usuario", usuarioSchema);

module.exports = usuario;