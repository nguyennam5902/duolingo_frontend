import { useContext, useEffect, useState } from "react";
import axios from "axios";
import parse from 'html-react-parser'
import { toast } from "react-toastify";
import { Context } from "../context";

const WritingIndex = ({ text, onChange }) => {
   const {
      state: { user },
   } = useContext(Context);

   const writingID = `65fff1318bfb716b72df0c04`
   const [data, setData] = useState("")
   const [loading, setLoading] = useState(true)
   const countWords = (input) => {
      const str = String(input).trim();
      const words = str.split(/\s+/);
      // console.log(`WORDS: [${words}]`);
      // console.log(`LENGTH: ${words.length}`);
      return str.length == 0 ? 0 : words.length;
   };

   useEffect(() => {
      const getTask = async () => {
         setLoading(true);
         const task = (await axios.get(`/api/task/${writingID}`)).data;
         // console.log("DATA:", task.data.text);
         // console.log("USER:", user.data._id);
         setData(task.data.text)
         setLoading(false);
      }
      getTask();
   }, [user]);
   return <>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         <h3>PHẦN 3: VIẾT - VSTEP WRITING</h3>
         <h5>Thời gian: 60 phút</h5>
         <h5>Số câu hỏi: 2</h5>
         {!loading && <div style={{
            width: '100%',
            fontSize: '16px'
         }}>
            <h5>Task 1</h5>
            <p>{parse(data.replace(/\n/g, "<br>"))}</p>
            <h2>Your answer</h2>
            <textarea defaultValue={text} onChange={onChange} style={{
               width: '100%'
            }}></textarea>
            <p>Number of words: {countWords(text)}</p>

            {/* TODO: MAKE THIS BUTTON WORK AT THE END OF THE TEST */}
            {/* <button style={{ float: 'right' }} onClick={async (event) => {
               if (!answer || !answer.trim()) {
                  event.preventDefault();
                  toast.error("Vui lòng nhập câu trả lời!");
                  return false;
               }
               event.target.disabled = true
               const result = await axios.post(`/api/task/submit/`, {
                  taskID: writingID,
                  userID: user.data._id,
                  content: answer
               });
               console.log("OK");
               toast.success(`ID: ${result.data._id}`)
            }}>Submit</button> */}
         </div>}
      </div>
   </>

}
export default WritingIndex;