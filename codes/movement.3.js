async function movementSubroutine() {
    timeout = 200;
    try {
        //am I close to my target?
        // let mark = get_target();
        
        if (myself.mark === null) {
            await smart_move(myself.markName); // a rare occurance, mark will exist even if dead.
        }
        else if (!myself.mark.dead && distance(character,myself.mark) > character.range) {
            await smart_move(myself.mark);
        }
        else if(!myself.mark.dead && distance(character,myself.mark) < character.range){
            move(parent.ctarget.x,parent.ctarget.y); //be smart, but be smart later, we need to NOT stand on the monster to avoid stacking debuffs.
        }
        else{
            await smart_move(myself.markName);
        }

        
    } catch (error) {
        
    }
    setTimeout(async () => {
        movementSubroutine();
    }, timeout);
}

async function moveThyself() { // a merchant move by request loop
    timeout = 200;
    try {
        if (myself.movement.arrived == false) {
            if (parent.party[myself.movement.location]) {   
                await smart_move(parent.party[myself.movement.location]);
                myself.movement.arrived = true;     
            } else {           
                await smart_move(myself.movement.location);
                myself.movement.arrived = true;  
            }
        }else if (myself.movement.party == true){
            if (distance(parent.character, parent.party[myself.movement.location]) > 500) {
                await smart_move(parent.party[myself.movement.location]);
            }else{
                move(parent.party[myself.movement.location].x,parent.party[myself.movement.location].y);
            }
            if (myself.client == undefined){ // Logic defines I have no clients, leave danger zones.
                myself.movement.party = false;
                requestMove('potions', false); // Free the lock right away. we aren't coming back here.
            }
        }
        
       
    } catch (error) {

    }
    setTimeout(async () => {
        moveThyself();
    }, timeout);
}
/// if my target exists and I'm wihin range.
    //do nothing
/// otherwise, I'm not in range
    //move.
// might need to get closer as well. but smart move to start.