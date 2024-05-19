import React, { useEffect, useRef } from 'react';

function AutoExpandingTextarea({ defaultValue, style,onChange }) {
   const textareaRef = useRef(null);
   
   const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
         textarea.style.height = 'auto'; // Reset height to auto to calculate new height
         textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on scrollHeight
      }
   };

   useEffect(() => {
      adjustHeight(); // Adjust height on initial render
   }, []);

   return (
      <textarea
         ref={textareaRef}
         defaultValue={defaultValue}
         style={{ ...style, overflow: 'hidden' }} // Hide the scrollbar
         onInput={adjustHeight} // Adjust height on input
         onChange={onChange}
      />
   );
}

export default AutoExpandingTextarea;
