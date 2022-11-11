async function movementSubroutine() {
    timeout = 200;
    try {
        //am I close to my target?
        let mark = get_target();
        if (mark && distance(mark) > character.range) {
            await smart_move(mark);
        }
        else if(mark && distance(mark) < character.range){
            move(parent.ctarget.x,parent.ctarget.y); //be smart, but be smart later, we need to NOT stand on the monster to avoid stacking debuffs.
        }
        // else{
        //     await smart_move(character.mark);
        // }

        
    } catch (error) {
        
    }
    setTimeout(async () => {
        movementSubroutine();
    }, timeout);
}


/// if my target exists and I'm wihin range.
    //do nothing
/// otherwise, I'm not in range
    //move.
// might need to get closer as well. but smart move to start.