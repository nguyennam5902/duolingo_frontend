import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import UserRoute from "../components/routes/UserRoute";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const UserIndex = () => {
   const {
      state: { user },
   } = useContext(Context);
   const [oldPassword, setOldPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const { push } = useRouter();
   useEffect(() => {
      const isLogin = window.localStorage.getItem('user');
      if (isLogin == null) {
         push('/login')
      }
   }, [user]);


   const changePassword = async (oldPassword, newPassword) => {
      const result = await axios.post('/api/update-password/', {
         userId: user.data._id,
         oldPassword: oldPassword,
         newPassword: newPassword
      })
      if (result.data.meta.code == 200) {
         toast.success("Password update successful");
      } else {
         toast.error(result.data.meta.message);
      }
   }
   return <UserRoute>
      <h1 className="jumbotron text-center square">Change password</h1>
      <div className="container">
         <div className="row">
            <div className="col-md-9">
               <table style={{ marginLeft: "20%" }}>
                  <tbody>
                     <tr>
                        <td><label>Current Password </label></td>
                        <td>
                           <input
                              id="oldPassword"
                              type="password"
                              className="form-control mb-4 p-4"
                              value={oldPassword}
                              required
                              style={{ marginLeft: "20px", width: "500px" }}
                              onChange={(e) => setOldPassword(e.target.value)}
                           />
                        </td>
                     </tr>
                     <tr>
                        <td><label>New Password </label></td>
                        <td>
                           <input
                              id="newPassword"
                              type="password"
                              className="form-control mb-4 p-4"
                              value={newPassword}
                              required
                              style={{ marginLeft: "20px", width: "500px" }}
                              onChange={(e) => setNewPassword(e.target.value)}
                           />
                        </td>
                     </tr>
                  </tbody>
               </table>
               <button
                  onClick={() => changePassword(oldPassword, newPassword)}
                  disabled={!oldPassword || !newPassword}
                  style={{
                     backgroundColor: "#007bff",
                     borderColor: "#007bff",
                     width: "300px",
                     marginLeft: "46%"
                  }}
                  className="btn btn-primary btn-block"
               >Change password
               </button>
            </div>
         </div>
      </div>
   </UserRoute>
};

export default UserIndex;