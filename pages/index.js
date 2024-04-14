import { useEffect } from "react";
import { useRouter } from 'next/router'

const Index = () => {
  const router= useRouter();
  useEffect(() => {
    const isLogin = window.localStorage.getItem('user');
    if (isLogin != null) {
      router.push('/courses');
    }
  })
  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Online Learning English
      </h1>
    </>
  );
};

export default Index;
