async function targetingSubroutine() {
    timeout = 200;
    try {
        if (!get_targeted_monster()){ // get our target, if we can't then we need to get a new target.
            myself.mark = get_nearest_monster({no_target: true, type: myself.markName})
            change_target(myself.mark);
        }
        
    } catch (error) {
    }
    setTimeout(async () => {
        targetingSubroutine();
    }, timeout);
}