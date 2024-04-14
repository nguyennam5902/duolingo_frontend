import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";
import Head from "next/dist/next-server/lib/head";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // state
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  // router
  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      if (data.meta.code == 200) {
        dispatch({
          type: "LOGIN",
          payload: data,
        });
        window.localStorage.setItem("user", JSON.stringify(data));
        toast.success("Đăng nhập thành công!", { autoClose: 1000, position: 'top-right' });
        router.push("/user");
        setLoading(false);
      } else {
        toast.error(data.meta.message, { autoClose: 1000, position: 'top-right' });
      }
    } catch (err) {
      console.log(err);
      toast.error("ERROR");
      setLoading(false);
    }
  };

  return <>
    <Head>
      <title>Đăng nhập</title>
      <meta></meta>
    </Head>
    <h1 className="jumbotron text-center bg-primary square">Đăng nhập</h1>

    <div className="container col-md-4 offset-md-4 pb-5">
      <form onSubmit={handleSubmit}>
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
          className="btn btn-primary btn-block"
          style={{
            backgroundColor: "#007bff",
            borderColor: "#007bff",
            marginLeft: '28%'
          }}
          disabled={!email || !password}>Đăng nhập
        </button>
      </form>

      <p className="text-center pt-3">
        Chưa có tài khoản?{" "}
        <Link href="/register">
          <a>Đăng ký ngay</a>
        </Link>
      </p>
    </div>
  </>
};

export default Login;
