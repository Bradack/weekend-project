const prodArray = require('./prodInfo.json');
const endOfList = {};
let saves = [];


function findSave(name) {       // Searches save files for a save with specific name.
    console.log(' Searching for...', name)
    for(let i=0; i<saves.length;i++) {
        if(saves[i].name == name) {
            console.log('  Save found!');
            return i;
        }
    }
    console.log('  Save not found!');
    return -1;
}
module.exports = {

    // readProd: (req, res) => {
    //     if(prodArray[req.params.id]) {
    //         return res.status(200).json(prodArray[req.params.id]);
    //     } else {
    //         return res.status(200).json(endOfList);
    //     }
    // },

    postSave: (req, res) => {           // Creates a new save value
        console.log('Saving...:', req.params.name, req.body)

        let search = findSave(req.params.name);

        if(search != -1) {              // Checks if save already exists and returns error if true
            console.log('   Save failed: Already Exists');
            return res.status(409).send(false);
        }

        saves.push({                    // Pushes new save into array
            name: req.params.name,
            saveInfo: req.body
        })
        console.log('   Save successful:', saves[saves.length-1]);
        return res.status(201).send(true);
    },

    updateSave: (req, res) => {         // Updates an existing save value
        console.log('Updating...', req.params.name, req.body);

        let search = findSave(req.params.name);

        if(search>=0) {                 // Searches for save value and updates
            saves[search].saveInfo = req.body;
            console.log('   Save success:', saves[search]);
            return res.status(200).send(true);
        }

        console.log('   Save failed: Does not Exist');  // Save value does not exist error and return
        return res.status(409).send(false);

    },

    getSave: (req, res) => {            // Restore a save value
        console.log('Loading...', req.params.name)
        console.log('query:', req.query.id);
        let search = findSave(req.params.name)

        if(search>=0) {                 // Searches for and returns save value
            console.log('   Load successful!', saves[search])
            return res.status(200).send(saves[search])
        }

        return res.status(404).send(false);  // Failed to find save value
    }
}
