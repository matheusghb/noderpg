// esse arquivo só está separado de main.js por questões de organização, é os conjutos de valores gerais que serão randomizados no rpg

let pmt // div do historico de prompts
let info // div de info
let playerdiv // div do container com as informações do player (nome lvl etc)
let playerheader // header acima dessa página
var player // variável que vai guardar a classe

class Player {
    
    constructor(name,route) { // string, obj, obj
    
    this.name = name 
    this.level = 1 
    this.route = route // referir-se a values.js

    this.cred = { // [valor ATUAL, valor MÁXIMO]
        HP: [0,0], //HEALTH POINTS
        MP: [0,0], // MANA POINTS
    }

    this.armadura = 0 // Redução de dano

    this.individualidades = { // lista de habilidades

        skill: [],
        passiva: [],
    
    }

    this.parafernalha = [] // ditto

    let itemcheck = [] // variavel placeholder

    route.itens.forEach((item) => { // loopa pelos itens para numerificar e definir arma e armadura inicial, se tiver
        
        if (itemcheck.includes(item.name)) { // checa se o nome do item já foi salvo em itemcheck. Se sim, não salva essa instancia e inves disso so adiciona +1 na quantidade do item anterior.
        
            this.parafernalha[itemcheck.indexOf(item.name)].qntd += 1
        
        } else {

            itemcheck.push(item.name) //itemcheck salva o nome do item

            item.qntd = 1
            this.parafernalha.push(item)

            if (item.tipo == "arma") {          
                this.arma = item               
            }
            if (item.tipo == "vestimenta") {
                this.vestimenta = item
            }

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
        this.addcred("HP",(this.stats.POT * 3)+10,true) // multiplica por 3 e adiciona
    } else { // se for igual ou menor
        this.addcred("HP",(this.stats.POT * 2)+10, true) // multiplica por 2 e adiciona (então ou +0 ou +(-2))
    }

    if (this.stats.ESP > 0) { // Ditto só que com ESPÍRITO
        this.addcred("MP",(this.stats.ESP * 2)+4, true) // Ditto mas multiplica por 2 
    } else { // Ditto
        this.addcred("MP",(this.stats.ESP)+ 4, true) // Ditto mas não multiplica (+0 ou +(-1))
    }

    this.acts = { // ações de combate

        atacar: async (enemylist) => {

            if (this.arma.alvos) { // se a arma tiver alvos limitados, obter os alvos

                const targets = await this.targets(this.arma.alvos,enemylist)

                await this.arma.efeito(this,targets)

            } else {

                await this.arma.efeito(this,enemylist)

            }

        },

        habilidades: async (enemylist) => { 
            
            const skilist = []

            const b = document.createElement("b")
            b.innerHTML = "0: [ VOLTAR ]" // sempre deixa a opção de retorno 
            skilist.push(b)

            this.individualidades.skill.forEach((skill,pos) => { // anota as habilidades disponiveis
                const b = document.createElement("b")
                pos += 1
                b.innerHTML = pos+": [ "+skill.name+" ] ("+skill.custo+" DE MP)"
                skilist.push(b)
            })

            pushp("Escolha uma dentre as opções abaixo: ",skilist)

            while (true) { // loopa para impedir que o usuario perca o turno caso ponha algo errado

                const s = Number(await getinput())

                if (0 < s && s < this.individualidades.skill.length+1) { // checa se o valor está disponível
                    const skill = this.individualidades.skill[s-1]
                    
                    if (skill.custo > this.cred.MP[0]) {

                        pushp("Você não tem MP para isso!")

                    } else {

                        if (skill.alvos) { // mesma coisa que ataque
                        
                            const targets = await this.targets(skill.alvos,enemylist)
                            skill.efeito(this,targets)

                        }

                        else {

                            skill.efeito(this,enemylist)

                        }

                        this.addcred("MP",-(skill.custo)) // sempre reduz a quantidade de MP no equivalente que foi usado
                        break
                    }

                } 
                
                else {

                    if (s == 0) { // caso o usuário desista de usar habilidades
                        await this.act(enemylist)
                        break
                    }
                    else {
                        pushp("Selecione uma das opções acima.")
                    }
                    
                }

            }


        },
        items: async (enemylist) => { 
            
            const itemlist = []

            const b = document.createElement("b")
            b.innerHTML = "0: [ VOLTAR ]"
            itemlist.push(b)

            this.parafernalha.forEach((item) => {

                if (item.tipo == "item") {
                    const pos = itemlist.length
                    const b = document.createElement("b")
                    b.innerHTML = pos+": [ <i>"+item.name+"</i> ] - X"+item.qntd
                    itemlist.push(b)
                }

            })

            pushp("Escolha um desses: ",itemlist)

            while (true) {

                const c = Number(await getinput())

                if (0 < c && c < itemlist.length+1) {

                    const itemname = itemlist[c].querySelector("i").innerHTML
                    let actualitem 

                    for (let i = 0; i < this.parafernalha.length; i++) {

                        if (this.parafernalha[i].name == itemname) { // já que nem todos os itens do array parafernalha estão disponíveis para esse tipo de uso
                            actualitem = this.parafernalha[i]        // (arma e vestimenta), procura o item com base no nome.
                            break
                        }

                    }

                    actualitem.qntd -= 1 // diminui a quantidade após seleção

                    if (actualitem.alvos) {

                        const targets = await (this.targets(actualitem.alvos,enemylist))

                    } else {

                        actualitem.efeito(this,enemylist)

                    }

                    this.parafernalha.forEach((item,pos) => { // checa por itens de quantidade abaixo de 1 e retira eles
                        if (item.qntd < 1) {
                            this.parafernalha = (this.parafernalha.slice(0,pos)).concat(this.parafernalha.slice(pos+1))
                        } 
                    })

                    break

                } else {

                    if (c == 0) {

                        await this.act(enemylist)
                        break
                    
                    } else {

                        pushp("Selecione uma das opções acima.")

                    }

                }

            }



        },
        correr: () => { // ação de desistir da luta
            
            if (Math.floor(Math.random() * 10) + this.stats.DES > 5) {
                this.fugir = true // a flag vai ser lida durante o combate
            } else {
                pushp("Falhou em fugir!")
            }

        }

    }

    this.indicheck(route.individualidades) // função que separa skills utilizaveis de passivas e que também ativa a passiva

    }

    indicheck(list) {

        list.forEach((skill) => {
 
            this.individualidades[skill.tipo].push(skill)

            if (skill.tipo == "passiva") {
                skill.efeito(this)
            }


        })
    
    }

    async targets(alvos,enemylist) { // entrega uma quantidade específica de alvos baseado na escolha do jogador

        const targets = []

        if (enemylist.length > 1) {

            pushp("Escolha "+alvos+" dentre os "+enemylist.length+" acima: ")
            
            for (let i = 0; i < alvos; i++) {
                
                while (true) {

                    const target = Number(await getinput())

                    if (0 < target && target < enemylist.length+1) {
                        targets.push(enemylist[target-1])
                        break
                    } else {
                        pushp("Escolha dentre as opções acima!")
                    }

                }

            }      

        } else {

            targets.push(enemylist[0])

        }

        return targets

    }

    addstats(stat,num) { // adiciona valores aos atributos (POS, DES, ESP, INT)
        
        if (this.stats[stat]) {            
            this.stats[stat] += num
            document.getElementById(stat).innerHTML = this.stats[stat]
        } else {
            console.log("Status [ "+stat+" ] não foi encontrado.")
        }

    }

    addcred (credsel,num, max) {   // incrementação dos valores de HELTH POINTS e MANA POINTS
                                // credsel = string, "HP" ou "MP", num = int, valor incrementado, max = boolean, se True aumenta atual e maximo
        if (this.cred[credsel]) { // fallback, checa se existe um valor em cred com a chave credsel
            if (max) { // se adicionar no valor máximo...
            
                this.cred[credsel][0] += num // incrementa em ambos dos valores, linha 17
                this.cred[credsel][1] += num // ditto
            
            } else { // senão...

                if ((this.cred[credsel][0]+num) > this.cred[credsel][1]) { // se o valor ATUAL + num for MAIOR que o MÁXIMO
                    this.cred[credsel][0] = this.cred[credsel][1] // o valor é ignorado e o ATUAL para no MÁXIMO (não pode passar)
                } else { // senão
                    this.cred[credsel][0] += num // incrementa naturalmente
                }
                
            }

            document.getElementById(credsel).innerHTML = this.cred[credsel][0]+"/"+this.cred[credsel][1] // modifica o valor da credencial (HP ou MP)
                                                                                                // no site com os valores calculados

        } else {
            console.log("Valor"+credsel+"não foi encontrado.") // resultado do fallback
        }

    }

    playerpush (atb,value) { // dinamicamente adiciona valores em arrays do Player

        if (this[atb] && Array.isArray(this[atb])) {
            this[atb].push(value)
        }
        else {
            console.log('Valor "'+atb+'" não foi encontrado na classe Player ou não é do tipo array.')
        }

    }

    async act(enemylist) { // função chamada durante combate
        
        const barray = []

        for (let [key] of Object.entries(this.acts)) {
            const b = document.createElement("b")
            b.innerHTML = "- "+key+"."
            barray.push(b)
        }

        pushp("Escolha uma das opções a seguir: ",barray)

        while(true) {

            const choice = await getinput()

            if (Object.keys(this.acts).includes(choice)) {

                await this.acts[choice](enemylist)      
                
                let mpgain = this.stats.INT

                if (mpgain < 1) {

                    mpgain = 1
                    
                }

                this.addcred("MP",mpgain) // aumenta MANA baseado na quantidade de INT

                break

            } else {
                pushp("Escolha uma das opções acima.")
            }

        }

    }

    writedmg (enemy,die,...add) { // receber dano e outros efeitos dinamicamente

        die -= this.armadura

        let txt = "Você recebeu <b>"+die+"</b> de dano"

        if (this.cred.HP[0] - die > 0) {
            this.cred.HP[0] -= die
        } else {
            this.cred.HP[0] = 0
        }
        
        if (add.length > 0) {

            add.forEach((cond) => {
                txt += " e "+cond.name
                if (Array.isArray(cond)) {
                    cond.forEach((item) => {
                        this.comorbidades.push(item)
                    })
                } else {
                    this.comorbidades.push(cond)
                }
                
            })

        }

        txt += "de <i>"+enemy.name+"</i>."

    }

}

class Enemy { // modelo de inimigo, não está dinamico
        
    constructor(name,individualidades,HP,armadura,stats,drops,sprites,desc,tipo) {

        this.name = name
        this.individualidades = individualidades
        this.HP = [HP,HP] 
        this.armadura = armadura
        this.stats = stats
        this.drops = drops
        this.sprites = sprites
        this.desc = desc
        this.tipo = tipo
        this.comorbidades = []
        this.div

    }

    writedmg(die,...add) {

        if (this.HP[0] - die > 0) {
            this.HP[0] -= die
        } else {
            this.HP[0] = 0
        }
        
        add.forEach((cond) => {

            if (Array.isArray(cond)) {
                cond.forEach((item) => {
                    this.comorbidades.push(item)
                })
            } else {
                this.comorbidades.push(cond)
            }
            
        })

    }

}

class Ally { // modelo de aliado
    
    constructor(name,acoes,HP,armadura,sprite,stats,desc) {

        this.name = name
        this.acoes = acoes
        this.HP = [
            HP,HP
        ]
        this.armadura = armadura
        this.sprite = sprite
        this.stats = {
            POT: stats.POT,
            DES: stats.DES
        }
        this.desc = desc

    }

    agir(nome,player,enemylist) {

        const action = this.acoes[Math.floor(Math.random() * this.acoes.length)] // seleciona um dos valores dentro do array acoes randomicamente

        if (action.alvos) {

            const targets = []

            for (let i = 0; i < action.alvos; i++) {
                targets.push(enemylist[Math.floor(Math.random() * enemylist.length)]) // inves de pedir ao jogador, só escolhe os alvos randomicamente
            }

            action.efeito(this.name,player,targets)


        } else {
            action.efeito(this.name, player, enemylist)
        }

    }

}

const loot = [ //lista de itens disponíveis no jogo, todos sendo itens

    // modelos:

    /*
  
    loot = [
    {item},
    {item},
    {item}
    ]

    valores minimos:

    name: string,
    tipo: "item","arma","vestimenta",
    decs: string,
    efeito: (player,enemylist) => {
        {efeito aqui}    
    }

    */

    {
        name: "BOMBA FRAGMENTADA",
        tipo: "item",
        desc: "Uma sacola com várias quantidades menores de estalos de salão. Você acha o estrago duvidoso.",
        efeito: (player,enemylist) => {
            
            enemylist.forEach((enemy) => {
              
                let dmg = (Math.floor(Math.random() * 5)-enemy.armadura)+player.stats.INT
                if (dmg < 1) {
                    dmg = 1
                }
                pushp("<b>"+dmg+"</b> de dano <i>Explosivo</i> em "+enemy.name+"!")
                enemy.HP[0] -= dmg


            })

        },
    },
    {
        name: "POÇÃO DE CURA",
        tipo: "item",
        desc: "Um recepiente com um líquido vago, só o suficiente pra não ser suspito.",
        efeito: (player, enemylist) => {

            const cura = 6 + player.stats.INT
            pushp("Curou "+cura+" de HP!")
            player.addcred("HP",cura)

        }
    },
    {
        name: "ESPADA ENFERRUJADA",
        tipo: "arma",
        desc: "Só o suficiente pra lhe tirar daqui.",
        alvos: 1,
        efeito: (player,targets) => {

            targets.forEach((enemy) => {

                if (Math.floor((Math.random() * 15)+player.stats[player.arma.ATB]) > (enemy.stats.DES)+3) {
                
                    const dmg = (player.arma.dano()+player.stats[player.arma.ATB])-enemy.armadura
                    enemy.HP[0] -= dmg

                    pushp("Você deu <b>"+dmg+"</b> de dano <i>Cortante</i> no inimigo "+enemy.name+"!")

                } else {

                    pushp("Você errou!")
                }

            })

        },
        dano: () => {return Math.floor((Math.random()) * 6)},
        ATB: "POT"
    },
    {
        name: "CARAPAÇA ROBUSTA",
        tipo: "vestimenta",
        desc: "Aderida a sua pele com força, reduzindo impacto.",
        efeito: (player) => {
            player.armadura += 2
        }
    },
    {
        name: "REVOLVER MARCADO",
        tipo: "arma",
        desc: "Tem uma rachadura na lateral da arma, em formato de raio.",
        efeito: (player,enemylist) => {
            
            let targets = []

            for (let i = 0; i < 2; i++) {
                targets.push(enemylist[Math.floor(Math.random() * enemylist.length)])
            }

            let hits = 0

            targets.forEach((enemy) => {

                if (Math.floor((Math.random() * 10)+player.stats.DES) > (enemy.stats.DES)+3) {
                    hits += 1
                    const dmg = (Math.floor((Math.random() * 4)+player.stats.DES))-enemy.armadura
                    enemy.HP[0] -= dmg
                    pushp(enemy.name+" foi acertado, dando <b>"+dmg+"</b> de dano <i>Perfurante</i>!")
                }

            })

            if (hits < 1) {
                pushp("Acertou ninguém!")
            }

        },
    },
    {
        name: "BASTÃO DOURADO",
        tipo: "arma",
        desc: "Não perdeu seu brilho, mesmo embaixo da terra e da poeira.",
        alvos: 1,
        ATB: "POT",
        efeito: (player,target) => {
            
            target.forEach((enemy) => {

                if (Math.floor(Math.random() * 10)+player.stats.POT > enemy.stats.DES) {

                    const dmg = (Math.floor(Math.random() * 4)+player.stats.ESP)-enemy.armadura
                    enemy.HP[0] -= dmg
                    pushp("Você deu <b>"+dmg+"</b> de dano <i>Contundente</i> no inimigo "+enemy.name+"!")

                    let hits
                    let totaldmg = 0

                    player.compatriotas.forEach((ally) => {

                        if (Math.floor(Math.random() * 10) > enemy.stats.DES) {

                            hits += 1

                            let dmg = (Math.floor(Math.random() * 5))-enemy.armadura
                            
                            if (dmg < 1) {
                                dmg = 1
                            }

                            totaldmg += dmg

                            enemy.HP[0] -= dmg
                            
                        }

                    })

                    if (hits > 0) {
                        pushp("E seus aliados adicionaram <b>"+dmg+"</b> de dano!")
                    } else {
                        pushp("Mas os aliados não conseguiram atacar!")
                    }

                } else {

                    pushp("Você errou!")

                }

            })

        }
        },
]

const acoes =  [ // lista de ações para os aliados, placeholder :( eventualmente será mais dinâmico
    {
        nome: "ataque",
        alvos: 1,
        efeito: (name,player,target) => {

            target.forEach((enemy) => {

                if (Math.floor(Math.random() * 15) > enemy.stats.DES+3) {

                    const dmg = (Math.floor(Math.random() * 4)+2)-enemy.armadura

                    enemy.HP[0] -= dmg

                    pushp(name+" deu <b>"+dmg+"</b> de dano em "+enemy.name+"!")

                } else {

                    pushp(name+" errou ao tentar acertar "+enemy.name+"!")

                }

            })

        }
    },
    {
        nome: "cura",
        efeito: (name,player,enemylist) => {

            const cura = Math.floor(Math.random() * 4)+2
            player.addcred("HP",cura)
            pushp(name+" decide curar você com <b>"+cura+"</b> de HP!")

        }
    },
    {
        nome: "efeito",
        alvos: 1,
        efeito: (name,player,target) => {

            target.forEach((target) => {

                if (Math.floor(Math.random() * 10)+5 > 10) {

                    target.comorbidades.push(condicoes[0])
                    pushp(name+" aderiu a <i>Condição</i> <b>"+condicoes[0].name+"</b> ao inimigo "+target.name+"!")

                } else {

                    pushp(name+" fez nada nesse turno!")

                }

            })

        }
    }
]


const classes = { // cada uma das classes é chamada como um objeto.

    /* 
    
    modelo:

    nome: {
        pontuação total inicial: 3
        POT: int,
        DES: int,
        ESP: int,
        INT: int,
        individualidades: [
            {
                nome: string,
                tipo: string ação, passiva,
                desc: string,
                custo: int (de MP)
            }
        ],
        itens: [loot[indice do item]], quantidade ilimitada
        desc: string
    }

    */

    gladiador: {
        POT: 3,
        DES: 1,
        ESP: -1,
        INT: 0,
        individualidades: [
        {
            name: "SEDENTO",
            tipo: "skill",
            custo: 3,
            desc: "Seu golpe recebe +POT de dano e 50% disso é retornado em HP.",
            efeito: (player,enemylist) => {

                let hits = 0
                let buff = Math.floor(player.stats.POT * 1.5)
                console.log(buff) 

                while (true) {

                    const enemy = enemylist[Math.floor(Math.random() * enemylist.length)]

                    if (Math.floor(Math.random() * 10)+buff > (enemy.stats.DES)+3) {
                        hits += 1
                        buff -= 1

                        let dmg = (Math.floor(Math.random() * 6))-enemy.armadura
                        
                        if (dmg < 1) {

                            dmg = 0

                        }

                        player.addcred("HP",dmg)
                        enemy.HP[0] -= dmg
                        pushp("Acertou "+enemy.name+" com <b>"+dmg+"</b> de dano Cortante!")

                    } else {

                        let txt = "Acertou"

                        if (hits == 1) {
                            txt += " uma vez!"
                        } else if (hits > 1) {
                            txt += " "+hits+" vezes!"
                        } else {
                            txt += "ninguém! :("
                        }
                        
                        pushp(txt)

                        break

                    }
                    
                }

            },
        },
        {
            name: "CASCA GROSSA",
            tipo: "passiva",
            desc: "Você naturalmente recebe menos dano.",
            efeito: (player) => {
                player.armadura += 1
            }
        }
        ],
        itens: [loot[2],loot[3],loot[1],loot[1]],
        desc: "O caminho do <b>Gladiador</b> é baseado em empurrar os danos com POTÊNCIA. Ele da muito dano em troca de pouca adaptabilidade."
    },
    pistoleiro: {
        POT: 1,
        DES: 3,
        ESP: 0,
        INT: -1,
        individualidades: [
        {
            name: "MIRA",
            tipo: "skill",
            desc: "Um golpe de dano baixo com chance de triplicar o dano. Mais chance se o inimigo tiver vida alta.",
            custo: 4,
            alvos: 1,
            efeito: (player,targets) => {

                targets.forEach((enemy) => {

                    if (Math.floor(Math.random() * 10)+(Math.floor((enemy.HP[0]/enemy.HP[1])*10)) > 10) {
                        
                        const dmg = ((Math.floor(Math.random() * 3)+1)*10)-enemy.armadura
                        enemy.HP[0] -= dmg
                        pushp("Acerto crítico! "+enemy.name+" toma <b>"+dmg+"</b> de dano <i>Perfurante</i>!")

                    } else {
                        pushp("Você errou o tiro!")
                    }

                })

            }
        },
        {
            name: "TALENTO",
            tipo: "passiva",
            desc: "aumenta um valor aleatório em +2.",
            efeito: (player) => {

                const keys = Object.keys(player.stats)
                const atb = keys[Math.floor(Math.random() * keys.length)]

                player.stats[atb] += 2
                document.getElementById(atb).innerHTML = player.stats[atb]

            }
        }
        ],
        itens: [loot[4],loot[0],loot[0],loot[0],loot[1]],
        desc: 'O caminho do <b>Pistoleiro</b> é instável, sua mira muitas vezes indo além da sua compreensão. É uma classe focada em CHANCE.',
    },
    nobre: {
        POT: -1,
        DES: 0,
        ESP: 3,
        INT: 1,
        individualidades: [
        {
            name: "CONVOCAÇÃO",
            tipo: "skill",
            desc: "chance de chamar um novo aliado.",
            custo: 5,
            efeito: (player,enemylist) => {

                const chancedealiado = Math.floor(Math.random() * 5)

                if (chancedealiado+(4-player.compatriotas.length) > 3) {

                    pushp("Um <b>aliado</b> se junta a você.")

                    player.compatriotas.push(new Ally(
                        "Aliado"+player.compatriotas.length,
                        [acoes[0],acoes[1],acoes[2]],
                        4,
                        0,
                        ['^- _ -^'],
                        {
                            POT: Math.floor(Math.random() * 3)-1,
                            DES: Math.floor(Math.random() * 3)-1
                        },
                        "Um diabo que parece ter se levantado ao seu lado."
                    ))                    

                } else {

                    pushp("Ninguém veio...")

                }

            }
        },
        {
            name: "SERVIÇAL LEAL",
            tipo: "passiva",
            desc: "Você possuí um aliado comum como bônus inicial.",
            efeito: (player) => {

                player.compatriotas.push(new Ally(
                    "Aliado",
                    [acoes[0],acoes[1],acoes[2]],
                    4,
                    0,
                    ['^- _ -^'],
                    {
                        POT: Math.floor(Math.random() * 3)-1,
                        DES: Math.floor(Math.random() * 3)-1
                    },
                    "Um diabo que parece ter se levantado ao seu lado."
                ))


            } 
        }
        ],
        itens: [loot[0],loot[0],loot[1],loot[5]],
        desc: 'O caminho do <b>Nobre</b> indica que terá várias pessoas seguindo seus passos, lealmente. É uma classe focada em <i>COMPATRIOTAS</i>, ao custo de sua vida.',
    },
    /* ectobiologo: { vamos adicionar eventualmente!
        POT: 0,
        DES: -1,
        ESP: 1,
        INT: 3,
        individualidades: [
        {

        },
        {

        }
        ],
        itens: loot["ectobiologo"],
        desc: 'ECTOBIOLOGO'
    }, */
    
}

const enemies = [ // array de modelo de inimigos, precisa de atualização

/* 

    modelo: 

    name: string,
    individualidades: [
        {
            name: string,
            efeito: (e) => {
                {efeito aqui}    
            }
        }
    ],
    HPbase: int,
    armadura: int,
    stats: {
    
        POT: int,
        DES: int,
    
    },
    loot: [...loot[indice do loot]]
    sprite: [:D, :/, :\, :B],
    desc: string,
    tipo: string

*/

    {
        name: "goblin",
        individualidades: [
            {
                name: "Soco Simples",
                efeito: (e) => {
                    return [Math.floor(Math.random() * 4)]
                }
            }, 
            {
                name: "Defesa",
                efeito: (e) => {

                    return 4
                
                }
            }
        ],
        HPbase: 8,
        armadura: 1,
        stats: {
            POT: 2,
            DES: -1,
        },
        loot: "sem loot no momento looool",
        sprite: ["8' H '8","8< H <8","8> H >8","8- H -8"],
        desc: "Esse é o goblin. É um inimigo simples, dando um dano aceitável e considerado bem parrudo. <br> Tem um máximo de 8 de vida e 2 de armadura. <br><br>",
        tipo: "goblin",
    },
    {
        name: "kobold",
        individualidades: [
            {
                name: "Golpe atordoante",
                efeito: (e) => {
                    const r = [Math.floor(Math.random() * 3)]

                    if (Math.floor(Math.random()*5) == 5) {
                        r.push(condicoes[0])
                    }

                    return r
                }
            },
            {
                name: "Defesa",
                efeito: (e) => {

                    if (e.HP[0] < e.HP[1]) {
                        pushp("E cura 2 pontos de vida!")

                        if (e.HP[0] + 2 > e.HP[1]) {
                            e.HP[0] = e.HP[1]
                        } else {
                            e.HP[0] += 2
                        }           

                    }
                    
                    return 1
                }
            }
        ],
        HPbase: 4,
        armadura: 0,
        stats: {
            POT: -1,
            DES: 0,
        },
        loot: "sem loot no momento looool",
        sprite: [",* > *,",",+ > +,",",. > .,"],
        desc: "Esse é o kobold, bem mais frágil comparado ao Goblin, mas tem o potêncial de se curar e dar condições caso acerte um golpe. <br> Tem um máximo de 4 de vida. <br><br>",
        tipo: "kobold"
    }
]

const condicoes = [ // lista de condições possíveis no rpg

/*

    modelo:

    name: string,
    desc: string,
    efeito: () => {
    
        {efeito}
        
    }

*/

    {
        name: "Fraco",
        desc: "Diminui o seu dano físico.",
        efeito: () => {
            console.log("uhh")
        }
    }
]