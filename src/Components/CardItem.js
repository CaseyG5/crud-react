import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';

export default function CardItem(props) {
    const [quantity, setQuantity] = useState( Number(props.quantity) );

    useEffect( () => {
        setQuantity( Number(props.quantity) );
    }, [props.quantity]);

    const handleUpdateQty = (id, qty) => {
        props.updateQty(id, qty);
    };

    return(
        <div className='flex-betw' style={{marginBottom: "1px"}}>
            <div>
                <input className='sm-input' type="number" min="0" max="4"
                        value={quantity} onChange={(evt) => setQuantity(Number(evt.target.value)) } />
                {"  "}{props.name}
            </div>
            <div className='btn-duo-sm'>
                <button onClick={(evt) => {
                            evt.preventDefault();
                            handleUpdateQty(props.id, quantity);
                        }} className='btn-sm btn-blue'>&#10004;</button>
                {"  "}<button onClick={(evt) => {
                            evt.preventDefault();
                            props.delete(props.id);
                        }} className='btn-sm btn-red'>&#10008;</button>
            </div>
        </div>
    );
}