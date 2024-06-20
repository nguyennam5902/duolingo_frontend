import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import parse from 'html-react-parser'
import { toast } from "react-toastify"
import { useRouter } from 'next/router'
import 'dotenv/config';

function secondsToTimeFormat(totalSeconds) {
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = totalSeconds % 60;

   const formattedHours = String(hours).padStart(2, '0');
   const formattedMinutes = String(minutes).padStart(2, '0');
   const formattedSeconds = String(seconds).padStart(2, '0');

   return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const AudioRecorder = ({ listeningCorrectCount, readingCorrectCount, user, listenID, readingIDs, listeningChoices,
   readingChoices, writingData, speakingData }) => {
   const [finalRecord, setFinalRecord] = useState(null);
   const mimeType = "audio/webm";
   const [permission, setPermission] = useState(false);
   const mediaRecorder = useRef(null);
   const [recordingStatus, setRecordingStatus] = useState("inactive");
   const [stream, setStream] = useState(null);
   const [audioChunks, setAudioChunks] = useState([]);
   const [audio, setAudio] = useState(null);
   const [seconds, setSeconds] = useState(0)
   const [isRunning, setIsRunning] = useState(false);
   const router = useRouter()
   useEffect(() => {
      let interval;
      if (isRunning) {
         interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
         }, 1000);
      } else if (!isRunning && seconds !== 0) {
         clearInterval(interval);
      }

      return () => clearInterval(interval);
   }, [isRunning, seconds]);

   const startRecording = async () => {
      setSeconds(0);
      setIsRunning(true)
      setRecordingStatus("recording");
      const media = new MediaRecorder(stream, { type: mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();
      let localAudioChunks = [];
      mediaRecorder.current.ondataavailable = (event) => {
         if (typeof event.data === "undefined") return;
         if (event.data.size === 0) return;
         localAudioChunks.push(event.data);
      };
      setAudioChunks(localAudioChunks);
   };
   const stopRecording = () => {
      setIsRunning(false)
      setRecordingStatus("inactive");
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = async () => {
         const audioBlob = new Blob(audioChunks, { type: mimeType });
         const arrayBuffer = await audioBlob.arrayBuffer();
         setFinalRecord(Buffer.from(arrayBuffer));
         const audioUrl = URL.createObjectURL(audioBlob);
         setAudio(audioUrl);
         setAudioChunks([]);
      };
   };
   const formattedTime = secondsToTimeFormat(seconds);

   const getMicrophonePermission = async () => {
      if ("MediaRecorder" in window) {
         try {
            const streamData = await navigator.mediaDevices.getUserMedia({
               audio: true,
               video: false,
            });
            setPermission(true);
            setStream(streamData);
         } catch (err) {
            alert(err.message);
         }
      } else {
         alert("The MediaRecorder API is not supported in your browser.");
      }
   };
   return <>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', width: '100%', margin: '0 auto' }}>
         <h3>PHẦN 4: NÓI - VSTEP SPEAKING</h3>
         <h5>Thời gian: 12 phút</h5>
         <h5>Số câu hỏi: 3</h5>
         {speakingData.length != 0 && <div>
            <h5>Part 1: Social Interaction (3')</h5>
            {parse(speakingData[0].text.replace(/\n/g, "<br>"))}<br /><br />
            <h5>Part 2: Solution Discussion (4')</h5>
            {parse(speakingData[1].text.replace(/\n/g, "<br>"))}<br /><br />
            <h5>Part 3: Topic Development (5')</h5>
            {parse(speakingData[2].text.replace(/\n/g, "<br>"))}<br /><br />
         </div>}
         <div style={{ marginBottom: '20px' }}>
            {!permission ? (
               <button onClick={getMicrophonePermission} type="button">
                  Get Microphone
               </button>
            ) : null}
            {permission && recordingStatus === "inactive" ? (
               <button onClick={startRecording} type="button">
                  Start Recording
               </button>
            ) : null}
            {recordingStatus === "recording" ? <>
               <button onClick={stopRecording} type="button">
                  Stop Recording
               </button>
            </> : null}
         </div>
      </div>
      <div style={{
         border: '5px solid black', width: '14%', alignItems: 'center', margin: '0 auto',
         textAlign: 'center', fontSize: '25px'
      }}><b>{formattedTime}</b></div>
      <br />
      {audio ? <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', width: '600px', margin: '0 auto' }}>
         <audio src={audio} controls></audio><br />
         <button onClick={async () => {
            // TODO: FINISHED LISTENING
            const readingAnswerID = (await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reading/submit/`, {
               readingIDs: readingIDs,
               choices: readingChoices,
               score: readingCorrectCount
            })).data
            // TODO: FINISHED READING
            const listeningAnswerID = (await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/listen/submit/`, {
               listeningID: listenID,
               choices: listeningChoices,
               score: listeningCorrectCount
            })).data
            // TODO: FINISHED WRITING
            const taskAnswerID = (await Promise.all(writingData.map(data => axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task/submit/`, {
               taskID: data._id,
               content: data.answer
            })))).map(task => task.data.data)
            const speakingAnswerID = (await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/speaking/upload`, {
               file: finalRecord,
               parts: speakingData.map(part => part._id)
            })).data
            // console.log("LISTENING:", listeningAnswerID.data);
            // console.log("READING:", readingAnswerID.data);
            // console.log("WRITING:", taskAnswerID);
            // console.log("SPEAKING:", speakingAnswerID.data);
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/test`, {
               listeningAnswerID: listeningAnswerID.data,
               readingAnswerID: readingAnswerID.data,
               taskAnswerID: taskAnswerID,
               speakingAnswerID: speakingAnswerID.data,
               userID: user.data._id
            })
            toast.success('Done!')
            router.push('/view-test')
         }}>Submit Recording</button>
      </div> : null}
   </>
};
export default AudioRecorder;
