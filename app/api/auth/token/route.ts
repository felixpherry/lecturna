import { getToken } from 'next-auth/jwt';

import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXT_AUTH_SECRET;

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req, secret, raw: true });
  return NextResponse.json({ token }, { status: 200 });
};
