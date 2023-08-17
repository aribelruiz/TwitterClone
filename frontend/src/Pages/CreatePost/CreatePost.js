import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import './CreatePost.scss';

function CreatePost() {
  
  const inititalValues = {
    title: "",
    postText: "",
    username: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a title"),
    postText: Yup.string().required(),
    username: Yup.string().min(3).max(15).required(),

  });
  
  const onSubmit = (data) => {
    axios.post("http://localhost:8080/posts", data).then((res) => {
      console.log("It worked!");
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
               
                <label> Username </label>
                <ErrorMessage name='username' component='span'/>
                <Field id='inputCreatePost' name='username' placeholder="(Ex. user123...)"/>

                <button type='submit'> Create Post </button>
            </Form>
        </Formik>
    </div>
  );
}

export default CreatePost;