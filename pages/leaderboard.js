import React, { useState, useEffect } from 'react';
import 'dotenv/config';
import Head from 'next/head';

const LeaderBoard = () => {
  const imageID = ['9e4f18c0bc42c7508d5fa5b18346af11',
    'cc7b8f8582e9cfb88408ab851ec2e9bd',
    'eef523c872b71178ef5acb2442d453a2']
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard?size=5`);
        const data = await response.json();
        // console.log("Response: " + data.data[0]._id)
        setUsers(data.data);
        setCurrentPage(data.meta.page);
        setPageSize(data.meta.size);
        setTotalUsers(data.meta.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(totalUsers / pageSize);

  const handlePageChange = async newPage => {
    if (newPage >= 0 && newPage <= totalPages - 1) {
      setCurrentPage(newPage);
      try {
        const response = await fetch(`/api/leaderboard?size=5&page=` + newPage);
        const data = await response.json();
        console.log("Page: " + newPage)
        setUsers(data.data);
        setPageSize(data.meta.size);
        setTotalUsers(data.meta.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  return <>
    <Head>
      <title>Bảng xếp hạng</title>
    </Head>
    <h1 className="jumbotron text-center bg-primary square">Bảng xếp hạng</h1>
    <ul className="list-group mr-4 ml-4">
      <li className="list-group-item d-flex">
        <p>Xếp hạng</p>
        <p style={{
          margin: 'auto',
          marginRight: '0%'
        }}>Điểm trong tuần</p>
      </li>
      {users.map((user, index) => (
        <a href={`/user/${user._id}`}>
          <div
            onMouseEnter={e => e.target.style.backgroundColor = '#F7F7F7'}
            onMouseLeave={e => e.target.style.backgroundColor = '#ffffff'}
            style={{
              fontSize: '17px',
              color: 'black',
              fontWeight: 'bold'
            }}>
            <li key={user._id} className="list-group-item d-flex">
              <div style={{ width: '70px' }}>
                {index < 3 ?
                  <img src={`https://d35aaqx5ub95lt.cloudfront.net/images/leagues/${imageID[index]}.svg`} ></img> :
                  <p>&nbsp;&nbsp;&nbsp;{index + 1}</p>}
              </div>
              <img style={{
                borderRadius: '50%',
              }} height={'50px'} width={'50px'} src={`/api/image/${user._id}`}></img>
              <p style={{
                fontSize: '17px',
                color: 'black',
              }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.name}</p>
              <p style={{
                margin: 'auto',
                marginRight: '0%'
              }}>{user.weekScore}</p>
            </li>
          </div>
        </a>
      ))}
    </ul>
    <div className="mt-4 mr-4 ml-4 mb-5 d-flex justify-content-between align-items-center">
      <button className="btn" onClick={() => handlePageChange(currentPage - 1)}>Previous Page</button>
      <p>
        Page {currentPage + 1} of {totalPages}, Total Users: {totalUsers}
      </p>
      <button className="btn" onClick={() => handlePageChange(currentPage + 1)}>Next Page</button>
    </div>
  </>
};

export default LeaderBoard;