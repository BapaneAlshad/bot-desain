import { NextResponse } from "next/server";
import { checkHermesHealth } from "@/lib/hermes/client";

export async function GET() {
  const health = await checkHermesHealth();
  return NextResponse.json(health);
}
