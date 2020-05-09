if(process.env.NODE_ENV !== 'dev') {

    const { Client } = require('pg');
    
    const client = new Client({  
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });

    client.connect();
    module.exports = client;
}

require('dotenv').config();
const { Pool } = require('pg');

console.log(process.env.NODE_ENV);

module.exports = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});
