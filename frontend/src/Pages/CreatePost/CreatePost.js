import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import './CreatePost.scss';

function CreatePost() {
  
  let navigate = useNavigate();

  const inititalValues = {
    title: "",
    postText: "",
  };

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
        <Formik initialValues={inititalValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className='post-form'>
                <label> Title </label>
                <ErrorMessage name='title' component='span'/>
                <Field id='inputCreatePost' name='title' placeholder="(Ex. Title...)"/>
                
                <label> Post </label>
                <ErrorMessage name='postText' component='span'/>
                <Field id='inputCreatePost' name='postText' placeholder="(Ex. Post Text...)"/>
                
                <button type='submit'> Create Post </button>
            </Form>
        </Formik>
    </div>
  );
}

export default CreatePost;