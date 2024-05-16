import Layout from "@/layout/layout";
import store from "@/redux toolkit/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Theme } from "@radix-ui/themes";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {/* <Theme> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      {/* </Theme> */}
    </Provider>
  );
}
