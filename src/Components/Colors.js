import React from 'react';
import '../App.css';

export default function Colors(props) {

    return(
        <div className='inl'>
            { props.colors.map( (color) => (<span>{color} </span>) ) }
        </div>
    );
}