const robot = require("robotjs")

const G_POS = {x: 466, y: 227}
const R_POS = {x: 780, y: 234}
const PAUSE_POS = {x: 606, y: 284}
const SENSOR_INTERVAL = {x_first: 440, y_first: 340,
                            x_last: 450, y_last: 350}
const GAME_POS = {x: 709, y: 894}

main()

async function main(){
    await playGame()
    await loop()
} 

async function loop(){

    var contCactos = 0;

    var speed = 1.0000;
    while(1){
        is_pause = await isPause()
        if(is_pause)
            break
        
        is_object_interval = await isObjectInInterval(SENSOR_INTERVAL)
        if(is_object_interval){
            console.log("Cacto encontrado")
            contCactos++
            await pular(speed)
            speed = speed <= 0.2 ? 0.2 : 1 - ( (contCactos) / 200)
            console.log("speed: " + speed)
        }
    }

    console.log("Qtd de cactos: " + contCactos)
}

async function isObject(pos = {}){
    if(robot.getPixelColor(pos.x, pos.y) != "ffffff"){
        return true
    }
    return false
}

async function isObjectInInterval(interval = {x_first: 799, y_first: 335, x_last: 830, y_last: 355}){
    for(var i = interval.x_first, j = interval.y_first; i <= interval.x_last; i++, j++){
        is_object = await isObject(pos = {x: i, y: j})
        if(is_object)
            return true
    }
    return false
}

async function playGame(){
    // move mouse for game screen
    robot.moveMouse(GAME_POS.x, GAME_POS.y)

    // mouse click for change windo
    robot.mouseClick()

    // tap up arrow for start game
    robot.keyTap("up")

    return true
}

async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

async function pular(speed){
    robot.keyToggle("down", "up")
    await sleep(10)
    robot.keyTap("up")
    await sleep(370*speed)
    robot.keyToggle("down", "down")
    return true
}

async function isPause(){
    is_g = await isObject(G_POS)
    is_r = await isObject(R_POS)
    is_pause = await isObject(PAUSE_POS)

    if(is_g && is_r && is_pause)
        return true

    return false
}