import config from "@config/config.json";
import theme from "@config/theme.json";
import { JsonContext } from "context/state";
import Head from "next/head";
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import "styles/style.scss";
import { AuthProvider } from "context/AuthContext";
import { Router } from "next/router";

const App = ({ Component, pageProps }) => {
  // import google font css
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  const [fontcss, setFontcss] = useState("");

  useEffect(() => {
    const fetchFontCSS = async () => {
      const res = await fetch(
        `https://fonts.googleapis.com/css2?family=${pf}${
          sf ? "&family=" + sf : ""
        }&display=swap`
      );
      const css = await res.text();
      setFontcss(css);
    };

    fetchFontCSS();
  }, [pf, sf]);

  // google tag manager (gtm)
  const tagManagerArgs = {
    gtmId: config.params.tag_manager_id,
  };

  useEffect(() => {
    setTimeout(() => {
      if (config.params.tag_manager_id) {
        TagManager.initialize(tagManagerArgs);
      }
    }, 5000);
  }, [tagManagerArgs]);

  return (
    <JsonContext>
      <Head>
        {/* google font css */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        {fontcss && (
          <style
            dangerouslySetInnerHTML={{
              __html: `${fontcss}`,
            }}
          />
        )}
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </JsonContext>
  );
};

export default App;
