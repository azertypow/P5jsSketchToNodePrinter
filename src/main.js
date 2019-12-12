import server from "./server"

/**
 * main function of node application
 * */
async function main() {
    server()

    return "main file is running"
}

// start process
main().then(console.info)
