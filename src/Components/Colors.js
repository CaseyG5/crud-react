import React from 'react';
import ColorIcon from './ColorIcon';

export default function Colors(props) {

    return(
        <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
            { props.colors.map( (color) => 
                ( <><i className={`sphere ${color}`} ></i>&nbsp;{color}&nbsp;</> ) 
            )}
        </div>
        
    );
}