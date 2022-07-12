import React from 'react';

export default function CardItem(props) {

    return(
        <div>{props.qty} &nbsp; {props.name}</div>
    );
}