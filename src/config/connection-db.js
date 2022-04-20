const { Client } = require('pg')

const dbcon = new Client({
    connectionString: 'postgres://ssnjgyrkbrhfkk:a4ed50734ac7ca49a6e49a8e1a3e1f774f242012fc7087d9350849ded046bfbb@ec2-52-71-69-66.compute-1.amazonaws.com:5432/denglilpjn65l1',
    ssl: {
        rejectUnauthorized: false
    }
});

dbcon.connect(err => {
    if (err) {
        console.log("ERRO!!! NAO FOI POSSIVEL CONECTAR NO BANCO");
        console.log( { err });
    } else {
        console.log("BANCO CONECTADO COM SUCESSO");
    }
});

module.exports = {
    dbcon
}