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
    const pmt = document.getElementById("prompt")
    const info = document.getElementsByClassName("info")[0]

    info.addEventListener("click",function () {
        if (this.children[0]) {
            this.children[0].remove()
        }

        const div = document.createElement("div")
        const h1 = document.createElement("h1")
        const p = document.createElement("p")

        h1.innerHTML = "INFO"
        p.innerHTML = "Infomativos ficam aqui. <b>CLIQUE</b> ou apenas bote o mouse <b>EM CIMA</b> de elementos destacados para tentar ver informações sobre eles. <b>CLIQUE AQUI</b> a qualquer momento pra recuperar essa tela."

        div.append(h1,p)
        this.append(div)

    })

    const sts = document.getElementsByClassName("STATS")[0].children

    for (let i = 0; i < sts.length; i++) {
        sts[i].onmouseover = function() {
            const st = (sts[i].textContent).slice(0,3)

                if (info.children[0]) {
                    info.children[0].remove()
                }

                const div = document.createElement("div")
                const h1 = document.createElement("h1")
                const p = document.createElement("p")
                const ul = document.createElement("ul")
                let l = []

                if (st == "POT") {
                    h1.innerHTML = "POTÊNCIA"
                    p.innerHTML = "A <b>POTÊNCIA</b> é a representante de seu poderío físico, seja incrementando sua resiliência quanto seu potêncial com as próprias mãos. Este é o atributo para os mais aventurados, que não temem agarrar a besta pela garganta.<br><br>Este Atributo afeta: "
                    l = ["HP","Dano de CURTO ALCANCE", "Inventário", "Descanso"]
                } else if (st == "DES") {
                    h1.innerHTML = "DESTREZA"
                    p.innerHTML = "A <b>DESTREZA</b> é a representante de sua técnica espacial, igualmente seus instintos e tempo de reação quanto sua predistidigitação latente. "
                } else if (st == "ESP") {
                    h1.innerHTML = "ESPÍRITO"
                } else {
                    h1.innerHTML = "INTELECTO"
                }

                l.forEach((txt) => {
                    const li = document.createElement("li")
                    li.innerHTML = txt+";"
                    ul.append(li)
                })

                div.append(h1,p,ul)
                info.append(div)

        }
    }
}


