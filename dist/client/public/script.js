console.log("hello from script.js file")

/**
 * @var {SocketIOClient.Socket}
 * */
const socket = io();

let p5Canvas = null

function setup() {
    p5Canvas = createCanvas(100, 100);
    background(255, 0, 0);
}

/**
 * @var {Object} data - data to send on node server
 * */
function onPrint() {

    if(socket.connected) {

        if(p5Canvas !== null) {
            // const canvasSaved = saveCanvas(p5Canvas, 'myCanvas', 'jpg');

            const dataUri = p5Canvas.canvas.toDataURL()

            socket.emit("printFromClient", dataUri)
            console.info(`dataUri of canvas sending to server: ${dataUri}`)

        } else {
            console.info("please wait, p5Canvas is not created")
        }
    } else {
        console.info("please wait, socket is not connected")
    }

}
