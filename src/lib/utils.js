module.exports = {
    age(timestamp){
        const today = new Date() // cria um novo objeto de data (data de hoje) e coloca no today
        const birthDate = new Date(timestamp)
        var age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
        const day = today.getDate() - birthDate.getDate()

        //today.getDay: dia da semana
        //today.getDate: dia do mes
        if (month < 0 || (month == 0 && day < 0)){
            age = age - 1
        }
        return age 
    },
    date(timestamp){
        const date = new Date(timestamp) // transforma o timestamp em ms em formato data
        const year = date.getUTCFullYear() //pega so o ano
        // utc pega o tempo universal, evita problemas de  mostrar somente 1 digito
        const month = `0${date.getUTCMonth() + 1}`.slice(-2) //pega so o mes
        const day = `0${date.getUTCDate()}`.slice(-2) //pega so o dia do mes
        return {
            iso: `${year}-${month}-${day}`,
            birthday: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    }
}



