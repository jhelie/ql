(function () {
	var foo = document.location;

	function inner(x) {
		unknown(x);
	}

	try {
		unknown(foo);
	} catch (e) {
		$('myId').html(e); // NOT OK!
	}

	try {
		inner(foo);
	} catch (e) {
		$('myId').html(e); // NOT OK!
	}

	try {
		unknown(foo + "bar");
	} catch (e) {
		$('myId').html(e); // NOT OK!
	}

	try {
		unknown({ prop: foo });
	} catch (e) {
		$('myId').html(e); // NOT OK!
	}

	try {
		unknown(["bar", foo]);
	} catch (e) {
		$('myId').html(e); // NOT OK!
	}

	function deep(x) {
		deep2(x);
	}
	function deep2(x) {
		inner(x);
	}

	try {
		deep("bar" + foo);
	} catch (e) {
		$('myId').html(e); // NOT OK!
	}

	try {
		var tmp = "bar" + foo;
	} catch (e) {
		$('myId').html(e); // OK 
	}

	function safe(x) {
		var foo = x + "bar";
	}

	try {
		safe(foo);
	} catch (e) {
		$('myId').html(e); // OK 
	}

	try {
		safe.call(null, foo);
	} catch (e) {
		$('myId').html(e); // OK 
	}
	var myWeirdInner;
	try {
		myWeirdInner = function (x) {
			inner(x);
		}
	} catch (e) {
		$('myId').html(e); // OK 
	}
	try {
		myWeirdInner(foo);
	} catch (e) {
		$('myId').html(e); // NOT OK! 
	}

	$('myId').html(foo); // Direct leak, reported by other query.

	try {
		unknown(foo.match(/foo/));
	} catch (e) {
		$('myId').html(e); // NOT OK! 
	}

	try {
		unknown([foo, "bar"]);
	} catch (e) {
		$('myId').html(e); // NOT OK! 
	}

	try {
		try {
			unknown(foo);
		} finally {
			// nothing
		}
	} catch (e) {
		$('myId').html(e); // NOT OK! 
	}
});

var express = require('express');

var app = express();

app.get('/user/:id', function (req, res) {
	try {
		unknown(req.params.id);
	} catch (e) {
		res.send("Exception: " + e); // NOT OK!
	}
});


(function () {
	sessionStorage.setItem('exceptionSession', document.location.search);

	try {
		unknown(sessionStorage.getItem('exceptionSession'));
	} catch (e) {
		$('myId').html(e); // NOT OK
	}
})();


app.get('/user/:id', function (req, res) {
	unknown(req.params.id, (error, res) => {
		if (error) {
			$('myId').html(error); // NOT OK
			return;
		}
		$('myId').html(res); // OK (for now?)
	});
});

(function () {
	var foo = document.location.search;

	new Promise(resolve => unknown(foo, resolve)).catch((e) => {
		$('myId').html(e); // NOT OK
	});

	try {
		null[foo];
	} catch (e) {
		$('myId').html(e); // NOT OK
	}

	try {
		unknown()[foo];
	} catch (e) {
		$('myId').html(e); // OK. We are not sure that `unknown()` is null-ish. 
	}

	try {
		"foo"[foo]
	} catch (e) {
		$('myId').html(e); // OK
	}

	function inner(tainted, resolve) {
		unknown(tainted, resolve);
	}

	new Promise(resolve => inner(foo, resolve)).catch((e) => {
		$('myId').html(e); // NOT OK
	});
})();

app.get('/user/:id', function (req, res) {
	unknown(req.params.id, (error, res) => {
		if (error) {
			$('myId').html(error); // OK (falls through to the next statement) 
		}
		$('myId').html(res); // NOT OK!
	});
});