import React from 'react';

export default function CardList(props) {

    return(
        <div>
            <h3>Card List</h3>
            <ul>{ props.cards.map((card, index) => 
                    {  return <li key={`${index}${card.id}`}>{card.name}</li>;} ) 
                }
            </ul>
        </div>
    );
}