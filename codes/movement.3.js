async function moveOrder(target) {
    try {
        if(potionTrip()){
            console.log('gonna go to town');
            await smart_move('potions');
        }
        else if(character.ctype != 'merchant'){
            if(!get_targeted_monster()){ // If we can't grab a target we should move to their area.
                await smart_move(target);
            }
            if(get_targeted_monster() && distance(character,get_targeted_monster()) > character.range){
                let targetObj = get_targeted_monster();
                if(!character.moving){
                    var half_x = character.real_x + (targetObj.real_x - character.real_x) / 2;
                    var half_y = character.real_y + (targetObj.real_y - character.real_y) / 2;
                    move(half_x, half_y);
                }
            }
            else if(!(distance(character,get_targeted_monster()) < character.range)){
                await smart_move(target);
            }
        }
        else if(character.ctype == 'merchant' && scrollTrip()){
            console.log('merchant is off to grab some scrolls');
            await smart_move('scrolls');
        }
        else if(character.ctype == 'merchant'){ // Merchant Only from here
            if (get('merchant_combine_request') == true) {
                let upgrade_arrived = get('merchant_at_combine');
                if(upgrade_arrived == false){
                //if(true && !false){
                    console.log('smart_move_here');
                    await smart_move('compound');
                    set('merchant_at_combine', true);
                } 
            } else {// We have nothing to do.
                await smart_move('town');
            }
        }
    } catch (err) {
        console.log('error in moveOrder');
        console.error(err);
        console.log(target);
    }
    setTimeout(async () => {
        moveOrder(target);
    }, 400);
}

function potionTrip(){ //do we need to get to town?
    if(quantity("mpot0") < 3 || quantity("hpot0") < 3 || character.esize < 10){
        if(character.ctype != 'merchant'){
            return true;
        }
    }
    else{
        return false;
    }
}

function scrollTrip(){ //do we need to get scrolls?
    if (character.ctype != 'merchant'){
        return;
    }
    
    let low_scroll = findItemIndex("cscroll0");
    let high_scroll = findItemIndex("cscroll1");

    let lets_go_to_scrolls = 0;

    for (item in scroll = [low_scroll,high_scroll]){
        if (character.items[scroll[item]] < 10){
            lets_go_to_scrolls++
        }
    }

    if (lets_go_to_scrolls > 0){
        return true;
    }
    return false;
}