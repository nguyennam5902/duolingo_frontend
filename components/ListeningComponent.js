import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import 'dotenv/config';

const ListeningComponent = ({ filename, listenQuestions, listenChoices, setListenChoices }) => {
   return <>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         <h3>PHẦN 1: NGHE HIỂU - VSTEP LISTENING</h3>
         <h5>Thời gian: Khoảng 40 phút</h5>
         <h5>Số câu hỏi: 35</h5>
      </div>
      <AudioPlayer
         src={`${process.env.NEXT_PUBLIC_API_URL}/audio/${filename}`}
         style={{ width: '100%' }}
         showJumpControls={false}
         header={<h3 style={{ color: 'white' }}>Part 1</h3>}
      />
      <h5>PART 1 - Questions 1-8</h5>
      {listenQuestions.slice(0, 8).map((question, index) => <div>
         <h5 id={`listen_${index}`}>{`${index + 1}. `}{question.question}</h5>
         {/* <p>{question.correct}</p> */}
         {question.answers.map(answer => <div>
            <input type="radio" name={`listen_${index}`} value={answer} onClick={() => {
               const tmp = [...listenChoices.slice(0, index), answer, ...listenChoices.slice(index + 1)]
               setListenChoices(tmp)
            }} checked={listenChoices[index] == answer} />&nbsp;{answer}<br /><br />
         </div>)}
      </div>)}
      <h5>PART 2 - Questions 9-20</h5>
      {listenQuestions.slice(8, 20).map((question, index) => <div>
         <h5 id={`listen_${index + 8}`}>{`${index + 8 + 1}. `}{question.question}</h5>
         {/* <p>{question.correct}</p> */}
         {question.answers.map(answer => <div>
            <input type="radio" name={`listen_${index + 8}`} value={answer} onClick={() => {
               const tmp = [...listenChoices.slice(0, index + 8), answer, ...listenChoices.slice(index + 1 + 8)]
               setListenChoices(tmp)
            }} checked={listenChoices[index + 8] == answer} />&nbsp;{answer}<br /><br />
         </div>)}
      </div>)}
      <h5>PART 3 - Questions 21-35</h5>
      {listenQuestions.slice(20, 36).map((question, index) => <div>
         <h5 id={`listen_${index + 20}`}>{`${index + 20 + 1}. `}{question.question}</h5>
         {/* <p>{question.correct}</p> */}
         {question.answers.map(answer => <div>
            <input type="radio" name={`listen_${index + 20}`} value={answer} onClick={() => {
               const tmp = [...listenChoices.slice(0, index + 20), answer, ...listenChoices.slice(index + 1 + 20)]
               setListenChoices(tmp)
            }} checked={listenChoices[index + 20] == answer} />&nbsp;{answer}<br /><br />
         </div>)}
      </div>)}
   </>
}
export default ListeningComponent;