import React from 'react';
import './reset.css';
import './clickGame.css';

function ProdTile(prop) {
    // console.log('prop:', prop.producer);
    return (
        <div className='prod-tile'>
            <button onClick={() => prop.action(prop.producer.id, 1)}>
                <div className='left-col'>
                    <div className='prod-name'>{prop.producer.name}</div>
                    <div className='prod-cost'>Costs: {prop.producer.cost}</div>
                </div>
                <div className='right-col'>
                    <div className='prod-quanity'>#: {prop.producer.quant}x</div>
                    <div className='res-per-sec'>Produces: {prop.producer.quant*prop.producer.output}</div>
                </div>
            </button>
        </div>
    )
}

export default ProdTile;