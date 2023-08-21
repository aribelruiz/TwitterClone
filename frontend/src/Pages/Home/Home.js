import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import CSS
import '../Post/Posts.scss'
function Home() {

    const [listOfPosts, setListOfPosts] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/posts").then((res) => {
            setListOfPosts(res.data);
        });
    }, []);

    return (
    <div className='home'>
        {listOfPosts.map((post, index) => {
            return (
                <div className='post' key={index} onClick={() => navigate(`/post/${post.id}`)}> 
                    <div className='post-header'> {post.title} </div>
                    <div className='post-body'> {post.postText} </div> 
                    <div className='post-footer'> {post.username} </div>
                </div>
            );
        })}
    </div>
    );
}

export default Home;