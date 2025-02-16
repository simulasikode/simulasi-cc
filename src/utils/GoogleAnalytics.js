"use client";
import Script from "next/script";

function Home() {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-2EQYKBXGNE" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-2EQYKBXGNE');
        `}
      </Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=AW-11462618511`}
      ></Script>
      <Script
        type="text/javascript"
        charset="UTF-8"
        src="//cdn.cookie-script.com/s/52f389459f95adaadd827e990e2225e0.js"
      ></Script>
    </>
  );
}

export default Home;
