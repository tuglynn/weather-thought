import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useParams
} from 'react-router-dom';
import {auth, signInWithEmailAndPassword, signOut, database, ref, set, push, get, child, update, remove} from './firebase';
import Header from './components/Header';
import Posts from './components/blog/Posts';
import Post from './components/blog/Post';
import PostForm from './components/blog/PostForm';
import NotFound from './components/util/NotFound';
import Message from './components/util/Message';
import Widget from './components/weather/Widget';
import Login from './components/util/Login';


import "./App.css";

const App = props => {
    //Declaring global variables
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //Setting a flash message for user
    const setFlashMessage = message => {
        setMessage(message);
        setTimeout(() => {
            setMessage(null);
        }, 1600);
    }
    //login
    const onLogin = async (email, password) => {
        try {
            //get user credentials and sign in
            //if this doesn't return, then we get a 400 error
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            //if user exists login
            //login with bad credentials gives 400 (bad request)
            //none of the else or catch is running.
            console.log(userCredentials);
            if(user) {
                setFlashMessage('signed in');
                //set global authentication to true
                setIsAuthenticated(true);
                //set navigation back to home page
            } else {
                //else do not set to true
                console.log('no user')
                setFlashMessage('invalid email or password');
                setIsAuthenticated(false);
            }

        } catch (error) {
            //errors for logging in
            if (error.code === 'auth/invalid-login-credentials') {
                // Handle this specific error case, maybe show a user-friendly message
                setFlashMessage('Invalid email or password');
            } else {
                console.error('login failed', error.message);
                setFlashMessage('login failed');
                setIsAuthenticated(false);
            }
        }
    }
    // signInWithEmailAndPassword(auth, email, password).then(userCredentials => {
    //     const user = userCredentials.user;
    //     console.log(user);
    //     setFlashMessage('signed in');
    //     setIsAuthenticated(true);
    // }).catch(error => console.error(error));

    //logout function
    const onLogout = () => {
        signOut(auth).then(() =>{
            setFlashMessage('signed out');
            //reset global
            setIsAuthenticated(false);
            console.log('signed out!');
            
        })
    }
//generate post slug
const getNewSlugFromTitle = title => {
    return encodeURIComponent(title.toLowerCase().split(' ').join('-'));
}
 //get posts
 const getPosts = postRef => {
    //query to database
    get(child(postRef, 'posts')).then(snapshot => {
        //make sure there are posts
        if (snapshot.exists()) {
            //create object of objects
            const posts = snapshot.val();
            //initialize array to loop over
            const newStatePosts= [];
            //push data into newState array
            for (let post in posts) {
                newStatePosts.push({
                    key: post,
                    slug: posts[post].slug,
                    title: posts[post].title,
                    content: posts[post].content
                });
            }
            setPosts(newStatePosts);
        } else {
            console.log('no data');
        }
    });
}
//create new post
const addNewPost = post => {
    //
    const postRef = ref(database, 'posts');
    const newPostRef = push(postRef);

    set(newPostRef, {
        title: post.title,
        content: post.content,
        slug: getNewSlugFromTitle(post.title)
    });
    setFlashMessage('saved');
    //when new post is added, we get a 404 page
    getPosts(ref(database));
 }
//update post
 const updatePost = (post) => {
    //find the post you are updating
    const postRef = ref(database, 'posts/' + post.key);
    //update the content
    update(postRef, {
        slug: getNewSlugFromTitle(post.title),
       title: post.title,
        content: post.content
    });
        
    setFlashMessage('updated');
    //get new post slug
    post.slug = getNewSlugFromTitle(post.title);
    //find the index of the post
    const index = posts.findIndex((p) => p.id === post.id);
    //remove the old version
    const oldPosts = posts.slice(0, index).concat(posts.slice(index + 1));
    //update the posts array
    const updatedPosts = [...oldPosts, post].sort((a, b) => a.id - b.id);
    setPosts(updatedPosts);
    setFlashMessage(`updated`); 
   //when a post has been updated we get a 404 page
};
    //delete post
    const deletePost = post => {
        //confirm box for delete
        if (window.confirm('Delete this post?')) {
            //find post with key
            const postRef = ref(database, 'posts/' + post.key);
            //remove from database
            remove(postRef);
            //refresh blog posts
            getPosts(ref(database));
            //notify user they deleted a post
            setFlashMessage(`deleted`);

        }
    }
    //to run on load
    useEffect(() => {
        //get posts from database
        getPosts(ref(database));
    }, [])
    return (
        <Router>
            <div className='App'>
                <Header 
                //passing the global isAuthenticated
                isAuthenticated={isAuthenticated}
                onLogout={onLogout} />
                <Widget database={database} set={set}  databaseRef={ref} get={get}/>
                {message && <Message type={message} />}
                {/* routes in app */}
                <Routes>
                    {/* home */}
                    <Route exact path='/weather-thought' element={<Posts
                        isAuthenticated={isAuthenticated}
                        posts={posts}
                        deletePost={deletePost} 
                        />}
                     />
                     {/* single post */}
                    <Route path='/post/:postSlug' element={<Post posts={posts} />}/>
                    {/* add post */}
                    <Route path='/new' element={<PostForm addNewPost={addNewPost} post={{id: null, slug: '', title: '', content: ''}} />} />
                    {/* edit post */}
                    <Route path='/edit/:postSlug' element={<EditPostForm posts={posts} updatePost={updatePost} />} />
                    {/* login */}
                                        <Route exact path='/login' element={<Login onLogin={(email, password) => onLogin(email, password)} />} />
                    {/* 404 page */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

const EditPostForm = ({posts, updatePost}) => {
    const { postSlug } = useParams();
    const post = posts.find((post) => post.slug === postSlug);

    if(!post) {
        return <NotFound />
    }

    return <PostForm updatePost={updatePost} post={post} />;
}

export default App;