import app from '../src/index';
import supertest from 'supertest';

let _id: string;
const contentType: string = 'application/json; charset=utf-8';
let token: any;

// todo: add tests for new friends api
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
      .post('/api/friendLists')
      .send({
        friendList: [1, 2],
        friendRequests: [1],
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
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
      .get(`/api/friendLists/`)
      .expect('Content-Type', contentType)
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
    const newFriendsLists = {
      friendList: [1, 2, 3],
      friendRequests: [1, 2],
    };

    supertest(app)
      .put(`/api/friendLists/`)
      .send({
        friendList: newFriendsLists.friendList,
        friendRequests: newFriendsLists.friendRequests,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        expect(res.body.friendList).toEqual(
          newFriendsLists.friendList.map(String)
        );

        expect(res.body.friendRequests).toEqual(
          newFriendsLists.friendRequests.map(String)
        );
        done();
      });
  });

  it('Patch friendList', (done) => {
    const newFriendList = [1, 2];
    supertest(app)
      .patch(`/api/friendLists/`)
      .send({
        friendList: newFriendList,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        expect(res.body.friendList).toEqual(newFriendList.map(String));
        done();
      });
  });
});
