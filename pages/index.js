import { useEffect } from "react";
import { useRouter } from 'next/router'
import Head from 'next/head';

const Index = () => {
  const router = useRouter();
  useEffect(() => {
    const isLogin = window.localStorage.getItem('user');
    if (isLogin != null) {
      router.push('/courses');
    }
  }, [])
  return <>
    <Head>
      <title>Online Learning English</title>
    </Head>
    <h1 className="jumbotron text-center bg-primary square">
      Online Learning English
    </h1>
    <div style={{ display: "flex", flexDirection: 'column', width: '900px', height: '700px', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ width: '540px', textAlign: 'center' }}>Cùng nhau học ngoại ngữ để sử dụng ngoài đời thực!</h1><br /><br />
      <a href="/register">
        <button style={{ border: 'none', width: '250px', height: '50px', color: 'white', background: '#009c29', fontSize: '20px' }}><b>Bắt đầu ngay</b>
        </button></a><br />
      <a href="/login">
        <button style={{ border: '1px solid gray', width: '250px', height: '50px', color: '#199EDD', background: 'white', fontSize: '20px' }}>
          <b>Tôi đã có tài khoản</b>
        </button></a><br />
    </div >
    <div style={{
      width: '100%',
      borderTop: '2px solid black'
    }}></div>
    <div style={{ display: "flex", flexDirection: 'column', width: '900px', height: '700px', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ width: '640px', textAlign: 'center' }}>Thi thử VSTEP, thử sức bản thân!</h1><br />
      <p style={{ fontSize: '17px' }}>VSTEP là từ viết tắt của tiếng Anh Vietnamese Standardized Test of English Proficiency. Đây là kỳ thi đánh giá năng lực tiếng
        Anh theo Khung năng lực ngoại ngữ (NLNN) 6 bậc dùng cho Việt Nam, tương đương với trình độ A1, A2, B1, B2, C1,C2.</p><br />
      <a href="/register">
        <button style={{ border: 'none', width: '250px', height: '50px', color: 'white', background: '#009c29', fontSize: '20px' }}><b>Thi thử ngay</b>
        </button></a><br />
    </div>
    <div style={{
      height: '150px',
      width: '100%',
      borderTop: '2px solid black'
    }}></div>
  </>
};

export default Index;
