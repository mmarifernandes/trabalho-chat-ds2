const { dbcon } = require("../config/connection-db");
const { nanoid } = require('nanoid');
class Grupo {
    constructor(id, adm, nome) {
        this.id = id;
        this.adm = adm;
        this.nome = nome;
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
          
        const sql = 'INSERT INTO public.grupos (id, adm, nome) VALUES ($1, $2, $3);';
        const values = [nanoid(8), grupo.adm, grupo.nome];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    Grupo,
    GrupoDAO
};