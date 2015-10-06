suite('Browser API', function () {

  setup(function (done) {
    // phantomjs seems to keep session data between runs,
    // so clear before running tests
    localStorage.clear();
    hoodie.account.signOut().done(function () {
      done();
    });
  });

  test('hoodie.global exists', function () {
    assert.ok(hoodie.global);
  });

  test('publish as testuser1, read as testuser2', function (done) {
    this.timeout(10000);
    var docid;
    var task = hoodie.account.signUp('testuser1', 'testing')
      .then(function () {
        return hoodie.store.add('test', {title: 'foo'}).publish()
          .then(function (x) {
            // Note that .publish() returns an array
            docid = x[0].id;
            return x;
          })
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        return hoodie.account.signUp('testuser2', 'testing');
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(false, err.message);
              done();
            })
            .done(function (doc) {
              assert.equal(doc.title, 'foo');
              done();
            })
        }, 2000);
      })
      .fail(function (err) {
        assert.ok(false, err.message);
        done();
      });
  });

  test('publish as testuser3, read as anonymous', function (done) {
    this.timeout(10000);
    var docid;
    var task = hoodie.account.signUp('testuser3', 'testing')
      .then(function () {
        return hoodie.store.add('test', {title: 'foo'}).publish()
          .then(function (x) {
            docid = x[0].id;
            return x;
          })
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(false, err.message);
              done();
            })
            .done(function (doc) {
              assert.equal(doc.title, 'foo');
              done();
            })
        }, 2000);
      })
      .fail(function (err) {
        assert.ok(false, err.message);
        done();
      });
  });

  test('testuser4 publish, read anonymous, unpublish, read anonymous', function (done) {
    this.timeout(10000);
    var docid;
    var task = hoodie.account.signUp('testuser4', 'testing')
      .then(function () {
        return hoodie.store.add('test', {title: 'foo'}).publish()
          .then(function (x) {
            docid = x[0].id;
            return x;
          })
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(false, err.message);
              done();
            })
            .done(function (doc) {
              assert.equal(doc.title, 'foo');
              done();
            })
        }, 2000);
      })
      .then(function () {
        return hoodie.account.signIn('testuser4', 'testing');
      })
      .then(function () {
        return hoodie.store.find('test', docid).unpublish();
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(err);
              done();
            })
            .done(function (doc) {
              assert.ok(false, 'should not return doc');
              done();
            })
        }, 2000);
      })
      .fail(function (err) {
        assert.ok(false, err.message);
        done();
      });
  });

//   test('publish two docs, then find them using .findAll(type)', function (done) {
//     this.timeout(10000);
//     var type = 'testfindall';
//     var task = hoodie.account.signUp('testuser5', 'testing')
//     .then(function () {
//       return hoodie.store.add(type, {title: 'foo'}).publish()
//       .then(function(){
//         return hoodie.store.add(type, {title: 'foo2'}).publish()
//         .then(function(){
//           // wait a bit to make sure the data has synced from the server
//           setTimeout(function () {
//             hoodie.global.findAll(type)
//             .fail(function (err) {
//               console.log('fail 1');
//               assert.ok(false, err.message);
//               done();
//             })
//             // TODO: Start here.  The assert fails, then the test times out here.
//             //  Both docs replicate, but they aren't visible here, I'm guessing due to a timing issue.
//             .then(function (docs) {
//               console.log('assert 1');
//               debugger;
//               assert.equal(docs.length, 2);
//             })
//             .then(function(){
//               return hoodie.account.signOut();
//             })
//             .then(function () {
//               // wait a bit to make sure the data has synced from the server
//               setTimeout(function () {
//                 hoodie.global.findAll(type)
//                 .fail(function (err) {
//                   console.log('fail 2');
//                   assert.ok(false, err.message);
//                   done();
//                 })
//                 .done(function (docs) {
//                   console.log('assert 2');
//                   assert.equal(docs.length, 2);
//                   done();
//                 });
//               }, 2000);
//             })
//           }, 4000);          
//         })
//         .fail(function(err){
//           console.log(err);
//           assert.ok(false, err.message);
//           done();
//         });
//       })
//       .fail(function(err){
//         console.log(err);
//         assert.ok(false, err.message);
//         done();
//       });
//     })
//     .fail(function (err) {
//       console.log('fail 3');
//       assert.ok(false, err.message);
//       done();
//     });
//   });

  test('publish two docs, then find them using .findAll(type)', function (done) {
    this.timeout(10000);
    var type = 'testfindall';
    var task = hoodie.account.signUp('testuser5', 'testing')
    .then(function(){
      // TODO: Why doesn't $publish get set on this one?
      return hoodie.store.add(type, {title: 'foo'}).publish();
    })
    .then(function(){
      return hoodie.store.add(type, {title: 'foo2'}).publish();
    })
    .then(function(){
      // wait a bit to make sure the data has synced from the server
      setTimeout(function () {
        hoodie.global.findAll(type)
        // TODO: Start here.  The assert fails, then the test times out here.
        //  (Sometimes?) Both docs replicate, but they aren't visible here, I'm guessing due to a timing issue.
        .then(function (docs) {
          console.log('assert 1');
          debugger;
          assert.equal(docs.length, 2);
        })
        .then(function(){
          return hoodie.account.signOut();
        })
        .then(function () {
          // wait a bit to make sure the data has synced from the server
          setTimeout(function () {
            hoodie.global.findAll(type)
            .fail(function (err) {
              console.log('fail 2');
              assert.ok(false, err.message);
              done();
            })
            .done(function (docs) {
              console.log('assert 2');
              assert.equal(docs.length, 2);
              done();
            });
          }, 2000);
        })
      }, 4000);          
    })
  });

  test('publish two docs, then find them using .findAll(function(){}) syntax', function (done) {
    done();
  });

});
