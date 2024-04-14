import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";
import Head from "next/dist/next-server/lib/head";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ name, email, password });
    try {
      setLoading(true);
      const { data } = await axios.post(`api/register`, {
        name,
        email,
        password,
      });
      // console.log("REGISTER RESPONSE", data);
      if (data.meta.code == 200) {
        toast.success("Đăng ký thành công.");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(data.meta.message);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast(err.response.data);
      setLoading(false);
    }
  };

  return <>
    <Head>
      <title>Đăng ký</title>
    </Head>
    <h1 className="jumbotron text-center bg-primary square">Đăng ký</h1>

    <div className="container col-md-4 offset-md-4 pb-5">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-4 p-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên người dùng"
          required
        />

        <input
          type="email"
          className="form-control mb-4 p-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          className="form-control mb-4 p-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          required
        />

        <button
          type="submit"
          style={{
            background: "#007bff",
            borderColor: "#007bff",
            marginLeft: '28%'
          }}
          className="btn btn-block btn-primary"
          disabled={!name || !email || !password || loading}
        >
          {loading ? <SyncOutlined spin /> : "Đăng ký"}
        </button>
      </form>

      <p className="text-center p-3">
        Đã có tài khoản?{" "}
        <Link href="/login">Đăng nhập</Link>
      </p>
    </div>
  </>
};

export default Register;
