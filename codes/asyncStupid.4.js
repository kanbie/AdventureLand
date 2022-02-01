// Async stuff // Please rename later
// Look into ping compensation
// Look into promises, and note the await in any async function. // await probably hits every server bound inquiry.
// How fast do we call ourselves?

async function LoopInterval(function_called,recall_in_ms){
    try {
        
    } catch (error) {
        console.error(error);
    }
    setTimeout(async () => {
        //recall this function
    }, recall_in_ms); // 1/4 a second we assumme.
    ;
}

--Call the function LoopInterval() 