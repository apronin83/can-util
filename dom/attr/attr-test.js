var canEvent = require("can-event");
var domAttr = require('can-util/dom/attr/attr');
var domEvents = require('can-util/dom/events/events');
var MUTATION_OBSERVER = require('can-util/dom/mutation-observer/mutation-observer');


QUnit = require('steal-qunit');

QUnit.module("can-util/dom/attr");

test("attributes event", function () {

	var div = document.createElement("div");

	var attrHandler1 = function(ev) {
		equal(ev.attributeName, "foo", "attribute name is correct");
		equal(ev.target, div, "target");
		equal(ev.oldValue, null, "oldValue");

		equal(div.getAttribute(ev.attributeName), "bar");
		domEvents.removeEventListener.call(div, "attributes", attrHandler1);
	};
	domEvents.addEventListener.call(div, "attributes", attrHandler1);

	domAttr.set(div, "foo", "bar");

	stop();

	setTimeout(function () {
		var attrHandler = function(ev) {
			ok(true, "removed event handler should be called");

			equal(ev.attributeName, "foo", "attribute name is correct");
			equal(ev.target, div, "target");
			equal(ev.oldValue, "bar", "oldValue should be 'bar'");

			equal(div.getAttribute(ev.attributeName), null, "value of the attribute should be null after the remove.");

			domEvents.removeEventListener.call(div, "attributes", attrHandler);
			start();
		};
		domEvents.addEventListener.call(div, "attributes", attrHandler);
		domAttr.remove(div, "foo");

	}, 50);

});

test("attr events without MUTATION_OBSERVER", 9, function(){
	var MO = MUTATION_OBSERVER();
	MUTATION_OBSERVER(null);

	var div = document.createElement("div");

	var attrHandler1 = function(ev) {
		equal(ev.attributeName, "foo", "attribute name is correct");
		equal(ev.target, div, "target");
		equal(ev.oldValue, null, "oldValue");

		equal(div.getAttribute(ev.attributeName), "bar");
		domEvents.removeEventListener.call(div, "attributes", attrHandler1);
	};
	domEvents.addEventListener.call(div, "attributes", attrHandler1);

	domAttr.set(div, "foo", "bar");

	stop();

	setTimeout(function () {
		var attrHandler = function(ev) {
			ok(true, "removed event handler should be called");

			equal(ev.attributeName, "foo", "attribute name is correct");
			equal(ev.target, div, "target");
			equal(ev.oldValue, "bar", "oldValue should be 'bar'");

			equal(div.getAttribute(ev.attributeName), null, "value of the attribute should be null after the remove.");

			domEvents.removeEventListener.call(div, "attributes", attrHandler);
			MUTATION_OBSERVER(MO);
			start();
		};
		domEvents.addEventListener.call(div, "attributes", attrHandler);
		domAttr.remove(div, "foo");

	}, 50);

});



test("attr.set CHECKED attribute works", function(){

	var input = document.createElement("input");
	input.type = "checkbox";

	document.getElementById("qunit-fixture").appendChild(input);

	domAttr.set(input, "CHECKED");
	equal(input.checked, true);

	input.checked = false;

	domAttr.set(input, "CHECKED");

	equal(input.checked, true);
	document.getElementById("qunit-fixture").removeChild(input);
});


test("Map special attributes", function () {

	var div = document.createElement("label");

	document.getElementById("qunit-fixture").appendChild(div);

	domAttr.set(div, "for", "my-for");
	equal(div.htmlFor, "my-for", "Map for to htmlFor");

	if('innerText' in div) {
		domAttr.set(div, "innertext", "my-inner-text");
		equal(div.innerText, "my-inner-text", "Map innertext to innerText");
	}

	domAttr.set(div, "textcontent", "my-content");
	equal(div.textContent, "my-content", "Map textcontent to textContent");

	domAttr.set(div, "readonly");
	equal(div.readOnly, true, "Map readonly to readOnly");

	document.getElementById("qunit-fixture").removeChild(div);
});

test('set class attribute via className or setAttribute for svg (#2015)', function() {
	var div = document.createElement('div');
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var obj = { toString: function() { return 'my-class'; } };

	domAttr.set(div, 'class', 'my-class');
	equal(div.getAttribute('class'), 'my-class', 'class mapped to className');

	domAttr.set(div, 'class', undefined);
	equal(div.getAttribute('class'), '', 'an undefined className is an empty string');

	domAttr.set(div, 'class', obj);
	equal(div.getAttribute('class'), 'my-class', 'you can pass an object to className');

	domAttr.set(svg, 'class', 'my-class');
	equal(svg.getAttribute('class'), 'my-class', 'svg class was set as an attribute');

	domAttr.set(svg, 'class', undefined);
	equal(svg.getAttribute('class'), '', 'an undefined svg class is an empty string');

	domAttr.set(svg, 'class', obj);
	equal(svg.getAttribute('class'), 'my-class', 'you can pass an object to svg class');
});

