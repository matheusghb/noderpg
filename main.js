const { QMainWindow, QLabel, QWidget, FlexLayout, QLineEdit } = require("@nodegui/nodegui")
const readline = require("readline")

const flexview = new QWidget();
const layout = new FlexLayout()
flexview.setLayout(layout)
flexview.setObjectName("window")

const leftdiv = new QWidget();
leftdiv.setObjectName("ldiv")
layout.addWidget(leftdiv)

const rightdiv = new QWidget();
rightdiv.setObjectName("rdiv")
const rlayout = new FlexLayout()
rightdiv.setLayout(rlayout)


    const inputname = new QLineEdit();
    inputname.setObjectName("inputName")
    inputname.setPlaceholderText("escreva seu nome");

    rlayout.addWidget(inputname);


layout.addWidget(rightdiv)

flexview.setStyleSheet(`
    
    #window {
        flex-direction: row;
        flex: 1;
        background-color: #120f20;
    }

    #ldiv {
        flex: 1;
        background-color: black;
    }

    #rdiv {
        flex: 1.5;
        margin: 7%;
        border: 4px solid #badb00%);
        border-radius: 5px;
        background-color: white;
    }

    #label {

        color: black;    
        width: 100%;
        height: 20%;
        margin: 40%;
        background-color: white;
    
    }

    #inputname {
        
        flex: 1;
        margin: 40%;
        background-color: white;
        color: rgb(148, 148, 148);

    
    }


`)

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
            HP: 10,
            MN: 4,
        }

        if (this.stats.POT > 0) {
            this.cred.HP += this.stats.POT * 3
        } else {
            this.cred.HP += -3
        }

        if (this.stats.ESP > 0) {
            this.cred.MN += this.stats.ESP * 3
        } else {
            this.cred.MN += -3
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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question("Give name", (name) => {
    console.log(name)
    innerlabel.setText(name)
    const player = new Player(name, "Novato", [1, 1, 1, 1], ["Nenhum"])
    player.printinfo()
    rl.close()
})

const win = new QMainWindow();
win.setMinimumSize(800,600)
win.setMaximumSize(3600,2500)
win.setCentralWidget(flexview);

win.show();
global.win = win;