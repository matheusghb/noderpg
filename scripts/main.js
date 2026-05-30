// ditto = "o que eu disse acima"
// </3 definindo funções globais v

let pmt // div do historico de prompts
let info // div de info
let playerdiv // div do container com as informações do player (nome lvl etc)
let playerheader // header acima dessa página
var player // variável que vai guardar a classe

class Player {
    
    constructor(name,route,regalias) { // string, obj, obj
    
    this.name = name 
    this.level = 1 
    this.route = route // referir-se a values.js

    this.cred = { // [valor ATUAL, valor MÁXIMO]
        HP: [10,10], //HEALTH POINTS
        MP: [4,4], // MANA POINTS
    }

    this.armadura = 0 // Redução de dano
    this.regalias = regalias // perks

    this.individualidades = route.individualidades // referir-se a values.js
    this.parafernalha = route.itens // ditto

    this.parafernalha.forEach((item) => {   // loopa pelos valores de parafernalha 
        if (item.tipo == "arma") {          // pra alocar eles a arma e vestimenta
            this.arma = item                // pois são os itens iniciais.
        }
        if (item.tipo == "vestimenta") {
            this.vestimetna = item
        }
    })

    this.stats = { // alocação de status
        POT: route.POT, // referir-se a values.js. POTÊNCIA
        DES: route.DES, // ditto. DESTREZA
        ESP: route.ESP, //ditto. ESPÍRITO
        INT: route.INT //ditto. INTELECTO
    }

    this.compatriotas = [] // lista de aliados
    this.comorbidades = [] // lista de condições aflingindo o personagem

    if (this.stats.POT > 0) { // se a POTÊNCIA for maior que 0
        this.addcred("HP",this.stats.POT * 3,true) // multiplica por 3 e adiciona
    } else { // se for igual ou menor
        this.addcred("HP",this.stats.POT * 2, true) // multiplica por 2 e adiciona (então ou +0 ou +(-2))
    }

    if (this.stats.ESP > 0) { // Ditto só que com ESPÍRITO
        this.addcred("MP",this.stats.ESP * 2, true) // Ditto mas multiplica por 2 
    } else { // Ditto
        this.addcred("MP",this.stats.ESP, true) // Ditto mas não multiplica (+0 ou +(-1))
    }

    }

    addcred (stat,num, max) {   // incrementação dos valores de HELTH POINTS e MANA POINTS
                                // stat = string, "HP" ou "MP", num = int, valor incrementado, max = boolean, se True aumenta atual e maximo
        if (this.cred[stat]) { // fallback, checa se existe um valor em cred com a chave stat
            if (max) { // se adicionar no valor máximo...
            
                this.cred[stat][0] += num // incrementa em ambos dos valores, linha 17
                this.cred[stat][1] += num // ditto
            
            } else { // senão...

                if ((this.cred[stat][0]+num) > this.cred[stat][1]) { // se o valor ATUAL + num for MAIOR que o MÁXIMO
                    this.cred[stat][0] = this.cred[stat][1] // o valor é ignorado e o ATUAL para no MÁXIMO (não pode passar)
                } else { // senão
                    this.cred[stat][0] += num // incrementa naturalmente
                }
                
            }

            document.getElementById(stat).innerHTML = this.cred[stat][0]+"/"+this.cred[stat][1] // modifica o valor da credencial (HP ou MP)
                                                                                                // no site com os valores calculados

        } else {
            console.log("Valor"+stat+"não foi encontrado.") // resultado do fallback
        }

    }

}

class Enemy {
        
        constructor(name,individualidades,HP,stats,drops,sprites,desc) {
            this.name = name
            this.individualidades = individualidades
            this.HP = [HP,HP] 
            this.stats = stats
            this.drops = drops
            this.sprites = sprites
            this.desc = desc
    }

}

