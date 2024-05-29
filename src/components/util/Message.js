import React from 'react';

//displays a message to users
const Message = ({ type }) => {
    //message object
    const messages = {
        //an argument will be passed to change the message
        //need to add login messages
        saved: 'Post has been saved!',
        updated: 'Post has been updated!',
        deleted: 'Post has been deleted.',
        loginFailed: 'The login failed',
        'signed in': 'You have been logged in',
        'signed out': 'You have been logged out'
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