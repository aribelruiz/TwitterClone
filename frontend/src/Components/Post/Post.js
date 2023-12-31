import { React, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext';

import './Posts.scss';
function Post() {

    let {id} = useParams();
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    const [postObj, setPostObj] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [errorMessage, SetErrorMessage] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8080/posts/postById/${id}`).then((res) => {
            setPostObj(res.data);
        });

        axios.get(`http://localhost:8080/comments/${id}`).then((res) => {
            setComments(res.data);
        });
    }, [id]);

    const addComment = () => {
        axios.post(
            "http://localhost:8080/comments", 
            { commentBody: newComment, PostId: id },
            { headers: { accessToken: localStorage.getItem("accessToken")} }
        ).then((res) => {

            if (res.data.error) {
                SetErrorMessage(res.data.error);
            }
            else {
                const commentToAdd = {commentBody: res.data.commentBody, username: res.data.username, id: res.data.id};
                setComments([...comments, commentToAdd]);
    
                setNewComment("");
                SetErrorMessage("");
            }
        });
    };

    const deleteComment = (id) => {
        axios.delete(
            `http://localhost:8080/comments/${id}`, 
            { headers: { accessToken: localStorage.getItem("accessToken") }}
        ).then(() => {
            setComments(
                comments.filter((val) => {
                    return val.id !== id;
                })
            );
        });
    };

    const deletePost = (id) => {
        axios.delete(
            `http://localhost:8080/posts/${id}`, 
            { headers: { accessToken: localStorage.getItem("accessToken") }}
        ).then(() => {
            navigate('/');
        });
    };

    const editPost = (option) => {
        if (option === 'title') {
            let newTitle = prompt("Enter new title: ");

            if (newTitle === "") {
                // do nothing, title can not be empty string
            }
            else if (newTitle) {
                axios.put(`http://localhost:8080/posts/editTitle`, 
                    {newTitle: newTitle, id: id},
                    { headers: { accessToken: localStorage.getItem("accessToken") }}
                ).then((res) => {
                    setPostObj({...postObj, title: newTitle});
                })
            }

        }
        else {
            let newPostText = prompt("Enter new text: ");

            if (newPostText === "") {
                // do nothing, post text can not be empty string
            }
            else if (newPostText) {
                axios.put(`http://localhost:8080/posts/editPostText`, 
                    {newText: newPostText, id: id},
                    { headers: { accessToken: localStorage.getItem("accessToken") }}
                ).then((res) => {
                    setPostObj({...postObj, postText: newPostText});
                })
            }

        }
    }

    return (
        <div className='post-page'>
            <div className='post'> 
                <div className={(authState.username === postObj.username)? 'post-header post-editable' : 'post-header'} onClick={() => {
                    if(authState.username === postObj.username) {
                        editPost('title');
                    }
                }}> 
                    {postObj.title} 
                </div>
                <div className={(authState.username === postObj.username)? 'post-body post-editable' : 'post-body'}  onClick={() => {
                    if(authState.username === postObj.username) {
                        editPost('body');
                    }
                }}>
                    {postObj.postText} 
                </div> 
                <div className='post-footer'>
                    {postObj.username}
                    { authState.username === postObj.username && (
                        <button onClick={() => {deletePost(postObj.id)}}>Delete Post</button>
                    )} 
                </div>
            </div>
            <div className='post-comments'>
                <div className='comments'> 
                    <div className='comment-input'>
                        <div className='comment-input-boxes'>
                            <input type='text' placeholder='Comment...' autoComplete='off' value={newComment} onChange={(e) => {setNewComment(e.target.value)}}/>
                            <button type='submit' onClick={addComment}> Add Comment </button>
                        </div>
                        <span>{errorMessage}</span>
                    </div>
                    <div className='comment-list'>
                        { comments.map((comment, index) => {
                            return (
                                <div key={index} className='comment'> 
                                    {authState.username === comment.username && <button className='delete-btn' onClick={() => {deleteComment(comment.id)}}>X Delete</button>}
                                    <p>{comment.commentBody}</p>
                                    <label>@ {comment.username}</label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;