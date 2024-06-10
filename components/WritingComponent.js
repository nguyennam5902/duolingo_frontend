import parse from 'html-react-parser'
import AutoExpandingTextarea from './AutoExpandingTextarea'
const WritingIndex = ({ text, onChange, writingData }) => {
   const countWords = (input) => {
      const str = String(input).trim();
      const words = str.split(/\s+/);
      return str.length == 0 ? 0 : words.length;
   };
   return <>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         <h3>PHẦN 3: VIẾT - VSTEP WRITING</h3>
         <h5>Thời gian: 60 phút</h5>
         <h5>Số câu hỏi: 2</h5>
         <div style={{
            width: '100%',
            fontSize: '16px'
         }}>
            {[...writingData].map((task, index) => {
               return <>
                  <h5>Task {index + 1}</h5>
                  <p>{parse(task.text.replace(/\n/g, "<br>"))}</p>
                  <h2>Your answer</h2>
                  <AutoExpandingTextarea defaultValue={text[index]} onChange={e => onChange(e, index)} />
                  <p>Number of words: {countWords(text[index])}</p>
               </>
            })}
         </div>
      </div>
   </>

}
export default WritingIndex;