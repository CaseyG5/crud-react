import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';

var cardsInDeck = [];
var cardsInHand = [];

const shuffle = () => {             // The simple but effective Fisher-Yates shuffling algorithm
    let j = 0;
    let temp = 0;
    for(let i = cardsInDeck.length - 1; i>0; i--) {     // for each card from last down to the 2nd
        j = Math.floor(Math.random() * i);              // get a random index from 0 to i
        
        temp = cardsInDeck[i];                          // swap the card at position i with
        cardsInDeck[i] = cardsInDeck[j];                // the random index
        cardsInDeck[j] = temp;                          
    }
    console.log("shuffled");
}



export default function Tester(props) {

    const [hand, setHand] = useState( [] );
    
    useEffect( () => {
        cardsInDeck = props.deck.slice();
        shuffle();
    }, []);

    const draw = (howMany) => {
        if(cardsInHand.length + howMany <=10) {

            for(let d=0; d<howMany; d++) {
                cardsInHand.push(cardsInDeck.pop());
            }
            setHand(cardsInHand.map((cardNum, index) =>     // set hand to an array of images here
                (<img key={`${cardNum}${index}`}            // instead of using .map() in 
                      src={`/images/${cardNum}.jpeg`}       // the return statement below
                      width='110px' height={"153px"} 
                      alt='game card' />) ));
        }    
    }

    const reset = () => {
        for(let i=cardsInHand.length; i>0; i--) {           // put back cards in hand
            cardsInDeck.push(cardsInHand.pop());
        }
        shuffle();  
        setHand( [] );
    }

    const mulligan = () => {                                
        let cardsToDraw = cardsInHand.length - 1;           
        reset();
        draw(cardsToDraw);
    }

    

    return(
        <div id='test-area'>
            <div id='hand'>                                 
                {hand}                                      {/* mapping here did NOT render updates */}
            </div>
            <div className='flex-col' style={{width: "80px", height: "130px"}}>
                <button onClick={shuffle}>Shuffle</button>
                <button onClick={ () => { draw(7); } }>Draw 7</button>
                <button onClick={mulligan}>Mull</button>
                <button onClick={ () => { draw(1); } }>Draw</button>
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    );
}