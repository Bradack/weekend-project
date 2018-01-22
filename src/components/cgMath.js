

// class CGMath {

    function findResPerTick(arr) {  // Finds the total sum of resources generated per tick.
        let sum = 0;
        for(let i=0; i<arr.length;i++) {
            sum = sum + arr[i].output*arr[i].quant;
        }
        return sum;
    }
// }


export default findResPerTick;