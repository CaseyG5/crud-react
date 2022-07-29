import React from 'react';

export default function Colors(props) {     
                                        // takes an array of colors and produces colored spheres with names
    return(
        <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
            { props.colors.map( (color) => 
                ( <><i className={`sphere ${color}`} ></i>&nbsp;{color}&nbsp;</> ) 
            )}
        </div>
        
    );
}