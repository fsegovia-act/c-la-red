import { PRODUCTION } from "../../_lib/constant";

interface GTMNoScriptProps {
  gtmId: string;
}

export default function GoogleTagManagerNoScript({ gtmId }: GTMNoScriptProps) {
  if (process.env.NODE_ENV !== PRODUCTION) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager NoScript"
      />
    </noscript>
  );
}
