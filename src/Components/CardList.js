import React from 'react';
import { useState, useEffect } from 'react';
import CardItem from './CardItem'

export default function CardList(props) {
    const { has60, cards, testMyDeck, updateQty, deleteCard } = props;

    return(
        <div>
            <div className='flex-betw'>
                <div><h3>Card List</h3></div>
                <div>
                    { has60 ? <button onClick={() => { testMyDeck() }}>Test it!</button> : <span>&#128065;</span>}
                </div>
            </div>
            <div>{ cards.map((card) => 
                    {  return <CardItem key={`${card.id}`} 
                                        quantity={card.qty} 
                                        name={card.name} 
                                        id={card.id} 
                                        updateQty={updateQty} 
                                        delete={deleteCard} />;
                    }) }
            </div>
        </div>
    );
}