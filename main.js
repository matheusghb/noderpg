let pmt 
let info
let playerdiv
let playerheader
var player

const loot = [
    {
        nome: "ESPADA ENFERRUJADA",
        tipo: "arma",
        desc: "Só o suficiente pra lhe tirar daqui.",
        qntd: 1,
        dado: dano = () => {
            return Math.floor((Math.random() * 4)+3)
        }
    },
    {
        nome: "CARAPAÇA ROBUSTA",
        tipo: "vestimenta",
        desc: "Aderida a sua pele com força, reduzindo impacto.",
        qntd: 1,
        efeito: addarmadura = () => {
            player.armadura += 2
        }
    }
]

const events = [
    battle = () => {

        class Enemy {
            
            constructor(name,individualidades,HP,drops,sprites) {
                this.name = name
                this.individualidades = individualidades
                this.HP = [HP,HP] 
                this.drops = drops
                this.sprites = sprites
            }

        }

        const skills = [{
            nome: "Soco simples",
            efeito: dano = () => {return Math.floor(Math.random * 4)}
        }]

        const sprite = ["8' H '8","8- H -8"]

        const enemylist = []

        for (let i = 0; i < 2;i++) {
            enemylist.push(new Enemy("goblin",skills,3,loot[0],sprite)) 
        }
        
        const view = document.getElementsByClassName("monsterview")[0] 
        let pos = 0
        enemylist.forEach((enemy) => {
            pos += 1
            const div = document.createElement("div")
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
            div.append(p,spritediv)
            view.append(div)
        })

        view.style.display = "flex"

    },
    interaction = () => {
        console.log("interaction")
    },
    ruins = () => {
        console.log("ruins")
    }
]

const regalias = {
    teste: {
        nome: "teste",
        desc: "teste",
        efeito: "uggg"
    },
    outroteste: {
        nome: "ouughhgb",
        desc: "shjakd",
        efeito: "ouuuughg"
    }
}

const classes = {
    gladiador: {
        POT: 3,
        DES: 1,
        ESP: 0,
        INT: -1,
        individualidades: [
            {
                nome: "GOLPE EXTRA",
                tipo: "ação",
                desc: "Pode atacar novamente, contanto que possa pagar o custo de MANA.",
                custo: 4,
            },
            {
                nome: "PESO PESADO",
                tipo: "passiva",
                desc: "Todos os seus golpes físicos tem 25% de chance de <b>Atordoar</b>."
            }
        ],
        itens: [
            loot[0],loot[1]
        ],
        desc: "GLADIADOR"
    },
    pistoleiro: {
        desc: 'PISTOLEIRO',
    },
    nobre: {
        desc: 'Nobre',
    },
    ectobiologo: {
        desc: 'ECTOBIOLOGO'
    }

    
}

class Player {
    
    constructor(name,route,regalias) {
    
    this.name = name
    this.level = 0
    this.route = route

    this.cred = {
        HP: [10,10],
        MP: [4,4],
    }

    this.buffs = {
        dmg_red: 0,
        dmg_buff: 0,
        HP_regen: 0,
        MN_regen: 0,
    }

    this.armadura = 0
    this.regalias = [regalias]

    this.individualidades = route.individualidades
    this.parafernalha = route.itens

    this.stats = {
        POT: route.POT,
        DES: route.DES,
        ESP: route.ESP,
        INT: route.INT
    }

    if (this.stats.POT > 0) {
        this.addcred("HP",this.stats.POT * 3,true)
    }

    if (this.stats.ESP > 0) {
        this.addcred("MP", this.stats.ESP * 3,true)
    }

    this.compatriotas = []
    this.comorbidades = []

    }

    addcred (stat,num, max) {

        if (this.cred[stat]) {
            if (max) {
                this.cred[stat][0] += num
                this.cred[stat][1] += num
            } else {

                if ((this.cred[stat][0]+num) > this.cred[stat][1]) {
                    this.cred[stat][0] = this.cred[stat][1]
                } else {
                    this.cred[stat][0] += num
                }
                
            }
            document.getElementById(stat).innerHTML = this.cred[stat][0]+"/"+this.cred[stat][1]
        } else {
            console.log("Valor"+stat+"não foi encontrado.")
        }

    }

}

window.onload = function() {
    
    async function main () {
        player = await createPlayer()
        pushp('"'+player.name+'", Você começa a compreender seus arredores, decidindo caminhar com o que encontrou ao seu lado ao acordar.')
        await event()
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

function event() {

    events[0]()
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
                    const qntd = document.createElement("b")
                    qntd.innerHTML = "x"+item.qntd
                    ul.append(li,qntd)
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
        keyb.innerHTML = key
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
        regb.innerHTML = key
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
                    pushp("=> "+value)
                    window.removeEventListener("keydown",input)
                    resolve(value)                    
                }

            } 
        })

    ])

}
