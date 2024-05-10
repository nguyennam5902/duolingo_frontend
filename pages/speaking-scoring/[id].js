import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from "react";
import Head from 'next/head';
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import parse from 'html-react-parser'
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import { Context } from "../../context";
import { toast } from "react-toastify";

const pageIndex = () => {
   const {
      state: { user },
   } = useContext(Context);
   const firstState = {
      userID: "",
      parts: [],
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
            const data = (await axios.get(`/api/scoring/speaking/${id}`)).data.data;
            setData({
               userID: data.userID,
               parts: data.speakingID,
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
         <title>Speaking scoring</title>
      </Head>
      <h1 className="jumbotron text-center square">Speaking scoring</h1>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         {loading && <SyncOutlined spin
            className="d-flex justify-content-center display-1 text-danger p-5"
         />}
         {!loading && <div style={{
            width: '55%',
            fontSize: '16px'
         }}>
            <AudioPlayer
               src={`/api/speaking/answers/${id}`}
               style={{
                  width: '100%'
               }}
               header={<h3 style={{ color: 'white' }}>Student audio</h3>}
            />
            {data.parts.length != 0 && <div>
               <h5>Part 1: Social Interaction (3')</h5>
               {parse(data.parts[0].text.replace(/\n/g, "<br>"))}<br /><br />
               <h5>Part 2: Solution Discussion (4')</h5>
               {parse(data.parts[1].text.replace(/\n/g, "<br>"))}<br /><br />
               <h5>Part 3: Topic Development (5')</h5>
               {parse(data.parts[2].text.replace(/\n/g, "<br>"))}<br /><br />
            </div>}
            <p>Scoring:</p>
            <input defaultValue={data.score != -1 ? data.score : 0} disabled={data.score != -1}
               type='number' max={10} min={0} onChange={(e) => setScore(e.target.value)} ></input>
            {data.score == -1 && <button disabled={!score || data.score != -1} onClick={(e) => {
               e.target.disabled = true;
               axios.post('/api/scoring/speaking/', {
                  id: id,
                  score: score
               })
               toast.success('Đã chấm xong!')
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