const { dbcon } = require("../config/connection-db");
const { nanoid } = require('nanoid');
class Usuario {
    constructor(id, nome, email, senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;

    }
}

// DAO = DATA ACCESS OBJECT
class UsuarioDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM usuario where id = $1';
        const result = await dbcon.query(sql, [id]);
        const usuario = result.rows[0];
        // const filme = new Filme() -> mundo ideal <3
        return usuario;
    }

    static async atualiza(usuario) {
        const sql = `UPDATE usuarios
            SET nome = $2, 
            WHERE id = $1;`;
        const values = [usuario.id, usuario.nome];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(usuario) {
          
        const sql = 'INSERT INTO public.usuario (id, nome, email, senha) VALUES ($1, $2, $3, $4);';
        const values = [nanoid(8), usuario.nome, usuario.email, usuario.senha];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
        }
    }
}

module.exports = {
    Usuario,
    UsuarioDAO
};