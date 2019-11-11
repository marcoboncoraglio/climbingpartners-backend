import app from '../src/index';
import supertest from 'supertest';

let id: string;
const contentType: string = 'application/json; charset=utf-8';
let cookie: any;

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
                if (err) { throw err; }
                id = res.body.id;
                cookie = res.headers['set-cookie'];
                done();
            });
    });

    afterAll((done) => {
        supertest(app)
            .post('/api/auth/logout')
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) { throw err; }
                done();
            });
    });

    it('Post friendList', (done) => {
        supertest(app)
            .post('/api/friendLists')
            .send({
                friendList: [1, 2],
                friendRequests: [1],
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(201)
            .end((err: any, res: any) => {
                if (err) { throw err; }
                id = res.body._id;
                done();
            });
    });

    it('Get friendList by id', (done) => {
        supertest(app)
            .get(`/api/friendLists/${id}`)
            .expect('Content-Type', contentType)
            .set('cookie', cookie)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) { throw err; }
                expect(res.body._id).toEqual(id);
                done();
            });
    });

    it('Put friendList', (done) => {
        const newFriendsLists = {
            friendList: [1, 2, 3],
            friendRequests: [1, 2],
        };

        supertest(app)
            .put(`/api/friendLists/${id}`)
            .send({
                friendList: newFriendsLists.friendList,
                friendRequests: newFriendsLists.friendRequests,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) { throw err; }
                expect(res.body.friendList)
                    .toEqual(newFriendsLists.friendList.map(String));

                expect(res.body.friendRequests)
                    .toEqual(newFriendsLists.friendRequests.map(String));
                done();
            });
    });

    it('Patch friendList', (done) => {
        const newFriendList = [1, 2];
        supertest(app)
            .patch(`/api/friendLists/${id}`)
            .send({
                friendList: newFriendList,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) { throw err; }
                expect(res.body.friendList)
                    .toEqual(newFriendList.map(String));
                done();
            });
    });

    it('Delete friendList', (done) => {
        supertest(app)
            .delete(`/api/friendLists/${id}`)
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) { throw err; }
                expect(res.body.message).toBe('Deleted friendList');
                done();
            });
    });

});


