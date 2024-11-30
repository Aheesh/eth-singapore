export function svgResponse(svg: string) {
  // Convert SVG to base64
  const base64Svg = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

  return new Response(dataUrl, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=10',
    },
  });
} 