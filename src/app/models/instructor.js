// const db = require('../../config/db')

const { age, date } = require('../../lib/utils')
const { Client } = require('pg');

const client = new Client({  
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

client.connect();

module.exports = {
    all(callback){
        const query = `
        select instructors.*, count(members.name) as total_students
        from instructors left join members on instructors.id = members.instructor_id
        group by instructors.id order by total_students desc`
        client.query(query, function(err, results){
            if(err) throw `Database error! ${err}`
            // results.rows ja eh um array
            callback(results.rows)
        })
    },
    // create retorna o id pra poder redirecionar a pagina
    create(data, callback){
        // data sao os dados que vieram do form (antes era req.body)
        const query = `
            insert into instructors (name, avatar_url, gender, services, birth, created_at)
            values ($1, $2, $3, $4, $5, $6)
            returning id`
            // retorna o id pra poder redirecionar a pagina
        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            date(Date.now()).iso
        ]
        client.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`
            // callback eh a function que definimos no instructor.js (nesse caso, no post)
            // post pois eh quando enviamos o dado pro banco..
            callback(results.rows[0])
        })
    },
    find(id, callback){
        client.query(`select * from instructors where id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`
            callback(results.rows[0])
        })
    },
    findBy(filter, callback){
        const query = `
        select instructors.*, count(members.name) as total_students
        from instructors
        left join members on instructors.id = members.instructor_id
        where instructors.name ilike '%${filter}%' or instructors.services ilike '%${filter}%'
        group by instructors.id
        order by total_students desc`
        client.query(query, function(err, results){
            if(err) throw `Database error! ${err}`
            // results.rows ja eh um array
            callback(results.rows)
        })
    },
    update(data, callback){
        const query = `
            update instructors set 
            name = $1, avatar_url = $2, gender = $3, services = $4, birth = $5
            where id = $6`
        const values = [data.name, data.avatar_url, data.gender, data.services, date(data.birth).iso, data.id]
        client.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`
            callback()
        })
    },
    delete(id, callback){
        client.query(`delete from instructors where id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`
            callback()
        })
    },
    paginate(params){

        const { filter, limit, offset, callback } = params

        let query = ``,
            filterQuery = ``,
            totalQuery = `(select count(*) from instructors) as total`

        if (filter){
            filterQuery = `
            where instructors.name ilike '%${filter}%' or instructors.services ilike '%${filter}%'`

            totalQuery = `
            (select count(*) from instructors
            ${filterQuery}) as total`
        }
        query = `
        select instructors.*, ${totalQuery},
        count(members.name) as total_students 
        from instructors left join members on instructors.id = members.instructor_id
        ${filterQuery}
        group by instructors.id 
        order by instructors.name
        limit $1 offset $2`

        client.query(query, [limit, offset], function(err, results){
            if(err) throw `Database error! ${err}`
            callback(results.rows)
        })
    }
}

