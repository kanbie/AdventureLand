async function targetingSubroutine() {
    timeout = 200;
    try {
        // Loop goes here...

        //Do I have a target?
        previousMark = get_targeted_monster();
        //Do nothing if previousMark returns an item, change to new target if it returns null
        if (!previousMark || parent.ctarget.dead){
            myself.mark = get_nearest_monster({no_target: true, type: myself.markName})
            change_target(myself.mark);
        }
        
    } catch (error) {
    }
    setTimeout(async () => {
        targetingSubroutine();
    }, timeout);
}