import 'dotenv/config';
import { toast } from "react-toastify";
import axios from "axios";
import React, { useState } from 'react';

const FollowButton = ({ firstState, userID, friendID, text = "" }) => {
   const [needFollow, setNeed] = useState(firstState);
   return <button
      style={{
         background: needFollow ? '#1cb0f6' : 'white',
         border: needFollow ? 'none' : '1px solid gray',
         color: needFollow ? 'white' : "#58cc02",
         float: 'right',
         fontSize: '15px',
         height: '35%',
         margin: 'auto',
         marginRight: '4%',
         marginTop: '6%',
         width: text.length == 0 ? '10%' : '30%',
      }}
      onClick={async () => {
         let w;
         if (needFollow)
            w = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/follow`, {
               "userID": userID, "friendID": friendID
            });
         else
            w = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/follow`, {
               data: { "userID": userID, "friendID": friendID }
            });
         if (w.data.meta.code == 200) {
            toast.success(`${needFollow ? `T` : `Bỏ t`}heo dõi thành công!`, { autoClose: 1000 });
            setNeed(!needFollow);
         } else {
            toast.error(w.data.meta.message);
         }
      }}>
      <img src={`https://d35aaqx5ub95lt.cloudfront.net/images/profile/${needFollow ?
         `984c4ab1d5fec1a4fb62d64ca7d282e6` : `370fe28a33e4f9d79739cb09f4667063`}.svg`}>
      </img>&nbsp;&nbsp;{text}
   </button>
};

export default FollowButton;
