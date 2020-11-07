import app from '../src/index';
import supertest from 'supertest';
import { getIdFromToken } from '../src/utils/jwtUtils';

describe('Testing locations API', () => {
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

  it('Post location', (done) => {
    supertest(app)
      .post('/api/locations')
      .send({
        lat: 43.1,
        lng: 22.44,
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

  it('Get location by id', (done) => {
    supertest(app)
      .get(`/api/locations/${_id}`)
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

  it('Put location', (done) => {
    const newLocation = {
      lat: 44.1,
      lng: 23.44,
    };

    supertest(app)
      .put(`/api/locations/${_id}`)
      .send({
        lat: newLocation.lat,
        lng: newLocation.lng,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.lat).toEqual(newLocation.lat);

        expect(res.body.lng).toEqual(newLocation.lng);
        done();
      });
  });

  it('Patch location', (done) => {
    const newLat = 43.1;
    supertest(app)
      .patch(`/api/locations/${_id}`)
      .send({
        lat: newLat,
      })
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.lat).toEqual(newLat);
        done();
      });
  });

  it('Delete location', (done) => {
    supertest(app)
      .delete(`/api/locations/${_id}`)
      .set('Content-Type', contentType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        expect(res.body.error).toBe('Deleted Location');
        done();
      });
  });
});
