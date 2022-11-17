async function resourceManagement() {
    timeout = 300;
    try {
        switch (myself.alert) {
            case "mp_low":
                use_skill("use_mp");
                myself.alert = null;
                break;
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