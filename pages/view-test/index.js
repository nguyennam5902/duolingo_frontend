import Head from 'next/head';
import { toast } from "react-toastify";
import { Context } from "../../context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import { getTimeDistance } from '../../utils/helpers'
import { formatISO9075 } from 'date-fns';
import { useRouter } from "next/router";

const viewIndex = () => {
   const router = useRouter()
   const cellStyle = {
      border: '1px solid black', // Add a border to each cell
      padding: '8px' // Add padding for better appearance
   }
   const {
      state: { user },
   } = useContext(Context);
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState([])
   const [filterData, setFilterData] = useState([])
   const [fromDate, setFromDate] = useState('');
   const [toDate, setToDate] = useState('');

   useEffect(() => {
      const getData = async () => {
         try {
            if (user) {
               setLoading(true)
               const tests = (await axios.get(`/api/test/search/${user.data._id}`)).data
               // console.log("DATA:", tests);
               setData(tests.data)
               setFilterData(tests.data)
               setLoading(false)
            }
         } catch (err) {
            setLoading(false)
            console.log("ERROR:", err);
         }
      }
      getData()
   }, [user])
   return <>
      <Head>
         <title>Xem điểm thi VSTEP</title>
      </Head>
      <h1 className="jumbotron text-center square">Xem điểm thi VSTEP</h1>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ display: 'flex', flexDirection: 'row' }}>
            <p>Từ:</p>&nbsp;&nbsp;&nbsp;&nbsp;
            <input aria-label="Date" type="date" onChange={e => setFromDate(e.target.value)} />
         </div>
         <br />
         <div style={{ display: 'flex', flexDirection: 'row' }}>
            <p>Đến:</p>&nbsp;&nbsp;&nbsp;&nbsp;
            <input aria-label="Date" type="date" onChange={e => setToDate(e.target.value)} />
         </div>
         {loading && <SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5" />}
         {!loading && <>
            <div style={{ display: "flex", flexDirection: 'column', width: '834px', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
               <br /><table style={{
                  border: '1px solid black',
                  borderCollapse: 'collapse',
                  width: '100%'
               }}>
                  <tr>
                     <td style={cellStyle}>STT</td>
                     <td style={cellStyle}>Test ID</td>
                     <td style={cellStyle}>Ngày và giờ</td>
                     <td style={cellStyle}>Thao tác</td>
                  </tr>
                  {filterData.map((test, index) => {
                     return <tr>
                        <td style={cellStyle}>{index + 1}</td>
                        <td style={cellStyle}>{test._id}</td>
                        <td title={formatISO9075(test.createdAt)} style={cellStyle}>{getTimeDistance(test.createdAt)}</td>
                        <td style={cellStyle}>
                           <a href={`/view-test/${test._id}`}><button style={{ width: '100%', color: 'green' }}>View</button></a>
                        </td>
                     </tr>
                  })}
               </table>
            </div>
         </>}
         <br /><button disabled={fromDate.length * toDate.length == 0} onClick={async () => {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            const filterData = data.filter(item => {
               const createdAtDate = new Date(item.createdAt);
               return createdAtDate >= from && createdAtDate <= to;
            })
            setFilterData(filterData)
            toast.success(`Tìm kiếm hoàn thành`, { autoClose: 400 })
         }}>Tìm</button>
      </div>
   </>
}
export default viewIndex;