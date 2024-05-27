import React from 'react';
import { Link } from 'react-router-dom'


const Posts = ({ posts, deletePost, isAuthenticated }) => {
    return(
        <article className='posts container'>
        <h1>Posts</h1>
        <ul>
            {/* check there are posts */}
            {posts.length < 1 && <li keys='empty'>No posts yet</li>}
            {/* loop to generate posts */}
            {posts.map((post, i) => (
                <li key={i}>
                    <h2>
                        <Link to={`/post/${post.slug}`}>{post.title}</Link>
                    </h2>
                { isAuthenticated ? (
                  <p>
                      <Link to={`/edit/${post.slug}`}>Edit </Link>
                       {' | '}
                    <button className='linkLike' onClick={() => deletePost(post)}>
                         Delete
                     </button>
                 </p>
                ) : null }
                </li>
            ))}
        </ul>
    </article>
    );
}

export default Posts;