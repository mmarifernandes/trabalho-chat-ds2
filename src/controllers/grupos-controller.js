let grupos = [];

const { nanoid } = require('nanoid');
const { dbcon } = require('../config/connection-db');
const { Grupo, GrupoUser, GrupoUserDAO, GrupoDAO, Mensagem, MensagemDAO } = require('../models/grupo');

class GruposController {


    async paginacao(req, res) {
        const { page } = {page: req.params.num};
        const total = await dbcon.query('SELECT * FROM grupos');
        const result = await dbcon.query('SELECT * FROM grupos limit 5 offset '+page);
        return res.render('listagem', { user: req.session.user, total: total.rows, grupos: result.rows});
    }

        async paginacaomensagem(req, res) {
        const { user } = {user: req.session.user.email}
        const { page } = {page: req.params.num};
        const { id } = req.params;
        const usuariogrupo = await GrupoDAO.buscaPeloIdGrupo(id, user);
        if (usuariogrupo.length > 0) {
        const grupo = await GrupoDAO.buscaPeloId(id);
        const result2 = await dbcon.query("SELECT * from grupouser join usuario on grupouser.userid = usuario.email  where grupoid = '"+id+"' order by grupouser.tipo asc");
        const result3 = await dbcon.query("SELECT *, to_char(datahora, 'HH24:MI') as horario from mensagem join usuario on usuario.email = mensagem.iduser where grupoid = '" + id + "' order by datahora asc limit 10 offset "+ page);
        const result4 = await dbcon.query("SELECT * from grupouser join usuario on usuario.email = grupouser.userid where userid = '"+user+"' and grupoid = '" + id + "'");
        const total = await dbcon.query("SELECT * from mensagem join usuario on usuario.email = mensagem.iduser where grupoid = '" + id + "'order by datahora asc");

        return res.render('detalhar', { user: req.session.user, grupo: grupo, total: total.rows, membros: result2.rows, mensagens: result3.rows, pessoa: result4.rows });
    } else{
        res.send("Você precisa entrar no grupo")
        }
    }
    async paginacaomgrupos(req, res) {
        const { user } = {user: req.session.user.email}
        const { page } = {page: req.params.num};
        const total = await dbcon.query("SELECT * FROM grupouser join grupos on grupouser.grupoid = grupos.id where grupouser.userid ='" + user + "'");
        const result2 = await dbcon.query("SELECT * FROM grupouser join grupos on grupouser.grupoid = grupos.id where grupouser.userid ='" + user + "' limit 5 offset "+page);
        return res.render('meusgrupos', { user: req.session.user, total: total.rows, meusgrupos: result2.rows});
    }

    async mostraCadastro(req, res) {
        if (req.session.user) {
        return res.render('cadastrar',{ user: req.session.user});
        }else{
        res.send("Você precisa estar logado")
        }
    }

    async mostraAlterar(req, res) {
        const { id } = req.params;
        const grupo = await GrupoDAO.buscaPeloId(id);
        res.render('alterar-grupo', { grupo: grupo })
    }

    async alterar(req, res) {
        const { id } = req.params;
        const { nome } = req.body;
        const grupo = new Grupo(id, nome);
        const resultado = await GrupoDAO.atualiza(grupo);
        res.send("Chamei o alterar do controller e fui pro banco... resultado " + resultado);
    }

    async listar(req, res) {

        if (req.session.user) {
        const { user } = {user: req.session.user.email}
        const result2 = await dbcon.query("SELECT * FROM grupouser join grupos on grupouser.grupoid = grupos.id where grupouser.userid ='" + user + "'");
        const result = await dbcon.query('SELECT * FROM grupos limit 5');
        const total = await dbcon.query('SELECT * FROM grupos');
        return res.render('listagem', { user: req.session.user, total: total.rows, grupos: result.rows, meusgrupos: result2.rows});
        }else{
        const result = await dbcon.query('SELECT * FROM grupos limit 5');
        const total = await dbcon.query('SELECT * FROM grupos');

        return res.render('listagem', { user: req.session.user, total: total.rows, grupos: result.rows, meusgrupos: null});

    }
    }

