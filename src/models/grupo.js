const { dbcon } = require("../config/connection-db");

// postgres://mguhwyxzuehniz:513393b8847a572e661667b54ca6560f9da2239d6d569004b671a0580229af8f@ec2-52-54-212-232.compute-1.amazonaws.com:5432/dfoselo3bnj81h
class Grupo {
    constructor(id, nome) {
        this.id = id;
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
          
        const sql = 'INSERT INTO public.grupos (id, nome) VALUES (2, $1);';
        const values = [grupo.nome];
        
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