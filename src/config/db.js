const { Pool } = require('pg')
// se nao usar tipo pool, toda vez que conectar, precisa enviar login e senha
// com essa config, conecta uma vez no banco e ele guarda a informacao

module.exports = new Pool({
    user: 'postgres',
    password: '8621',
    host: 'localhost',
    port: 5432,
    database: 'gymmanager'
})

