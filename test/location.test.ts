import app from '../src/index';
import supertest from 'supertest';

describe('Testing locations API', () => {
    let id: string;
    const contentType: string = 'application/json; charset=utf-8';

    it('Post location', (done) => {
        supertest(app)
            .post('/api/locations')
            .send({
                lat: 43.1,
                lng: 22.44,
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

    it('Get location by id', (done) => {
        supertest(app)
            .get(`/api/locations/${id}`)
            .expect('Content-Type', contentType)
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body._id).toEqual(id);
                done();
            });
    });

    it('Put location', (done) => {
        const newLocation = {
            lat: 44.1,
            lng: 23.44,
        };

        supertest(app)
            .put(`/api/locations/${id}`)
            .send({
                lat: newLocation.lat,
                lng: newLocation.lng,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.lat)
                    .toEqual(newLocation.lat);

                expect(res.body.lng)
                    .toEqual(newLocation.lng);
                done();
            });
    });

    it('Patch location', (done) => {
        const newLat = 43.1;
        supertest(app)
            .patch(`/api/locations/${id}`)
            .send({
                lat: newLat,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.lat)
                    .toEqual(newLat);
                done();
            });
    });

    it('Delete friendList', (done) => {
        supertest(app)
            .delete(`/api/locations/${id}`)
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.message).toBe('Deleted Location');
                done();
            });
    });

});


