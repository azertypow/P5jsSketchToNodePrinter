import printFile from "./printFile"

const PORT_CLIENT = 8080

import express from "express"
import nodeHttp from "http"
import socketIo from "socket.io"

export default function() {

    const app = express()
    const http = nodeHttp.createServer(app)
    const io = socketIo(http)

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/client/index.html')
    })

    app.use('/public', express.static(__dirname + '/client/public'))

    http.listen(PORT_CLIENT, () => {
        console.log(`listening on *:${PORT_CLIENT}`)
    })

    io.on("connection", (socket) => {
        console.log("new connection")

        socket.on("printFromClient", (filePath) => {
            console.log(filePath)
            printFile(filePath).then(() => {
                // action when printed file action was success
            })
        })
    })
}
