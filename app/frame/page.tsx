export default function FramePage() {
  return (
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://eth-singapore-woad.vercel.app/api/generateImage" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Ding" />
        <meta property="fc:frame:button:2" content="Gukesh" />
        <meta property="fc:frame:button:3" content="Draw" />
        <meta property="fc:frame:post_url" content="https://eth-singapore-woad.vercel.app/api/frame" />
      </head>
      <body>
        <h1>Baller Chess Frame</h1>
      </body>
    </html>
  )
} 