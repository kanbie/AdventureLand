async function report() {
    timeout = 2000;
    try {
        send_cm("TwelvePounds",myself); //swap to party lead
    } catch (error) {

    }
    setTimeout(async () => {
        report();
    }, timeout);
}

async function metrics() {
    timeout = 500;
    try {
        // Log Code Costs
        myself.cc.local[2] = myself.cc.local[1];
        myself.cc.local[1] = myself.cc.local[0];
        myself.cc.local[0] = character.cc;
        myself.cc.localMax = Math.max(...myself.cc.local);
        // implement an average here.

        // Log Inventory
        logInventory();

    } catch (error) {

    }
    setTimeout(async () => {
        metrics();
    }, timeout);
}

function logInventory(){
    // syntax should be myself.inventory.item.property
    
    let inventoryStub = {};
    let inventoryNames = [];
    character.items.forEach(itemSlot => {
        if (itemSlot !== null && itemSlot.hasOwnProperty("name") && !inventoryNames.includes(itemSlot.name)) {
            inventoryNames.push(itemSlot.name);
        }
    });
    inventoryNames.forEach(name => {
        inventoryStub[name] = {}
    });
    // We now have a object filled with entries for each item in our inventory, like {hpot0: {…}, mpot0: {…}, cscroll0: {…}, cscroll1: {…}, ...}
    // lets nest in one layer and fill the properties

    Object.keys(inventoryStub).forEach(item => {
        inventoryStub[item].slots = [];
        slot = 0;
        character.items.forEach(itemSlot => {
            if (itemSlot != null && itemSlot.name == item) {
                inventoryStub[item].slots.push(slot);
            }
            slot++
        });
    });

    myself.inventory = inventoryStub;
    //console.log(inventoryStub);
}