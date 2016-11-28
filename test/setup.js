import dotenv from 'dotenv';
import chai from 'chai';

dotenv.config();

before(function (done) {
  chai.should();
  chai.config.includeStack = true;

  this.expect = chai.expect;
  done();
});
