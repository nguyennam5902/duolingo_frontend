import styles from './Course.module.css';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import 'dotenv/config';
import { useRouter } from 'next/router'

const Courses = () => {
   const [courses, setCourses] = useState([]);
   const [loading, setLoading] = useState(true);
   const { push } = useRouter();
   useEffect(() => {
      const isLogin = window.localStorage.getItem('user');
      if (isLogin == null) {
         push('/login');
      }
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`)
         .then((response) => {
            setCourses(response.data.data);
            setLoading(false);
         })
         .catch((error) => {
            console.error('Error fetching courses:', error);
            setLoading(false);
         });
   }, []);

   if (loading) {
      return <div className={styles.loadingSpinner}></div>;
   }

   return <>
      <Head>
         <title>Courses</title>
      </Head>
      <h1 className="jumbotron text-center bg-primary square">
         Online Learning English: Courses
      </h1>
      {courses.length > 0 ? (
         courses.map(course =>
            <a href={`/courses/${course.courseID}`} style={{
               color: 'white',
            }}><div className={styles.courseBox} key={course.courseID}
               style={{
                  background: '#89E219',
                  fontSize: '25px',
               }}>
                  <b>{course.title}</b>
               </div>
            </a>
         )) : (<p>No courses available.</p>)}
   </>
};

export default Courses;
