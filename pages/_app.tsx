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
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {/* <Theme> */}
      <Layout>
        <GoogleAnalytics gaId="G-9YEEVK03WR" />
        <GoogleReCaptchaProvider reCaptchaKey="6LeYggQqAAAAAPJ9aKFdqTOKj_Yr77myhhCS2sg-">
          <Component {...pageProps} />
        </GoogleReCaptchaProvider>
      </Layout>
      {/* </Theme> */}
    </Provider>
  );
}