test("attr.special addEventListener allows custom binding", function(){
	var trigger;
	domAttr.special.foo = {
		addEventListener: function(eventName, handler){
			trigger = function(){
				handler();
			};

			return function(){
				trigger = function(){};
			};
		},
		set: function(val){
			this.foo = val;
			// Trigger an event
			trigger();
		}
	};

	var div = document.createElement("div");

	var times = 0;
	var handler = function(){
		times++;
		equal(times, 1, "addEventListener called");
	};
	domEvents.addEventListener.call(div, "foo", handler);

	domAttr.set(div, "foo", "bar");

	domEvents.removeEventListener.call(div, "foo", handler);

	// Shouldn't happen again.
	domAttr.set(div, "foo", "baz");
	delete domAttr.special.foo;
});

test("'selected' is bindable on an <option>", function(){
	var select = document.createElement("select");
	var option1 = document.createElement("option");
	var option2 = document.createElement("option");
	select.appendChild(option1);
	select.appendChild(option2);

	domEvents.addEventListener.call(option2, "selected", function(){
		ok(true, "selected was called on the option");
	});

	option2.selected = true;
	canEvent.trigger.call(select, "change");

	equal(domAttr.get(option1, "selected"), false, "option1 is not selected");
	equal(domAttr.get(option2, "selected"), true, "option2 is selected");
});

test('get, set, and addEventListener on focused', function(){
	var input = document.createElement("input");
	var ta = document.getElementById("qunit-fixture");

	ta.appendChild(input);

	var focusedCount = 0;
	// fired on blur and focus events
	ok(domAttr.special.focused.addEventListener, "addEventListener implemented");
	domEvents.addEventListener.call(input, "focused", function(){
		focusedCount++;
	});

	equal( domAttr.get(input,"focused"), false, "get not focused" );

	domAttr.set(input, "focused", true);
	equal(focusedCount, 1, "focused event");
	equal( domAttr.get(input,"focused"), true, "get focused" );

	domAttr.set(input, "focused", false);
	equal(focusedCount, 2, "focused event");
	equal( domAttr.get(input,"focused"), false, "get not focused after blur" );
});

test("get, set, and addEventListener on values", function(){
	var select = document.createElement("select");
	select.multiple = true;
	var option1 = document.createElement("option");
	option1.value = "one";
	var option2 = document.createElement("option");
	option2.value = "two";

	select.appendChild(option1);
	select.appendChild(option2);

	var valuesCount = 0;
	domEvents.addEventListener.call(select, "values", function(){
		valuesCount++;
	});

	deepEqual(domAttr.get(select, "values"), [], "None selected to start");

	option1.selected = true;
	canEvent.trigger.call(select, "change");

	equal(valuesCount, 1, "values event");
	deepEqual(domAttr.get(select, "values"), ["one"], "First option is in values");

	option2.selected = true;
	canEvent.trigger.call(select, "change");

	equal(valuesCount, 2, "values event");
	deepEqual(domAttr.get(select, "values"), ["one", "two"], "both selected");

	option1.selected = option2.selected = false;
	canEvent.trigger.call(select, "change");

	equal(valuesCount, 3, "values event");
	deepEqual(domAttr.get(select, "values"), [], "none selected");

	domAttr.set(select, "values", ["two"]);
	
	equal(option1.selected, false, "option1 not selected");
	equal(option2.selected, true, "option2 selected");
	deepEqual(domAttr.get(select, "values"), ["two"], "two is only selected");

});

test("get, set, and addEventListener on innerHTML", function(){
	var div = document.createElement("div");
	div.appendChild(document.createElement("span"));

	var count = 0;
	domEvents.addEventListener.call(div, "innerHTML", function(){
		count++;
	});

	equal(domAttr.get(div, "innerHTML"), "<span></span>", "got innerhtml");

	domAttr.set(div, "innerHTML", "<p>hello</p>");
	canEvent.trigger.call(div, "change");
	equal(count, 1, "innerHTML event");

	equal(domAttr.get(div, "innerHTML"), "<p>hello</p>", "got innerhtml");
});

test("get, set on 'value'", function(){
	var input = document.createElement("input");
	input.value = "foo";

	equal(domAttr.get(input, "value"), "foo", "got the value");

	domAttr.set(input, "value", "bar");
	equal(domAttr.get(input, "value"), "bar", "got the value");

	input.value = "";
	equal(domAttr.get(input, "value"), "", "value is an empty string");
});

test("get/sets the checkedness of a checkbox", function(){
	var input = document.createElement("input");
	input.type = "checkbox";

	equal(domAttr.get(input, "checked"), false, "not checked");

	domAttr.set(input, "checked", true);
	equal(domAttr.get(input, "checked"), true, "now it is true");

	domAttr.set(input, "checked", false);
	equal(domAttr.get(input, "checked"), false, "now it is false");

	domAttr.set(input, "checked");
	equal(domAttr.get(input, "checked"), true, "now it is true");

	domAttr.set(input, "checked", 0);
	equal(domAttr.get(input, "checked"), false, "now it is false");

	domAttr.set(input, "checked", "");
	equal(domAttr.get(input, "checked"), true, "now it is true");
});
