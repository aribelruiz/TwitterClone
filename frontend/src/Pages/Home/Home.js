import React from 'react';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext';

// Import CSS
import '../Post/Posts.scss'

// Import Icons
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function Home() {

    let navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {

        if(!localStorage.getItem("accessToken")) {
            navigate('/login');
        } else {
            axios.get(
                "http://localhost:8080/posts",
                { headers: {accessToken: localStorage.getItem("accessToken")} }
            ).then((res) => {
            setListOfPosts(res.data.listOfPosts);
            setLikedPosts(res.data.likedPosts.map((like) => {
                return like.PostId;
            }));
        });
        }
        // eslint-disable-next-line
    }, []);

    const likePost = (postId) => {
        axios.post(
            "http://localhost:8080/likes", 
            { PostId: postId },
            { headers: {accessToken: localStorage.getItem("accessToken")} } 
        ).then((res) => {

            // Only allow logged in users to like post
            if (authState.status) {
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
                }));

                // Updates user liked posts 
                if(likedPosts.includes(postId)) {
                    setLikedPosts(
                        likedPosts.filter((id) => {
                            return id !== postId;
                        })
                    );
                } else {
                    setLikedPosts([...likedPosts, postId]);
                }

            } else {
                alert('Must login to like a post');
            }
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
                        <div className='post-footer-left'>
                            {post.username} 
                        </div>
                        <div className='post-footer-right'>
                            <ThumbUpIcon 
                                className={likedPosts.includes(post.id)? 'liked-btn' : 'unliked-btn'} 
                                onClick={() => {likePost(post.id)}}
                            />
                            <label> {post.Likes.length} </label>
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
    );
}

export default Home;