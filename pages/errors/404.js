import Head from "next/dist/next-server/lib/head";

const Error = () => {
   return <>
      <Head>
         <title>Error 404</title>
      </Head>
      <div style={{ marginLeft: '40%', marginTop: '15%' }}>
         <h1>Error 404</h1>
         <p>Sorry, the page you were looking for doesn't exist.</p>
         <a href="/"> Go back to homepage</a>
      </div>
   </>
};

export default Error;