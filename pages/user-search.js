import 'dotenv/config';
import Head from "next/dist/next-server/lib/head";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import FollowButton from '../components/FollowButton';
import { useRouter } from 'next/router';

const UserSearch = () => {
   const userState = {
      _id: "",
      following: [],
      followers: []
   }
   const {
      state: { user: mainUser },
   } = useContext(Context);
   const [loading, setLoading] = useState(false);
   const [users, setUsers] = useState([]);
   const [input, setInput] = useState("");
   const [clicked, setClicked] = useState(false);
   const [followArr, setFollowArr] = useState([]);
   const [userData, setUserData] = useState(userState);
   const { push } = useRouter();
   useEffect(() => {
      const isLogin = window.localStorage.getItem('user');
      if (isLogin == null) {
         push('/login');
      }
      loadData();
   }, [mainUser]);

   const loadData = async () => {
      if (mainUser) {
         const mainData = (await axios.get(`api/user/${mainUser.data._id}`)).data;
         console.log("MAIN:", mainData);
         setUserData({
            _id: mainUser.data._id,
            followers: mainData.data.followers,
            following: mainData.data.following
         });
      }
   }

   const search = async () => {
      try {
         await loadData();
         setClicked(true);
         setLoading(true);
         const data = (await axios.get(`api/user/search/${input}`)).data;
         const s = data.data.map(user => (userData._id != user._id && !userData.following.map(_ => _._id).includes(user._id)))
         setFollowArr(s);
         setUsers(data.data);
         setLoading(false);
      } catch (err) {
         console.log(err);
         setLoading(false);
      }
   }

   return <>
      <Head>
         <title>Search users</title>
      </Head>
      <h1 className="jumbotron text-center square">Search users</h1>
      <table style={{ marginLeft: '25%', width: '47%' }}>
         <td>
            <input
               className="form-control mb-4 p-4"
               type="text"
               placeholder="Username"
               onChange={e => setInput(e.target.value)}
               value={input}
               style={{ width: '120%' }}>
            </input>
         </td>
         <td>
            <button type="button"
               style={{
                  backgroundColor: "#007bff",
                  borderColor: "#007bff",
                  width: "80%",
                  height: "50px",
                  marginLeft: "110%",
                  marginBottom: "20%",
                  color: 'white'
               }}
               disabled={!input}
               onClick={() => search()}
            >Search</button>
         </td>
      </table>
      <div className="container" >
         <div style={{ marginLeft: '15%' }}>
            {loading && <SyncOutlined
               spin
               className="d-flex justify-content-center display-1 text-danger p-5"
            />}
            {clicked && (<h2 style={{ fontSize: '24px' }}>{users.length} result</h2>)}
            {users.map((user, index) => <div style={{
               color: '#000000',
               fontSize: '24px',
               textDecoration: 'none',
               width: '60%',
               height: '100px',
               border: '1px solid black',
               borderBottom: index === users.length - 1 ? '1px solid black' : '0',
            }}>
               <a href={`/user/${user._id}`}>
                  <img height={'70px'} width={'70px'} style={{
                     marginTop: '2%', marginLeft: '2%',
                     borderRadius: '50%', border: '1px solid black'
                  }} src={`/api/image/${user._id}`}></img></a>
               <a href={`/user/${user._id}`} style={{
                  color: 'black', marginLeft: '4%', fontSize: '24px', fontWeight: 'bold'
               }}>{user.name.length > 17 ? `${user.name.slice(0, 18)}...` : user.name}</a>
               {followArr[index] && mainUser && <FollowButton text='Follow' firstState={followArr[index]} userID={mainUser.data._id}
                  friendID={user._id} />}</div>)}
         </div>
      </div>
   </>
};

export default UserSearch;