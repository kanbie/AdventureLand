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

async function inventoryToFile(){ // we very well may be able to grab whatever goes into the file and read it back for cross character functions.
    try {
        let inventory = character.items;
        let stage = {};
        for (slot in inventory){
            if(isValidItem(inventory[slot])){
                stage[inventory[slot].name] = {
                    name: inventory[slot].name,
                    slot: [],
                }
            }
        }
        for (slot in inventory){
            if(isValidItem(inventory[slot])){
                stage[inventory[slot].name].slot.push(slot);
            }
        }
        writeToFile(JSON.stringify(stage), character.name + ' inventory.JSON');
    } catch (err) {
        console.error(err);
    }
    setTimeout(async () => {
        inventoryToFile();
    }, 1000 * 30);
}

async function inventoryToListFile(){ //depends how, but I expect we can read this back as a list for backlists and whitelists, though more commonly just for copy/paste into merchantTasks.js
    try {
        Iout = [];
        for (slot in apple){
            if (apple[slot] && !Iout.includes(apple[slot].name)){
                Iout.push(apple[slot].name);
            }
        }
        writeToFile(Iout, character.name + ' inventoryList.txt');
    } catch (err) {
        console.error(error);
    }
    setTimeout(async () => {
        inventoryToListFile();
    }, 1001 * 30);
}

