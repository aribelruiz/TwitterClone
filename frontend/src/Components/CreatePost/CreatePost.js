import { React, useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../helpers/AuthContext';


import './CreatePost.scss';
import profileImg from '../../Images/aribellogo.png';

function CreatePost({listOfPosts, setListOfPosts}) {
  
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const inititalValues = {
    title: "",
    postText: "",
  };

  const emptyPost = {
    title: "",
    postText: "",
    username: authState.username,
  };

  let [post, setPost] = useState(emptyPost);


  useEffect(() => {
    if(!localStorage.getItem("accessToken")) {
      navigate('/');
    }
    //eslint-disable-next-line
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a title"),
    postText: Yup.string().required(),
  });
  
  const onSubmit = (data) => {
    axios.post(
      "http://localhost:8080/posts", 
      data,
      { headers: {accessToken: localStorage.getItem('accessToken')} },
    ).then((res) => {
      navigate(`/`);
    });
  }

  return (
    <div className='create-post'>
      <div className='post-pfp'>
        <Link to={`/profile/${authState.id}`}>
          <img className='profile-img' src={profileImg} alt='profile-img'></img>
        </Link>
      </div>
        <Formik initialValues={inititalValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className='post-form'>
                {/* <label> Title </label> */}
                <Field id='inputCreatePost' name='title' placeholder="Enter a title..." autoComplete="off"/>
                <ErrorMessage name='title' component='span'/>

                {/* <label> Post </label> */}
                <Field id='inputCreatePost' name='postText' placeholder="What is happening?!" autoComplete="off"/>
                <ErrorMessage name='postText' component='span'/>
                
                <button type='submit'> Post </button>
            </Form>
        </Formik>
    </div>
  );
}

export default CreatePost;