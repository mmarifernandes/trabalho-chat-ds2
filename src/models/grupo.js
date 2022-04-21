const { dbcon } = require("../config/connection-db");
const { nanoid } = require('nanoid');
class Grupo {
    constructor(id, adm, nome, quantidade) {
        this.id = id;
        this.adm = adm;
        this.nome = nome;
        this.quantidade = quantidade;

    }
}

class GrupoUser {
    constructor(userid, grupoid, tipo) {
        this.grupoid = grupoid;
        this.userid = userid;
        this.tipo = tipo;

    }
}

class Mensagem {
    constructor(grupoid, iduser, texto, id, datahora) {
        this.grupoid = grupoid;
        this.iduser = iduser;
        this.texto = texto;
        this.id = id;
        this.datahora = datahora;

    }
}

// DAO = DATA ACCESS OBJECT
class GrupoDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM grupos where id = $1';
        const result = await dbcon.query(sql, [id]);
        const grupo = result.rows[0];
        // const filme = new Filme() -> mundo ideal <3
        return grupo;
    }

    static async atualiza(grupo) {
        const sql = `UPDATE grupos
            SET nome = $2, 
            WHERE id = $1;`;
        const values = [grupo.id, grupo.nome];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(grupo) {
        
        const sql2 = 'INSERT INTO public.grupouser (userid, grupoid, tipo) VALUES ($1, $2, $3);';
        const values2 = [grupo.adm, grupo.id, 'adm'];

        const sql = 'INSERT INTO public.grupos (id, adm, nome, quantidade) VALUES ($1, $2, $3, $4);';
        const values = [grupo.id, grupo.adm, grupo.nome, 1];
        
        try {
            await dbcon.query(sql, values);
            await dbcon.query(sql2, values2);

        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }

        
    }
}

class GrupoUserDAO {

    static async cadastrarusuario(grupouser) {

        const sql = 'INSERT INTO public.grupouser (grupoid, userid, tipo) VALUES ($1, $2, $3);';
        const values = [grupouser.grupoid, grupouser.userid, grupouser.tipo];
        const up = "UPDATE public.grupos set quantidade = quantidade+1 where id = '"+grupouser.grupoid+"'";

        try {
            await dbcon.query(sql, values);
            await dbcon.query(up);

        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({
                error
            });
        }

    }
}

class MensagemDAO {

    static async cadastrarmensagem(mensagem) {

        const sql = 'INSERT INTO public.mensagem (grupoid, iduser, texto, id, datahora) VALUES ($1, $2, $3, $4, $5);';
        const values = [mensagem.grupoid, mensagem.iduser, mensagem.texto, mensagem.id, mensagem.datahora];

        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({
                error
            });
        }

    }
}




module.exports = {
    Grupo,
    GrupoUser,
    GrupoUserDAO,
    GrupoDAO,
    Mensagem,
    MensagemDAO
};