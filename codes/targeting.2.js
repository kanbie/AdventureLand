//These functions keep our target/focus up to date.

/*
Some notes about targets,
get_target(); - returns our current focus, we can use this to remember our previous state
Object properties of import;
    .type - monster or somthing else?
    .mtype - for monsters, contains the name of the object found in G.monsters[mtype]
    .name - mostly useless, only for presentations sould this be used, but not to reference in code.
*/


async function targetUpdate(targetType) {
    let nextArg = targetType;
    try {
        previous_state = get_targeted_monster();
        if (!previous_state){
            change_target(get_nearest_monster({no_target: true, type: targetType}));
        }
    } catch (err) {
        error(err);
    }
    setTimeout(async () => {
        targetUpdate(nextArg);
    }, 199);
}