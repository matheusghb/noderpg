let pmt 
let info
let p 

class Player {
    
    constructor(name,route,stats,itens) {
    this.name = name
    this.level = 0
    this.route = route
    this.stats = {
        POT: stats[0],
        DES: stats[1],
        ESP: stats[2],
        INT: stats[3],
    }
    this.itens = itens,
    this.cred = {
        HP: [10,10],
        MN: [4,4],
    }
    this.buffs = {
        dmg_red: 0,
        dmg_buff: 0,
        HP_regen: 0,
        MN_regen: 0,
    }
    this.perks = []

    this.stats.HP.forEach((HP) => {
        if (this.stats.POT > 0) {
            HP += this.stats.POT *3
        } else {
            HP += this.stats.POT 
        }
    })

    if (this.stats.ESP > 0) {
        this.cred.MN += this.stats.ESP * 2
    } else {
        this.cred.MN += -2
    }

    }

    printinfo() {

        console.log(`Seu nome é ${this.name}, ${this.route} nível ${this.level}. Seus status são:\n
POT: ${this.stats.POT}
DES: ${this.stats.DES}
ESP: ${this.stats.ESP}
INT: ${this.stats.INT}
HP: ${this.cred.HP}
MG: ${this.cred.MN}\n
E seus itens são: `)
        this.itens.forEach(element => {
            console.log("- "+element+";")
        });
    }

}

window.onload = function() {

    pmt = document.getElementById("prompt")
    info = document.getElementsByClassName("info")[0]

    info.addEventListener("click",function () {
        const title = "INFO"
        const txt = "Infomativos ficam aqui. <b>CLIQUE</b> ou apenas bote o mouse <b>EM CIMA</b> de elementos destacados para tentar ver informações sobre eles. <b>CLIQUE AQUI</b> a qualquer momento pra recuperar essa tela."

        changeinfo(title, txt)

    })

    

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
                    li.innerHTML = "<b>"+txt+";</b>"
                    ul.append(li)
                })

                changeinfo(titl,text,[ul])

        }
    }

    async function main () {

        const teste = await getinput()  
        battle()        

    }

    main()

}

function battle () {

    document.getElementsByClassName("monsterview")[0].style.display = "flex"
    pushp("Uma horda selvagem se aproxima!")

}

function pushp(txt,position) {
    const p = document.createElement("p")
    p.innerHTML = txt
    p.style.opacity = .8
    pmt.append(p)

    if (position) {
        pmt.scrollTop = pmt.scrollHeight    
    } else [
        pmt.scrollTop = 0
    ]
    
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
                    document.getElementById('playerinput').placeholder = "> Preencha antes de enviar."
                } else {
                    document.getElementById('playerinput').placeholder = "> Preencha e pressione ENTER para enviar."
                    document.getElementById("playerinput").value = ''
                    pushp("> "+value,true)
                    window.removeEventListener("keydown",input)
                    resolve(value)                    
                }

            } 
        })

    ])

}
