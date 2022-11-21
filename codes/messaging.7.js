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
        logPotions();

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

function logPotions(){
    let hpot0Slot = findItemIndex("hpot0"); 
    let mpot0Slot = findItemIndex("mpot0");
    let hpot1Slot = findItemIndex("hpot1");
    let mpot1Slot = findItemIndex("mpot1");

    //this is a condition, execute if ture : execute if false statement. Its a one line if/else to catch the null from not finding an item.
    (hpot0Slot) ? myself.potions.hpot0 = character.items[hpot0Slot].q : myself.potions.hpot0 = 0;
    (mpot0Slot) ? myself.potions.mpot0 = character.items[mpot0Slot].q : myself.potions.mpot0 = 0;
    (hpot1Slot) ? myself.potions.hpot1 = character.items[hpot1Slot].q : myself.potions.hpot1 = 0;
    (mpot1Slot) ? myself.potions.mpot1 = character.items[mpot1Slot].q : myself.potions.mpot1 = 0;
} 