export async function GET(request) {
  const res = await fetch('http://www.anagramica.com/best/:acres');

  const data = await res.json();
  console.log(data)

  // return new Response(data);
  return new Response('Hello, Next.js!')
}