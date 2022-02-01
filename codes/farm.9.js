//Set our target and MAYBE take care of monsterhunt logic;

function farm(goals,current_position,current_target_definition){
    if(goals){return goals;}
    target = get_targeted_monster() // reference previous targeting state.
    if(!target){ //we don't have a target, lets grab one
        target = get_nearest_monster({no_target: true, type: current_target_definition});
		if(target) {
			change_target(target);
            if(checkdistance() < 150){return 'move_closer_to_monster';}
            else{return 'get_to_monster_area';}
        }
        else{ //targeting failed, we need to find one, raise the flag to move to our target
            return 'get_to_monster_area';
        }
    }
    return null;
}

function check_distance(){
    try {
        distance(character,parent.ctarget);
    } catch (error) {
        return null;
    }
}
