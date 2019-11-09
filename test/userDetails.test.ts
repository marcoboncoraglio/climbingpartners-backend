import app from '../src/index';
import supertest from 'supertest';

describe('Testing userDetails API', () => {
    let id: string;
    const contentType: string = 'application/json; charset=utf-8';

    it('Post userCard', (done) => {
        supertest(app)
            .post('/api/userDetails')
            .send({
                about: 'hi',
                availableEquipment: ['70m Rope'],
                languagesSpoken: ['Italian'],
                climbingStyles: ['Lead'],
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

    it('Get userDetails by id', (done) => {
        supertest(app)
            .get(`/api/userDetails/${id}`)
            .expect('Content-Type', contentType)
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body._id).toEqual(id);
                done();
            });
    });

    it('Put userDetails', (done) => {
        const newUserDetails = {
            about: 'hi1',
            availableEquipment: ['80m Rope'],
            languagesSpoken: ['Italian', 'German'],
            climbingStyles: ['Lead', 'Bouldering'],
        };

        supertest(app)
            .put(`/api/userDetails/${id}`)
            .send({
                about: newUserDetails.about,
                availableEquipment: newUserDetails.availableEquipment,
                languagesSpoken: newUserDetails.languagesSpoken,
                climbingStyles: newUserDetails.climbingStyles,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.about)
                    .toEqual(newUserDetails.about);

                expect(res.body.availableEquipment)
                    .toEqual(newUserDetails.availableEquipment);

                expect(res.body.languagesSpoken)
                    .toEqual(newUserDetails.languagesSpoken);

                expect(res.body.climbingStyles)
                    .toEqual(newUserDetails.climbingStyles);
                done();
            });
    });

    it('Patch userDetails', (done) => {
        const newAbout = 'hi';
        supertest(app)
            .patch(`/api/userDetails/${id}`)
            .send({
                about: newAbout,
            })
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.about)
                    .toEqual(newAbout);
                done();
            });
    });

    it('Delete userDetails', (done) => {
        supertest(app)
            .delete(`/api/userDetails/${id}`)
            .set('Content-Type', contentType)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) { throw err; }
                expect(res.body.message).toBe('Deleted User Details');
                done();
            });
    });

});


