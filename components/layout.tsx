import { FC, useEffect } from "react";
import Script from "next/script";
import { Layout, Page } from "@vercel/examples-ui";
import type { LayoutProps } from "@vercel/examples-ui/layout";
import { GaProvider } from "@lib/useGa";
import Head from "next/head";

function throwIfSSR() {
  throw new Error("Using GA during SSR is not allowed");
}

function gaHandler() {
  const dataLayer = ((window as any).dataLayer = (window as any).dataLayer || []);

  dataLayer.push(arguments);
}

const OptimizeLayout: FC<LayoutProps> = ({ children, ...props }) => {
  const ga = typeof window === "undefined" ? throwIfSSR : gaHandler;

  // useEffect(() => {
  //   (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  //   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  //   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  //   // @ts-ignore
  //   j.async=true;j.src=
  //   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  //   })(window,document,'script','dataLayer',`${process.env.NEXT_PUBLIC_GOOGLE_TAGMANAGER_ID}`);
  // }, []);

  return (
    <Layout {...props}>
      <Head>
        {/* // eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAGMANAGER_ID}');
                `,
          }}
        ></script>
      </Head>
      <Page>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID}`}
          onLoad={() => {
            // @ts-ignore
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              // @ts-ignore
              dataLayer.push(arguments);
            }
            // @ts-ignore
            gtag("js", new Date());
            // @ts-ignore
            gtag("config", process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID);
          }}
        />
        <Script
          src={`https://www.googleoptimize.com/optimize.js?id=${process.env.NEXT_PUBLIC_OPTIMIZE_CONTAINER_ID}`}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAGMANAGER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <GaProvider value={ga}>{children}</GaProvider>
      </Page>
    </Layout>
  );
};

export default OptimizeLayout;
