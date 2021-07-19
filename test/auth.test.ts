import app from '../src/index';
import supertest from 'supertest';
import UserLogin from '../src/models/userLogin';



describe('Testing authentication API: local strategy', () => {
  let user = "aasdfasdfa1";
  let pw = "hello";

  let _id: string;
  let token: string;
  const contentType: string = 'application/json; charset=utf-8';

  it('Register', (done) => {
    supertest(app)
      .post('/api/auth/register')
      .send({
        username: user,
        password: pw,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        token = res.body.token;
        _id = res.body.id;

        done();
      });
  });

  it('Login successful', (done) => {
    supertest(app)
      .post('/api/auth/login')
      .send({
        username: user,
        password: pw,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body).not.toBeUndefined();
        done();
      });
  });

  it('Login unsuccessful', (done) => {
    supertest(app)
      .post('/api/auth/login')
      .send({
        username: 'marcoasdfsadf',
        password: 'hi',
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .expect(401)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.error).toEqual('Password or username is incorrect');
        done();
      });
  });

  it('Deleting test object', (done) => {
    let error = false;
    UserLogin.deleteOne({ _id: _id }, (err) => {
      if (err) {
        error = true;
      }
    });
    expect(error).toBe(false);

    done();
  });
});
