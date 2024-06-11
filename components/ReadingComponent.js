import parse from 'html-react-parser'

const ReadingComponent = ({ readingData, readingChoices, setReadingChoices }) => {
   return <>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         <h3>PHẦN 2: ĐỌC HIỂU - VSTEP READING</h3>
         <h5>Thời gian: 60 phút</h5>
         <h5>Số câu hỏi: 40</h5>
      </div>
      {readingData.map((reading, index) => <>
         <h5>PASSAGE {index + 1} - Questions {10 * index + 1}-{10 * index + 10}</h5>
         <div style={{ width: '100%', fontSize: '16px' }}>
            {parse(reading.text.replace(/\n/g, "<br>"))}<br /><br />
            {reading.questions.map((q, questionIndex) => <div>
               <h5 id={`reading_${10 * index + questionIndex}`}>{`${10 * index + questionIndex + 1}. ${q.question}`}</h5>
               {/* <p>{q.correct}</p> */}
               {q.answers.map(answer => <div>
                  <input type="radio" name={`reading_${10 * index + questionIndex}`} value={answer} onClick={() => {
                     const tmp = [...readingChoices.slice(0, 10 * index + questionIndex), answer, ...readingChoices.slice(10 * index + questionIndex + 1)]
                     setReadingChoices(tmp)
                  }} checked={readingChoices[10 * index + questionIndex] == answer} />&nbsp;{answer}<br /><br />
               </div>)}
            </div>)}
         </div>
      </>)}
   </>
}
export default ReadingComponent;