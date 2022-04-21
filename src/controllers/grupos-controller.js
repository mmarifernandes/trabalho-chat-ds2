let grupos = [];

const { nanoid } = require('nanoid');
const { dbcon } = require('../config/connection-db');
const { Grupo, GrupoUser, GrupoUserDAO, GrupoDAO, Mensagem, MensagemDAO } = require('../models/grupo');

class GruposController {

    async mostraCadastro(req, res) {
        return res.render('cadastrar');
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
        console.log('PAGINA INICIAL');
        console.log({ session: req.session });
        // LISTAGEM DE TODOS OS grupos MOSTRANDO O NOME
        // O NOME É CLICAVEL E REDIRECIONA PARA O DETALHAR DO grupo
        // let html = '';
        // grupos.forEach(grupo => {
        //     html += `<a href="/grupos/${grupo.id}">${grupo.nome}</a><br></br>`
        // })
        const result = await dbcon.query('SELECT * FROM grupos');
        console.log({user: req.session.user})
        // return res.send(html);
        return res.render('listagem', { user: req.session.user, grupos: result.rows});
    }

    async deletar(req, res) {
        const { id } = req.params;
        // BUSCAR O grupo E REMOVER DO VETOR
        const grupoIdx = grupos.findIndex(f => f.id == id);
        grupos.splice(grupoIdx, 1);

        // FILTRAR O VETOR DE grupos BASEADO NO ID != DO ID DA REMOÇÃO
        // grupos = grupos.filter(f => f.id != id);
        
        // BANCO - SQL COM DELETE WHERE

        return res.redirect('/grupos')
    }

    async detalhar(req, res) {
        const { id } = req.params;
        const { user } = {user: req.session.user.email}

        const grupo = await GrupoDAO.buscaPeloId(id);
        const result2 = await dbcon.query("SELECT * from grupouser join usuario on grupouser.userid = usuario.email  where grupoid = '"+id+"'");
        const result3 = await dbcon.query("SELECT *, to_char(datahora, 'HH24:MI') as horario from mensagem join usuario on usuario.email = mensagem.iduser where grupoid = '" + id + "'order by datahora asc");
        const result4 = await dbcon.query("SELECT * from grupouser join usuario on usuario.email = grupouser.userid where userid = '"+user+"' and grupoid = '" + id + "'");

      console.log(user)
        console.log({
            RESULT2: result4.rows
        });

        return res.render('detalhar', { user: req.session.user, grupo: grupo, membros: result2.rows, mensagens: result3.rows, pessoa: result4.rows });

    }


    async cadastrarusuario(req, res) {
        const { id } =  req.params;
        const { email } = req.body;
        const { tipo } = req.body;
        //DEPOIS DE CADASTRAR, REDIRECIONA PARA A LISTAGEM
        console.log(`Cadastrando um usuario`);
        console.log({ id: req.body });
        
        // const { userid } = {user: req.session.user.email}
        
        console.log(id)
        console.log(email)
        console.log(tipo)
        const grupouser = new GrupoUser(email, id, tipo);

        console.log(grupouser)
        await GrupoUserDAO.cadastrarusuario(grupouser);
        
        return res.redirect('/grupos');
    }



    async cadastrarmensagem(req, res) {
        const { id } =  req.params;
        const { user } = {user: req.session.user.email}
        const { texto } = req.body;
        const date  = new Date();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const formatdata = hour + ':' + minute;

        //DEPOIS DE CADASTRAR, REDIRECIONA PARA A LISTAGEM
        console.log(`Cadastrando mensagem`);
        console.log({ id: req.body });
        
        // const { userid } = {user: req.session.user.email}
        
        console.log(id)
        const mensagem = new Mensagem(id, user, texto, nanoid(8), date);

        console.log(mensagem)
        await MensagemDAO.cadastrarmensagem(mensagem);
        
        return res.redirect('/grupos/' + id);
    }


    async cadastrar(req, res) {
        //DEPOIS DE CADASTRAR, REDIRECIONA PARA A LISTAGEM
        console.log(`Cadastrando um grupo`);
        console.log({ body: req.body });
                console.log({ user: req.session.user.email });
        const { user } = {user: req.session.user.email}
        const { nome } = req.body;
        const { id } =  {id: nanoid(8)};
        console.log('AQQIUIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
        console.log(id);
        
        const grupo = new Grupo(id, user, nome, 1);
        await GrupoDAO.cadastrar(grupo);
        
        return res.redirect('/grupos');
        // return res.send('Deveria cadastrar um grupo');
    }
}

module.exports = { GruposController }