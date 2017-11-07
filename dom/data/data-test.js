'use strict';

var domData = require("./data");
var domDataState = require("can-dom-data-state");
var diff = require("../../js/diff-object/diff-object");
var getDocument = require('can-globals/document/document');
var mutate = require("../mutate/mutate");
var unit = require('../../test/qunit');

var document = getDocument();

unit.module('can-util/dom/data');

unit.test('domData should be cleaned up if element is removed from DOM', function (assert) {
	var done = assert.async();
	var fixture = document.getElementById('qunit-fixture');
	var origDataKeys = Object.keys(domDataState._data);

	var div = document.createElement('div');
	mutate.appendChild.call(fixture, div);
	domData.set.call(div, "div-data", { abc: "def" });
	var newDataKeys = Object.keys(domDataState._data);
	assert.ok(diff(origDataKeys, newDataKeys).length > 0, "items added to domData._data for div");

	mutate.removeChild.call(fixture, div);

	var checkRemoved = function() {
		if (diff(Object.keys(domDataState._data), origDataKeys).length === 0) {
			assert.ok(true, "domData._data returned to initial state");
			done();
		}
		else {
			setTimeout(checkRemoved, 10);
		}
	};

	checkRemoved();
});

unit.test('domData should be cleaned up if multiple elements are removed from DOM', function (assert) {
	var done = assert.async();
	var fixture = document.getElementById('qunit-fixture');
	var origDataKeys = Object.keys(domDataState._data);

	var div = document.createElement('div');
	mutate.appendChild.call(fixture, div);
	domData.set.call(div, "div-data", { abc: "def" });
	var newDataKeys = Object.keys(domDataState._data);
	assert.ok(diff(origDataKeys, newDataKeys).length > 0, "items added to domData._data for div");

	var p = document.createElement('p');
	mutate.appendChild.call(fixture, p);
	domData.set.call(p, "p-data", { ghi: "jkl" });
	newDataKeys = Object.keys(domDataState._data);
	assert.ok(diff(origDataKeys, newDataKeys).length > 1, "items added to domData._data for p");

	mutate.removeChild.call(fixture, div);
	mutate.removeChild.call(fixture, p);

	var checkRemoved = function() {
		if (diff(Object.keys(domDataState._data), origDataKeys).length === 0) {
			assert.ok(true, "domData._data returned to initial state");
			done();
		}
		else {
			setTimeout(checkRemoved, 10);
		}
	};

	checkRemoved();
});

unit.test('domData should be cleaned up if element is removed from DOM after calling setData for two different keys', function (assert) {
	var fixture = document.getElementById('qunit-fixture');
	var done = assert.async();
	var origDataKeys = Object.keys(domDataState._data);

	var div = document.createElement('div');
	mutate.appendChild.call(fixture, div);
	domData.set.call(div, "div-data", { abc: "def" });
	domData.set.call(div, "div-other-data", { ghi: "jkl" });
	var newDataKeys = Object.keys(domDataState._data);
	assert.ok(diff(origDataKeys, newDataKeys).length > 0, "items added to domData._data for div");

	mutate.removeChild.call(fixture, div);

	var checkRemoved = function() {
		if (diff(Object.keys(domDataState._data), origDataKeys).length === 0) {
			assert.ok(true, "domData._data returned to initial state");
			done();
		}
		else {
			setTimeout(checkRemoved, 10);
		}
	};

	checkRemoved();
});

unit.test('domData should be cleaned up if element is removed from DOM after calling setData twice for the same key', function (assert) {
	var fixture = document.getElementById('qunit-fixture');
	var done = assert.async();
	var origDataKeys = Object.keys(domDataState._data);

	var div = document.createElement('div');
	mutate.appendChild.call(fixture, div);
	domData.set.call(div, "div-data", { abc: "def" });
	domData.set.call(div, "div-data", { ghi: "jkl" });
	var newDataKeys = Object.keys(domDataState._data);
	assert.ok(diff(origDataKeys, newDataKeys).length > 0, "items added to domData._data for div");

	mutate.removeChild.call(fixture, div);

	var checkRemoved = function() {
		if (diff(Object.keys(domDataState._data), origDataKeys).length === 0) {
			assert.ok(true, "domData._data returned to initial state");
			done();
		}
		else {
			setTimeout(checkRemoved, 10);
		}
	};

	checkRemoved();
});

// MutationObserver is needed for this test
if(typeof MutationObserver !== 'undefined'){
	unit.test('domData should count active elements', function (assert){
		var done = assert.async();
		var div = document.createElement('div');
		var fixture = document.getElementById('qunit-fixture');
		var startingCount = domData._elementSetCount;
	
		fixture.appendChild(div);
		domData.set.call(div, 'foo', 'bar');
	
		assert.equal(domData.get.call(div, 'foo'), 'bar', 'foo was set');
		assert.equal(domData._elementSetCount, startingCount + 1, '_elementSetCount incremented');
	
		fixture.removeChild(div);
	
		// Remove event fires on next tick
		setTimeout(function(){
			assert.equal(domData._elementSetCount, startingCount, '_elementSetCount decremented');
			assert.equal(domData.get.call(div, 'foo'), undefined, 'foo was deleted');
			done();
		}, 0);
	});
}
