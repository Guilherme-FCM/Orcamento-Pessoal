class Despesa{
    constructor(data,tipo,descricao,valor){
        this.data = data
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }    

    validarDado(){
        for(let i in this){
            if (this[i] == undefined || this[i] == null || this[i] == '') { 
                document.getElementById(i).classList.add('is-invalid')
                return false
            }
        }
        this.id = null
        return true
    }
}

class BD{
    constructor(){
        let id = localStorage.getItem('id')

        if (id == null){
            localStorage.setItem('id', 0)
        }
    }

    proximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.proximoId()
        d.id = id
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    pesquisar(despesaBusca){
        let despesasFiltradas = this.recuperarRegistros()

        if (despesaBusca.data != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.data == despesaBusca.data)
        }
        if (despesaBusca.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesaBusca.tipo)
        }
        if (despesaBusca.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesaBusca.descricao)
        }
        if (despesaBusca.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesaBusca.valor)
        }
        /*let chaves = Object.keys(despesaBusca)
        for(let key in chaves) {
            console.log(despesaBusca[chaves[key]])
            if (despesaBusca[chaves[key]] == ''){ continue }
            despesasFiltradas = despesasFiltradas.filter(d => {
                console.log(d[key])
                return d[key] == despesaBusca[chaves[key]]
            })
        }*/
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }

    recuperarRegistros(){
        let despesas = []
        let ids = localStorage.getItem('id')
        for(let x = 1; x <= ids; x++){
            if(localStorage.getItem(x) == null){continue}
            despesas.push(JSON.parse(localStorage.getItem(x)))
        }
        return despesas
    }
}

bd = new BD()

function cadastrarDespesa(){
    let data = document.querySelector('#data')
    let tipo = document.querySelector('#tipo')
    let descricao = document.querySelector('#descricao')
    let valor = document.querySelector('#valor')

    let despesa = new Despesa(
        data.value.split('-').reverse().join('/'),
        tipo.value,
        descricao.value,
        valor.value
    ) 

    if (despesa.validarDado()){
        document.querySelector('#modalRegistroDespesa .modal-title').innerHTML = 'Despesas Cadastradas'
        document.querySelector('#modalRegistroDespesa .modal-title').classList = 'modal-title text-success'
        document.querySelector('#modalRegistroDespesa .modal-body').innerHTML = 'Registro concluído com sucesso'
        document.querySelector('#modalRegistroDespesa button#botaoRetornar').classList = 'btn btn-success'
        document.querySelector('#modalRegistroDespesa button#botaoRetornar').innerHTML = 'Voltar'
        document.querySelector('#modalRegistroDespesa button#botaoRetornar').setAttribute('onclick', 'window.location.reload()')
        $('#modalRegistroDespesa').modal('show')
        bd.gravar(despesa) 
    } else {
        document.querySelector('#modalRegistroDespesa .modal-title').innerHTML = 'Erro na Gravação'
        document.querySelector('#modalRegistroDespesa .modal-title').classList = 'modal-title text-danger'
        document.querySelector('#modalRegistroDespesa .modal-body').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
        document.querySelector('#modalRegistroDespesa button#botaoRetornar').classList = 'btn btn-danger'
        document.querySelector('#modalRegistroDespesa button#botaoRetornar').innerHTML = 'Voltar e Corrigir'
        $('#modalRegistroDespesa').modal('show')
    }
}

function mostrarConsulta(despesas = []){
    if (despesas.length == 0){despesas = bd.recuperarRegistros()}
    
    let tabela = document.querySelector('#tabela')
    tabela.innerHTML = ''

    despesas.forEach( (objetos) => {
        let id_objeto = null
        let contador = 0
        let linha = tabela.insertRow()
        for( let key in objetos){
            if (key == 'id'){
                id_objeto = objetos[key]
                continue
            }
            linha.insertCell(contador).innerHTML = objetos[key] 
            contador++
        }
        let btn = document.createElement('button')
        btn.className = 'btn btn-outline-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = id_objeto
        btn.onclick = function() {
            bd.remover(btn.id)
            window.location.reload()
        }
        linha.insertCell(contador).append(btn)
    }) 
}

function pesquisarDespesa(){
    let data = document.querySelector('#data')
    let tipo = document.querySelector('#tipo')
    let descricao = document.querySelector('#descricao')
    let valor = document.querySelector('#valor')

    let despesa = new Despesa(
        data.value.split('-').reverse().join('/'),
        tipo.value,
        descricao.value,
        valor.value
    ) 

    let despesas = bd.pesquisar(despesa)
    mostrarConsulta(despesas)
}