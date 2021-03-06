
let sendItemsBlacklist = ['mpot0','hpot0'];

async function vacateItems(recipient = 'TwelvePounds'){
    try {
        if(character.name == recipient){return}
        if(distance(character,get_player(recipient)) < 300){
            send_gold(recipient, character.gold - 200000);
        }
        for (let slot = 0; slot < character.items.length; slot++) {
            if(character.items[slot] && !(isOnBlacklist(slot))){
                if(distance(character,get_player(recipient)) < 300){
                    await slow_send(recipient,slot);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
    setTimeout(async () => {
        vacateItems();
    }, 1000);
}

function isOnBlacklist(slot){
    if(sendItemsBlacklist.includes(character.items[slot].name)){return true;}
    return false;
}

async function slow_send(doorstop, slot, amount = 9999){
    return new Promise(setTimeout(send_item(doorstop,slot,amount),200)); // we use this to not get disconnected    
}

function isValidItem(itemObject){
    if(itemObject){
        if(itemObject.name){
            return true;
        }
    }else{
        return false;
    }
}