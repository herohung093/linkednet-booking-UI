import Layout from "@/layout/layout";
import store from "@/redux toolkit/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Theme } from "@radix-ui/themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Theme className={` bg-gradient-to-l from-pink-100`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Theme>
    </Provider>
  );
}
