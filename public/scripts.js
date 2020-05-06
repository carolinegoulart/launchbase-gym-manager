// Ítem do cabeçalho em negrito de acordo com a página que está ativa:
// window.location: mostra a localização que a pagina esta (ex: /instructors/2/edit)
// location eh o mesmo que windows.location
const currentPage = location.pathname
const menuItems = document.querySelectorAll('header .links a')
for(let item of menuItems){
    var nameItem = item.getAttribute('href')
    if(currentPage.includes(nameItem)){
        item.classList.add('active')
    }
}

// Confirmação ao clicar em deletar:
const formDelete = document.querySelector("#form-delete")
if(formDelete){
    formDelete.addEventListener('submit', function(event){
    const currentPage = location.pathname
    if(currentPage.includes('members')){
        const confirmation = confirm('Deseja deletar o membro?')
        if(!confirmation){
            event.preventDefault()
        }
    }
    if(currentPage.includes('instructor')){
        const confirmation = confirm('Deseja deletar o instrutor?')
        if(!confirmation){
            event.preventDefault()
        }
    }
    })
}

// Paginação:
function paginate(selectedPage, totalPages){
    let pages = [],
        oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++){
        const firstAndLastPages = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if(firstAndLastPages || (pagesBeforeSelectedPage && pagesAfterSelectedPage)){
            if(oldPage && currentPage - oldPage > 2){
                pages.push('...')
            }
            if(oldPage && currentPage - oldPage == 2){
                pages.push(currentPage - 1)
            }
            pages.push(currentPage)
            oldPage = currentPage
        }
    }
    return pages
}

const pagination = document.querySelector(".pagination")
if(pagination){
    const actualPage = +pagination.dataset.page
    const total = +pagination.dataset.total
    const filter = pagination.dataset.filter
    const pages = paginate(actualPage, total)

    let elements = ""
    for(let page of pages){
        if(String(page).includes('...')){
            elements += `<span>${page}</span>`
        }else{
            if(filter){
                if(page == actualPage) {
                    elements += `<a><strong>${page}</strong></a>`
                } else {
                    elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
                }
            }else{
                if(page == actualPage) {
                    elements += `<a href="?page=${page}"><strong>${page}</strong></a>`
                } else {
                    elements += `<a href="?page=${page}">${page}</a>`
                }
            }
        }
    }
    pagination.innerHTML = elements
}
