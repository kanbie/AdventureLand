// Load Code Lines
load_code('targeting');
load_code('movement');
load_code('attacking');
load_code('potionConsumption');
// Global Settings
let primary_target = 'goo';
console.log(primary_target);


targetUpdate(primary_target); //Todo, have targetUpdate actually update our target for the rest of the bros.
moveOrder(primary_target);
attackOrder(primary_target);
drinkPots();














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

