const intl = require('intl')
const Member = require('../models/member')
const { age, date } = require('../../lib/utils.js')
// usaria const date = require('./utils') se fosse exports.age no utils.js ao inves de module.exports

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
            callback(members){
                if(members.length > 0) {
                    const pagination = {
                        total: Math.ceil(members[0].total / limit),
                        page
                    }
                    return res.render('members/index', { members, pagination, filter })
                }else{
                    return res.render('members/error', { filter })
                }
            }
        }
        Member.paginate(params)

        // Quando tinha somente o filtro:
        // const { filter } = req.query
        // if(filter){
        //     Member.findBy(filter, function(members){
        //         return res.render('members/index', { members, filter })
        //     })
        // }else{
        //     Member.all(function(members){
        //         return res.render('members/index', { members })
        //     })
        // }
    },
    // Create: aparecer a pagina create
    create(req, res){
        Member.instructorsSelectOptions(function( options ){
            return res.render('members/create', { instructorOptions: options } )
        })
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
        // vai para o arquivo member.js e executa a funcao create ()
        Member.create(req.body, function(member){
            return res.redirect(`/members/${member.id}`)
        })
    },
    // Show: mostra dos dados salvos no banco
    show(req, res){
        const { id } = req.params
        Member.find(id, function(member){
            // o que entra nesta funcao eh definido la no member.js, eh o que sai como output da consulta ao banco

            // tratando os dados antes de enviar para o front end
            if(!member) res.send('Member not found.')
            member.birth = date(member.birth).birthday
            member.created_at = date(member.created_at).format

            // enviando para o front
            return res.render('members/show', { member })
        })
    },
    // Edit: habilita a edicao
    edit(req, res){
        const { id } = req.params
        Member.find(id, function(member){
            if(!member) res.send('Member not found.')
            member.birth = date(member.birth).iso

            Member.instructorsSelectOptions(function(intructors){
                return res.render('members/edit', { member, instructorOptions: intructors })
            })
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
        Member.update(req.body, function(){
            return res.redirect(`/members/${req.body.id}`)
            // ja enviou a id pelo form, por isso pega o req.body
        })
    },
    // Delete
    delete(req, res){
        Member.delete(req.body.id, function(){
           return res.redirect('/members')
        })
    }
}