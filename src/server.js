const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
// permite usar os verbos put e delete

// criando o servidor
const server = express()

// middleware (tudo que esta a partir daqui, ate o momento em que colocamos o servidor online)

// faz funcionar o req.body (enviando dados de um formulario para o backend)
// deve vir antes dos demais server.use
server.use(express.urlencoded({ extended: true }))

server.use(express.static('public'))
server.use(methodOverride('_method')) // primeiro deve sobrescrever o method post com o metodo put, e depois 
// mandar para a rota.. por isso o server.use(methodOverride('_method')) deve vir antes do server.use(routes)
server.use(routes)
server.set('view engine', 'njk')

// informa a localizacao das views
nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

// colocando o servidor online:
// server.listen(5000, function(){
//     console.log('Server is running.')
// })

// Heroku:
server.listen(process.env.PORT || 3000)