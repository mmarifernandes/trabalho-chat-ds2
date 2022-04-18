const { Client } = require('pg')

const dbcon = new Client({
    connectionString: 'postgres://kwzkrxmxlxnehn:272be637853ae46e39cab36093a0fd696d94f1f0db877453c12e0dad9f50554b@ec2-23-20-224-166.compute-1.amazonaws.com:5432/dcsvft9olh52bo',
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