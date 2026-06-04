const events = [ // lista de eventos possíveis quando o jogo estiver rodando, guarda funções que são chamadas dinamicamente
    battle = async () => {

        let enemylist = [] // uma lista é feita e preenchida com instâncias da classe enemies (values.js), com a repetição sendo a quantidade de inimigos.

        for (let i = 0; i < 3;i++) {

            const enemyselect = enemies[Math.floor(Math.random() * enemies.length)] // Escolhe randomicamente um template (valores) de inimigo com base na variável enemies

            enemylist.push(new Enemy( //preenchimento de valores
            enemyselect.name+(i+1),
            enemyselect.individualidades,
            enemyselect.HPbase,
            enemyselect.armadura,
            enemyselect.stats,
            enemyselect.loot,
            enemyselect.sprite,
            enemyselect.desc+" Esse é o inimigo número "+(i+1)+".",
            enemyselect.tipo
        )) 
        }
        
        const view = document.getElementsByClassName("monsterview")[0] // essa view é fixa e sempre será usada para apresentar anexos

        enemylist.forEach((enemy, pos) => { // loopa pelos inimigos em enemylist para colocar eles dentro da view, ja estilizados
            const div = document.createElement("div")
            div.id = pos+1 // pos será utilizado para selecionar o inimigo, o +1 é corrigido na seleção e fica apenas para embelezar o site (evitar inimigo número 0)
            const spritediv = document.createElement("div") // esse div menor é o que vai ter o "sprite" do inimigo, o resto é organização
            div.className = "enemy"
            const p = document.createElement("p")

            p.innerHTML = pos+1

            if (enemy.sprites.length > 1) { 
                let spriteIndex = 0
                setInterval(() => { // cria a animação por ficar alternando entre os valores de enemy.sprites
                    spritediv.innerHTML = enemy.sprites[spriteIndex]
                    spriteIndex = (spriteIndex + 1) % enemy.sprites.length
                }, 500)
            } else {
                div.innerHTML = sprite[0] // caso n tiver mais de um, deixa só esse
            }

            spritediv.onmouseover = () => { // preencher o div .info com as informações do inimigo
                changeinfo(enemy.name,enemy.desc)
            }

            div.append(p,spritediv)
            enemy.div = div
            view.append(div)
        })

        view.style.display = "flex" // "abre" o div

        pushp("Um grupo de inimigos se encontra com você.")
        
        while (enemylist.length > 0) { 
            
            await player.act(enemylist) // a função act é o turno completo do jogador

            if (player.fugir) { // flag de fugir do combate
                pushspecial("*** VOCÊ FUGIU.","Nem todos os dias precisam de uma vitória triunfante. Por hoje, o suor na sua testa é o suficiente.")
                delete player.fugir
                break
            }

            player.compatriotas.forEach((ally) => { // turno dos aliados
                
                ally.agir(ally.name,player,enemylist)

            })

            enemylist.forEach((enemy,pos) => { // check pra ver se os inimigos morreram

                if (enemy.HP[0] <= 0) {

                    pushp(enemy.name+" foi derrotado!")
                    enemy.div.remove()

                    enemylist = (enemylist.slice(0,pos)).concat(enemylist.slice(pos+1)) // recorta o inimigo pra apagar ele completamente do jogo

                    const divs = document.getElementsByClassName("enemy")
                        
                    for (let i = 0; i < divs.length; i++) { // loopa pra reordenar as posições, pra que não fiquem com os números errados
                        divs[i].id = (i+1)
                        divs[i].querySelector("p").innerHTML = (i+1)
                    }

                }
            
            })

            enemylist.forEach((enemy) => { // turno dos inimigos, não está dinamico ainda
                
                enemies.forEach((armadura) => { // flag da ação "armadura", não é uma solução muito efetiva mas funciona...
                    if (armadura.tipo == enemy.tipo) {
                        enemy.armadura = armadura.armadura
                    }
                })

                    const skill = enemy.individualidades[Math.floor(Math.random() * (enemy.individualidades.length))] // escolhe a ação do inimigo randomicamente, pega so a string de name

                    pushp(enemy.name+" usa "+skill.name+"!") // anuncia o que ele usou

                    const r = skill.efeito(enemy) // guarda o valor resultante

                    if (skill.name == "Defesa") { // ação de defesa
                        enemy.armadura += r
                    } else {
                        r[0] -= player.armadura // calculo de dano, é um array no caso de ter mais efeitos alem de puro dano
                        if (r[0] < 0) {
                            r[0] = 0
                        }
                        let txt = "Você recebeu <b>"+r[0]+"</b> de dano"
                        player.addcred("HP",-(r[0])) // modifica o dano do jogador

                        if (r[1]) { // se tiver algo alem de r[0], significa que tem condições
                            for (let i = 1; i < r.length; i++) {
                                player.addcond(r[i])
                                txt = txt + " e a condição "+r[i].name
                            }
                        }

                        pushp(txt+" do inimigo: <b>"+enemy.name+"</b>!") // esse valor é alterado dinamicamente


                    }

            })

            if (player.cred.HP[0] <= 0) { // flag de derrota
                pushspecial("*** DERROTA.","Suas forças se esvaem, o peso de seus desafios lhe levando ao chão. <i>Boa sorte na próxima vez.</i>")
                break
            }

            if (enemylist.length == 0) { // flag de vitoria
                pushspecial("*** VITÓRIA","Seus oponentes são derrotados, e você tem posse total dos frutos de seus esforços.")
                break
            }


        }

        for (let i = view.children.length; i > 0; --i) { // apaga todas as divs dos inimigos
            view.children[i-1].remove()
        }
        view.style.display = "none" // e fecha a view

    },
    interaction = () => { // outros eventos, modificar futuramente
        console.log("interaction")
    },
    ruins = () => {
        console.log("ruins")
    }
]

