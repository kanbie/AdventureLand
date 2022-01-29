// Async stuff // Please rename later
// Look into ping compensation
// Look into promises, and note the await in any async function. // await probably hits every server bound inquiry.
// How fast do we call ourselves?

async function LoopInterval(functionCall){
    try {
        
    } catch (error) {
        console.error(error);
    }
    setTimeout(async () => {
        //recall this function
    }, 250); // 1/4 a second we assumme.
    ;
}

--Call the function LoopInterval() 