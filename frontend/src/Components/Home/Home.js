import React from 'react';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext';
import CreatePost from '../CreatePost/CreatePost';

// Import CSS
import '../Post/Posts.scss';
import '../Home/Home.scss';

// Import Icons
import HeartIcon from '@mui/icons-material/Favorite';
import profileImg from '../../Images/aribellogo.png';

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
        <div className='home-left'>
            <h2>Home</h2>
            <CreatePost listOfPosts={listOfPosts} setListOfPosts={setListOfPosts}/>
            <div className='list-of-posts'>
                {listOfPosts.map((post, index) => {
                    return (
                        <div className='post' key={index}> 
                            <div className='post-header'> 
                                <Link to={`/profile/${post.UserId}`}>
                                    <img className='profile-img' src={profileImg} alt='profile-img'></img>
                                </Link>
                            </div>
                            <div className='post-body'> 
                                <div className='post-body-top'> 
                                    <h3 className='username'> {post.username}</h3>
                                    <h3 className='timestamp'> • {post.createdAt}</h3>
                                </div>
                                <div className='post-body-center' onClick={() => navigate(`/post/${post.id}`)}>
                                    <h4>{post.title}</h4>
                                    <h5>{post.postText}</h5>
                                </div>

                                <div className='post-footer'> 
                                    <HeartIcon 
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
        </div>
        <div className='home-right'>
            Will fill later
         </div>
    </div>
    );
}

export default Home;