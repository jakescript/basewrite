import { POST } from './route'

describe('/api/contribute', () => {
  it('creates a contribution', async () => {
    const req = {
      tokenId: 1,
      length: 10,
      content: '',
      author: ''
    }

    const res = await POST(req)
  })
})
