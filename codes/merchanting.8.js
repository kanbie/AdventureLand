//TODO, SEQUENCING, move move to moving for movement

async function potionPurchaseProgram() {
    timeout = 10000;
    try {
        if (myself.poitons.hpot0 < 300) {
            await smart_move('potions');
            buy_with_gold('hpot0', 1000 - myself.poitons.hpot0);
        }
        if (myself.poitons.mpot0 < 300) {
            await smart_move('potions');
            buy_with_gold('mpot0', 1000 - myself.poitons.mpot0);
        }
        
    } catch (error) {

    }
    setTimeout(async () => {
        potionPurchaseProgram();
    }, timeout);
}

async function potionDeliveryProgram() {
    timeout = 10000;
    try {
        clients = Object.keys(myself.others);
        clients.forEach(async client => {
            if (myself.others[client].hpot0 < 200) {
                await smart_move(parent.party[cleint]);
                send_item(client,200,findItemIndex("hpot0"));
            }
            if (myself.others[client].mpot0 < 200) {
                await smart_move(parent.party[cleint]);
                send_item(client,200,findItemIndex("mpot0"));
            }
        });
    } catch (error) {

    }
    setTimeout(async () => {
        potionDeliveryProgram();
    }, timeout);
}