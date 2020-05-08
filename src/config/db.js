const { Client } = require('pg');

const client = new Client({  
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

client.connect();

module.exports = client;

// Running locally:
// const { Pool } = require('pg')

// module.exports = new Pool({
//     user: 'postgres',
//     password: '8621',
//     host: 'localhost',
//     port: 5432,
//     database: 'gymmanager'
// })

