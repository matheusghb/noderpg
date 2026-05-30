// esse arquivo só está separado de main.js por questões de organização, é os conjutos de valores gerais que serão randomizados no rpg

const loot = { //lista de itens disponíveis no jogo, separadas em objetos para uso geral

    // modelos:

    /*
  
    loot = { grupo: 
        [ 
    {item},
    {item},
    {item}
        ] 
    }

    nome: string nome do item
    tipo: string arma, vestimenta, item
    desc: string, descrição da arma 
    qntd: int, numero do item que existe no inventario
    efeito: () => {
            // função que será chamada durante o momento apropriado (refere-se ao tipo)
        }
    tipodano [específico pra arma]: string, tipo de dano
    atributo [específico pra arma]: string (em MAIÚSCULO), atributo
    */

    gladiador: [
        {
        nome: "ESPADA ENFERRUJADA",
        tipo: "arma",
        desc: "Só o suficiente pra lhe tirar daqui.",
        qntd: 1,
        efeito: (enemyDES) => {
            return Math.floor((Math.random() * 4)+player.stats.POT)
        },
        tipodano: "cortante",
        atributo: "POT"
    },
    {
        nome: "CARAPAÇA ROBUSTA",
        tipo: "vestimenta",
        desc: "Aderida a sua pele com força, reduzindo impacto.",
        qntd: 1,
        efeito: () => {
            player.armadura += 2
        }
    }
],
    pistoleiro: [
    {
        nome: "REVOLVER MARCADO",
        tipo: "arma",
        desc: "Tem uma rachadura na lateral da arma, em formato de raio.",
        qntd: 1,
        efeito: (enemyDES) => {
            return Math.floor((Math.random() * 4+player.stats.DES))
        },
        tipodano: "perfurante",
        atributo: "DES"
    },
    {
        nome: "BOMBA FRAGMENTADA",
        tipo: "item",
        desc: "Uma sacola com várias quantidades menores de estalos de salão. Você acha o estrago duvidoso.",
        qtd: 3,
        efeito: () => {
            
        },
        tipodano: "explosivo"
    }
],
    nobre: [
        {

        },
        {

        }
],
    ectobiologo: [
        {

        },
        {

        }
    ]
}

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
        itens: loot["nome da classe"] (faça um grupo para ela antes),
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
                nome: "SEDENTO",
                tipo: "ação",
                desc: "Seu golpe recebe +FOR de dano e 50% disso é retornado em HP.",
                custo: 4,
            },
            {
                nome: "PESO PESADO",
                tipo: "passiva",
                desc: "Todos os seus golpes físicos tem 25% de chance de <b>Atordoar</b>."
            }
        ],
        itens: loot["gladiador"],
        desc: "GLADIADOR"
    },
    pistoleiro: {
        POT: -1,
        DES: 3,
        ESP: 1,
        INT: 0,
        individualidades: [
            {
                nome: "PACIENCIA",
                tipo: "ação",
                desc: "Gasta este turno para ter 100% de chance de crítico no próximo.",
                custo: 2,
            },
            {
                nome: "",
                tipo: "passiva",
            }
        ],
        itens: loot["pistoleiro"],
        desc: 'PISTOLEIRO',
    },
    nobre: {
        POT: 1,
        DES: -1,
        ESP: 3,
        INT: 0,
        individualidades: [
            {
                nome: "INSPIRAÇÃO",
                tipo: "ação",
                desc: "Cura e adiciona +ESP no dano de seus aliados.",
                custo: 2
            },
            {
                nome: "SERVIÇAL LEAL",
                tipo: "passiva",
                desc: "Você possuí um aliado comum."
            }
        ],
        itens: loot["nobre"],
        desc: 'Nobre',
    },
    ectobiologo: {
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
    }

    
}

const regalias = { // WIP extremo. São perks de fallout

    /* 
    
    modelo:

    nome: {
    
        nome: string,
        desc: string,
        efeito: () => {
            //efeito    
        }
    
    }

    */

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

const enemies = [
    {
        name: "goblin",
        individualidades: [
            {
                nome: "Soco Simples",
                efeito: () => {
                    return Math.floor(Math.random * 4)
                }
            }
        ],
        HPbase: 3,
        stats: {
            POT: 2,
            DES: -1,
        },
        loot: "sem loot no momento looool",
        sprite: ["8' H '8","8- H -8"],
        desc: "Esse é o goblin."
    },
]