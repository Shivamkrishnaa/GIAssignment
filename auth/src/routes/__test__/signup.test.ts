import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667317',
      otp: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid phone', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667316',
      otp: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid otp', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667316',
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 with missing phone and otp', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667317'
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      otp: 'alskjdf'
    })
    .expect(400);
});

it('disallows duplicate phone', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: '+917217667317',
      otp: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667317',
      otp: 'password'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667317',
      otp: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
