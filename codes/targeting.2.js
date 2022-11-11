async function targetingSubroutine(mark) {
    timeout = 200;
    try {
        // Loop goes here...

        //Do I have a target?
        previousMark = get_targeted_monster();
        //Do nothing if previousMark returns an item, change to new target if it returns null
        if (!previousMark || parent.ctarget.dead){
            change_target(get_nearest_monster({no_target: true, type: mark}));
            character.mark = mark; // Do I want to store the object or just the nam 
        }
        
    } catch (error) {
    }
    setTimeout(async () => {
        targetingSubroutine(mark);
    }, timeout);
}