import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'react-quill';

//import text editor
import 'react-quill/dist/quill.snow.css';

//post creater/editor component
const PostForm = ({ post: propsPost, addNewPost, updatePost }) => {
    //get post from state
    const [post, setPost] = useState({...propsPost});

    // const [title, setTitle] = useState('');
    // const [content, setContent] = useState('');
    //to link to another destination
    const navigate = useNavigate();
    //get previous post
    const prevPostRef = useRef();
    //onload
    useEffect(() => {
        //create the post if we are visiting an old post
        prevPostRef.current = post;
    }, [post]);
    //get that post
    const prevPost = prevPostRef.current;
//create quill
    const quillRef = React.useRef();
    //onload
    useEffect(() => {
        if (prevPost && quillRef.current) {
            if (propsPost.id !== prevPost.id) {
                setPost({...propsPost});
                quillRef.current.getEditor().setContents(``);
            }
        }
    }, [prevPost, propsPost]);

    //event for handling post
    const handlePostForm = event => {
        event.preventDefault();
        //check if this is an existing post
        if (post.title) {
            //update the post
            if (updatePost) {
                updatePost(post)
                //go to the home page
                navigate('/weather-thought');
            } else
            {
                //create a new post
                const newPost = {
                title: post.title,
                content: post.content
            };
            //add the post
            addNewPost(newPost);
            //go home
            navigate('/weather-thought') }
        } else {
            //please enter a title
            alert('title required');
        }
    };
    return (
        //on submit
        <form className='container' onSubmit={handlePostForm}>
            <h1>Add a New post</h1>
            <p>
                <label htmlFor='form-title'>Title:</label>
                <br />
                <input id='form-title' value={post.title} onChange={event => setPost({
                    ...post,
                    title: event.target.value
                })} />
            </p>
            <p>
                <label htmlFor='form-content'>Content:</label>
            </p>
            <Quill onChange={(content, delta, source, editor) => {
                setPost({
                    ...post,
                    content: editor.getContents()
                });
            }} />
            <p>
                <button type='submit' className='btn'>Save</button>
            </p>
        </form>
    );
 };
 export default PostForm;