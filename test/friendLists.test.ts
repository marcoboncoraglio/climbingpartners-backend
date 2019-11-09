import app from '../src/index'; // Link to your server file
import supertest from 'supertest';

describe('Testing friendList API', () => {
    let id: string;
    const contentType: string = 'application/json; charset=utf-8';

    it('Post friendList', (done) => {
        supertest(app)
            .post('/api/friendLists')
            .send({
                friendList: [1, 2],
                friendRequests: [1],
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(201)
            .end((err, res) => {
                if (err) { throw err; }
                id = res.body._id;
                done();
            });
    });

    it('Get friendList by id', (done) => {
        supertest(app)
            .get(`/api/friendLists/${id}`)
            .expect('Content-Type', contentType)
            .expect(200)
            .end((err, res) => {
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
            .expect(200)
            .end((err, res) => {
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
            .expect(200)
            .end((err, res) => {
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
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.message).toBe('Deleted friendList');
                done();
            });
    });

});


