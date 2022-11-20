async function resourceManagement() {
    timeout = 249;
    try {
        const canDrink = new Date() > parent.next_skill.use_hp;
        if (myself.alert.low_mp == true && canDrink) {
            use_skill("use_mp");
            myself.alert.low_mp = false;
        }
        else if (myself.alert.low_hp == true && canDrink) {
            use_skill("use_hp");
            myself.alert.low_mp = false;
        }
        if (myself.alert.rip) {
            respawn();
        }
        
    } catch (error) {

    }
    setTimeout(async () => {
        resourceManagement();
    }, timeout);
}

async function purchasePotions() {
    timeout = 2000;
    try {
        //
        
    } catch (error) {

    }
    setTimeout(async () => {
        purchasePotions();
    }, timeout);
}




