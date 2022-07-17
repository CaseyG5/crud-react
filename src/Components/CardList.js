import React from 'react';
import CardItem from './CardItem'

export default function CardList(props) {

    return(
        <div>
            <h3>Card List</h3>
            <div>{ props.cards.map((card) => 
                    {  return <CardItem key={`${card.id}`} 
                                        quantity={card.qty} 
                                        name={card.name} 
                                        id={card.id} 
                                        updateQty={props.updateQty} 
                                        delete={props.delete} />;
                    }) }
            </div>
        </div>
    );
}