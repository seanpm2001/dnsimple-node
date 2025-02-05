import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("domain delegation", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#getDomainDelegation", () => {
    const fixture = loadFixture("getDomainDelegation/success.http");

    it("produces a name server list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/example.com/delegation")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.getDomainDelegation(accountId, domainId).then(
        (response) => {
          const delegation = response.data;
          expect(delegation).to.eql([
            "ns1.dnsimple.com",
            "ns2.dnsimple.com",
            "ns3.dnsimple.com",
            "ns4.dnsimple.com",
          ]);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#changeDomainDelegation", () => {
    const attributes = [
      "ns1.dnsimple.com",
      "ns2.dnsimple.com",
      "ns3.dnsimple.com",
      "ns4.dnsimple.com",
    ];

    it("produces a name server list", (done) => {
      const fixture = loadFixture("changeDomainDelegation/success.http");
      nock("https://api.dnsimple.com")
        .put("/v2/1010/registrar/domains/example.com/delegation", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar
        .changeDomainDelegation(accountId, domainId, attributes)
        .then(
          (response) => {
            const delegation = response.data;
            expect(delegation).to.eql([
              "ns1.dnsimple.com",
              "ns2.dnsimple.com",
              "ns3.dnsimple.com",
              "ns4.dnsimple.com",
            ]);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#changeDomainDelegationToVanity", () => {
    const attributes = ["ns1.example.com", "ns2.example.com"];

    it("produces a name server list", (done) => {
      const fixture = loadFixture(
        "changeDomainDelegationToVanity/success.http"
      );
      nock("https://api.dnsimple.com")
        .put(
          "/v2/1010/registrar/domains/example.com/delegation/vanity",
          attributes
        )
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar
        .changeDomainDelegationToVanity(accountId, domainId, attributes)
        .then(
          (response) => {
            const delegation = response.data;
            expect(delegation.length).to.eq(2);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#changeDomainDelegationFromVanity", () => {
    it("produces nothing", (done) => {
      const fixture = loadFixture(
        "changeDomainDelegationFromVanity/success.http"
      );
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/delegation/vanity")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar
        .changeDomainDelegationFromVanity(accountId, domainId)
        .then(
          (response) => {
            expect(response).to.eql({});
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });
});
