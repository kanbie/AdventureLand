//TODO, client management. Should handle client and task better, we are getting stuck at the potion purchase program.

async function potionPurchaseProgram() {
    timeout = 10000;
    try {
        if (myself.alert.low_hpot0) {
            if (myself.movement.arrived && myself.movement.location == 'potions') {
                buy_with_gold('hpot0', 1000 - myself.potions.hpot0);
                myself.alert.low_hpot0 = false;
                myself.movement.lock = false;
            }
            else{
                requestMove('potions');
            }
        }
        if (myself.alert.low_mpot0) {
            if (myself.movement.arrived && myself.movement.location == 'potions') {
                buy_with_gold('mpot0', 1000 - myself.potions.mpot0);
                myself.alert.low_mpot0 = false;
                myself.movement.lock = false;
            }
            else{
                requestMove('potions');
            }
        }
        
    } catch (error) {

    }
    setTimeout(async () => {
        potionPurchaseProgram();
    }, timeout);
}

async function potionDeliveryProgram() {
    timeout = 5000;
    try {
        if (myself.alert.low_hpot0 || myself.alert.low_mpot0) {
            return;
        }
        else{
            let clients = Object.keys(myself.others);
            let needy = []
            clients.forEach(client => {
                if (myself.others[client].alert.low_hpot0 || myself.others[client].alert.low_mpot0) needy.push(client);
            });
            let client = needy[0];
            myself.client = needy[0];
            if (myself.others[myself.client].alert.low_hpot0) {
                if (arrived(myself.client)) {
                    send_item(myself.client,findItemIndex("hpot0"),200);
                    myself.movement.lock = false;
                }
                else{
                    requestMove(myself.client);
                }
            }
            if (myself.others[myself.client].alert.low_mpot0) {
                if (arrived(myself.client)) {
                    send_item(myself.client,findItemIndex("mpot0"),200);
                    myself.movement.lock = false;
                }
                else{
                    requestMove(myself.client);
                }
            }
        }
               
    } catch (error) {

    }
    setTimeout(async () => {
        potionDeliveryProgram();
    }, timeout);
}