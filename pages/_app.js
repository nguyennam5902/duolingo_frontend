import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import '../public/css/audio_player.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "../context";
function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer position="top-right" />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;