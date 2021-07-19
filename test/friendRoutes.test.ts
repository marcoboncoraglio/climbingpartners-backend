import app from '../src/index';
import supertest from 'supertest';

let _id: string;
const contentType: string = 'application/json; charset=utf-8';
let token: any;

describe('Testing friendList API', () => {
  beforeAll((done) => {
    supertest(app)
      .post('/api/auth/login')
      .send({
        username: 'marco1',
        password: 'hi',
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        token = res.body.token;
        _id = res.body.id;
        done();
      });
  });

  it('Send friend request', (done) => {
    supertest(app)
      .post('/api/friends/sendFriendRequest')
      .send({
        addedFriendId: '60f564ca494cd40ce031b72b',
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        _id = res.body.id;
        done();
      });
  });

  it('Accept friend request', (done) => {
    supertest(app)
      .post(`/api/friends/acceptFriendRequest`)
      .send({
        acceptedFriendId: '60f564ca494cd40ce031b72b'
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        expect(res.body.id).toEqual(_id);
        done();
      });
  });

  it('Deny friend request', (done) => {
    supertest(app)
      .post(`/api/friends/declineFriendRequest`)
      .send({
        declinedFriendId: '60f564ca494cd40ce031b72b',
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        done();
      });
  });

  
  it('Remove friend', (done) => {
    supertest(app)
      .delete(`/api/friends/removeFriendship`)
      .send({
        removedFriendId: '5fa742a8e2a5c12bf0b67278',
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        done();
      });
  });

});