        async listarmeusgrupos(req, res) {
        if (req.session.user) {
        const { user } = {user: req.session.user.email}
        const total = await dbcon.query("SELECT * FROM grupouser join grupos on grupouser.grupoid = grupos.id where grupouser.userid ='" + user + "'");
        const result2 = await dbcon.query("SELECT * FROM grupouser join grupos on grupouser.grupoid = grupos.id where grupouser.userid ='" + user + "' limit 5");
        return res.render('meusgrupos', { user: req.session.user, total: total.rows, meusgrupos: result2.rows});
        }else{
        return res.send("Você precisa estar logado");
    }
    }

    async deletar(req, res) {
        const { id } = req.params;
        const { user } = {user: req.session.user.email}
        await GrupoDAO.SairGrupo(id, user);
        return res.redirect('/grupos')
    }

        async deletarMembro(req, res) {
        const { id } = {id: req.params.id}
        const { user } = {user: req.params.membroid}
        console.log(id);
                console.log(user);

        await GrupoDAO.SairGrupo(id, user);
        console.log("nao funcionou");
        return res.redirect('/grupos/' + id);
    }

    async detalhar(req, res) {
        const { id } = req.params;
        if (req.session.user) {
            const { user } = {user: req.session.user.email}
            const usuariogrupo = await GrupoDAO.buscaPeloIdGrupo(id, user);
            if (usuariogrupo.length > 0) {
            const grupo = await GrupoDAO.buscaPeloId(id);
            const result2 = await dbcon.query("SELECT * from grupouser join usuario on grupouser.userid = usuario.email  where grupoid = '"+id+"' order by grupouser.tipo asc");
            const result3 = await dbcon.query("SELECT *, to_char(datahora, 'HH24:MI') as horario from mensagem join usuario on usuario.email = mensagem.iduser where grupoid = '" + id + "'order by datahora asc limit 10");
            const result4 = await dbcon.query("SELECT * from grupouser join usuario on usuario.email = grupouser.userid where userid = '"+user+"' and grupoid = '" + id + "'");
            const total = await dbcon.query("SELECT * from mensagem join usuario on usuario.email = mensagem.iduser where grupoid = '" + id + "'order by datahora asc");

        return res.render('detalhar', { user: req.session.user, grupo: grupo, total: total.rows, membros: result2.rows, mensagens: result3.rows, pessoa: result4.rows });
    } else{
        res.send("Você precisa entrar no grupo")
        }
    }else{
        res.send("Você precisa logar primeiro")
    }
    }
    async cadastrarusuario(req, res) {
        const { id } =  req.params;
        const { email } = req.body;
        const { tipo } = req.body;
        const result1 = await dbcon.query("SELECT * FROM usuario where usuario.email ='" + email + "'");
        const result2 = await dbcon.query("SELECT * FROM grupouser join grupos on grupouser.grupoid = grupos.id where grupouser.userid ='" + email + "' and grupoid ='" + id + "'");
        if(result1.rows.length !==0 ){
        if( result2.rows.length === 0){
        const grupouser = new GrupoUser(email, id, tipo);
        await GrupoUserDAO.cadastrarusuario(grupouser);
        return res.redirect('/grupos/' + id);
        }else{
            res.send("Usuário já esta no grupo")
        }
        }else{
            res.send("Usuário não existe")

    }
    }



    async cadastrarmensagem(req, res) {
        const { id } =  req.params;
        const { user } = {user: req.session.user.email}
        const { texto } = req.body;
        const date  = new Date();
        if(texto !== ''){
        const mensagem = new Mensagem(id, user, texto, nanoid(8), date);
        await MensagemDAO.cadastrarmensagem(mensagem);
        return res.redirect('/grupos/' + id);
        }else{
            res.send("Você precisa digitar algo")
        }
    }


    async cadastrar(req, res) {

        const { user } = {user: req.session.user.email}
        const { nome } = req.body;
        const { id } =  {id: nanoid(8)};
        const grupo = new Grupo(id, user, nome, 1);
        await GrupoDAO.cadastrar(grupo);
        return res.redirect('/grupos');
        // return res.send('Deveria cadastrar um grupo');
    }
}

module.exports = { GruposController }