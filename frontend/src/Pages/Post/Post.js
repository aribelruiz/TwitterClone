import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './Posts.scss';
function Post() {

    let {id} = useParams();
    const [postObj, setPostObj] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8080/posts/postById/${id}`).then((res) => {
            setPostObj(res.data);
        });
    }, [id]);

    return (
        <div className='post-page'>
            <div className='post'> 
                <div className='post-header'> {postObj.title} </div>
                <div className='post-body'> {postObj.postText} </div> 
                <div className='post-footer'> {postObj.username} </div>
            </div>
            <div className='post-comments'>
                <div className='comments'> 
                    <h4> Comments </h4>
                </div>
            </div>
        </div>
    );
}

export default Post;