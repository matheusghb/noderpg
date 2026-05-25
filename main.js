const { QMainWindow, QLabel, QWidget, FlexLayout } = require("@nodegui/nodegui")

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

    const innerlabel = new QLabel();
    innerlabel.setObjectName("label")
    innerlabel.setText("Hello World")

    rlayout.addWidget(innerlabel)

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
        border: 4px solid #badb00;
        border-radius: 5px;
    }

    #label {

        color: black;    
        width: 100%;
        height: 20%;
        margin: 40%;
        background-color: white;
    
    }


`)

const win = new QMainWindow();
win.setMinimumSize(800,600)
win.setMaximumHeight(3600);
win.setMaximumWidth(2500);
win.setCentralWidget(flexview);

win.show();
global.win = win;

