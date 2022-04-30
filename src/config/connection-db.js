const { Client } = require('pg')

const dbcon = new Client({
    connectionString: 'postgres://tfhgfwikjocfhz:9de45ed07fe92e5dc941fc4141d4ceec24632adcf8fdd5222d32bd8bf155ae35@ec2-44-196-223-128.compute-1.amazonaws.com:5432/d2mutb76m5dphs',
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