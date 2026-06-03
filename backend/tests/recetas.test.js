const request = require('supertest')
const app = require('../src/app')

describe('Recetas routes', () => {
  it('GET /api/recetas debe responder', async () => {
    const res = await request(app).get('/api/recetas')
    expect(res.statusCode).not.toBe(404)
  })
})