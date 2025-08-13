import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from 'next/font/google';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ['latin'] 
})
const orbitron = Orbitron({ 
  variable: "--font-orbitron",
  subsets: ['latin'] 
})

// Get the base URL for metadata
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Ridiculous Rumors - AI Conspiracy Theory Generator for Comedy",
  description: "Generate hilarious and completely fictional conspiracy theories with our AI-powered comedy generator. Perfect for entertainment, creative writing, and getting a good laugh. All theories are satirical fiction.",
  keywords: [
    "conspiracy theory generator", 
    "humor", 
    "satire", 
    "entertainment", 
    "fictional", 
    "comedy", 
    "AI generator",
    "funny theories",
    "parody",
    "creative writing",
    "joke generator",
    "satirical content"
  ],
  authors: [{ name: "Ridiculous Rumors", url: "https://ridiculousrumors.com" }],
  creator: "Ridiculous Rumors",
  publisher: "Ridiculous Rumors",
  category: "Entertainment",
  classification: "Entertainment/Comedy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // OpenGraph for Facebook, LinkedIn, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/", // This will resolve to the full URL with metadataBase
    siteName: "Ridiculous Rumors",
    title: "Ridiculous Rumors - AI Conspiracy Theory Generator",
    description: "Generate hilarious fictional conspiracy theories with AI. Perfect for comedy, entertainment, and creative inspiration. All content is satirical fiction.",
    images: [
      {
        url: "/og-image.png", // This will resolve to the full URL
        width: 1200,
        height: 630,
        alt: "Ridiculous Rumors - AI Comedy Conspiracy Theory Generator",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 1080,
        height: 1080,
        alt: "Ridiculous Rumors Logo",
        type: "image/png",
      }
    ],
  },

  // Twitter/X Cards
  twitter: {
    card: "summary_large_image",
    site: "@RidiculousRumors", // Replace with your actual Twitter handle
    creator: "@RidiculousRumors", // Replace with your actual Twitter handle
    title: "Ridiculous Rumors - AI Conspiracy Theory Generator",
    description: "Generate hilarious fictional conspiracy theories with AI. All content is satirical fiction for entertainment only.",
    images: {
      url: "/twitter-image.png", // This will resolve to the full URL
      alt: "Ridiculous Rumors - AI Comedy Generator",
    },
  },

  // Additional meta tags
  other: {
    "theme-color": "#22c55e",
    "color-scheme": "dark",
    "format-detection": "telephone=no",
    "disclaimer": "All content is fictional and for entertainment purposes only",
    "content-type": "Comedy/Entertainment",
    "audience": "General",
    "rating": "General",
    // Open Graph Article (for individual theory pages)
    "article:author": "Ridiculous Rumors AI",
    "article:section": "Entertainment",
    "article:tag": "Comedy, Satire, Fictional, Entertainment",
  },

  // Verification tags (add your actual verification codes)
  verification: {
    google: "your-google-verification-code", // Replace with actual code
    // facebook: "your-facebook-verification-code", // Uncomment and replace if needed
    // other: {
    //   pinterest: "your-pinterest-verification-code", // Uncomment and replace if needed
    // }
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#22c55e" },
    ],
  },

  // Manifest for PWA
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${getBaseUrl()}/#website`,
        "url": getBaseUrl(),
        "name": "Ridiculous Rumors",
        "description": "AI-powered comedy conspiracy theory generator for entertainment",
        "publisher": {
          "@id": `${getBaseUrl()}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${getBaseUrl()}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": `${getBaseUrl()}/#organization`,
        "name": "Ridiculous Rumors",
        "url": getBaseUrl(),
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": `${getBaseUrl()}/#/schema/logo/image/`,
          "url": `${getBaseUrl()}/logo.png`,
          "contentUrl": `${getBaseUrl()}/logo.png`,
          "width": 512,
          "height": 512,
          "caption": "Ridiculous Rumors"
        },
        "description": "Entertainment website generating fictional conspiracy theories for comedy purposes",
        "sameAs": [
          "https://twitter.com/RidiculousRumors", // Replace with actual social links
          "https://facebook.com/RidiculousRumors", // Replace with actual social links
        ]
      },
      {
        "@type": "WebApplication",
        "name": "Ridiculous Rumors Generator",
        "url": getBaseUrl(),
        "description": "AI-powered conspiracy theory generator for entertainment and comedy",
        "applicationCategory": "Entertainment",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@id": `${getBaseUrl()}/#organization`
        }
      },
      {
        "@type": "CreativeWork",
        "name": "AI Comedy Generator",
        "description": "Generates fictional conspiracy theories for entertainment purposes",
        "genre": "Comedy",
        "audience": {
          "@type": "Audience",
          "audienceType": "General Public"
        },
        "contentRating": "General Audiences",
        "creator": {
          "@id": `${getBaseUrl()}/#organization`
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="color-scheme" content="dark" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Google Ads */}
        <meta name="google-adsense-account" content="ca-pub-5777200462066598"></meta>

        {/* Canonical URL - now uses metadataBase */}
        <link rel="canonical" href={getBaseUrl()} />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Twitter Card additional tags */}
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
        
        {/* Additional meta tags for rich previews */}
        <meta name="application-name" content="Ridiculous Rumors" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Copyright and disclaimer */}
        <meta name="copyright" content="© 2024 Ridiculous Rumors. All rights reserved." />
        <meta name="disclaimer" content="All generated content is fictional and for entertainment purposes only." />

        {/* Google Tag Manager using next/script */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
        >
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PMVWTX73');
          `}
        </Script>
        
      </head>
      <body className={`${jetbrainsMono.variable} ${orbitron.variable}`}>
        
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PMVWTX73"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}