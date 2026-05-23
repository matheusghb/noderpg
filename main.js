const { QMainWindow, QLabel } = require("@nodegui/nodegui")

const win = new QMainWindow();
win.setMinimumSize(400,400)
win.setMaximumHeight(3600);
win.setMaximumWidth(2500);


const displaynome = new QLabel(win); 
displaynome.setText("seu nome é:");
displaynome.setInlineStyle("color: black;");

win.show();
global.win = win;

