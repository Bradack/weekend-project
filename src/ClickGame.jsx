import React, { Component } from 'react';
import axios from 'axios';
import findResPerTick from './components/cgMath.js';
import ProdTile from './components/ProdTile.js';
import prodFile from './components/prodInfo.json';
import './components/reset.css';
import './components/clickGame.css';


// const DATA_ADDRESS = '/api/cg/';
const ACT_ADDRESS = '/api/act/';        // Save file locations
const TIME_INCREMENT = 500;             // Controls the speed of the game by ms/tick

class ClickGame extends Component {
    constructor() {
        super();
        this.state = {
            saveName: '',
            curRes: 0,
            prodList: prodFile,
            resPTick: 0,
            saveExists: false
        }

        // this.importProducers([], 0);
        this.buyProducer = this.buyProducer.bind(this);
        this.tick = this.tick.bind(this);
        this.uploadSave = this.uploadSave.bind(this);
        this.updateSave = this.updateSave.bind(this);
        this.clicker = this.clicker.bind(this);
        this.restoreSave = this.restoreSave.bind(this);
        this.textChange = this.textChange.bind(this);
    }

// Alternate method of fetching produce data from server
    // importProducers(inArr, x) {                         // Recursively etrieves data from the server until it runs out
    //     axios.get(`${DATA_ADDRESS}${x}`).then( (resp) => {
    //         if(resp.data.name) {
    //             inArr.push(resp.data);
    //             x++;
    //             this.importProducers(inArr, x);
    //         } else {
    //             this.setState({prodList: inArr});
    //         }
    //     })
    //     return inArr;
    // }

// Debug for importing producers
    // printProducers() {            // Debugging Method
    //     for(let i=0; i<this.state.prodList.length; i++) {
    //         console.log('printProducer',this.state.prodList[i]);
    //     }
    // }

    buyProducer(x,y) {                                                  // Attempts to purchase y amount of  x building (onClick)
        if(this.state.curRes < this.state.prodList[x].cost) {           // Check if resources exist
            return;
        }

        let arr = this.state.prodList;

        this.setState({curRes: this.state.curRes - arr[x].cost});       // Subtract building cost from resources
        arr[x].quant+=y;                                                // Increment building count
        this.setState({prodList: arr});                                 // Set building count
        this.setState({resPTick: findResPerTick(arr)});                 // Update resources per second based on new count
    }

    uploadSave() {
        if(!this.state.saveName) {
            alert('Please enter a save name first!');
            return;
        }
        let quantArr = []
        for(let i=0; i<this.state.prodList.length;i++) {                // Create an array of only building quantities
            quantArr.push(this.state.prodList[i].quant);
        }
        console.log('Creating new save:', this.state.saveName);
        axios.post(`${ACT_ADDRESS}${this.state.saveName}`, {            // Post request for new save
            curRes: this.state.curRes,
            purchased:  quantArr
        }).catch((res)=> {                                              // New save attempt Feedback
            if(res.response.status==409) {
                alert('Save already exists');
            } else if(res.response.status==201) {
                console.log('Save successful');
            }
        });
    }

    updateSave() {
        let quantArr = []                                               
        for(let i=0; i<this.state.prodList.length;i++) {                // Create an array of only building quantities
            quantArr.push(this.state.prodList[i].quant);
        }
        console.log('Updating save:',this.state.saveName);
        axios.put(`${ACT_ADDRESS}${this.state.saveName}`, {             // Upload current resouces and quantity array
            curRes: this.state.curRes,
            purchased:  quantArr
        }).catch((res)=> {                                              // Update attempt Feedback
            if(res.response.status==404) {
                alert('Save does not exist');
            } else if(res.response.status==200) {
                console.log('Save updated successfully');
            }
        } )
        // this.setState({saveExists: true});                              
    }

    restoreSave() {                                                     // Restore a save
        console.log('Restoring save:', this.state.saveName);
        axios.get(`${ACT_ADDRESS}${this.state.saveName}`).then((resp) => {
            let tempArr = prodFile;                                        
            for(let i=0; i<resp.data.saveInfo.purchased.length; i++) {  // Create an a fresh array with imported building numbers
                tempArr[i].quant = resp.data.saveInfo.purchased[i];
            }
            this.setState({curRes: resp.data.saveInfo.curRes,           // Restore resources and building numbers
                prodList: tempArr
            })
        }).catch((res)=> {                                              // Restore attempt feedback
            if(res.response.status==404) {
                alert('Save does not exist');
            } else if(res.response.status==200) {
                console.log('Save restore successful');
            }
        } )
    }

    componentDidMount() {                                                // Start tick timer for game updates
        setInterval(this.tick,TIME_INCREMENT);
    }

    checkVisibleTiles() {                                               // Update and display the list of available producers
        let tempArr = this.state.prodList;

        for(let i=0; (this.state.curRes >= (this.state.prodList[i].cost*.75)) && (i<tempArr.length);i++){
            tempArr[i].unlocked = true;
        }
        this.setState({prodList: tempArr});
    }

    loadTiles() {                                                       // Creates a renderable array of production tile components
        let tempArr = [];

        for(let i=0; (this.state.prodList[i].unlocked==true) && (i<this.state.prodList.length);i++) {
            tempArr.push(
            <ProdTile 
                key={this.state.prodList[i].id} 
                producer={this.state.prodList[i]} 
                action={this.buyProducer} 
            />)
        }

        return tempArr;
    }

    tick() {                                                             // Progresses the game in increments
        this.setState({curRes: (this.state.curRes + this.state.resPTick)});
        this.checkVisibleTiles();
    }

    clicker() {                                                         // Handles the click for resources function
        let c = 10;
        c = c + this.state.curRes;
        this.setState({curRes : c});
        this.checkVisibleTiles();
    }

    textChange(input) {                                                 // Save name field handler
        this.setState({saveName: input.target.value});
    }

    render() {
        return (
            <div>
                <div className='resource-panel'>                        
                    Res: {this.state.curRes}<br/>
                    Res/s: {this.state.resPTick}<br/>
                </div>                    
                <div className='account-management'>
                    <input value={this.state.saveName} onChange={this.textChange} />
                    <button className='save-load' onClick={this.uploadSave}>New Save!</button>
                    <button className='save-load' onClick={this.updateSave}>Save!</button>
                    <button className='save-load' onClick={this.restoreSave}>Restore!</button><br/>
                </div>
                <div className='production-area'>
                    <button className='clicker' onClick={this.clicker}>Click!</button>
                    {this.loadTiles()}
                </div>
            </div>
        )
    }
}

export default ClickGame;