import { NextResponse } from "next/server";

export async function GET(request) {
  const word = request.headers.get("word");
  const res = await fetch(`http://www.anagramica.com/best/:${word}`);
  const data = await res.json();
  return NextResponse.json(data);
}