const events = [
    battle = async (p) => {

        const sprite = []

        let enemylist = []

        for (let i = 0; i < 5;i++) {
            const enemyselect = enemies[Math.floor(Math.random() * enemies.length)]
            enemylist.push(new Enemy(enemyselect.name+(i+1),
            enemyselect.individualidades,
            enemyselect.HPbase,
            enemyselect.stats,
            enemyselect.loot,
            enemyselect.sprite,
            enemyselect.desc+" número "+(i+1)+".")) 
        }
        
        const view = document.getElementsByClassName("monsterview")[0] 

        let pos = 0
        enemylist.forEach((enemy) => {
            pos += 1
            const div = document.createElement("div")
            div.id = pos
            const spritediv = document.createElement("div")
            div.className = "enemy"
            const p = document.createElement("p")

            p.innerHTML = pos

            if (enemy.sprites.length > 1) {
                let spriteIndex = 0
                setInterval(() => {
                    spritediv.innerHTML = enemy.sprites[spriteIndex]
                    spriteIndex = (spriteIndex + 1) % enemy.sprites.length
                }, 500)
            } else {
                div.innerHTML = sprite[0]
            }

            spritediv.onmouseover = () => {
                changeinfo(enemy.name,enemy.desc)
            }

            div.append(p,spritediv)
            view.append(div)
        })

        console.log(enemylist)

        view.style.display = "flex"

        pushp("Um grupo de inimigos se encontra com você.")

        while (enemylist.length > 0) {

            pushp("O que você deseja fazer entre: ",['- atacar','- defender','- item','- correr'])
            const act = await getinput()

            switch (act) {
                case "atacar": 

                    let target

                    if (enemylist.length > 1) {
                        pushp("Escolha 1 dos "+enemylist.length+" alvos: ")
                        target = await getinput()                        
                    } else {
                        target = 1
                    }

                    if (0 < target && target <= enemylist.length) {

                        const enemy = enemylist[target-1]

                        if (Math.floor((Math.random() * 15)+player.stats[player.arma.atributo]) > (enemy.stats.DES)+5) {
                            dano = player.arma.efeito()

                            pushp("Você desferiu um total de: <b>"+dano+"</b> de dano </i>"+player.arma.tipodano+"</i> no inimigo: <i>"+enemylist[target-1].name+"</i>.")
                            enemylist[target-1].HP[0] -= dano
                            if (enemylist[target-1].HP[0] <= 0) {
                                pushp("Você derrotou "+enemylist[target-1].name+"!")
                                document.getElementById(target).remove()
                                enemylist = (enemylist.slice(0,target-1)).concat(enemylist.slice(target))
                                const divs = document.getElementsByClassName("enemy")
                                for (let i = 0; i < divs.length; i++) {
                                    divs[i].id = (i+1)
                                    divs[i].querySelector("p").innerHTML = (i+1)
                                }
                            }                            
                        } else {
                        
                            pushp("Você errou!")
                        
                        }

                    } else {
                        pushp("Escolha baseado no número acima deles.")
                    }
                    break
                case "defender": 
                    pushp("Defender")
                    break
                case "item": 
                    pushp("Item")
                    break
                case "correr": 
                    pushp("Correr")
                    break
                default:
                    pushp("Escolha uma das opções acima.")
            }

            if (enemylist.length == 0) {
                pushp("Você venceu o combate.")
                break
            }

            enemylist.forEach((enemy) => {
                console.log(enemy)
            })

        }

    },
    interaction = (p) => {
        console.log("interaction")
    },
    ruins = (p) => {
        console.log("ruins")
    }
]

