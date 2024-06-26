import Head from 'next/head';
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { toast } from "react-toastify";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router'
import { getTimeDistance } from '../utils/helpers'
import { formatISO9075 } from 'date-fns';
import 'dotenv/config';

const Scoring = () => {
   const router = useRouter();
   const firstState = {
      l: [],
      r: [],
      w: [],
      s: []
   }
   const {
      state: { user },
   } = useContext(Context);
   const [current, setCurrent] = useState(0);
   const [studentID, setStudentID] = useState("");
   const [data, setData] = useState(firstState);
   const [loading, setLoading] = useState(false);
   const cellStyle = {
      border: '1px solid black', // Add a border to each cell
      padding: '8px' // Add padding for better appearance
   };

   useEffect(() => {
      if (user) {
         const email = String(user.data.email);
         if (!email.endsWith('@hust.edu.vn')) {
            router.push('/errors/404')
         }
      }
   }, [user])

   return <>
      <Head>
         <title>Chấm điểm</title>
      </Head>
      <h1 className="jumbotron text-center square">Chấm điểm</h1>
      <div className="container-fluid">
         <div className="row">
            <div className="col-md-2">
               <div className="nav flex-column nav-pills">
                  <button className={`nav-link ${current == 0 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(0)}>
                     Listening
                  </button>
                  <br />
                  <button className={`nav-link ${current == 1 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(1)}>
                     Reading
                  </button>
                  <br />
                  <button className={`nav-link ${current == 2 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(2)}>
                     Writing
                  </button>
                  <br />
                  <button className={`nav-link ${current == 3 ? 'disabled' : 'active'}`} style={{ border: '1px solid black' }} onClick={() => setCurrent(3)}>
                     Speaking
                  </button>
               </div>
            </div>
            <div className="col-md-8">
               <div style={{ display: "flex", flexDirection: 'column', width: '834px', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
                  <input style={{ width: '50%' }} type='text' placeholder='Student ID' onChange={(e) => {
                     setStudentID(e.target.value)
                     setData({
                        l: [],
                        w: [],
                        r: [],
                        s: []
                     })
                  }}>
                  </input>
                  <br />
                  <button style={{ width: '19%' }} disabled={studentID.length == 0} type='button' onClick={async () => {
                     setLoading(true);
                     const studentData = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/scoring/student/${studentID}`)).data
                     toast.success("Tìm kiếm hoàn thành!", { autoClose: 400 });
                     // console.log("DATA:", studentData.data.s);
                     setData({
                        l: studentData.data.l,
                        r: studentData.data.r,
                        w: studentData.data.w,
                        s: studentData.data.s
                     })
                     setLoading(false);
                  }}>
                     Tìm kiếm
                  </button>
                  <br />
                  {loading && <SyncOutlined spin
                     className="d-flex justify-content-center display-1 text-danger p-5"
                  />}
                  {!loading && <table style={{
                     border: '1px solid black',
                     borderCollapse: 'collapse',
                     width: '100%'
                  }}>{<tbody>
                     {current == 0 && <>
                        <tr>
                           <td style={cellStyle}>STT</td>
                           <td style={cellStyle}>Tên file nghe</td>
                           <td style={cellStyle}>Ngày và giờ</td>
                           <td style={cellStyle}>Thao tác</td>
                        </tr>
                        {data.l?.map((tmp, index) => <tr>
                           <td style={cellStyle}>{index + 1}</td>
                           <td style={cellStyle}>{tmp.listeningID.filename}</td>
                           <td title={formatISO9075(tmp.createdAt)} style={cellStyle}>{getTimeDistance(tmp.createdAt)}</td>
                           <td style={cellStyle}><a href={`/listening-scoring/${tmp._id}`}><button style={{ width: '100%', color: 'green' }}>Xem</button></a></td>
                        </tr>)}
                     </>}
                     {current == 1 && <>
                        <tr>
                           <td style={cellStyle}>STT</td>
                           <td style={cellStyle}>Điểm</td>
                           <td style={cellStyle}>Ngày và giờ</td>
                           <td style={cellStyle}>Thao tác</td>
                        </tr>
                        {data.r?.map((tmp, index) => <tr>
                           <td style={cellStyle}>{index + 1}</td>
                           <td style={cellStyle}>{tmp.score == -1 ? "-" : `${tmp.score} / 20`}</td>
                           <td title={formatISO9075(tmp.createdAt)} style={cellStyle}>{getTimeDistance(tmp.createdAt)}</td>
                           <td style={cellStyle}><a href={`/reading-scoring/${tmp._id}`}><button style={{ width: '100%', color: 'green' }}>Xem</button></a></td>
                        </tr>)}
                     </>}
                     {current == 2 && <>
                        <tr>
                           <td style={cellStyle}>STT</td>
                           <td style={cellStyle}>Bài viết</td>
                           <td style={cellStyle}>Ngày và giờ</td>
                           <td style={cellStyle}>Thao tác</td>
                        </tr>
                        {data.w?.map((tmp, index) => <tr>
                           <td style={cellStyle}>{index + 1}</td>
                           <td style={cellStyle}>{tmp.taskID.type}</td>
                           <td title={formatISO9075(tmp.createdAt)} style={cellStyle}>{getTimeDistance(tmp.createdAt)}</td>
                           <td style={cellStyle}>
                              <a href={`/writing-scoring/${tmp._id}`}>
                                 <button style={{ width: '100%', color: tmp.score == -1 ? "red" : "green" }}>
                                    {tmp.score == -1 ? "Chấm" : "Xem"}
                                 </button>
                              </a>
                           </td>
                        </tr>)}
                     </>}
                     {current == 3 && <>
                        <tr>
                           <td style={cellStyle}>STT</td>
                           <td style={cellStyle}>ID</td>
                           <td style={cellStyle}>Ngày và giờ</td>
                           <td style={cellStyle}>Thao tác</td>
                        </tr>
                        {data.s?.map((tmp, index) => <tr>
                           <td style={cellStyle}>{index + 1}</td>
                           <td style={cellStyle}>{tmp._id}</td>
                           <td title={formatISO9075(tmp.createdAt)} style={cellStyle}>{getTimeDistance(tmp.createdAt)}</td>
                           <td style={cellStyle}><a href={`/speaking-scoring/${tmp._id}`}>
                              <button style={{ width: '100%', color: tmp.score == -1 ? "red" : "green" }}>
                                 {tmp.score == -1 ? "Chấm" : "Xem"}
                              </button>
                           </a></td>
                        </tr>)}
                     </>}
                  </tbody>}
                  </table>}
               </div>
            </div>
         </div>
      </div>
   </>
}

export default Scoring;