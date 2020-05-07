// const db = require('../../config/db')
const { age, date } = require('../../lib/utils.js')
const client = require('../../config/db')

// substituted all db.query for client.query
module.exports = {
    all(callback){
        client.query(`select * from members order by name asc`, function(err, results){
            if(err) throw `Database error! ${err}`
            // results.rows ja eh um array
            callback(results.rows)
        })
    },
    // create retorna o id pra poder redirecionar a pagina
    create(data, callback){
        // data sao os dados que vieram do form (antes era req.body)
        const query = `
            insert into members (name, avatar_url, gender, email, birth, blood, weight, height, instructor_id)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning id`
            // retorna o id pra poder redirecionar a pagina
        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.email,
            date(data.birth).iso,
            data.blood,
            data.weight,
            data.height,
            data.instructor
        ]
        client.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`
            // callback eh a function que definimos no member.js (nesse caso, no post)
            // post pois eh quando enviamos o dado pro banco..
            callback(results.rows[0])
        })
    },
    find(id, callback){
        client.query(`select members.*, instructors.name as instructor_name
        from members left join instructors
        on members.instructor_id = instructors.id
        where members.id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`
            callback(results.rows[0])
        })
    },
    findBy(filter, callback){
        client.query(`select * from members where name ilike '%${filter}%' order by name asc`, function(err, results){
            if(err) throw `Database error! ${err}`
            // results.rows ja eh um array
            callback(results.rows)
        })
    },
    update(data, callback){
        const query = `
            update members set 
            name = $1, avatar_url = $2, gender = $3, email = $4, birth = $5, blood = $6, weight = $7, height = $8, instructor_id = $9
            where id = $10`
        const values = [data.name, data.avatar_url, data.gender, data.email, date(data.birth).iso, data.blood, data.weight,
            data.height, data.instructor, data.id]
            client.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`
            callback()
        })
    },
    delete(id, callback){
        client.query(`delete from members where id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`
            callback()
        })
    },
    instructorsSelectOptions(callback){
        client.query(`select name, id from instructors`, function(err, results){
            if(err) throw `Database error! ${err}`
            callback(results.rows)
        })
    },
    paginate(params){
        const { filter, limit, offset, callback } = params

        let query = ``,
            filterQuery = ``,
            totalQuery = `(select count(*) from members) as total`

        if (filter){
            filterQuery = `
            where members.name ilike '%${filter}%' or members.email ilike '%${filter}%'`

            totalQuery = `
            (select count(*) from members
            ${filterQuery}) as total`
        }

        query = `
        select members.*, ${totalQuery}
        from members
        ${filterQuery}
        order by members.name
        limit $1 offset $2`

        client.query(query, [limit, offset], function(err, results){
            if(err) throw `Database error! ${err}`
            callback(results.rows)
        })
    }
}
