import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      phone: '+917217667317',
      otp: 'password'
    })
    .expect(400);
});

it('fails when an incorrect otp is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667317,
      otp: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      phone: '+917217667317',
      password: 'aslkdfjalskdfj'
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      phone: '+917217667317',
      otp: 'password'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      phone: '+917217667317',
      otp: 'password'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
