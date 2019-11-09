import app from '../src/index'; // Link to your server file
import supertest from 'supertest';

describe('Testing userCards API', () => {
    let id: string;
    const contentType: string = 'application/json; charset=utf-8';

    it('Post userCard', (done) => {
        supertest(app)
            .post('/api/userCards')
            .send({
                name: 'marco2',
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

    it('Get userCard by id', (done) => {
        supertest(app)
            .get(`/api/userCards/${id}`)
            .expect('Content-Type', contentType)
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body._id).toEqual(id);
                done();
            });
    });

    it('Put userCard', (done) => {
        const newUserCard = {
            name: 'marco1',
            imgUrl: 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        };

        supertest(app)
            .put(`/api/userCards/${id}`)
            .send({
                name: newUserCard.name,
                imgUrl: newUserCard.imgUrl,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.name)
                    .toEqual(newUserCard.name);

                expect(res.body.imgUrl)
                    .toEqual(newUserCard.imgUrl);
                done();
            });
    });

    it('Patch userCard', (done) => {
        const newName = 'jimmy';
        supertest(app)
            .patch(`/api/userCards/${id}`)
            .send({
                name: newName,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.name)
                    .toEqual(newName);
                done();
            });
    });

    it('Delete userCard', (done) => {
        supertest(app)
            .delete(`/api/userCards/${id}`)
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.message).toBe('Deleted User Card');
                done();
            });
    });

});


