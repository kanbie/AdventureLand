async function resourceManagement() {
    timeout = 2000;
    try {
        switch (myself.alert) {
            case "mp_low":
                use_skill("use_mp");
                myself.alert = null;
            case "hp_low":
                use_skill("use_hp");
                myself.alert = null;
            default:
                break;
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