window.onload = function() {
    
    async function main () {
        player = await createPlayer()
        pushp('"'+player.name+'", Você começa a compreender seus arredores, decidindo caminhar com o que encontrou ao seu lado ao acordar.')
        await event(player)
    }

    pmt = document.getElementById("prompt")
    info = document.getElementsByClassName("info")[0]
    const nav = document.getElementsByClassName("nav")[0].children
    playerdiv = document.getElementsByClassName("player")[0]
    playerheader = document.getElementById("playertitle")

    info.addEventListener("click",function () {
        const title = "INFO"
        const txt = "Infomativos ficam aqui. <i>CLIQUE</i> ou apenas bote o mouse <i>EM CIMA</i> de elementos destacados para tentar ver informações sobre eles. <i>CLIQUE AQUI</i> a qualquer momento pra recuperar essa tela."

        changeinfo(title, txt)

    })

    for (let i = 0; i < nav.length; i++) {
        nav[i].addEventListener("click",function() {
            page(this.id)
        })
    }

    const sts = document.getElementsByClassName("STATS")[0].children

    for (let i = 0; i < sts.length; i++) {
        sts[i].onmouseover = function() {
            const st = (sts[i].textContent).slice(0,3)

                const ul = document.createElement("ul")
                let l = []

                let titl = ''
                let text = ''

                if (st == "POT") {
                    titl = "POTÊNCIA"
                    text = "A <b>POTÊNCIA</b> é a representante de seu poderío físico, seja incrementando sua RESILIÊNCIA quanto seu POTÊNCIAL com as próprias mãos. Este é o atributo para os mais aventurados, que não temem agarrar a besta pela garganta.<br><br>Este Atributo afeta: "
                    l = ["HP","Dano de CURTO ALCANCE", "Inventário", "Descanso"]
                } else if (st == "DES") {
                    titl = "DESTREZA"
                    text = "A <b>DESTREZA</b> é a representante de sua técnica espacial, utilizando tanto de seus INSTINTOS e tempo de REAÇÃO quanto sua PRESTIDIGITAÇÃO latente. Acompanha os mais ardilosos, que preferem conquistar seus objetivos com precisão.<br><br>Este Atributo afeta: "
                    l = ["Desvio","Dano de LONGO ALCANCE","Eventos SELVAGENS", "Loot"]
                } else if (st == "ESP") {
                    titl = "ESPÍRITO"
                    text = "O <b>ESPÍRITO</b> é o representante de sua fluência abstrata, sua compreensão SOCIAL e ARCANA com o ambiente a sua volta. Estes desejam soluções a base da vontade, quais possuem resistências muito além do próprio corpo.<br><br>Este Atributo afeta: "
                    l = ["MANA máxima", "Dano de ALIADOS", "Eventos SOCIAIS", "Sorte"]
                } else {
                    titl = "INTELECTO"
                    text = "O <b>INTELECTO</b> é o representante de sua perspicácia lógica, apropriando-se das REGRAS e CONSISTÊNCIAS para moldar sua próxima ação imediata. Os dotados desta natureza só podem se saciar quando sentirem que utilizaram do máximo de tudo o que os foram oferecidos. <br><br>Este Atributo afeta: "
                    l = ["REGEN de MANA", "Dano de MAGIAS", "PREÇOS em LOJAS"]
                }

                l.forEach((txt) => {
                    const li = document.createElement("li")
                    li.innerHTML = "<i>"+txt+";</i>"
                    ul.append(li)
                })

                changeinfo(titl,text,[ul])

        }
    }

    main()

}

function event(p) {

    events[0](p)
    //events[Math.floor(Math.random() * events.length)]()
    
}

function page(id) {
    
    const page = document.createElement("div")
    page.className = "page"

    const exit = document.createElement("div")
    exit.innerHTML = "x"
    exit.className = "exit"
    exit.onmousedown = () => {
        page.remove()
        exit.remove()
        playerheader.innerHTML = "*** PLAYER-SCREEN ***"
    }

    const p = document.createElement("p")
    const innerdiv = document.createElement("div")
    const ul = document.createElement("ul")
    innerdiv.className = "innerdiv"

    

    switch(id) {
        case "individualidades": {
            p.innerHTML = "Suas <i>INDIVIDUALIDADES</i> podem ser utilizadas dentro de combate ao custo de MP."
            playerheader.innerHTML = "******* INDIVIDUALIDADES"
            break
        }
        case "parafernalha": {
            p.innerHTML = "Suas <i>PARAFERNALHAS</i> são itens de natureza variada com uso único. Aqui é o seu INVENTÁRIO."
            playerheader.innerHTML = "******* PARAFERNALHAS"
            break
        }
        case "regalias": {
            p.innerHTML = "Suas <i>REGaLIAS</i> são uma naturez  a única atrelada a seu personagem."
            playerheader.innerHTML = "******* REGALIAS"
            break
        }
        case "compatriotas": {
            p.innerHTML = "Seus <i>COMPATRIOTAS</i> representam aliados que estão lhe acompanhando neste momento."
            playerheader.innerHTML = "******* COMPATRIOTAS"
            break
        }
        case "comorbidades": {
            p.innerHTML = "Suas <i>COMORBIDADES</i> são condições atualmente lhe afetando."
            playerheader.innerHTML = "******* COMORBIDADES"
            break
        }
        case "ref": {
            p.innerHTML = "Sobre o jogo: "
            playerheader.innerHTML = "******* REFERÊNCIAS"
            break
        }
    }

    if (id != "ref") {
        if (player) {
            if (player[id].length > 0) {
                player[id].forEach((item) => {
                    const li = document.createElement("li")
                    li.innerHTML = "<b>"+item.nome+"</b>: "+item.desc
                    if (item.qntd) {
                        const qntd = document.createElement("b")
                        qntd.innerHTML = "x"+item.qntd
                        ul.append(li,qntd)
                    } else if (item.custo) {
                        const custo = document.createElement("b")
                        custo.innerHTML = item.custo+" MP"
                        ul.append(li,custo)
                    } else {
                        ul.append(li)
                    }
                })
                innerdiv.append(ul)
            } else {
                innerdiv.innerHTML = "Você não possuí "+id+" neste momento."
            }
        } else {
            innerdiv.innerHTML = "Você não possuí "+id+" neste momento."
        }    
    }  

    playerheader.append(exit)
    page.append(p,innerdiv)
    playerdiv.append(page)

}

