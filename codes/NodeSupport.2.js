// node.js code goes here.

const fs = require('fs');
const homedir = require('os').homedir();

async function writeToFile(content, filename){
    if (typeof(filename) == 'string'){
        fs.writeFile(homedir + '/AdventureLandStorage/' + filename, content, writeError => {
            console.error(writeError);
            return
        });
    }
}