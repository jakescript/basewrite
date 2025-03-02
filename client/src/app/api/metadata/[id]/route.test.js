/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "./route";

describe('/api/metadata', () => {
  it('returns metadata for a token id', async () => {
    const req = new NextRequest('http://localhost:3000/api/metadata/1');
    const res = await GET(req, { params: { id: 1 }});
    
    console.log(await res.json());
  });
});

