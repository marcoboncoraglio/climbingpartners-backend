import app from '../src/index';
import supertest from 'supertest';

describe('Testing userDetails API', () => {
  let _id: string;
  const contentType: string = 'application/json; charset=utf-8';
  let token: any;

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

  it('Post userCard', (done) => {
    supertest(app)
      .post('/api/users/details')
      .send({
        id: _id,
        about: 'hi',
        availableEquipment: ['70m Rope'],
        languagesSpoken: ['Italian'],
        climbingStyles: ['Lead'],
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        _id = res.body.id;
        done();
      });
  });

  it('Get userDetails by id', (done) => {
    supertest(app)
      .get(`/api/users/details`)
      .expect('Content-Type', contentType)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.id).toEqual(_id);
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
      .put(`/api/users/details`)
      .send({
        about: newUserDetails.about,
        availableEquipment: newUserDetails.availableEquipment,
        languagesSpoken: newUserDetails.languagesSpoken,
        climbingStyles: newUserDetails.climbingStyles,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.about).toEqual(newUserDetails.about);

        expect(res.body.availableEquipment).toEqual(
          newUserDetails.availableEquipment
        );

        expect(res.body.languagesSpoken).toEqual(
          newUserDetails.languagesSpoken
        );

        expect(res.body.climbingStyles).toEqual(newUserDetails.climbingStyles);
        done();
      });
  });

  it('Patch userDetails', (done) => {
    const newAbout = 'hi';
    supertest(app)
      .patch(`/api/users/details`)
      .send({
        about: newAbout,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.about).toEqual(newAbout);
        done();
      });
  });

  it('Delete userDetails', (done) => {
    supertest(app)
      .delete(`/api/users/details`)
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.error).toBe('Deleted User Details');
        done();
      });
  });
});
