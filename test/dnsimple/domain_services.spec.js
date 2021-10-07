'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domain services', () => {
  describe('#appliedServices', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const fixture = testUtils.fixture('appliedServices/success.http');

    it('supports pagination', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId, { sort: 'name:asc' });

      nock.isDone();
      done();
    });

    it('produces a service list', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId).then((response) => {
        const services = response.data;
        expect(services.length).to.eq(1);
        expect(services[0].name).to.eq('WordPress');
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#allAppliedServices', () => {
    const accountId = '1010';
    const domainId = 'example.com';

    it('produces a complete list', (done) => {
      const fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.services.allAppliedServices(accountId, domainId).then((items) => {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, (error) => {
        done(error);
      }).catch((error) => {
        done(error);
      });
    });
  });

  describe('#applyService', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const serviceId = 'name';

    it('produces nothing', (done) => {
      const fixture = testUtils.fixture('applyService/success.http');

      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/services/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.applyService(accountId, domainId, serviceId).then((response) => {
        expect(response).to.eql({});
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#unapplyService', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const serviceId = 'name';

    it('produces nothing', (done) => {
      const fixture = testUtils.fixture('unapplyService/success.http');

      nock('https://api.dnsimple.com')
        .delete('/v2/1010/domains/example.com/services/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.unapplyService(accountId, domainId, serviceId).then((response) => {
        expect(response).to.eql({});
        done();
      }, (error) => {
        done(error);
      });
    });
  });
});
