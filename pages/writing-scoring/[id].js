import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from "react";
import Head from 'next/head';
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import parse from 'html-react-parser'
import 'react-h5-audio-player/lib/styles.css';
import { Context } from "../../context";
import { toast } from "react-toastify";

const pageIndex = () => {
   const {
      state: { user },
   } = useContext(Context);

   const countWords = (input) => {
      const str = String(input).trim();
      const words = str.split(/\s+/);
      return str.length == 0 ? 0 : words.length;
   };

   const firstState = {
      userID: "",
      type: 0,
      text: "",
      answer: "",
      score: -1
   }
   const router = useRouter();
   const id = router.query.id;
   const [data, setData] = useState(firstState);
   const [score, setScore] = useState(0);
   const [loading, setLoading] = useState(true)
   useEffect(() => {
      const getData = async () => {
         if (id) {
            setLoading(true)
            const data = (await axios.get(`/api/scoring/writing/${id}`)).data.data;
            setData({
               userID: data.userID,
               type: data.taskID.type,
               text: data.taskID.text,
               answer: data.answer,
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
         <title>Writing scoring</title>
      </Head>
      <h1 className="jumbotron text-center square">Writing scoring</h1>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         {loading && <SyncOutlined spin
            className="d-flex justify-content-center display-1 text-danger p-5"
         />}
         {!loading && <div style={{
            width: '55%',
            fontSize: '16px'
         }}>
            <h5>Task {data.type}</h5>
            <p>{parse(data.text.replace(/\n/g, "<br>"))}</p>
            <h2>Student answer</h2>
            <textarea defaultValue={data.answer} disabled={true} style={{
               width: '100%'
            }}></textarea>
            <p>Number of words: {countWords(data.answer)}</p>
            <p>Scoring:</p>
            <input defaultValue={data.score != -1 ? data.score : 0} disabled={data.score != -1}
               type='number' max={10} min={0} onChange={(e) => setScore(e.target.value)} ></input>
            {data.score == -1 && <button disabled={!score || data.score != -1} onClick={async (e) => {
               e.target.disabled = true;
               axios.post('/api/scoring/writing/', {
                  id: id,
                  score: score
               })
               toast.success("Đã chấm xong!");
               router.push('/scoring')
            }}>
               Finish
            </button>}
            <br/><a href='/scoring'>Quay trở về</a>
         </div>}
      </div>
   </>
}
export default pageIndex;