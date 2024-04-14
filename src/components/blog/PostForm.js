import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

const PostForm = ({ post: propsPost, addNewPost, updatePost }) => {
    const [post, setPost] = useState({...propsPost});

    // const [title, setTitle] = useState('');
    // const [content, setContent] = useState('');
    const navigate = useNavigate();

    const prevPostRef = useRef();
    useEffect(() => {
        prevPostRef.current = post;
    }, [post]);
    const prevPost = prevPostRef.current;

    const quillRef = React.useRef();
    useEffect(() => {
        if (prevPost && quillRef.current) {
            if (propsPost.id !== prevPost.id) {
                setPost({...propsPost});
                quillRef.current.getEditor().setContents(``);
            }
        }
    }, [prevPost, propsPost]);

    const handlePostForm = event => {
        event.preventDefault();
        if (post.title) {
            if (updatePost) {
                updatePost(post)
                navigate('/');
            } else
            {
                const newPost = {
                title: post.title,
                content: post.content
            };
            addNewPost(newPost);
            navigate('/') }
        } else {
            alert('title required');
        }
    };
    return (
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