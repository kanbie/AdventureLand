load_code("main");

async function consoleLog() {
    timeout = 20000;
    try {
        console.log(myself);
        
    } catch (error) {

    }
    setTimeout(async () => {
        consoleLog();
    }, timeout);
}

consoleLog();