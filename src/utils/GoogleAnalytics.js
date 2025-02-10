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
    </>
  );
}

export default Home;