window.onload = function() { // criação da interface
    
    async function main () { // essa função dita toda a sequência de eventos, é a **PRINCIPAL**
        player = await createPlayer() 
        pushp('"'+player.name+'", Você começa a compreender seus arredores, decidindo caminhar com o que encontrou ao seu lado ao acordar.')

        await event()

    }

    //lista de divs para criação de interface

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

    for (let i = 0; i < nav.length; i++) { // loopa eventos em cima dos botões de .nav

        nav[i].addEventListener("click",function() {
            page(this.id)
        })

    }

    const sts = document.getElementsByClassName("STATS")[0].children

    for (let i = 0; i < sts.length; i++) { // loopa eventos em cima das divs de .STATS, os atributos
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

async function event() { // roda os eventos randomizados, mas só o combate por enquanto

    if (player.cred.HP[0] > 0) {
        await events[0]()  
    }
    //events[Math.floor(Math.random() * events.length)]()
    
}

function page(id) { // pagina resultante de clicar os botões de .nav
    
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
            p.innerHTML = "<b>Sobre o jogo:</b> <br><br><i>NO-RPG</i> é um projeto que tenta criar um RPG de texto puro, tal como os RPGs antigos, em um site com JAVASCRIPT nas mãos de alunos do terceiro semestre de <i>CIÊNCIAS DA COMPUTAÇÃO</i>.<br>No momento não tem nada muito além de um combate básico e <b>3</b> classes distintas com opções bem limitadas, mas o foco é incrementar com o tempo.<br><br>Você ao menos pode ver como está indo!"
            playerheader.innerHTML = "******* REFERÊNCIAS"
            break
        }
    }

    page.append(p)

    if (id != "ref") {
        
        let txt = "Você não possuí "+id+" neste momento."

        if (player) {

            const atblist = player[id] // todos os ids são iguais a atributos da classe Player para serem chamados dinamicamente

            if (atblist.length > 0) {
                
                atblist.forEach((item) => {

                    const value = document.createElement("div")
                    value.className = "value"

                    const p = document.createElement("p")
                    p.innerHTML = "<b>"+item.name+"</b>: "+item.desc

                    if (item.qntd) {
                    
                        const qntd = document.createElement("b")
                        qntd.innerHTML = "x"+item.qntd
                        value.append(p,qntd)
                    
                    } else if (item.custo) {
                    
                        const custo = document.createElement("b")
                        custo.innerHTML = item.custo+" MP"
                        value.append(p,custo)
                    
                    } else {
                    
                        value.append(p)
                    
                    }

                    page.append(value)
                
                })

            } else {

                if (typeof atblist === "object") {

                    for (let [name, values] of Object.entries(atblist)) {

                        const value = document.createElement("div")
                        value.className = "value"

                        const title = document.createElement("h1")
                        title.innerHTML = ">>> "+name

                        value.append(title)

                        values.forEach((item) => {

                            const skill = document.createElement("li")
                            skill.innerHTML = "[ <i>"+item.name+"</i> ]: "+item.desc
                            
                            if (item.custo) {
                            
                                const c = document.createElement("b")
                                c.innerHTML = item.custo+" MP"
                                value.append(skill,c)
                            
                            } else {
                                value.append(skill)
                            }
                        }) 

                        page.append(value)
                    }
                } 
            }
        } 
    }  

    playerheader.append(exit)
    playerdiv.append(page)

}

async function createPlayer() { // função de "dialogo" para a criação da instância da classe player

    pushp("Qual é o seu <i>Nome</i>?")
    const name = await getinput()
    pushp("<b>"+name+"</b> é o Nome que você sente lhe chamando quando fecha os olhos.")
    document.getElementById("NAME").innerHTML = name

    const keyblist = []

    for (key in classes) {
        const keyb = document.createElement("b")
        keyb.innerHTML = "- <i>"+key+"</i>"
        keyb.className = "option"
        keyblist.push(keyb)
    }

    keyblist.forEach((b) => {
        const t = b.querySelector("i").innerHTML
        b.onmouseover = () => {changeinfo(t,classes[t].desc);}
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

    const p = new Player(name,classes[pclass])

    const stats = document.getElementsByClassName("STATS")[0].children
    for (let i = 0; i < stats.length; i++) {
        stats[i].children[0].innerHTML = p.stats[stats[i].children[0].id]
    }

    document.getElementById("lvl").innerHTML = 1

    return p 

}

function pushspecial(title,txt) { // empurra uma mensagem com título na div de prompt
    const div = document.createElement("div")
    div.className = "special"
    const h1 = document.createElement("h1")
    h1.innerHTML = title
    const p = document.createElement("p")
    p.innerHTML = txt
    div.append(h1,p)
    pmt.append(div)
    pmt.scrollTop = pmt.scrollHeight  
}

function pushp(txt,...adds) { // empurra uma mensagem normal na div de prompt
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

function changeinfo(title,text,lista) { // modifica a div .info para ser preenchida com os valores indicados

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

function getinput() { // Promessa que espera até o usuario clicar "Enter" para ler o valor dentro do input e enviar para o que quer que tenha chamado
                    // tenta simular comandos de um terminal
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
