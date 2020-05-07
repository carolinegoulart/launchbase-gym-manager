const intl = require('intl')
const Instructor = require('../models/instructor')
const { age, date } = require('../../lib/utils')

module.exports = {
    // Index
    index(req, res){
        let { filter, page, limit } = req.query
        page = page || 1
        limit = limit || 5
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors){
                if(instructors.length > 0) {
                    const pagination = {
                        total: Math.ceil(instructors[0].total / limit),
                        page
                    }
                    return res.render('instructors/index', { instructors, pagination, filter })
                }else{
                    return res.render('instructors/error', { filter })
                }
            }
        }
        return res.send("Oie")
        Instructor.paginate(params)

        // Quando tinha filtro, sem paginação:
        // const { filter } = req.query //dado que vem do filtro
        // if(filter){
        //     Instructor.findBy(filter, function(instructors){
        //         return res.render('instructors/index', { instructors, filter })
        //     }) 
        // } else {
        //     Instructor.all(function(instructors){
        //         return res.render('instructors/index', { instructors })
        //     })
        // }
    },
    // Create: aparecer a pagina create
    create(req, res){
        return res.render('instructors/create')
    },
    // Post: pega os dados do form e salva no backend
    post(req, res){
        // deve configurar o express para ele ler os dados
        const keys = Object.keys(req.body)
        for(key of keys){
            if(!req.body[key]){
                return res.send('Please, fill out all requires fiels.')
            }
        }
        // vai para o arquivo instructor.js e executa a funcao create ()
        Instructor.create(req.body, function(instructor){
            return res.redirect(`/instructors/${instructor.id}`)
        })
    },
    // Show
    show(req, res){
        const { id } = req.params
        Instructor.find(id, function(instructor){
            // o que entra nesta funcao eh definido la no instructor.js

            // tratando os dados antes de enviar para o front end
            if(!instructor) res.send('Instructor not found.')
            instructor.age = age(instructor.birth)
            instructor.services = instructor.services.split(",")
            instructor.created_at = date(instructor.created_at).format

            // enviando para o front
            return res.render('instructors/show', { instructor })
        })
    },
    // Edit: habilita a edicao
    edit(req, res){
        const { id } = req.params
        Instructor.find(id, function(instructor){
            if(!instructor) res.send('Instructor not found.')

            instructor.birth = date(instructor.birth).iso
            return res.render(`instructors/edit`, { instructor })
        })
    },
    // Put: edita e salva no backend. quando envia o form ja vai com o id (hidden)
    put(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(!req.body[key]){
                return res.send('Please, fill out all requires fiels.')
            }
        }
        Instructor.update(req.body, function(){
            return res.redirect(`/instructors/${req.body.id}`)
            // ja enviou a id pelo form, por isso pega o req.body
        })
    },
    // Delete
    delete(req, res){
        Instructor.delete(req.body.id, function(){
           return res.redirect('/instructors')
        })
    }
}

