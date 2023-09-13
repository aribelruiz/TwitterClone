import React, {useEffect, useState, useContext} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';

// Import CSS
import './Profile.scss';

// Import Icons
import HeartIcon from '@mui/icons-material/Favorite';
import profileImg from '../../Images/aribellogo.png';

function Profile() {

    let { id } = useParams();
    let navigate = useNavigate();

    const { authState } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        // Get user info to display on profile
        axios.get(`http://localhost:8080/auth/userinfo/${id}`).then((res) => {
            setUsername(res.data.username);
        });

        // // Getting all user posts
        axios.get(`http://localhost:8080/posts/postsByUser/${id}`).then((res) => {
            setUserPosts(res.data.userPosts);
        }); 

        // Getting user liked Posts if user logged in
        if (localStorage.getItem('accessToken')) {
            axios.get(
                "http://localhost:8080/posts",
                { headers: {accessToken: localStorage.getItem("accessToken")} }
            ).then((res) => {
                setLikedPosts(res.data.likedPosts.map((like) => {
                    return like.PostId;
                }));
            });
        }

        // eslint-disable-next-line
    }, []);

    // Lets user like posts from profile page 
    const likePost = (postId) => {
        axios.post(
            "http://localhost:8080/likes", 
            { PostId: postId },
            { headers: {accessToken: localStorage.getItem("accessToken")} } 
        ).then((res) => {

            // Only allow logged in users to like post
            if (authState.status) {
                setUserPosts(userPosts.map((post) => {

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
    <div className='profile-page'>
        <div className='profile-info'>
            <h1>Username: {username}</h1>
            { (authState.username === username) && 
                <button onClick={() => {navigate('/edit-profile')}}> Edit Profile </button>
            }   
        </div>
        <div className='list-of-posts'>
            {(userPosts.length > 0)? 
                userPosts.map((post, index) => {
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
                }) : (
                    <div> 
                        <h3>User has no posts yet.</h3>
                    </div>
                )
            }
     
        </div>
    </div>
    );
}

export default Profile;