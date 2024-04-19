import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Head from 'next/head';
import { toast } from "react-toastify";
import { SyncOutlined } from '@ant-design/icons'
import parse from 'html-react-parser'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Context } from "../context";
import AudioRecorder from "../components/RecorderComponent";
import WritingIndex from "../components/WritingComponent";

const vstepIndex = () => {
   const {
      state: { user },
   } = useContext(Context);
   const firstState = {
      filename: "",
      listenQuestions: [],
      readingData: [],
      writingData: [],
      speakingData: []
   }
   const [current, setCurrent] = useState(0);
   const [data, setData] = useState(firstState);
   const [listenChoices, setListenChoices] = useState([]);
   const [readingChoices, setReadingChoices] = useState([]);
   const [writingAnswers, setWritingAnswer] = useState(["", ""]);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      const getData = async () => {
         if (user) {
            setLoading(true);
            const listenData = (await axios.get(`/api/listen/`)).data;
            const readingData = (await axios.get(`/api/reading/`)).data;
            const task = (await axios.get(`/api/tasks/`)).data;
            const speakingData = (await axios.get(`/api/speaking/`)).data;
            let readingLength = 0;
            readingData.data.map(r => readingLength += r.questions.length)
            // console.log("reading:", readingData.data.questions);
            setData({
               filename: listenData.filename,
               listenQuestions: listenData.data.questions,
               readingData: readingData.data,
               writingData: task.data,
               speakingData: speakingData
            })
            setListenChoices(Array(listenData.data.questions.length).fill(""))
            setReadingChoices(Array(readingLength).fill(""))
            setLoading(false);
            console.log("TEST:", listenData);
         }
      }
      getData()
   }, [user]);
   return <>
      <Head>
         <title>VSTEP Practice Test</title>
      </Head>
      <h1 className="jumbotron text-center square">VSTEP Practice Test</h1>
      <div className="container-fluid">
         <div className="row">
            <div className="col-md-2">
               <div className="nav flex-column nav-pills">
                  <button className={`nav-link ${current == 0 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(0)}>
                     Listening
                  </button>
                  <br />
                  <button className={`nav-link ${current == 1 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(1)}>
                     Reading
                  </button>
                  <br />
                  <button className={`nav-link ${current == 2 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(2)}>
                     Writing
                  </button>
                  <br />
                  <button className={`nav-link ${current == 3 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(3)}>
                     Speaking
                  </button>
               </div>
            </div>
            <div className="col-md-8">
               {loading ? <SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5" /> : <div
                  style={{ display: "flex", flexDirection: 'column', width: '834px', margin: '0 auto' }}>
                  {current == 0 && <>
                     <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                        <h3>PHẦN 1: NGHE HIỂU - VSTEP LISTENING</h3>
                        <h5>Thời gian: Khoảng 40 phút</h5>
                        <h5>Số câu hỏi: 35</h5>
                     </div>
                     <AudioPlayer
                        src={`/api/audio/${data.filename}`}
                        onPlay={_e => console.log("onPlay")}
                        style={{
                           width: '100%'
                        }}
                        showJumpControls={false}
                        header={<h3 style={{ color: 'white' }}>Part 1</h3>}
                     />
                     <h5>PART 1 - Questions 1-8</h5>
                     {data.listenQuestions.map((question, index) => {
                        return <div>
                           <p>{`${index + 1}. `}{question.question}</p>
                           {question.answers.map(answer => {
                              return <div>
                                 <input type="radio" name={`listen_${index}`} value={answer} onClick={() => {
                                    const tmp = [...listenChoices.slice(0, index), answer, ...listenChoices.slice(index + 1)]
                                    // console.log(tmp);
                                    setListenChoices(tmp)
                                 }} checked={listenChoices[index] == answer} />&nbsp;{answer}<br /><br />
                              </div>
                           })}

                        </div>
                     })}
                     <button onClick={() => {
                        let allAnswer = true;
                        let correctCount = 0;
                        for (let i = 0; i < listenChoices.length; i++) {
                           if (listenChoices[i] == "") {
                              allAnswer = false;
                              break;
                           }
                           if (listenChoices[i] == data.listenQuestions[i].correct) {
                              correctCount++;
                           }
                        }
                        if (allAnswer) {
                           setCurrent(current + 1);
                        } else {
                           toast.error(`Hãy trả lời tất cả câu hỏi`)
                        }
                     }}>Submit</button>
                  </>}
                  {current == 1 && <>
                     <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                        <h3>PHẦN 2: ĐỌC HIỂU - VSTEP READING</h3>
                        <h5>Thời gian: 60 phút</h5>
                        <h5>Số câu hỏi: 40</h5>
                     </div>
                     {data.readingData.map((reading, index) => {
                        return <>
                           <h5>PASSAGE {index + 1} - Questions {10 * index + 1}-{10 * index + 10}</h5>
                           <div style={{ width: '100%', fontSize: '16px' }}>
                              {parse(reading.text.replace(/\n/g, "<br>"))}<br /><br />
                              {reading.questions.map((q, questionIndex) => {
                                 return <div>
                                    <p>{`${10 * index + questionIndex + 1}. ${q.question}`}</p>
                                    {q.answers.map(answer => {
                                       return <div>
                                          <input type="radio" name={`reading_${10 * index + questionIndex}`} value={answer} onClick={() => {
                                             const tmp = [...readingChoices.slice(0, 10 * index + questionIndex), answer, ...readingChoices.slice(10 * index + questionIndex + 1)]
                                             setReadingChoices(tmp)
                                          }} checked={readingChoices[10 * index + questionIndex] == answer} />&nbsp;{answer}<br /><br />
                                       </div>
                                    })}
                                 </div>
                              })}
                           </div>
                        </>
                     })}
                     <button onClick={() => {
                        let allAnswer = true;
                        let correctCount = 0;
                        for (let i = 0; i < data.readingData.length; i++) {
                           const questions = data.readingData[i].questions;
                           for (let j = 0; j < 10; j++) {
                              if (readingChoices[10 * i + j] == "") {
                                 allAnswer = false;
                                 break;
                              }
                              if (readingChoices[10 * i + j] == questions[j].correct) {
                                 correctCount++;
                              }
                           }
                        }
                        if (allAnswer) {
                           setCurrent(current + 1)
                        } else {
                           toast.error(`Hãy trả lời tất cả câu hỏi`)
                        }
                     }}>Submit</button>
                  </>}
                  {current == 2 && <>
                     <WritingIndex text={writingAnswers} onChange={(e, index) => {
                        if (index == 0) {
                           setWritingAnswer([e.target.value, writingAnswers[1]])
                        }
                        else {
                           setWritingAnswer([writingAnswers[0], e.target.value])
                        }
                     }} writingData={data.writingData} />
                     <button onClick={(event) => {
                        if (!writingAnswers[0] || !writingAnswers[0].trim() || !writingAnswers[1] || !writingAnswers[1].trim()) {
                           event.preventDefault();
                           toast.error("Vui lòng nhập câu trả lời!");
                           return false;
                        }
                        setCurrent(current + 1)
                     }}>Submit</button>
                  </>}
                  {current == 3 && <AudioRecorder speakingData={data.speakingData} user={user}
                     readingIDs={data.readingData.map(r => r._id)} listeningChoices={listenChoices}
                     readingChoices={readingChoices} writingData={data.writingData.map((obj, index) => {
                        return {
                           _id: obj._id,
                           answer: writingAnswers[index]
                        }
                     })} />}
               </div>}
            </div>
         </div>
      </div>
      <footer>
         <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
            <h1>This is the footer</h1>
            <h1>This is the footer</h1>
            <h1>This is the footer</h1>
         </div>
      </footer>
   </>
}
export default vstepIndex;