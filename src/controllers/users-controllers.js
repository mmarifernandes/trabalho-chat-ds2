const bcrypt = require('bcrypt');

const { nanoid } = require('nanoid');
const { dbcon } = require('../config/connection-db');
const { Usuario, UsuarioDAO } = require('../models/usuario');

class UsersController {

    async mostraCadastro(req, res) {
        return res.render('cadastrouser');
    }


    async cadastrar(req, res) {
        console.log('UsersController/cadastrar');

        const userBody = req.body;
        const senha = bcrypt.hashSync(userBody.senha, 10);

        const user = {
            nome: userBody.nome,
            email: userBody.email,
            senha
        }
        req.session.user = user;
        const usuario = new Usuario(null, user.nome, user.email, senha);
        await UsuarioDAO.cadastrar(usuario);

        res.redirect('/');
    }

    async mostraLogin(req, res) {
        return res.render('login');
    }

    async login(req, res) {
        // ACHAR COM O EMAIL CERTO
        const { email, senha } = req.body;
        const usuario = await UsuarioDAO.buscaPeloId(email);
        if (!usuario) return res.send('User nao encontrado');

        // VERIFICAR A SENHA
        const confere = bcrypt.compareSync(senha, usuario.senha);
        if (confere) {
            req.session.user = usuario;
            return res.redirect('/');

        } else {
            return res.send('Senha nao confere...');
        }

    }
}

module.exports = UsersController;
