export function svgResponse(svg: string) {
  const encodedSvg = encodeURIComponent(svg);
  const dataUrl = `data:image/svg+xml,${encodedSvg}`;

  return new Response(dataUrl, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=10',
    },
  });
} 