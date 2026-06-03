const request = require('supertest')
const app = require('../src/app')

describe('Auth routes', () => {
  it('POST /api/auth/register debe responder', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.statusCode).not.toBe(404)
  })

  it('POST /api/auth/login debe responder', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.statusCode).not.toBe(404)
  })
})