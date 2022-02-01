// node.js code goes here.

const fs = require('fs');
const homedir = require('os').homedir();
const workingDir = homedir + '/AdventureLandStorage/';

/*
    writeToFile accepts the file content and a filename, this creates and overwrites the file on use.
*/
async function writeToFile(content, filename){
    if (typeof(filename) == 'string'){
        fs.writeFile(workingDir + filename, content, writeError => {
            console.error(writeError);
            return
        });
    }
}
