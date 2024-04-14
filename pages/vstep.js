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
   const listenID = `65f6bbb28050d4be7b59f2e3`
   const readingID = `65fd9077b48b9d6f6bc117f3`

   const firstState = {
      filename: "",
      listenQuestions: [],
      readingData: {},
   }
   const [current, setCurrent] = useState(0);
   const [data, setData] = useState(firstState);
   const [listenChoice, setListenChoice] = useState([]);
   const [readingChoice, setReadingChoice] = useState([]);
   const [writingAnswer, setWritingAnswer] = useState("");
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         const listenData = (await axios.get(`/api/listen/${listenID}`)).data;
         const readingData = (await axios.get(`/api/reading/${readingID}`)).data;

         console.log("reading:", readingData.data.questions);
         setData({
            filename: listenData.filename,
            listenQuestions: listenData.questions,
            readingData: readingData.data
         })
         setListenChoice(Array(listenData.questions.length).fill(""))
         setReadingChoice(Array(readingData.data.questions.length).fill(""))
         setLoading(false);
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
                                    const tmp = [...listenChoice.slice(0, index), answer, ...listenChoice.slice(index + 1)]
                                    // console.log(tmp);
                                    setListenChoice(tmp)
                                 }} checked={listenChoice[index] == answer} />&nbsp;{answer}<br /><br />
                              </div>
                           })}
                        </div>
                     })}
                     <button onClick={() => {
                        let allAnswer = true;
                        let correctCount = 0;
                        for (let i = 0; i < listenChoice.length; i++) {
                           if (listenChoice[i] == "") {
                              allAnswer = false;
                              break;
                           }
                           if (listenChoice[i] == data.listenQuestions[i].correct) {
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
                     <h5>PASSAGE 1 - Questions 1-10</h5>
                     <div style={{ width: '100%', fontSize: '16px' }}>
                        {parse(data.readingData.text.replace(/\n/g, "<br>"))}<br /><br />
                        {data.readingData.questions.map((q, index) => {
                           return <div>
                              <p>{`${index + 1}. ${q.question}`}</p>
                              {q.answers.map(answer => {
                                 return <div>
                                    <input type="radio" name={`reading_${index}`} value={answer} onClick={() => {
                                       const tmp = [...readingChoice.slice(0, index), answer, ...readingChoice.slice(index + 1)]
                                       setReadingChoice(tmp)
                                    }} checked={readingChoice[index] == answer} />&nbsp;{answer}<br /><br />
                                 </div>
                              })}
                           </div>
                        })}
                     </div>
                     <button onClick={() => {
                        let allAnswer = true;
                        let correctCount = 0;
                        for (let i = 0; i < readingChoice.length; i++) {
                           if (readingChoice[i] == "") {
                              allAnswer = false;
                              break;
                           }
                           if (readingChoice[i] == data.readingData.questions[i].correct) {
                              correctCount++;
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
                     <WritingIndex text={writingAnswer} onChange={(e) => {
                        setWritingAnswer(e.target.value);
                     }} />
                     <button onClick={(event) => {
                        if (!writingAnswer || !writingAnswer.trim()) {
                           event.preventDefault();
                           toast.error("Vui lòng nhập câu trả lời!");
                           return false;
                        }
                        setCurrent(current + 1)
                     }}>Submit</button>
                  </>}
                  {current == 3 && <AudioRecorder listeningChoices={listenChoice}
                     readingChoices={readingChoice} writingAnswer={writingAnswer} />}
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