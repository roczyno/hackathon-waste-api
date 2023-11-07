import request from 'supertest';
import app from "../app.js"

describe('Authentication API Tests', () => {
  let userToken = '';

//   test('should register a new user', async () => {
//     const response = await request(app)
//       .post('/api/auth/v1/register')
//       .send({
//         ussername:"roczyno",
//         email: 'test@example.com',
//         password: 'password123',
//         location:"betom",
//         date:"10-10-2022",
//         appType: 'app1',
//       });

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Email sent to your account please verify');
//   });

  test('should login an existing user', async () => {
    const response = await request(app)
      .post('/api/auth/v1//login')
      .send({
        email: 'jacob.adiaba@amalitech.com',
        password: 'Password1@',
      });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    userToken = response.body.accessToken; 
  });

//   test('should handle invalid credentials', async () => {
//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: 'test@example.com',
//         password: 'invalidPassword',
//       });

//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe('Wrong credentials');
//   });

  // Add more test cases for other authentication functions (verifyTokenSentToEmail, passwordResetLink, etc.)

//     

//   test('should handle access to a protected route with an invalid token', async () => {
//     const response = await request(app)
//       .get('/api/some-protected-route')
//       .set('Authorization', 'Bearer invalidToken');

//     expect(response.status).toBe(401);
//     // Add assertions for the response when using an invalid token
//   });
});
