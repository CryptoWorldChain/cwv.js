
var path = require('path');
var JSDOM = require('mocha-jsdom')
var sleep = require('sleep')
var assert = require('assert');
const sinon = require('sinon');

const rp = require ('request-promise');

const dom = new JSDOM({
  url: "http://localhost/"
});

var cwv ;

describe('#testall', function() {
	beforeEach(function() {
		httpPostStub = sinon.stub(rp,'post'); // stub http so we can change the response
	});

	afterEach(function() {
		httpPostStub.restore();
	});


	it('load bundle', function() {
		var bundle = require(path.join(__dirname,"../", 'dist', 'cwvbundle.js'));
		console.log("cwv version="+bundle.cwv["version"]);
		cwv=bundle.cwv;
		cwv.rpc.setMockRequest(rp);
		return true;
	});


	it('test.1-getbalance', async function() {
		var p = cwv.rpc.getBalance("df2fc3cdc723c8f5be2f51b5d051ace6264008ad").then(function(body){
			console.log("get body:"+JSON.stringify(body));
		}).catch(function (error){
			console.log("get error:"+error);
		}).done();
		await p;
		console.log("okok:");
		return p;
	});

});






