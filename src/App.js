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
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setFlashMessage = message => {
        setMessage(message);
        setTimeout(() => {
            setMessage(null);
        }, 1600);
    }

    const onLogin = async (email, password) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            if(user) {
                setFlashMessage('signed in');
                setIsAuthenticated(true);
                //set navigation back to home page
            } else {
                console.log('no user')
                setFlashMessage('invalid email or password');
                setIsAuthenticated(false);
            }

        } catch (error) {
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

    const onLogout = () => {
        signOut(auth).then(() =>{
            setFlashMessage('signed out');
            setIsAuthenticated(false);
            console.log('signed out!');
        })
    }

const getNewSlugFromTitle = title => {
    return encodeURIComponent(title.toLowerCase().split(' ').join('-'));
}
    const addNewPost = post => {
        const postRef = ref(database, 'posts');
        const newPostRef = push(postRef);

        set(newPostRef, {
            title: post.title,
            content: post.content,
           slug: getNewSlugFromTitle(post.title)
        });
        setFlashMessage('saved');
    }
    const updatePost = (post) => {
        const postRef = ref(database, 'posts/' + post.key);
        update(postRef, {
            slug: getNewSlugFromTitle(post.title),
            title: post.title,
            content: post.content
        });
        
        setFlashMessage('updated');
        post.slug = getNewSlugFromTitle(post.title);
        const index = posts.findIndex((p) => p.id === post.id);
        const oldPosts = posts.slice(0, index).concat(posts.slice(index + 1));
        const updatedPosts = [...oldPosts, post].sort((a, b) => a.id - b.id);
        setPosts(updatedPosts);
        setFlashMessage(`updated`); 
    };
    const deletePost = post => {
        if (window.confirm('Delete this post?')) {
            const postRef = ref(database, 'posts/' + post.key);
            remove(postRef);
            setFlashMessage(`deleted`);
        }
    }
    useEffect(() => {
        const postRef = ref(database);
        get(child(postRef, 'posts')).then(snapshot => {
            if (snapshot.exists()) {
                const posts = snapshot.val();
                const newStatePosts= [];
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
    }, [database, ref])
    return (
        <Router>
            <div className='App'>
                <Header 
                isAuthenticated={isAuthenticated}
                onLogout={onLogout} />
                {message && <Message type={message} />}
                <Widget database={database} set={set}  databaseRef={ref} get={get} child={child}/>
                <Routes>
                    <Route exact path='/weather-thought' element={<Posts
                        isAuthenticated={isAuthenticated}
                        posts={posts}
                        deletePost={deletePost} 
                        />}
                     />
                    <Route path='/post/:postSlug' element={<Post posts={posts} />}/>
                    <Route path='/new' element={<PostForm addNewPost={addNewPost} post={{id: null, slug: '', title: '', content: ''}} />} />
                    <Route path='/edit/:postSlug' element={<EditPostForm posts={posts} updatePost={updatePost} />} />
                    <Route path='*' element={<NotFound />} />
                    <Route exact path='/login' element={<Login onLogin={(email, password) => onLogin(email, password)} />} />
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