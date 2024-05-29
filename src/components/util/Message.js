import React from 'react';

//displays a message to users
const Message = ({ type }) => {
    //message object
    const messages = {
        //an argument will be passed to change the message
        saved: 'Post has been saved!',
        updated: 'Post has been updated!',
        deleted: 'Post has been deleted.'
    };
    return (
        <div className={`App-message ${type}`}>
            <p className='container'>
                <strong>{messages[type]}</strong>
            </p>
        </div>
    );
};

export default Message;