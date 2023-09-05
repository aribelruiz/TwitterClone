import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import CSS
import '../Post/Posts.scss'
function Home() {

    let navigate = useNavigate();
    const [listOfPosts, setListOfPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/posts").then((res) => {
            setListOfPosts(res.data);
        });
    }, []);

    const likePost = (postId) => {
        axios.post(
            "http://localhost:8080/likes", 
            { PostId: postId },
            { headers: {accessToken: localStorage.getItem("accessToken")} } 
        ).then((res) => {
            setListOfPosts(listOfPosts.map((post) => {

                // Update like for post
                if (post.id === postId) {
                    if (res.data.liked) {
                        // Add element to post.Likes so that length is incremented
                        return {...post, Likes: [...post.Likes, 1]};
                    }
                    else {
                        // Remove element from post.Likes to update length
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray};
                    }
                }
                else {
                    return post;
                }
            }))
        })
    };

    return (
    <div className='home'>
        {listOfPosts.map((post, index) => {
            return (
                <div className='post' key={index}> 
                    <div className='post-header'> {post.title} </div>
                    <div className='post-body' onClick={() => navigate(`/post/${post.id}`)}> {post.postText} </div> 
                    <div className='post-footer'> 
                        {post.username} 
                        <button className='like-btn' onClick={() => {likePost(post.id)}}>Like</button>
                        <label> {post.Likes.length} </label>
                    </div>
                </div>
            );
        })}
    </div>
    );
}

export default Home;