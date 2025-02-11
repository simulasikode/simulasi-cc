// app/MetadataComponent.tsx  (This is a SERVER component)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulasi Studio",
  description:
    "Screen printing studio base on Yogyakarta, Indonesia. We offer hand-pulled screen printing on paper using water-based ink.",
  keywords: [
    "screen printing",
    "custom printing",
    "fine art",
    "Poster",
    "local screen printing",
    "Sablon Indonesia",
    "Sablon kertas",
    "art printing",
    "CMYK",
    "RGB",
    "COlor",
    "Paper",
  ],
  openGraph: {
    title: "Simulasi Studio Fine Art Printing",
    description:
      "Screen printing studio base on Yogyakarta, Indonesia. We offer hand-pulled screen printing on paper using water-based ink.",
    url: "https://simulasi.studio",
    type: "website",
    images: [
      {
        url: "https://simulasi.studio/images/papersize.svg",
        alt: "Paper Size Chart",
        width: 1200,
        height: 630,
      },
    ],
  },
};

//  We don't *render* anything here, we just export metadata.
//  This component is a *server* component and just holds the Metadata.
export default function MetadataComponent() {
  return null; // Or an empty fragment: <></>
}