async function createPlayer() {

    pushp("Qual é o seu <i>Nome</i>?")
    const name = await getinput()
    pushp("<b>"+name+"</b> é o nome que você sente lhe chamando quando fecha os olhos.")
    document.getElementById("NAME").innerHTML = name

    const keyblist = []

    for (key in classes) {
        const keyb = document.createElement("b")
        keyb.innerHTML = "- "+key
        keyb.className = "option"
        keyblist.push(keyb)
    }

    keyblist.forEach((b) => {
        b.onmouseover = () => {changeinfo(b.innerHTML,classes[b.innerHTML].desc);}
    })

    pushp("E qual será sua <i>classe</i> entre: ",keyblist)

    while (true) {
        var pclass = await getinput()
        if (classes[pclass]) {
            document.getElementById("ROUTE").innerHTML = pclass
            pushp("O caminho do "+pclass+" define sua identidade.")
            break
        } else {
            pushp("Você deve ser uma das opções acima.")
        }
    }

    const rgl = []

    for (key in regalias) {
        regb = document.createElement("b")
        regb.innerHTML = "- "+key
        regb.className = "option"
        rgl.push(regb)
    }

    rgl.forEach((key) => {
        key.onmouseover = () => {
            changeinfo(key.innerHTML,regalias[key.innerHTML].desc)
        }
    })

    pushp("Por fim, escolha uma <i>Regalia</i> entre: ", rgl)

    while (true) {
        var rega = await getinput()
        if (regalias[rega]) {
            pushp("Você aceita <i>"+rega+"</i> como sua natureza.")
            break
        } else {
            pushp("Escolha uma das opções acima.")
        }
    }

    const p = new Player(name,classes[pclass],regalias[rega])

    document.getElementById("HP").innerHTML = p.cred.HP[0]+"/"+p.cred.HP[1]
    document.getElementById("MP").innerHTML = p.cred.MP[0]+'/'+p.cred.MP[1]

    const stats = document.getElementsByClassName("STATS")[0].children
    for (let i = 0; i < stats.length; i++) {
        stats[i].children[0].innerHTML = p.stats[stats[i].children[0].id]
    }

    return p

}

function pushp(txt,...adds) {
    const p = document.createElement("p")
    p.innerHTML = txt
    let added 
    adds.forEach((add) => {
        added = add
    })
    if (Array.isArray(added)) {
        pmt.append(p)
        added.forEach((add) => {
            const br = document.createElement("br")
            pmt.append(br,add)
        })
    } 
    else {
        pmt.append(p,adds)
    }
    pmt.scrollTop = pmt.scrollHeight    
    
}

function changeinfo(title,text,lista) {

    if (info.children[0]) {
        info.children[0].remove()
    }

    const div = document.createElement("div")
    const h1 = document.createElement("h1")
    h1.innerHTML = "> "+title
    const p = document.createElement("p")
    p.innerHTML = text

    div.append(h1,p)

    if (lista) {
        lista.forEach((item) => {
            div.append(item)
        })        
    }

    info.append(div)

}

function getinput() {
    
    return new Promise((resolve, reject) => [

        window.addEventListener("keydown",input = (event) => {
            if (event.code == "Enter") {
                const value = document.getElementById("playerinput").value
                if (value == '') {
                    document.getElementById('playerinput').placeholder = "=> Preencha antes de enviar."
                } else {
                    document.getElementById('playerinput').placeholder = "=> Preencha e pressione ENTER para enviar."
                    document.getElementById("playerinput").value = ''
                    pushp("=> <i>"+value+"</i>")
                    window.removeEventListener("keydown",input)
                    resolve(value)                    
                }

            } 
        })

    ])

}
