import React from 'react';
//not sure what this is for. check and possibly remove
const Description = props => {
    return(
        <div>
            <h3>DESCRIPTION:</h3>
            <p>{props.children}</p>
        </div>
    )
}

export default Description;