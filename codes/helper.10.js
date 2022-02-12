// Helper functions for dumb code in the runner files.

// the in game function for this returns index 0 on search at times, weird. Wrote this to replace it, null on not found.
function findItemIndex(itemName){
    for (slot in character.items){
        if (character.items[slot] && character.items[slot].name == itemName){
            return slot;
        }
    }
    return null;
}