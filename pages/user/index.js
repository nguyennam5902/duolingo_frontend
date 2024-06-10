import 'dotenv/config';
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import FollowButton from '../../components/FollowButton';
import { useRouter } from 'next/router';

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const firstState = {
    point: 0,
    following: [],
    followers: [],
    buttons: []
  }
  const [data, setData] = useState(firstState);
  const [array, setArray] = useState([]);
  const [isLeft, setLeft] = useState(true);
  const { push } = useRouter();
  useEffect(() => {
    const isLogin = window.localStorage.getItem('user');
    if (isLogin == null) {
      push('/login');
    }
    loadUserData().then(() => document.getElementById('left_button')?.click());
  }, [user]);

  const loadUserData = async () => {
    if (user) {
      try {
        setLoading(true);
        const data = (await axios.get(`/api/user/${user.data._id}`)).data;
        // console.log("data:", data);
        setData({
          point: data.data.totalScore,
          following: data.data.following,
          followers: data.data.followers,
          buttons: data.data.followers.map(tmpUser => (tmpUser._id != user.data._id && !data.data.following.map(_ => _._id).includes(tmpUser._id)))
        });
        setLoading(false);
      } catch (err) {
        console.log("ERROR:", err);
        setLoading(false);
      }
    }
  };

  return <UserRoute>
    {loading && <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-danger p-5"
    />}
    <h1 className="jumbotron text-center square">Tài khoản của tôi</h1>

    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            {!loading && <img src={`/api/image/${user.data._id}`} alt="Person" className="card__image" />}
            <a href='/image-choose'>
              <button style={{
                marginTop: '4%',
                background: 'white',
                color: 'black',
                fontSize: '15px'
              }}>Change image</button>
            </a>
            <p className="card__name"> {user && user.data.name}</p>
            <div className="grid-container">
              <div className="grid-child-posts">
                Email: {user && user.data.email}
              </div>
              <div>
                Week Score: {user && user.data.weekScore}
                <br></br>
                Total Score: {user && data.point}
              </div>
            </div>
          </div>
        </div>
        <div>
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
                borderBottom: `2px solid ${isLeft == true ? "#1cb0f6" : "black"}`,
                color: `${isLeft == true ? " #1cb0f6" : " black"}`,
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
                </div>
                ))
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
              borderBottom: `2px solid ${isLeft ? "black" : "#1cb0f6"}`,
              color: `${isLeft ? " black" : " #1cb0f6"}`,
            }}
              onClick={() => {
                setLeft(false)
                setArray(data.followers.map((tmp, index) => <div style={{ height: '85px', width: '360px', display: 'flex' }}>
                  <a style={{ marginLeft: '2%' }} href={`/user/${tmp._id}`}>
                    <img src={`/api/image/${tmp._id}`} height={'48px'} width={'48px'}
                      style={{ borderRadius: '50%', border: '1px solid black', marginTop: '25%' }} />
                  </a>
                  <a style={{ textDecoration: 'none', marginLeft: '2%', marginTop: '2%', padding: '0 0px' }}
                    href={`/user/${tmp._id}`}>
                    <h3 style={{ color: 'black', fontSize: '20px' }}>{tmp.name}</h3>
                    <div style={{ color: '#afafaf', fontSize: '16px', marginBottom: '10px' }}>Score: {tmp.totalScore}</div>
                  </a>
                  {data.buttons[index] &&
                    <FollowButton firstState={data.buttons[index]} userID={user.data._id} friendID={tmp._id} />
                  }
                </div>
                ))
              }}>Followers</button>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', border: '2px solid black', width: '360px',
            alignItems: 'center', padding: '0 10px', borderTop: 'none'
          }}>
            {array.length == 0 ? <div style={{
              height: '320px', width: '360px', display: 'flex', alignItems: 'center',
              padding: '0 13%', fontSize: '18px', textAlign: 'center'
            }}>
              Learning is more fun and effective<br></br>when you connect with others
            </div> : array}
          </div>
          <a href='/user-search' style={{ textDecoration: 'none', color: 'black' }}>
            <div style={{ display: 'flex', border: '2px solid black', marginTop: '5%' }}>
              <img src='https://d35aaqx5ub95lt.cloudfront.net/images/profile/48b8884ac9d7513e65f3a2b54984c5c4.svg'
                style={{ marginLeft: '5%' }}></img>
              <div style={{ marginLeft: '6%', marginTop: '4%' }}>Search users </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </UserRoute>
};

export default UserIndex;