import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import parse from 'html-react-parser'
import { toast } from "react-toastify";

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
   const startRecording = async () => {
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
            {recordingStatus === "recording" ? (
               <button onClick={stopRecording} type="button">
                  Stop Recording
               </button>
            ) : null}
         </div>
      </div>
      {audio ? <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', width: '600px', margin: '0 auto' }}>
         <audio src={audio} controls></audio><br />
         <button onClick={async () => {
            // TODO: FINISHED LISTENING
            const readingAnswerID = (await axios.post(`/api/reading/submit/`, {
               readingIDs: readingIDs,
               userID: user.data._id,
               choices: readingChoices,
               score: readingCorrectCount
            })).data
            // TODO: FINISHED READING
            const listeningAnswerID = (await axios.post(`/api/listen/submit/`, {
               listeningID: listenID,
               userID: user.data._id,
               choices: listeningChoices,
               score: listeningCorrectCount
            })).data
            // TODO: FINISHED WRITING
            const taskAnswerID = (await Promise.all([...writingData].map(data => axios.post(`/api/task/submit/`, {
               taskID: data._id,
               userID: user.data._id,
               content: data.answer
            })))).map(task => task.data.data)
            const speakingAnswerID = (await axios.post('/api/speaking/upload', {
               file: finalRecord,
               userID: user.data._id,
               parts: speakingData.map(part => part._id)
            })).data
            console.log("LISTENING:", listeningAnswerID.data);
            console.log("READING:", readingAnswerID.data);
            console.log("WRITING:", taskAnswerID);
            console.log("SPEAKING:", speakingAnswerID.data);
            axios.post('/api/test', {
               listeningAnswerID: listeningAnswerID.data,
               readingAnswerID: readingAnswerID.data,
               taskAnswerID: taskAnswerID,
               speakingAnswerID: speakingAnswerID.data,
               userID: user.data._id
            })
            toast.success('Done!')
         }}>Submit Recording</button>
      </div> : null}
   </>
};
export default AudioRecorder;
