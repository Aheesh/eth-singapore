export function svgResponse(svg: string) {
  return new Response(Buffer.from(svg), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=10',
      'Access-Control-Allow-Origin': '*'
    },
  });
} 