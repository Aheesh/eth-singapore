export function svgResponse(svg: string) {
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=10',
    },
  });
} 