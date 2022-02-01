



function movement(goals,current_target_definition){
    let move_order = false;
    if(goals == 'potion_trip_requested'){
        move_order = smart_move_please('potions');
        if(move_order == true){return 'in_town';}    
        else{return null;}
    }
    else if(goals == 'get_to_monster_area'){
        move_order = smart_move_please(current_target_definition);
        if(move_order == true){return 'at_requested_monster';}    
        else{return null;}
    }
    else if(goals == 'move_closer_to_monster'){
        move_order = move_closer_to_target(parent.ctarget);
        if(move_order){return 'at_requested_monster';}    
        else{return null;}
    }
    else{return null;}
}

async function smart_move_please(arg){
    await smart_move(arg);
    return true;
}


function resetFlag(){
    return null;
};

function move_closer_to_target(parent.ctarget){
    let target = parent.ctarget;
    var half_x = character.real_x + (target.real_x - character.real_x) / 2;
    var half_y = character.real_y + (target.real_y - character.real_y) / 2;
    move(half_x, half_y);
    return true;
}
