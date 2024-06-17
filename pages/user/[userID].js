import 'dotenv/config';
import { SyncOutlined } from "@ant-design/icons";
import Head from "next/dist/next-server/lib/head";
import axios from "axios";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FollowButton from '../../components/FollowButton';

const UserIndex = () => {
  const state = {
    name: "",
    email: "",
    weekScore: 0,
    totalScore: 0,
    imageURL: "",
    following: [],
    followers: []
  }
  const router = useRouter();
  const userID = router.query.userID;
  const [loading, setLoading] = useState(false);
  const [follow, setFollow] = useState(false);
  const [data, setData] = useState(state);
  const [userData, setUserData] = useState(state);
  const [array, setArray] = useState([]);
  const [isLeft, setLeft] = useState(true);
  const [ls, setLS] = useState(null);
  const check = (checkID) => {
    return (ls != null && checkID != JSON.parse(ls).data._id && userData.following.map(user => user._id).includes(checkID) == false);
  }
  const isFollow = (checkID, arr) => arr.map(user => user._id).includes(checkID)
  useEffect(() => {
    const isLogin = window.localStorage.getItem('user');
    if (isLogin == null) {
      router.push('/login')
    }
    loadUserData().then(() => document.getElementById('left_button').click());
    setLS(localStorage.getItem('user'));
    // console.log("LS", ls);
  }, [userID]);

  const loadUserData = async () => {
    try {
      if (userID) {
        setLoading(true);
        const mainData = (await axios.get(`/api/user/${JSON.parse(localStorage.user).data._id}`)).data;
        // console.log("MAIN:", mainData);
        setUserData({
          followers: mainData.data.followers,
          following: mainData.data.following
        });
        // console.log("PROFILE:", mainData);
        const userData = (await axios.get(`/api/user/${userID}`)).data;
        // console.log("DATA:", userData);
        if (userData.meta.code != 200) {
          router.push(`/errors/404`);
        }
        setData({
          name: userData.data.name,
          email: userData.data.email,
          weekScore: userData.data.weekScore,
          totalScore: userData.data.totalScore,
          imageURL: `/api/image/${userID}`,
          followers: userData.data.followers,
          following: userData.data.following
        });
        setFollow(isFollow(userID, mainData.data.following));
        setLoading(false);
      }
    } catch (err) {
      console.log("ERROR:", err);
      setLoading(false);
    }
  };
  const followFunction = async () => {
    const w = await axios.post('/api/follow', {
      "userID": JSON.parse(ls).data._id,
      "friendID": userID
    });
    if (w.data.meta.code == 200) {
      toast.success('Theo dõi thành công!', { autoClose: 1000 });
    } else {
      toast.error(w.data.meta.message);
    }
  }
  const unfollowFunction = async () => {
    const w = await axios.delete('/api/follow', {
      data: {
        "userID": JSON.parse(ls).data._id,
        "friendID": userID
      }
    });
    if (w.data.meta.code == 200) {
      toast.success('Bỏ theo dõi thành công!', { autoClose: 1000 });
    } else {
      toast.error(w.data.meta.message);
    }
  }

  return <>
    <Head>
      <title>User profile</title>
    </Head>
    {loading && (
      <SyncOutlined
        spin
        className="d-flex justify-content-center display-1 text-danger p-5"
      />
    )}
    <h1 className="jumbotron text-center square">User profile</h1>

    <div className="container">
      <div className="card">
        <img src={data.imageURL} alt="Person" className="card__image" />
        <p className="card__name"> {data && data.name}</p>
        <div className="grid-container">
          <div className="grid-child-posts">
            Email: {data && data.email}
          </div>
          <div>
            Week Score: {data && data.weekScore}
            <br></br>
            Total Score: {data && data.totalScore}
          </div>
        </div>
      </div>
      {(ls && userID != JSON.parse(ls).data._id) && <button style={{
        marginTop: '2%',
        backgroundColor: follow ? "white" : "#1cb0f6",
        border: follow ? "1px solid black" : 'none',
        color: follow ? "#58cc02" : 'white',
        width: '27%',
        height: '50px',
        fontSize: '15px'
      }}
        onClick={async () => {
          if (follow) { await unfollowFunction() }
          else { await followFunction() }
          setFollow(!follow);
        }}>
        <img src={`https://d35aaqx5ub95lt.cloudfront.net/images/profile/${follow ?
          '370fe28a33e4f9d79739cb09f4667063' : '984c4ab1d5fec1a4fb62d64ca7d282e6'}.svg`}>
        </img >
        &nbsp;&nbsp;&nbsp; {follow ? "Following" : "Follow"}
      </button >}
    </div >
    <div style={{
      width: '400px', marginTop: `-22%`,
      marginLeft: '60%'
    }}>
      <div style={{ display: 'flex' }}>
        <button
          id='left_button'
          style={{
            background: 'white',
            display: 'flex',
            fontSize: '16px',
            width: '180px',
            height: '50px',
            borderTop: '2px solid black',
            borderLeft: '2px solid black',
            borderRight: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0',
            borderBottom: `2px solid ${isLeft ? "#1cb0f6" : "black"}`,
            color: `${isLeft ? " #1cb0f6" : " black"}`,
          }}
          onClick={() => {
            setLeft(true);
            setArray(data.following.map(user => <div style={{ height: '85px', width: '360px', display: 'flex' }}>
              <a style={{ marginLeft: '2%' }} href={`/user/${user._id}`}>
                <img src={`/api/image/${user._id}`} height={'48px'} width={'48px'}
                  style={{ borderRadius: '50%', border: '1px solid black', marginTop: '25%' }} />
              </a>
              <a style={{ textDecoration: 'none', marginLeft: '2%', marginTop: '2%', padding: '0 0px' }}
                href={`/user/${user._id}`}>
                <h3 style={{ color: 'black', fontSize: '20px' }}>{user.name}</h3>
                <div style={{ color: '#afafaf', fontSize: '16px', marginBottom: '10px' }}>Score: {user.totalScore}</div>
              </a>
              {check(user._id) && <FollowButton firstState={check(user._id)}
                userID={JSON.parse(localStorage.user).data._id} friendID={user._id} />}
            </div>))
          }}
        >Following</button>
        <button style={{
          background: 'white',
          display: 'flex',
          fontSize: '16px',
          width: '180px',
          height: '50px',
          borderTop: '2px solid black',
          borderRight: '2px solid black',
          borderLeft: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0',
          borderBottom: `2px solid ${!isLeft ? "#1cb0f6" : "black"}`,
          color: `${!isLeft ? " #1cb0f6" : " black"}`,
        }}
          onClick={() => {
            setLeft(false);
            setArray(data.followers.map(user => <div style={{ height: '85px', width: '360px', display: 'flex' }}>
              <a style={{ marginLeft: '2%' }} href={`/user/${user._id}`}>
                <img src={`/api/image/${user._id}`} height={'48px'} width={'48px'}
                  style={{
                    borderRadius: '50%', border: '1px solid black', marginTop: '25%'
                  }} />
              </a>
              <a style={{ textDecoration: 'none', marginLeft: '2%', marginTop: '2%', padding: '0 0px' }}
                href={`/user/${user._id}`}>
                <h3 style={{ color: 'black', fontSize: '20px' }}>{user.name}</h3>
                <div style={{ color: '#afafaf', fontSize: '16px', marginBottom: '10px' }}>Score: {user.totalScore}</div>
              </a>
              {check(user._id) && <FollowButton firstState={check(user._id)}
                userID={JSON.parse(localStorage.user).data._id} friendID={user._id} />}</div>
            ))
          }}>Followers</button>
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', border: '2px solid black', borderTop: 'none', width: '360px',
        alignItems: 'center', padding: '0 10px'
      }}>
        {array.length == 0 ? <div style={{
          height: '320px', width: '360px', display: 'flex', alignItems: 'center',
          padding: '0 13%', fontSize: '18px', textAlign: 'center'
        }}>Learning is more fun and effective<br></br>when you connect with others</div> : array}
      </div>
    </div>
  </>
};

export default UserIndex;