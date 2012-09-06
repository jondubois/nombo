
/**
 * Test dependencies
 *
 * @api private
 */

var HubStore = require('..')
  , should = require('should')

/**
 * Test.
 */

module.exports = {

  'test publishing doesnt get caught by the own store subscriber': function (done) {
    var a = new HubStore(1)

    a.subscribe('woot', function (arg) {
      arg.should.equal('bb');
      a.destroy();
      b.destroy();
      done();
    }, function () {
      a.publish('woot', 'aa');
    });

    done();
  },

  'test storing data for a client': function (done) {
    var store = new HubStore
      , rand = 'test-' + Date.now()
      , client = store.client(rand);

    client.id.should.equal(rand);

    client.set('a', 'b', function (err) {
      should.strictEqual(err, null);

      client.get('a', function (err, val) {
        should.strictEqual(err, null);
        val.should.equal('b');

        client.has('a', function (err, has) {
          should.strictEqual(err, null);
          has.should.be.true;

          client.has('b', function (err, has) {
            should.strictEqual(err, null);
            has.should.be.false;

            client.del('a', function (err) {
              should.strictEqual(err, null);

              client.has('a', function (err, has) {
                should.strictEqual(err, null);
                has.should.be.false;

                client.set('b', 'c', function (err) {
                  should.strictEqual(err, null);

                  client.set('c', 'd', function (err) {
                    should.strictEqual(err, null);

                    client.get('b', function (err, val) {
                      should.strictEqual(err, null);
                      val.should.equal('c');

                      client.get('c', function (err, val) {
                        should.strictEqual(err, null);
                        val.should.equal('d');

                        store.destroy();
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  'test cleaning up clients data': function (done) {
    var rand1 = Math.abs(Math.random() * Date.now() | 0)
      , rand2 = Math.abs(Math.random() * Date.now() | 0);

    var store = new HubStore()
      , client1 = store.client(rand1)
      , client2 = store.client(rand2);

    client1.set('a', 'b', function (err) {
      should.strictEqual(err, null);

      client2.set('c', 'd', function (err) {
        should.strictEqual(err, null);

        client1.has('a', function (err, val) {
          should.strictEqual(err, null);
          val.should.be.true;

          client2.has('c', function (err, val) {
            should.strictEqual(err, null);
            val.should.be.true;

            store.destroy();

            var newstore = new HubStore()
              , newclient1 = newstore.client(rand1)
              , newclient2 = newstore.client(rand2);

            newclient1.has('a', function (err, val) {
              should.strictEqual(err, null);
              val.should.be.false;

              newclient2.has('c', function (err, val) {
                should.strictEqual(err, null);
                val.should.be.false;

                newstore.destroy();
                done();
              });
            });
          });
        });
      });
    });
  },

  'test cleaning up a particular client': function (done) {
    var rand1 = Math.abs(Math.random() * Date.now() | 0)
      , rand2 = Math.abs(Math.random() * Date.now() | 0);

    var store = new HubStore()
      , client1 = store.client(rand1)
      , client2 = store.client(rand2);

    client1.set('a', 'b', function (err) {
      should.strictEqual(err, null);

      client2.set('c', 'd', function (err) {
        should.strictEqual(err, null);

        client1.has('a', function (err, val) {
          should.strictEqual(err, null);
          val.should.be.true;

          client2.has('c', function (err, val) {
            should.strictEqual(err, null);
            val.should.be.true;

            store.clients.should.have.property(rand1);
            store.clients.should.have.property(rand2);
            store.destroyClient(rand1);

            store.clients.should.not.have.property(rand1);
            store.clients.should.have.property(rand2);

            client1.has('a', function (err, val) {
              should.strictEqual(err, null);
              val.should.equal(false);

              store.destroy();
              done();
            });
          });
        });
      });
    });
  },

  'test destroy expiration': function (done) {
    var store = new HubStore()
      , id = Math.abs(Math.random() * Date.now() | 0)
      , client = store.client(id);

    client.set('a', 'b', function (err) {
      should.strictEqual(err, null);
      store.destroyClient(id, 1);

      setTimeout(function () {
        client.get('a', function (err, val) {
          should.strictEqual(err, null);
          val.should.equal('b');
        });
      }, 500);

      setTimeout(function () {
        client.get('a', function (err, val) {
          should.strictEqual(err, null);
          should.strictEqual(val, null);

          store.destroy();
          done();
        });
      }, 1500);
    });
  }

};
