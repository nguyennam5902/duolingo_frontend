import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from "react";
import Head from 'next/head';
import axios from "axios";
import AudioPlayer from 'react-h5-audio-player';
import { SyncOutlined } from '@ant-design/icons'
import parse from 'html-react-parser'
import AutoExpandingTextarea from '../../components/AutoExpandingTextarea';
import 'dotenv/config';

const countWords = (input) => {
   const str = String(input).trim();
   const words = str.split(/\s+/);
   return str.length == 0 ? 0 : words.length;
};

const pageIndex = () => {
   const firstState = {
      filename: "",
      listenQuestions: [],
      listenChoices: [],
      listenScore: -1,
      readingScore: -1,
      readingData: [],
      readingChoices: [],
      writingData: [],
      speakingAnswerFilename: "",
      speakingParts: [],
      speakingScore: -1
   }
   const router = useRouter();
   const id = router.query.id;
   const [current, setCurrent] = useState(0);
   const [loading, setLoading] = useState(true)
   const [data, setData] = useState(firstState)

   useEffect(() => {
      const getData = async () => {
         if (id) {
            setLoading(true)
            const data = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/test/${id}`)).data
            // console.log("DATA:", data.data);
            // TODO: FIX
            setData({
               filename: data.data.listeningAnswerID.listeningID.fileID,
               listenQuestions: data.data.listeningAnswerID.listeningID.questions,
               listenChoices: data.data.listeningAnswerID.choices,
               listenScore: data.data.listeningAnswerID.score,
               readingData: data.data.readingAnswerID.readingID,
               readingChoices: data.data.readingAnswerID.choices,
               readingScore: data.data.readingAnswerID.score,
               writingData: data.data.taskAnswerID,
               speakingAnswerFilename: data.data.speakingAnswerID.filename,
               speakingParts: data.data.speakingAnswerID.speakingID,
               speakingScore: data.data.speakingAnswerID.score
            })
            setLoading(false)
         }
      }
      getData()
   }, [id])
   return <>
      <Head>
         <title>Xem điểm thi VSTEP</title>
      </Head>
      <h1 className="jumbotron text-center square">Xem điểm thi VSTEP</h1>
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
                        src={`${process.env.NEXT_PUBLIC_API_URL}/audio/${data.filename}`}
                        style={{ width: '100%' }}
                        header={<h3 style={{ color: 'white' }}>Part 1</h3>}
                     />
                     <h5>PART 1 - Questions 1-8</h5>
                     {data.listenQuestions.slice(0, 8).map((question, index) => <div>
                        <h5 id={`listen_${index}`}>{`${index + 1}. `}{question.question}</h5>
                        {question.answers.map(answer => <div>
                           <input disabled type="radio" name={`listen_${index}`} value={answer} checked={data.listenChoices[index] == answer} />&nbsp;{answer}&nbsp;
                           {answer == question.correct ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#84cc16" fill-rule="evenodd" stroke="#84cc16" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" clip-rule="evenodd" /></svg> :
                              <svg fill="#ff0000" height="16" width="16" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 208.891 208.891" xmlSpace="preserve" stroke="#ff0000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0,170l65.555-65.555L0,38.891L38.891,0l65.555,65.555L170,0l38.891,38.891l-65.555,65.555L208.891,170L170,208.891 l-65.555-65.555l-65.555,65.555L0,170z"></path> </g></svg>
                           }
                           <br /><br />
                        </div>)}
                     </div>)}
                     <h5>PART 2 - Questions 9-20</h5>
                     {data.listenQuestions.slice(8, 20).map((question, index) => {
                        const tmpI = index + 8
                        return <div>
                           <h5 id={`listen_${tmpI}`}>{`${tmpI + 1}. `}{question.question}</h5>
                           {question.answers.map(answer => <div>
                              <input disabled type="radio" name={`listen_${tmpI}`} value={answer} checked={data.listenChoices[tmpI] == answer} />&nbsp;{answer}&nbsp;
                              {answer == question.correct ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#84cc16" fill-rule="evenodd" stroke="#84cc16" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" clip-rule="evenodd" /></svg> :
                                 <svg fill="#ff0000" height="16" width="16" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 208.891 208.891" xmlSpace="preserve" stroke="#ff0000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0,170l65.555-65.555L0,38.891L38.891,0l65.555,65.555L170,0l38.891,38.891l-65.555,65.555L208.891,170L170,208.891 l-65.555-65.555l-65.555,65.555L0,170z"></path> </g></svg>
                              }
                              <br /><br />
                           </div>)}
                        </div>
                     })}
                     <h5>PART 3 - Questions 21-35</h5>
                     {data.listenQuestions.slice(20, 36).map((question, index) => {
                        const tmpI = index + 20
                        return <div>
                           <h5 id={`listen_${tmpI}`}>{`${tmpI + 1}. `}{question.question}</h5>
                           {question.answers.map(answer => <div>
                              <input disabled type="radio" name={`listen_${tmpI}`} value={answer} checked={data.listenChoices[tmpI] == answer} />&nbsp;{answer}&nbsp;
                              {answer == question.correct ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#84cc16" fill-rule="evenodd" stroke="#84cc16" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" clip-rule="evenodd" /></svg> :
                                 <svg fill="#ff0000" height="16" width="16" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 208.891 208.891" xmlSpace="preserve" stroke="#ff0000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0,170l65.555-65.555L0,38.891L38.891,0l65.555,65.555L170,0l38.891,38.891l-65.555,65.555L208.891,170L170,208.891 l-65.555-65.555l-65.555,65.555L0,170z"></path> </g></svg>
                              }
                              <br /><br />
                           </div>)}
                        </div>
                     })}
                     <p>Scoring:</p>
                     <input defaultValue={data.listenScore} disabled></input>
                  </>}
                  {current == 1 && <div style={{ display: "flex", flexDirection: 'column', width: '834px', margin: '0 auto' }}>
                     <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                        <h3>PHẦN 2: ĐỌC HIỂU - VSTEP READING</h3>
                        <h5>Thời gian: 60 phút</h5>
                        <h5>Số câu hỏi: 40</h5>
                     </div>
                     {data.readingData.map((obj, i) => <>
                        <h5>PASSAGE {i + 1} - Questions {10 * i + 1}-{10 * i + 10}</h5>
                        <div style={{ width: '100%', fontSize: '16px' }}>
                           {parse(obj.text.replace(/\n/g, "<br>"))}<br /><br />
                           {obj.questions.map((q, j) => <div>
                              <h5>{`${10 * i + j + 1}. ${q.question}`}</h5>
                              {q.answers.map(answer => <div>
                                 <input disabled type="radio" name={`reading_${10 * i + j}`} value={answer} checked={data.readingChoices[10 * i + j] == answer} />&nbsp;{answer}&nbsp;
                                 {answer == q.correct ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#84cc16" fill-rule="evenodd" stroke="#84cc16" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" clip-rule="evenodd" /></svg> :
                                    <svg fill="#ff0000" height="16" width="16" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 208.891 208.891" xmlSpace="preserve" stroke="#ff0000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0,170l65.555-65.555L0,38.891L38.891,0l65.555,65.555L170,0l38.891,38.891l-65.555,65.555L208.891,170L170,208.891 l-65.555-65.555l-65.555,65.555L0,170z"></path> </g></svg>
                                 }
                                 <br /><br />
                              </div>
                              )}
                           </div>)}
                        </div>
                     </>)}
                     <p>Scoring:</p>
                     <input defaultValue={data.readingScore} disabled></input>
                  </div>}
                  {current == 2 && <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                     <h3>PHẦN 3: VIẾT - VSTEP WRITING</h3>
                     <h5>Thời gian: 60 phút</h5>
                     <h5>Số câu hỏi: 2</h5>
                     {data.writingData.sort((a, b) => a.taskID.type - b.taskID.type).map(obj => <div style={{ fontSize: '16px' }}>
                        <h5>Task {obj.taskID.type}</h5>
                        <p>{parse(obj.taskID.text.replace(/\n/g, "<br>"))}</p>
                        <h2>Student answer</h2>
                        <AutoExpandingTextarea disabled={true} defaultValue={obj.answer} />
                        <p>Number of words: {countWords(obj.answer)}</p>
                        <p>Scoring:</p>
                        <input defaultValue={obj.score != -1 ? obj.score : 0} disabled type='number' ></input>
                     </div>)}
                  </div>}
                  {current == 3 && <>
                     <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', width: '100%', margin: '0 auto' }}>
                        <h3>PHẦN 4: NÓI - VSTEP SPEAKING</h3>
                        <h5>Thời gian: 12 phút</h5>
                        <h5>Số câu hỏi: 3</h5>
                     </div>
                     <AudioPlayer
                        src={`${process.env.NEXT_PUBLIC_API_URL}/speaking/answers/${data.speakingAnswerFilename}`}
                        style={{ width: '100%' }}
                        header={<h3 style={{ color: 'white' }}>Student audio</h3>}
                     />
                     {data.speakingParts.length != 0 && <div>
                        <h5>Part 1: Social Interaction (3')</h5>
                        {parse(data.speakingParts[0].text.replace(/\n/g, "<br>"))}<br /><br />
                        <h5>Part 2: Solution Discussion (4')</h5>
                        {parse(data.speakingParts[1].text.replace(/\n/g, "<br>"))}<br /><br />
                        <h5>Part 3: Topic Development (5')</h5>
                        {parse(data.speakingParts[2].text.replace(/\n/g, "<br>"))}<br /><br />
                     </div>}
                     <p>Scoring:</p>
                     <input defaultValue={data.speakingScore != -1 ? data.speakingScore : 0} disabled ></input>
                  </>}
                  <br /><a href='/view-test'>Quay trở về</a>
               </div>}
            </div>
         </div>
      </div>
   </>
}
export default pageIndex;