import { useRouter } from 'next/router'
import React, { useEffect, useState, useContext } from "react";
import Head from 'next/head';
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import parse from 'html-react-parser'
import { Context } from "../../context";
import 'dotenv/config';

const pageIndex = () => {
   const {
      state: { user },
   } = useContext(Context);
   const firstState = {
      texts: [],
      questions: [],
      choices: [],
      score: -1
   }
   const router = useRouter();
   const id = router.query.id;
   const [data, setData] = useState(firstState);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      const getData = async () => {
         if (id) {
            const data = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/scoring/reading/${id}`)).data.data;
            // console.log("FULL:", data);
            const r = data.readingID;
            const texts = []
            const questions = []
            for (let i = 0; i < r.length; i++) {
               texts.push(r[i].text);
               const tmp = []
               for (let j = 0; j < r[i].questions.length; j++) {
                  const q = r[i].questions[j];
                  const tmp1 = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/choice-questions/${q}`)).data.data;
                  tmp.push(tmp1);
               }
               questions.push(tmp);
            }
            setData({
               texts: texts,
               questions: questions,
               choices: data.choices,
               score: data.score
            })
            setLoading(false)
         }
      }
      if (user) {
         const email = String(user.data.email);
         if (!email.endsWith('@hust.edu.vn')) {
            router.push('/errors/404')
         } else {
            getData()
         }
      }
   }, [id, user])
   return <>
      <Head>
         <title>Reading scoring</title>
      </Head>
      <h1 className="jumbotron text-center square">Reading scoring</h1>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         {loading && <SyncOutlined spin
            className="d-flex justify-content-center display-1 text-danger p-5"
         />}
         {!loading && <div
            style={{ display: "flex", flexDirection: 'column', width: '834px', margin: '0 auto' }}>
            {data.texts.map((text, i) => <>
               <h5>PASSAGE {i + 1} - Questions {10 * i + 1}-{10 * i + 10}</h5>
               <div style={{ width: '100%', fontSize: '16px' }}>
                  {parse(text.replace(/\n/g, "<br>"))}<br /><br />
                  {data.questions[i].map((q, j) => <div>
                     <h5>{`${10 * i + j + 1}. ${q.question}`}</h5>
                     {q.answers.map(answer => <div>
                        <input disabled type="radio" name={`reading_${10 * i + j}`} value={answer}
                           checked={data.choices[10 * i + j] == answer} />&nbsp;{answer}&nbsp;
                        {answer == q.correct ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#84cc16" fill-rule="evenodd" stroke="#84cc16" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" clip-rule="evenodd" /></svg> :
                           <svg fill="#ff0000" height="16" width="16" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 208.891 208.891" xmlSpace="preserve" stroke="#ff0000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0,170l65.555-65.555L0,38.891L38.891,0l65.555,65.555L170,0l38.891,38.891l-65.555,65.555L208.891,170L170,208.891 l-65.555-65.555l-65.555,65.555L0,170z"></path> </g></svg>
                        }
                        <br /><br />
                     </div>)}
                  </div>)}
               </div></>
            )}
            <p>Scoring:</p>
            <input defaultValue={data.score} disabled></input>
            <br /><a href='/scoring'>Quay trở về</a>
         </div>}
      </div>
   </>
}
export default pageIndex;