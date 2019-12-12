import printer from "pdf-to-printer"

/**
 * send document to print
 * @param {String} documentPath - path of the document to print
 * */
export default async function(documentPath) {
    const arrayOfPrinters = await printer.list()

    console.log(arrayOfPrinters)
    printer.print(documentPath, {
        printer: arrayOfPrinters[0]
    })
        .then(value => {console.info(`printed!\r\n${value}`)})
        .catch(reason => {console.error(reason)})
}
