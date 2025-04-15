/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "./route";

describe('/api/metadata/disk/:diskId', () => {
  it('returns metadata for a disk id', async () => {
    const req = new NextRequest('http://localhost:3000/api/metadata/disk/1');
    const res = await GET(req, { params: { id: 1 }});
    
    console.log(await res.json());
  });
});

