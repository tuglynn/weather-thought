import React from 'react';
import { useParams } from 'react-router-dom';
//convert quill text to html
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import NotFound from '../util/NotFound';

const Post = ({ posts }) => {
    const {postSlug} = useParams();
    const post = posts.find(post => post.slug === postSlug);
       if (!post) return <NotFound />;

       const converter = new QuillDeltaToHtmlConverter(post.content.ops, {});
       const contentHTML = converter.convert();

       return (
        <article className='container'>
            <h1>{post.title}</h1>
            <div className='container'
            // add html content from quill
                dangerouslySetInnerHTML={{__html: contentHTML}} />
        </article>
       )
    }

export default Post;