import fs from "fs"
import sys from "sys"

export function saveImageFromDataUri(dataUri, pathOfDirectory = "/") {

    // strip off the data: url prefix to get just the base64-encoded bytes
    const base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "")

    fs.writeFile(__dirname + pathOfDirectory + "out.png", base64Data, 'base64', (err) => {
        console.log(err)
    })
}
