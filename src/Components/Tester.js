import React from 'react';
import { useState } from 'react';
import '../App.css';

export default function Tester(props) {
    let deck = props.deck.slice();
    let cardsInHand = [];

    const [hand, setHand] = useState([]);

    const shuffle = () => {
        let j = 0;
        let temp = 0;
        for(let i = deck.length - 1; i>0; i--) {
            let j = Math.floor(Math.random() * i);
            
            temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }

    const draw = (howMany) => {

        if(cardsInHand.length + howMany <=10) {
            console.log("drawing cards");
            for(let d=0; d<howMany; d++) {
                cardsInHand.push(deck.pop());
            }
            console.log("cardsInHand before setHand()", cardsInHand);
            setHand(cardsInHand);
            console.log("cardsInHand after setHand()", cardsInHand);
        }    
    }

    const reset = () => {
        console.log("putting cards back");
        console.log("cardsInHand:", cardsInHand);
        console.log("hand.length:", hand.length)
        for(let i=hand.length; i>0; i--) {
            console.log("removing card from hand and putting back on library");
            deck.push(hand[i]);
        }
            
        // setHand([]);
        shuffle();
    }

    const mulligan = () => {
        console.log("mulligan-ing");
        let cardsToDraw = hand.length - 1;
        console.log("cards to draw:", cardsToDraw);
        reset();
        console.log("just called reset()");
        draw(cardsToDraw);
    }


    return(
        <div id='test-area'>
            <div id='hand'>   
                {hand.map((cardNum) => (<img src={`/images/${cardNum}.jpeg`} width='110px' height={"153px"} alt='game card' />) )}
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