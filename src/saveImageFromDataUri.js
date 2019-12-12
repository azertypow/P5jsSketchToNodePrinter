import fs from "fs"
import Jimp from "jimp"

export function saveImageFromDataUri(dataUri, pathOfDirectory = "/") {

    const absolutePathOfDirectory = __dirname + pathOfDirectory
    const pathOfImage = absolutePathOfDirectory + "out.png"

    // strip off the data: url prefix to get just the base64-encoded bytes
    const base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "")

    fs.writeFile( pathOfImage, base64Data, 'base64', (err) => {
        console.log(err)
    })

    Jimp.read(pathOfImage)
        .then(image => {
            return image
                .quality(100)       // set quality
                .write(absolutePathOfDirectory + 'out.bmp')   // save
        })
        .catch(err => {
            console.error(err);
        });
}
