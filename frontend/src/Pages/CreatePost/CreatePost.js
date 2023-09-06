import { React, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../helpers/AuthContext';

import './CreatePost.scss';

function CreatePost() {
  
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const inititalValues = {
    title: "",
    postText: "",
    username: "",
  };

  useEffect(() => {
    if(!authState.status) {
      navigate('/');
    }
    //eslint-disable-next-line
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a title"),
    postText: Yup.string().required(),
    username: Yup.string().min(3).max(15).required(),

  });
  
  const onSubmit = (data) => {
    axios.post("http://localhost:8080/posts", data).then((res) => {
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