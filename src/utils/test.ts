import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import 'sinon-as-promised';

chai.use(chaiAsPromised);

const expect = chai.expect;

export { sinon, expect }
