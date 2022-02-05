


async function moveOrder(target) {
    try {
        if(potionTrip()){
            console.log('gonna go to town')
            await smart_move('potions')
        }
        else{
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
        return true;
    }
    else{
        return false;
    }
}