let grupos = [];

const { nanoid } = require('nanoid');
const { dbcon } = require('../config/connection-db');
const { Grupo, GrupoDAO } = require('../models/grupo');

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
        const grupo = await GrupoDAO.buscaPeloId(id);
        const result2 = await dbcon.query("SELECT * from grupouser join usuario on grupouser.userid = usuario.id  where grupoid = '"+id+"'");
        const result3 = await dbcon.query("SELECT * from mensagem join usuario on usuario.id = mensagem.iduser where grupoid = '" + id + "'");

        
        console.log({
            RESULT2: result2.rows
        });

        return res.render('detalhar', { grupo: grupo, membros: result2.rows, mensagens: result3.rows });

    }

    async cadastrar(req, res) {
        //DEPOIS DE CADASTRAR, REDIRECIONA PARA A LISTAGEM
        console.log(`Cadastrando um grupo`);
        console.log({ body: req.body });
                console.log({ user: req.session.user.email });
        const { user } = {user: req.session.user.email}
        const { nome } = req.body;
        const { adm } =  user;
        console.log(user);
        
        const grupo = new Grupo(null, user, nome, 1);
        await GrupoDAO.cadastrar(grupo);
        
        return res.redirect('/grupos');
        // return res.send('Deveria cadastrar um grupo');
    }
}

module.exports = { GruposController }