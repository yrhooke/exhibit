(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}



function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$SalesGallery$Model = F2(
	function (data, closeIconURL) {
		return {closeIconURL: closeIconURL, data: data};
	});
var $author$project$SalesGallery$Artwork = function (id) {
	return function (url) {
		return function (image) {
			return function (title) {
				return function (series) {
					return function (year) {
						return function (priceUSD) {
							return function (priceNIS) {
								return function (sizeCm) {
									return function (sizeIn) {
										return function (saleData) {
											return {id: id, image: image, priceNIS: priceNIS, priceUSD: priceUSD, saleData: saleData, series: series, sizeCm: sizeCm, sizeIn: sizeIn, title: title, url: url, year: year};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $author$project$SaleData$Behind = {$: 'Behind'};
var $author$project$SaleData$Model = F5(
	function (saleData, updated, errors, csrftoken, icons) {
		return {csrftoken: csrftoken, errors: errors, icons: icons, saleData: saleData, updated: updated};
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2($elm$core$Basics$composeR, $elm$json$Json$Decode$succeed, $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var $author$project$SaleData$Icons = F3(
	function (loaderIconURL, successIconURL, failIconURL) {
		return {failIconURL: failIconURL, loaderIconURL: loaderIconURL, successIconURL: successIconURL};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (_v0.$ === 'Ok') {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (_v1.$ === 'Ok') {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _v1.a;
					return $elm$json$Json$Decode$fail(
						$elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$SaleData$iconsDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'fail_icon',
	$elm$json$Json$Decode$string,
	'',
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'success_icon',
		$elm$json$Json$Decode$string,
		'',
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'loader_icon',
			$elm$json$Json$Decode$string,
			'',
			$elm$json$Json$Decode$succeed($author$project$SaleData$Icons))));
var $author$project$SaleData$SaleData = function (id) {
	return function (artwork) {
		return function (buyer) {
			return function (agent) {
				return function (notes) {
					return function (saleCurrency) {
						return function (salePrice) {
							return function (discount) {
								return function (agentFee) {
									return function (amountToArtist) {
										return function (saleDate) {
											return {agent: agent, agentFee: agentFee, amountToArtist: amountToArtist, artwork: artwork, buyer: buyer, discount: discount, id: id, notes: notes, saleCurrency: saleCurrency, saleDate: saleDate, salePrice: salePrice};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$InputResize$estimateRows = F2(
	function (settings, content) {
		var rowHeight = settings.fontSize * settings.lineHeight;
		var numRows = function (line) {
			return (line === '') ? 1 : $elm$core$Basics$ceiling(
				$elm$core$String$length(line) / settings.columns);
		};
		var lines = A2($elm$core$String$split, '\n', content);
		return rowHeight * A3(
			$elm$core$List$foldl,
			$elm$core$Basics$add,
			1,
			A2($elm$core$List$map, numRows, lines));
	});
var $author$project$InputResize$fromContent = F2(
	function (settings, content) {
		return {
			content: content,
			height: A2($author$project$InputResize$estimateRows, settings, content),
			isMeasuring: false
		};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$InputResize$defaultSettings = {
	columns: $elm$core$Basics$round(50),
	divID: 'elm-textarea-resize',
	fontSize: 17,
	lineHeight: 1.2,
	width: '300px'
};
var $author$project$SaleData$settingsNotes = $author$project$InputResize$defaultSettings;
var $author$project$SaleData$saleDataDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'saleDate',
	$elm$json$Json$Decode$string,
	'',
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'amountToArtist',
		$elm$json$Json$Decode$string,
		'',
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'agentFee',
			$elm$json$Json$Decode$string,
			'',
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'discount',
				$elm$json$Json$Decode$string,
				'',
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'salePrice',
					$elm$json$Json$Decode$string,
					'',
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'saleCurrency',
						$elm$json$Json$Decode$string,
						'',
						A4(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'notes',
							A2(
								$elm$json$Json$Decode$map,
								$author$project$InputResize$fromContent($author$project$SaleData$settingsNotes),
								$elm$json$Json$Decode$string),
							A2($author$project$InputResize$fromContent, $author$project$SaleData$settingsNotes, ''),
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'agent',
								$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int),
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'buyer',
									$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int),
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'artwork',
										$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int),
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'id',
											$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int),
											$elm$json$Json$Decode$succeed($author$project$SaleData$SaleData))))))))))));
var $author$project$SaleData$decode = A2(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
	$author$project$SaleData$iconsDecoder,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'csrftoken',
		$elm$json$Json$Decode$string,
		'',
		A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
			_List_Nil,
			A2(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
				$author$project$SaleData$Behind,
				A2(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
					$author$project$SaleData$saleDataDecoder,
					$elm$json$Json$Decode$succeed($author$project$SaleData$Model))))));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$SalesGallery$Size = F3(
	function (width, height, unit) {
		return {height: height, unit: unit, width: width};
	});
var $author$project$SalesGallery$sizeDecoder = function (unit) {
	var width = 'width_' + unit;
	var height = 'height_' + unit;
	return A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
		unit,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			height,
			A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				width,
				A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float),
				$elm$json$Json$Decode$succeed($author$project$SalesGallery$Size))));
};
var $author$project$SalesGallery$artworkDecoder = A2(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
	A2($elm$json$Json$Decode$field, 'sale_data', $author$project$SaleData$decode),
	A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
		$author$project$SalesGallery$sizeDecoder('in'),
		A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			$author$project$SalesGallery$sizeDecoder('cm'),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'price_usd',
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float)),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'price_nis',
					$elm$json$Json$Decode$maybe(
						A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float)),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'year',
						A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'series',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'title',
								$elm$json$Json$Decode$string,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'image',
									$elm$json$Json$Decode$string,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'url',
										$elm$json$Json$Decode$string,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'id',
											$elm$json$Json$Decode$int,
											$elm$json$Json$Decode$succeed($author$project$SalesGallery$Artwork))))))))))));
var $NoRedInk$list_selection$List$Selection$Selection = F2(
	function (a, b) {
		return {$: 'Selection', a: a, b: b};
	});
var $NoRedInk$list_selection$List$Selection$fromList = function (items) {
	return A2($NoRedInk$list_selection$List$Selection$Selection, $elm$core$Maybe$Nothing, items);
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$core$Debug$log = _Debug_log;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$SalesGallery$init = function (flags) {
	var modelDecoder = A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'closeIconURL',
		$elm$json$Json$Decode$string,
		'',
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'data',
			A2(
				$elm$json$Json$Decode$map,
				function (a) {
					return $NoRedInk$list_selection$List$Selection$fromList(a);
				},
				$elm$json$Json$Decode$list($author$project$SalesGallery$artworkDecoder)),
			$NoRedInk$list_selection$List$Selection$fromList(_List_Nil),
			$elm$json$Json$Decode$succeed($author$project$SalesGallery$Model)));
	var _v0 = A2($elm$json$Json$Decode$decodeValue, modelDecoder, flags);
	if (_v0.$ === 'Ok') {
		var model = _v0.a;
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	} else {
		var e = _v0.a;
		var debug_init = A2($elm$core$Debug$log, 'error initializing list:', e);
		return _Utils_Tuple2(
			{
				closeIconURL: '',
				data: $NoRedInk$list_selection$List$Selection$fromList(_List_Nil)
			},
			$elm$core$Platform$Cmd$none);
	}
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$SalesGallery$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$SalesGallery$NoOp = {$: 'NoOp'};
var $NoRedInk$list_selection$List$Selection$deselect = function (_v0) {
	var items = _v0.b;
	return A2($NoRedInk$list_selection$List$Selection$Selection, $elm$core$Maybe$Nothing, items);
};
var $author$project$SalesGallery$GotViewPort = function (a) {
	return {$: 'GotViewPort', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$SalesGallery$getArtworkPosition = function (artworkID) {
	return A2(
		$elm$core$Task$attempt,
		$author$project$SalesGallery$GotViewPort,
		$elm$browser$Browser$Dom$getElement(
			'artwork_wrapper' + $elm$core$String$fromInt(artworkID)));
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $NoRedInk$list_selection$List$Selection$selectBy = F2(
	function (query, _v0) {
		var original = _v0.a;
		var items = _v0.b;
		return A2(
			$NoRedInk$list_selection$List$Selection$Selection,
			A2(
				$elm$core$Maybe$withDefault,
				original,
				A2(
					$elm$core$Maybe$map,
					$elm$core$Maybe$Just,
					$elm$core$List$head(
						A2($elm$core$List$filter, query, items)))),
			items);
	});
var $elm$browser$Browser$Dom$setViewport = _Browser_setViewport;
var $author$project$SalesGallery$SaleDataUpdated = function (a) {
	return {$: 'SaleDataUpdated', a: a};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $NoRedInk$list_selection$List$Selection$mapSelected = F2(
	function (mappers, _v0) {
		var selectedItem = _v0.a;
		var items = _v0.b;
		return A2(
			$NoRedInk$list_selection$List$Selection$Selection,
			A2($elm$core$Maybe$map, mappers.selected, selectedItem),
			A2(
				$elm$core$List$map,
				function (item) {
					return _Utils_eq(
						$elm$core$Maybe$Just(item),
						selectedItem) ? mappers.selected(item) : mappers.rest(item);
				},
				items));
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $NoRedInk$list_selection$List$Selection$selected = function (_v0) {
	var selectedItem = _v0.a;
	return selectedItem;
};
var $author$project$SaleData$Failed = {$: 'Failed'};
var $author$project$SaleData$ServerResponse = function (a) {
	return {$: 'ServerResponse', a: a};
};
var $author$project$SaleData$UpdateNotes = function (a) {
	return {$: 'UpdateNotes', a: a};
};
var $author$project$SaleData$Updated = {$: 'Updated'};
var $author$project$SaleData$Updating = {$: 'Updating'};
var $author$project$SaleData$AgentFee = {$: 'AgentFee'};
var $author$project$SaleData$AmountToArtist = {$: 'AmountToArtist'};
var $author$project$SaleData$SaleCurrency = {$: 'SaleCurrency'};
var $author$project$SaleData$SaleDate = {$: 'SaleDate'};
var $author$project$SaleData$SalePrice = {$: 'SalePrice'};
var $rtfeldman$elm_validate$Validate$Validator = function (a) {
	return {$: 'Validator', a: a};
};
var $rtfeldman$elm_validate$Validate$all = function (validators) {
	var newGetErrors = function (subject) {
		var accumulateErrors = F2(
			function (_v0, totalErrors) {
				var getErrors = _v0.a;
				return _Utils_ap(
					totalErrors,
					getErrors(subject));
			});
		return A3($elm$core$List$foldl, accumulateErrors, _List_Nil, validators);
	};
	return $rtfeldman$elm_validate$Validate$Validator(newGetErrors);
};
var $rtfeldman$elm_validate$Validate$any = F2(
	function (validators, subject) {
		any:
		while (true) {
			if (!validators.b) {
				return true;
			} else {
				var getErrors = validators.a.a;
				var others = validators.b;
				var _v1 = getErrors(subject);
				if (!_v1.b) {
					var $temp$validators = others,
						$temp$subject = subject;
					validators = $temp$validators;
					subject = $temp$subject;
					continue any;
				} else {
					var error = _v1.a;
					return false;
				}
			}
		}
	});
var $rtfeldman$elm_validate$Validate$ifTrue = F2(
	function (test, error) {
		var getErrors = function (subject) {
			return test(subject) ? _List_fromArray(
				[error]) : _List_Nil;
		};
		return $rtfeldman$elm_validate$Validate$Validator(getErrors);
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$DateValidator$Day = function (a) {
	return {$: 'Day', a: a};
};
var $author$project$DateValidator$dayFromInt = function (number) {
	return ((number > 0) && (number <= 31)) ? $elm$core$Maybe$Just(
		$author$project$DateValidator$Day(number)) : $elm$core$Maybe$Nothing;
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$DateValidator$joinIndices = function (element) {
	return A2(
		$elm$core$Maybe$map,
		function (v) {
			return _Utils_Tuple2(element.a, v);
		},
		element.b);
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$DateValidator$findMatches = F2(
	function (stringParser, potentialMatches) {
		return A2(
			$elm$core$List$filterMap,
			$author$project$DateValidator$joinIndices,
			A2(
				$elm$core$List$indexedMap,
				$elm$core$Tuple$pair,
				A2($elm$core$List$map, stringParser, potentialMatches)));
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$DateValidator$getUniqueMatch = F2(
	function (stringParser, potentialMatches) {
		var matches = A2($author$project$DateValidator$findMatches, stringParser, potentialMatches);
		return _Utils_eq(
			$elm$core$List$tail(matches),
			$elm$core$Maybe$Just(_List_Nil)) ? $elm$core$List$head(matches) : $elm$core$Maybe$Nothing;
	});
var $author$project$DateValidator$findDay = $author$project$DateValidator$getUniqueMatch(
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$toInt,
		$elm$core$Maybe$andThen($author$project$DateValidator$dayFromInt)));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$DateValidator$Month = function (a) {
	return {$: 'Month', a: a};
};
var $author$project$DateValidator$monthFromInt = function (number) {
	return ((number > 0) && (number <= 12)) ? $elm$core$Maybe$Just(
		$author$project$DateValidator$Month(number)) : $elm$core$Maybe$Nothing;
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$DateValidator$monthNames = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('january', 1),
			_Utils_Tuple2('jan', 1),
			_Utils_Tuple2('february', 2),
			_Utils_Tuple2('feb', 2),
			_Utils_Tuple2('march', 3),
			_Utils_Tuple2('mar', 3),
			_Utils_Tuple2('april', 4),
			_Utils_Tuple2('ap', 4),
			_Utils_Tuple2('may', 5),
			_Utils_Tuple2('june', 6),
			_Utils_Tuple2('jun', 6),
			_Utils_Tuple2('july', 7),
			_Utils_Tuple2('jul', 7),
			_Utils_Tuple2('august', 8),
			_Utils_Tuple2('aug', 8),
			_Utils_Tuple2('september', 9),
			_Utils_Tuple2('sep', 9),
			_Utils_Tuple2('october', 10),
			_Utils_Tuple2('oct', 10),
			_Utils_Tuple2('november', 11),
			_Utils_Tuple2('nov', 11),
			_Utils_Tuple2('december', 12),
			_Utils_Tuple2('dec', 12)
		]));
var $elm$core$String$toLower = _String_toLower;
var $author$project$DateValidator$monthFromName = function (name) {
	return A2(
		$elm$core$Maybe$andThen,
		$author$project$DateValidator$monthFromInt,
		A2(
			$elm$core$Dict$get,
			$elm$core$String$toLower(name),
			$author$project$DateValidator$monthNames));
};
var $author$project$DateValidator$findMonth = $author$project$DateValidator$getUniqueMatch($author$project$DateValidator$monthFromName);
var $author$project$DateValidator$Year = function (a) {
	return {$: 'Year', a: a};
};
var $author$project$DateValidator$yearFromInt = function (number) {
	return (number > 999) ? $elm$core$Maybe$Just(
		$author$project$DateValidator$Year(number)) : $elm$core$Maybe$Nothing;
};
var $author$project$DateValidator$findYear = $author$project$DateValidator$getUniqueMatch(
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$toInt,
		$elm$core$Maybe$andThen($author$project$DateValidator$yearFromInt)));
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
var $author$project$DateValidator$Date = F3(
	function (a, b, c) {
		return {$: 'Date', a: a, b: b, c: c};
	});
var $author$project$DateValidator$daysInMonth = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(1, 31),
			_Utils_Tuple2(2, 29),
			_Utils_Tuple2(3, 31),
			_Utils_Tuple2(4, 30),
			_Utils_Tuple2(5, 31),
			_Utils_Tuple2(6, 30),
			_Utils_Tuple2(7, 31),
			_Utils_Tuple2(8, 31),
			_Utils_Tuple2(9, 30),
			_Utils_Tuple2(10, 31),
			_Utils_Tuple2(11, 30),
			_Utils_Tuple2(12, 31)
		]));
var $author$project$DateValidator$isValidDayMonth = F2(
	function (day, month) {
		var m = month.a;
		var _v1 = A2($elm$core$Dict$get, m, $author$project$DateValidator$daysInMonth);
		if (_v1.$ === 'Just') {
			var maxDays = _v1.a;
			var d = day.a;
			return _Utils_cmp(d, maxDays) < 1;
		} else {
			return false;
		}
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$DateValidator$isValidDate = F3(
	function (year, month, day) {
		if (A2($author$project$DateValidator$isValidDayMonth, day, month)) {
			var y = year.a;
			if (((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y))) {
				return true;
			} else {
				var m = month.a;
				if (m === 2) {
					var d = day.a;
					return d < 29;
				} else {
					return true;
				}
			}
		} else {
			return false;
		}
	});
var $author$project$DateValidator$maybeDate = F3(
	function (yearPair, monthPair, dayPair) {
		var mutuallyExclusive = F3(
			function (a, b, c) {
				return (!_Utils_eq(a, b)) && ((!_Utils_eq(a, c)) && (!_Utils_eq(b, c)));
			});
		return (A3(mutuallyExclusive, yearPair.a, monthPair.a, dayPair.a) && A3($author$project$DateValidator$isValidDate, yearPair.b, monthPair.b, dayPair.b)) ? $elm$core$Maybe$Just(
			A3($author$project$DateValidator$Date, yearPair.b, monthPair.b, dayPair.b)) : $elm$core$Maybe$Nothing;
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$String$trim = _String_trim;
var $elm$core$String$words = _String_words;
var $author$project$DateValidator$tokenize = function (datestamp) {
	return $elm$core$String$words(
		A3(
			$elm$core$String$replace,
			'\\',
			' ',
			A3(
				$elm$core$String$replace,
				',',
				' ',
				A3(
					$elm$core$String$replace,
					'.',
					' ',
					A3(
						$elm$core$String$replace,
						'/',
						' ',
						A3(
							$elm$core$String$replace,
							'-',
							' ',
							$elm$core$String$trim(datestamp)))))));
};
var $author$project$DateValidator$fromString = function (datestamp) {
	var tokens = $author$project$DateValidator$tokenize(datestamp);
	var potentialYear = $author$project$DateValidator$findYear(tokens);
	var potentialMonth = $author$project$DateValidator$findMonth(tokens);
	var potentialDay = $author$project$DateValidator$findDay(tokens);
	if ($elm$core$List$length(tokens) === 3) {
		var _v0 = A4($elm$core$Maybe$map3, $author$project$DateValidator$maybeDate, potentialYear, potentialMonth, potentialDay);
		if (_v0.$ === 'Just') {
			var maybedate = _v0.a;
			return maybedate;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_validate$Validate$ifFalse = F2(
	function (test, error) {
		var getErrors = function (subject) {
			return test(subject) ? _List_Nil : _List_fromArray(
				[error]);
		};
		return $rtfeldman$elm_validate$Validate$Validator(getErrors);
	});
var $author$project$DateValidator$isNotDate = F2(
	function (map, error) {
		return A2(
			$rtfeldman$elm_validate$Validate$ifFalse,
			A2(
				$elm$core$Basics$composeR,
				map,
				A2(
					$elm$core$Basics$composeR,
					$author$project$DateValidator$fromString,
					function (a) {
						return _Utils_eq(a, $elm$core$Maybe$Nothing);
					})),
			error);
	});
var $author$project$SaleData$ifNotBlankOrDate = F2(
	function (subjectToString, error) {
		return A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			$rtfeldman$elm_validate$Validate$any(
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_validate$Validate$ifTrue,
						A2($elm$core$Basics$composeR, subjectToString, $elm$core$String$isEmpty),
						error),
						A2($author$project$DateValidator$isNotDate, subjectToString, error)
					])),
			error);
	});
var $elm$core$String$toFloat = _String_toFloat;
var $rtfeldman$elm_validate$Validate$isFloat = function (str) {
	var _v0 = $elm$core$String$toFloat(str);
	if (_v0.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $rtfeldman$elm_validate$Validate$ifNotFloat = F2(
	function (subjectToString, error) {
		return A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return $rtfeldman$elm_validate$Validate$isFloat(
					subjectToString(subject));
			},
			error);
	});
var $author$project$SaleData$ifNotBlankOrFloat = F2(
	function (subjectToString, error) {
		return A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			$rtfeldman$elm_validate$Validate$any(
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_validate$Validate$ifTrue,
						A2($elm$core$Basics$composeR, subjectToString, $elm$core$String$isEmpty),
						error),
						A2($rtfeldman$elm_validate$Validate$ifNotFloat, subjectToString, error)
					])),
			error);
	});
var $author$project$SaleData$saleDataValidator = $rtfeldman$elm_validate$Validate$all(
	_List_fromArray(
		[
			A2(
			$author$project$SaleData$ifNotBlankOrFloat,
			function ($) {
				return $.salePrice;
			},
			_Utils_Tuple2($author$project$SaleData$SalePrice, 'Price must be a number')),
			A2(
			$author$project$SaleData$ifNotBlankOrFloat,
			function ($) {
				return $.agentFee;
			},
			_Utils_Tuple2($author$project$SaleData$AgentFee, 'we need a number here')),
			A2(
			$author$project$SaleData$ifNotBlankOrFloat,
			function ($) {
				return $.amountToArtist;
			},
			_Utils_Tuple2($author$project$SaleData$AmountToArtist, 'we need a number here')),
			A2(
			$author$project$SaleData$ifNotBlankOrDate,
			function ($) {
				return $.saleDate;
			},
			_Utils_Tuple2($author$project$SaleData$SaleDate, 'we couldn\'t figure out this date')),
			A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.saleCurrency;
				},
				function (a) {
					return $elm$core$String$length(a) > 10;
				}),
			_Utils_Tuple2($author$project$SaleData$SaleCurrency, 'this field is too long'))
		]));
var $rtfeldman$elm_validate$Validate$Valid = function (a) {
	return {$: 'Valid', a: a};
};
var $rtfeldman$elm_validate$Validate$validate = F2(
	function (_v0, subject) {
		var getErrors = _v0.a;
		var _v1 = getErrors(subject);
		if (!_v1.b) {
			return $elm$core$Result$Ok(
				$rtfeldman$elm_validate$Validate$Valid(subject));
		} else {
			var errors = _v1;
			return $elm$core$Result$Err(errors);
		}
	});
var $author$project$SaleData$clearErrors = function (model) {
	var new_errors = function (saledata) {
		var _v0 = A2($rtfeldman$elm_validate$Validate$validate, $author$project$SaleData$saleDataValidator, saledata);
		if (_v0.$ === 'Ok') {
			return _List_Nil;
		} else {
			var errors = _v0.a;
			return errors;
		}
	};
	return _Utils_eq(model.errors, _List_Nil) ? model : _Utils_update(
		model,
		{
			errors: new_errors(model.saleData)
		});
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$multipartBody = function (parts) {
	return A2(
		_Http_pair,
		'',
		_Http_toFormData(parts));
};
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$stringPart = _Http_pair;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$DateValidator$toString = function (date) {
	var formatInt = F2(
		function (size, _int) {
			return A3(
				$elm$core$String$padLeft,
				size,
				_Utils_chr('0'),
				$elm$core$String$fromInt(_int));
		});
	var format = F3(
		function (y, m, d) {
			return A2(formatInt, 4, y) + ('-' + (A2(formatInt, 2, m) + ('-' + A2(formatInt, 2, d))));
		});
	var year = date.a;
	var month = date.b;
	var day = date.c;
	var y = year.a;
	var m = month.a;
	var d = day.a;
	return A3(format, y, m, d);
};
var $author$project$SaleData$saleDataToForm = function (record) {
	var includeJustIntField = F2(
		function (fieldName, value) {
			if (value.$ === 'Just') {
				var v = value.a;
				return _List_fromArray(
					[
						A2(
						$elm$http$Http$stringPart,
						fieldName,
						$elm$core$String$fromInt(v))
					]);
			} else {
				return _List_Nil;
			}
		});
	var encodeSaleDateField = function (saledate) {
		var _v1 = $author$project$DateValidator$fromString(saledate);
		if (_v1.$ === 'Just') {
			var date = _v1.a;
			return _List_fromArray(
				[
					A2(
					$elm$http$Http$stringPart,
					'sale_date',
					$author$project$DateValidator$toString(date))
				]);
		} else {
			return _List_Nil;
		}
	};
	var encodeIDField = function (idField) {
		if (idField.$ === 'Just') {
			var id = idField.a;
			return _List_fromArray(
				[
					A2(
					$elm$http$Http$stringPart,
					'id',
					$elm$core$String$fromInt(id))
				]);
		} else {
			return _List_Nil;
		}
	};
	return _Utils_ap(
		encodeIDField(record.id),
		_Utils_ap(
			A2(includeJustIntField, 'artwork', record.artwork),
			_Utils_ap(
				A2(includeJustIntField, 'buyer', record.buyer),
				_Utils_ap(
					A2(includeJustIntField, 'agent', record.agent),
					_Utils_ap(
						_List_fromArray(
							[
								A2($elm$http$Http$stringPart, 'notes', record.notes.content),
								A2($elm$http$Http$stringPart, 'sale_currency', record.saleCurrency),
								A2($elm$http$Http$stringPart, 'sale_price', record.salePrice),
								A2($elm$http$Http$stringPart, 'discount', record.discount),
								A2($elm$http$Http$stringPart, 'agent_fee', record.agentFee),
								A2($elm$http$Http$stringPart, 'amount_to_artist', record.amountToArtist)
							]),
						encodeSaleDateField(record.saleDate))))));
};
var $author$project$SaleData$setAgentFee = F2(
	function (newAgentFee, saleData) {
		return _Utils_update(
			saleData,
			{agentFee: newAgentFee});
	});
var $author$project$SaleData$setAmountToArtist = F2(
	function (newAmountToArtist, saleData) {
		return _Utils_update(
			saleData,
			{amountToArtist: newAmountToArtist});
	});
var $author$project$SaleData$setDiscount = F2(
	function (newDiscount, saleData) {
		return _Utils_update(
			saleData,
			{discount: newDiscount});
	});
var $author$project$SaleData$setNotes = F2(
	function (newNotes, saleData) {
		return _Utils_update(
			saleData,
			{notes: newNotes});
	});
var $author$project$SaleData$setSaleCurrency = F2(
	function (newSaleCurrency, saleData) {
		return _Utils_update(
			saleData,
			{saleCurrency: newSaleCurrency});
	});
var $author$project$SaleData$setSaleDate = F2(
	function (newSaleDate, saleData) {
		return _Utils_update(
			saleData,
			{saleDate: newSaleDate});
	});
var $author$project$SaleData$setSalePrice = F2(
	function (newSalePrice, saleData) {
		return _Utils_update(
			saleData,
			{salePrice: newSalePrice});
	});
var $elm$core$Debug$toString = _Debug_toString;
var $author$project$InputResize$GotSize = function (a) {
	return {$: 'GotSize', a: a};
};
var $elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var $author$project$InputResize$getSize = F2(
	function (msg, divID) {
		return A2(
			$elm$core$Task$attempt,
			A2($elm$core$Basics$composeL, msg, $author$project$InputResize$GotSize),
			$elm$browser$Browser$Dom$getViewportOf(divID));
	});
var $author$project$InputResize$update = F3(
	function (msg, resizeMsg, model) {
		if (resizeMsg.$ === 'NewContent') {
			var divID = resizeMsg.a;
			var content = resizeMsg.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{content: content, isMeasuring: true}),
				A2($author$project$InputResize$getSize, msg, divID));
		} else {
			var result = resizeMsg.a;
			if (result.$ === 'Ok') {
				var viewport = result.a;
				var log_height = A2(
					$elm$core$Debug$log,
					'viewport',
					$elm$core$Debug$toString(viewport));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{height: viewport.scene.height, isMeasuring: false}),
					$elm$core$Platform$Cmd$none);
			} else {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$SaleData$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'UpdateNotes':
				var resizeMsg = msg.a;
				var _v1 = A3($author$project$InputResize$update, $author$project$SaleData$UpdateNotes, resizeMsg, model.saleData.notes);
				var newNotes = _v1.a;
				var newMsg = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							saleData: A2($author$project$SaleData$setNotes, newNotes, model.saleData),
							updated: $author$project$SaleData$Behind
						}),
					newMsg);
			case 'UpdateSaleCurrency':
				var val = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							saleData: A2($author$project$SaleData$setSaleCurrency, val, model.saleData),
							updated: $author$project$SaleData$Behind
						}),
					$elm$core$Platform$Cmd$none);
			case 'UpdateSalePrice':
				var val = msg.a;
				return _Utils_Tuple2(
					$author$project$SaleData$clearErrors(
						_Utils_update(
							model,
							{
								saleData: A2($author$project$SaleData$setSalePrice, val, model.saleData),
								updated: $author$project$SaleData$Behind
							})),
					$elm$core$Platform$Cmd$none);
			case 'UpdateDiscount':
				var val = msg.a;
				return _Utils_Tuple2(
					$author$project$SaleData$clearErrors(
						_Utils_update(
							model,
							{
								saleData: A2($author$project$SaleData$setDiscount, val, model.saleData),
								updated: $author$project$SaleData$Behind
							})),
					$elm$core$Platform$Cmd$none);
			case 'UpdateAgentFee':
				var val = msg.a;
				return _Utils_Tuple2(
					$author$project$SaleData$clearErrors(
						_Utils_update(
							model,
							{
								saleData: A2($author$project$SaleData$setAgentFee, val, model.saleData),
								updated: $author$project$SaleData$Behind
							})),
					$elm$core$Platform$Cmd$none);
			case 'UpdateAmountToArtist':
				var val = msg.a;
				return _Utils_Tuple2(
					$author$project$SaleData$clearErrors(
						_Utils_update(
							model,
							{
								saleData: A2($author$project$SaleData$setAmountToArtist, val, model.saleData),
								updated: $author$project$SaleData$Behind
							})),
					$elm$core$Platform$Cmd$none);
			case 'UpdateSaleDate':
				var val = msg.a;
				return _Utils_Tuple2(
					$author$project$SaleData$clearErrors(
						_Utils_update(
							model,
							{
								saleData: A2($author$project$SaleData$setSaleDate, val, model.saleData),
								updated: $author$project$SaleData$Behind
							})),
					$elm$core$Platform$Cmd$none);
			case 'AttemptSubmitForm':
				var log_submit = A2(
					$elm$core$Debug$log,
					'Submitting: ' + $elm$core$Debug$toString(model),
					'');
				var _v2 = A2($rtfeldman$elm_validate$Validate$validate, $author$project$SaleData$saleDataValidator, model.saleData);
				if (_v2.$ === 'Ok') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{errors: _List_Nil, updated: $author$project$SaleData$Updating}),
						$elm$http$Http$request(
							{
								body: $elm$http$Http$multipartBody(
									A2(
										$elm$core$List$cons,
										A2($elm$http$Http$stringPart, 'csrfmiddlewaretoken', model.csrftoken),
										$author$project$SaleData$saleDataToForm(model.saleData))),
								expect: A2($elm$http$Http$expectJson, $author$project$SaleData$ServerResponse, $author$project$SaleData$saleDataDecoder),
								headers: _List_Nil,
								method: 'POST',
								timeout: $elm$core$Maybe$Nothing,
								tracker: $elm$core$Maybe$Just('upload'),
								url: '/c/api/saledata'
							}));
				} else {
					var errors = _v2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{errors: errors, updated: $author$project$SaleData$Failed}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var response = msg.a;
				var log_response = A2(
					$elm$core$Debug$log,
					'Response: ' + $elm$core$Debug$toString(response),
					'');
				if (response.$ === 'Ok') {
					var data = response.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{saleData: data, updated: $author$project$SaleData$Updated}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{updated: $author$project$SaleData$Failed}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$SalesGallery$updateSaleData = F2(
	function (saleDataMsg, model) {
		var newSubMsg = function (oldSaleData) {
			return A2($author$project$SaleData$update, saleDataMsg, oldSaleData).b;
		};
		var subCmd = function () {
			var _v0 = $NoRedInk$list_selection$List$Selection$selected(model.data);
			if (_v0.$ === 'Just') {
				var artwork = _v0.a;
				return newSubMsg(artwork.saleData);
			} else {
				return $elm$core$Platform$Cmd$none;
			}
		}();
		var newSaleData = function (oldSaleData) {
			return A2($author$project$SaleData$update, saleDataMsg, oldSaleData).a;
		};
		var newArtwork = function (oldArtwork) {
			return _Utils_update(
				oldArtwork,
				{
					saleData: newSaleData(oldArtwork.saleData)
				});
		};
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					data: A2(
						$NoRedInk$list_selection$List$Selection$mapSelected,
						{
							rest: $elm$core$Basics$identity,
							selected: function (a) {
								return newArtwork(a);
							}
						},
						model.data)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$SalesGallery$SaleDataUpdated, subCmd));
	});
var $author$project$SalesGallery$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Select':
				var artworkID = msg.a;
				var log_selected = A2($elm$core$Debug$log, 'artwork selected', artworkID);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							data: A2(
								$NoRedInk$list_selection$List$Selection$selectBy,
								function (a) {
									return _Utils_eq(a.id, artworkID);
								},
								model.data)
						}),
					$author$project$SalesGallery$getArtworkPosition(artworkID));
			case 'GotViewPort':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var element = result.a;
					var oldOffset = element.viewport.y;
					var height = element.viewport.height;
					var elementOffset = element.element.y;
					var elementHeight = element.element.height;
					var newOffset = (_Utils_cmp(height, elementHeight) < 1) ? elementOffset : (elementOffset - ((height - elementHeight) / 2));
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							function (_v2) {
								return $author$project$SalesGallery$NoOp;
							},
							A2($elm$browser$Browser$Dom$setViewport, element.viewport.x, newOffset)));
				} else {
					var e = result.a;
					var viewport_log = A2($elm$core$Debug$log, 'error getting height', e);
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'Deselect':
				var log_deselect = $elm$core$Debug$log('artwork deselected');
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							data: $NoRedInk$list_selection$List$Selection$deselect(model.data)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GoTo':
				var url = msg.a;
				return _Utils_Tuple2(
					model,
					$elm$browser$Browser$Navigation$load(url));
			case 'SaleDataUpdated':
				var saleDataMsg = msg.a;
				return A2($author$project$SalesGallery$updateSaleData, saleDataMsg, model);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$SalesGallery$GoTo = function (a) {
	return {$: 'GoTo', a: a};
};
var $author$project$SalesGallery$Select = function (a) {
	return {$: 'Select', a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$core$Basics$not = _Basics_not;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onDoubleClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'dblclick',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$SalesGallery$sizeText = function (size) {
	return size.width + ('x' + (size.height + size.unit));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$SalesGallery$artworkView = F2(
	function (expanded, artwork) {
		var wrapper = expanded ? $elm$html$Html$a(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('gallery-item-wrapper-expanded'),
					$elm$html$Html$Attributes$id(
					'artwork_wrapper' + $elm$core$String$fromInt(artwork.id)),
					$elm$html$Html$Attributes$href(artwork.url)
				])) : $elm$html$Html$div(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('gallery-item-wrapper'),
					$elm$html$Html$Events$onClick(
					$author$project$SalesGallery$Select(artwork.id)),
					$elm$html$Html$Events$onDoubleClick(
					$author$project$SalesGallery$GoTo(artwork.url))
				]));
		var imageBox = (artwork.image !== '') ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('gallery-bounding-box'),
					A2($elm$html$Html$Attributes$style, 'background-image', 'url(\'' + (artwork.image + '\')'))
				]),
			_List_Nil) : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('gallery-item-image', !expanded),
							_Utils_Tuple2('gallery-item-image-expanded', expanded)
						])),
					A2($elm$html$Html$Attributes$style, 'background', 'darkgrey')
				]),
			_List_Nil);
		var hoverClass = expanded ? 'gallery-item-hover-expanded' : 'gallery-item-hover';
		return wrapper(
			_List_fromArray(
				[
					imageBox,
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(hoverClass)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('gallery-item-text')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('gallery-item-title')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(artwork.title)
														]))
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$id(
													'artwork_series_' + $elm$core$String$fromInt(artwork.id))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(artwork.series)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('separator')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(' | ')
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$id(
													'artwork_year_' + $elm$core$String$fromInt(artwork.id))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(artwork.year)
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$author$project$SalesGallery$sizeText(artwork.sizeCm))
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('separator')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(' | ')
												])),
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$author$project$SalesGallery$sizeText(artwork.sizeIn))
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$SalesGallery$Deselect = {$: 'Deselect'};
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$SaleData$AttemptSubmitForm = {$: 'AttemptSubmitForm'};
var $author$project$SaleData$Discount = {$: 'Discount'};
var $author$project$SaleData$Notes = {$: 'Notes'};
var $author$project$SaleData$UpdateAgentFee = function (a) {
	return {$: 'UpdateAgentFee', a: a};
};
var $author$project$SaleData$UpdateAmountToArtist = function (a) {
	return {$: 'UpdateAmountToArtist', a: a};
};
var $author$project$SaleData$UpdateDiscount = function (a) {
	return {$: 'UpdateDiscount', a: a};
};
var $author$project$SaleData$UpdateSaleCurrency = function (a) {
	return {$: 'UpdateSaleCurrency', a: a};
};
var $author$project$SaleData$UpdateSaleDate = function (a) {
	return {$: 'UpdateSaleDate', a: a};
};
var $author$project$SaleData$UpdateSalePrice = function (a) {
	return {$: 'UpdateSalePrice', a: a};
};
var $author$project$SaleData$findErrors = F2(
	function (field, errors) {
		var fieldMatch = function (error) {
			return _Utils_eq(error.a, field);
		};
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$second,
			A2($elm$core$List$filter, fieldMatch, errors));
	});
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$SaleData$saleDataIdSelectionView = function (saleDataID) {
	if (saleDataID.$ === 'Just') {
		var id = saleDataID.a;
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$attribute, 'selected', ''),
					$elm$html$Html$Attributes$value(
					$elm$core$String$fromInt(id))
				]),
			_List_Nil);
	} else {
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value('')
				]),
			_List_Nil);
	}
};
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$SaleData$hiddenInputView = function (saleDataID) {
	return A2(
		$elm$html$Html$select,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$name('sale_data'),
				$elm$html$Html$Attributes$id('id_sale_data'),
				A2($elm$html$Html$Attributes$style, 'display', 'none')
			]),
		_List_fromArray(
			[
				$author$project$SaleData$saleDataIdSelectionView(saleDataID)
			]));
};
var $elm$html$Html$small = _VirtualDom_node('small');
var $author$project$Input$errorView = function (error) {
	return A2(
		$elm$html$Html$small,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('form-test'),
				$elm$html$Html$Attributes$class('text-muted'),
				A2($elm$html$Html$Attributes$style, 'width', '86px')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(error)
			]));
};
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $author$project$Input$inputView = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				$elm$html$Html$Attributes$class('form-group')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for(props.id)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(props.label)
						])),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id(props.id),
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('edit-field', true),
										_Utils_Tuple2('form-control', true),
										_Utils_Tuple2('form-control-sm', true)
									])),
								$elm$html$Html$Attributes$placeholder(props.placeholder),
								$elm$html$Html$Attributes$value(props.value),
								$elm$html$Html$Attributes$name(props.name)
							]),
						props.attributes),
					_List_Nil)
				]),
			A2($elm$core$List$map, $author$project$Input$errorView, props.errors)));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$InputResize$htmlEncodeString = F2(
	function (lineHeight, someString) {
		var lines = A2($elm$core$String$split, '\n', someString);
		var height = $elm$core$String$fromFloat(lineHeight) + 'px';
		var htmlMapper = function (line) {
			return (line === '') ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'height', height)
					]),
				_List_Nil) : A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(line)
					]));
		};
		return _Utils_ap(
			A2($elm$core$List$map, htmlMapper, lines),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', height)
						]),
					_List_Nil)
				]));
	});
var $author$project$InputResize$setAttributes = function (settings) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'resize', 'none'),
			A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
			A2($elm$html$Html$Attributes$style, 'white-space', 'pre-wrap'),
			A2($elm$html$Html$Attributes$style, 'wordWrap', 'break-word'),
			A2($elm$html$Html$Attributes$style, 'width', settings.width),
			A2(
			$elm$html$Html$Attributes$style,
			'line-height',
			$elm$core$String$fromFloat(settings.lineHeight)),
			A2(
			$elm$html$Html$Attributes$style,
			'font-size',
			$elm$core$String$fromFloat(settings.fontSize) + 'px'),
			A2($elm$html$Html$Attributes$style, 'padding', '0px'),
			A2($elm$html$Html$Attributes$style, 'margin', '0px')
		]);
};
var $author$project$InputResize$hiddenDivView = F4(
	function (settings, divID, customAttributes, content) {
		var rowHeight = settings.lineHeight * settings.fontSize;
		var textDivs = A2($author$project$InputResize$htmlEncodeString, rowHeight, content);
		var height = rowHeight * $elm$core$List$length(textDivs);
		var attributes = _Utils_ap(
			customAttributes,
			$author$project$InputResize$setAttributes(settings));
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				attributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id(divID),
						$elm$html$Html$Attributes$value(content),
						A2(
						$elm$html$Html$Attributes$style,
						'height',
						$elm$core$String$fromFloat(height) + 'px'),
						A2($elm$html$Html$Attributes$style, 'margin-left', '-' + settings.width),
						A2($elm$html$Html$Attributes$style, 'z-index', '1')
					])),
			textDivs);
	});
var $author$project$InputResize$NewContent = F2(
	function (a, b) {
		return {$: 'NewContent', a: a, b: b};
	});
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$InputResize$textAreaView = F5(
	function (msg, settings, divID, customAttributes, model) {
		var attributes = _Utils_ap(
			customAttributes,
			$author$project$InputResize$setAttributes(settings));
		return A2(
			$elm$html$Html$textarea,
			_Utils_ap(
				attributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id(divID),
						$elm$html$Html$Attributes$value(model.content),
						$elm$html$Html$Events$onInput(
						A2(
							$elm$core$Basics$composeL,
							msg,
							$author$project$InputResize$NewContent(settings.divID))),
						A2(
						$elm$html$Html$Attributes$style,
						'height',
						$elm$core$String$fromFloat(model.height) + 'px'),
						A2($elm$html$Html$Attributes$style, 'z-index', '3')
					])),
			_List_fromArray(
				[
					$elm$html$Html$text(model.content)
				]));
	});
var $author$project$InputResize$view = F5(
	function (msg, settings, innerAttributes, outerAttributes, model) {
		var innerView = model.isMeasuring ? _List_fromArray(
			[
				A5($author$project$InputResize$textAreaView, msg, settings, 'text_area_measure', innerAttributes, model),
				A4($author$project$InputResize$hiddenDivView, settings, settings.divID, innerAttributes, model.content)
			]) : _List_fromArray(
			[
				A5($author$project$InputResize$textAreaView, msg, settings, settings.divID, innerAttributes, model),
				A4($author$project$InputResize$hiddenDivView, settings, 'text_area_measure', innerAttributes, model.content)
			]);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				outerAttributes,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'start'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'start'),
						A2($elm$html$Html$Attributes$style, 'padding-left', '0.5rem')
					])),
			innerView);
	});
var $author$project$Input$resizeView = function (props) {
	var innerAttributes = _Utils_ap(
		props.innerAttributes,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$name(props.name),
				$elm$html$Html$Attributes$placeholder(props.placeholder),
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('edit-field', true),
						_Utils_Tuple2('form-control', true),
						_Utils_Tuple2('form-control-sm', true)
					]))
			]));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				$elm$html$Html$Attributes$class('form-group'),
				A2($elm$html$Html$Attributes$style, 'height', 'min-content')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for(props.settings.divID),
							A2($elm$html$Html$Attributes$style, 'align-self', 'start')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(props.label)
						])),
					A5($author$project$InputResize$view, props.onInput, props.settings, innerAttributes, props.outerAttributes, props.value)
				]),
			A2($elm$core$List$map, $author$project$Input$errorView, props.errors)));
};
var $author$project$SaleData$syncStatusView = F2(
	function (status, icons) {
		var icon = function () {
			switch (status.$) {
				case 'Behind':
					return A2($elm$html$Html$div, _List_Nil, _List_Nil);
				case 'Updating':
					return A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(icons.loaderIconURL),
								A2($elm$html$Html$Attributes$style, 'height', '25px')
							]),
						_List_Nil);
				case 'Updated':
					return A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(icons.successIconURL),
								A2($elm$html$Html$Attributes$style, 'height', '25px')
							]),
						_List_Nil);
				default:
					return A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(icons.failIconURL),
								A2($elm$html$Html$Attributes$style, 'height', '25px')
							]),
						_List_Nil);
			}
		}();
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'width', '40px')
				]),
			_List_fromArray(
				[icon]));
	});
var $author$project$SaleData$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('details-list'),
				$elm$html$Html$Attributes$class('form-inline')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('headers'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '18px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Sale Details')
							])),
						A2($author$project$SaleData$syncStatusView, model.updated, model.icons)
					])),
				$author$project$Input$resizeView(
				{
					errors: A2($author$project$SaleData$findErrors, $author$project$SaleData$Notes, model.errors),
					innerAttributes: _List_fromArray(
						[
							$elm$html$Html$Events$onBlur($author$project$SaleData$AttemptSubmitForm)
						]),
					label: 'Notes:',
					name: 'notes',
					onInput: $author$project$SaleData$UpdateNotes,
					outerAttributes: _List_Nil,
					placeholder: 'Notes',
					settings: $author$project$SaleData$settingsNotes,
					value: model.saleData.notes
				}),
				$author$project$Input$inputView(
				{
					attributes: _List_fromArray(
						[
							$elm$html$Html$Events$onInput($author$project$SaleData$UpdateSaleCurrency),
							$elm$html$Html$Events$onBlur($author$project$SaleData$AttemptSubmitForm)
						]),
					errors: A2($author$project$SaleData$findErrors, $author$project$SaleData$SaleCurrency, model.errors),
					id: 'id_sale_currency',
					label: 'Sale Currency:',
					name: 'sale_currency',
					placeholder: 'Sale Currency',
					value: model.saleData.saleCurrency
				}),
				$author$project$Input$inputView(
				{
					attributes: _List_fromArray(
						[
							$elm$html$Html$Events$onInput($author$project$SaleData$UpdateSalePrice),
							$elm$html$Html$Events$onBlur($author$project$SaleData$AttemptSubmitForm)
						]),
					errors: A2($author$project$SaleData$findErrors, $author$project$SaleData$SalePrice, model.errors),
					id: 'id_sale_price',
					label: 'Sale Price:',
					name: 'sale_price',
					placeholder: 'Sale Prince',
					value: model.saleData.salePrice
				}),
				$author$project$Input$inputView(
				{
					attributes: _List_fromArray(
						[
							$elm$html$Html$Events$onInput($author$project$SaleData$UpdateDiscount),
							$elm$html$Html$Events$onBlur($author$project$SaleData$AttemptSubmitForm)
						]),
					errors: A2($author$project$SaleData$findErrors, $author$project$SaleData$Discount, model.errors),
					id: 'id_discount',
					label: 'Discount:',
					name: 'discount',
					placeholder: '(Number or Percentage)',
					value: model.saleData.discount
				}),
				$author$project$Input$inputView(
				{
					attributes: _List_fromArray(
						[
							$elm$html$Html$Events$onInput($author$project$SaleData$UpdateAgentFee),
							$elm$html$Html$Events$onBlur($author$project$SaleData$AttemptSubmitForm)
						]),
					errors: A2($author$project$SaleData$findErrors, $author$project$SaleData$AgentFee, model.errors),
					id: 'id_agent_fee',
					label: 'Agent Fee:',
					name: 'agent_fee',
					placeholder: 'Amount to Agent',
					value: model.saleData.agentFee
				}),
				$author$project$Input$inputView(
				{
					attributes: _List_fromArray(
						[
							$elm$html$Html$Events$onInput($author$project$SaleData$UpdateAmountToArtist),
							$elm$html$Html$Events$onBlur($author$project$SaleData$AttemptSubmitForm)
						]),
					errors: A2($author$project$SaleData$findErrors, $author$project$SaleData$AmountToArtist, model.errors),
					id: 'id_amount_to_artist',
					label: 'Amount to Artist:',
					name: 'amount_to_artist',
					placeholder: 'Amount to Artist',
					value: model.saleData.amountToArtist
				}),
				$author$project$Input$inputView(
				{
					attributes: _List_fromArray(
						[
							$elm$html$Html$Events$onInput($author$project$SaleData$UpdateSaleDate),
							$elm$html$Html$Events$onBlur($author$project$SaleData$AttemptSubmitForm)
						]),
					errors: A2($author$project$SaleData$findErrors, $author$project$SaleData$SaleDate, model.errors),
					id: 'id_sale_date',
					label: 'Sale Date:',
					name: 'sale_date',
					placeholder: 'Date',
					value: model.saleData.saleDate
				}),
				$author$project$SaleData$hiddenInputView(model.saleData.id)
			]));
};
var $author$project$SalesGallery$selectedArtworkView = F2(
	function (closeIconURL, artwork) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					$elm$html$Html$Events$onBlur($author$project$SalesGallery$Deselect),
					$elm$html$Html$Attributes$id(
					'artwork_wrapper' + $elm$core$String$fromInt(artwork.id))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-self', 'center'),
							A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(222, 222, 212)'),
							A2($elm$html$Html$Attributes$style, 'width', 'min-content'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '5px'),
							$elm$html$Html$Attributes$tabindex(1)
						]),
					_List_fromArray(
						[
							A2($author$project$SalesGallery$artworkView, true, artwork),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('sales-info'),
									$elm$html$Html$Attributes$class('card'),
									A2($elm$html$Html$Attributes$style, 'width', '400px'),
									A2($elm$html$Html$Attributes$style, 'margin', '40px 15px 20px 10px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('card-body'),
											$elm$html$Html$Attributes$class('sale-form')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$map,
											$author$project$SalesGallery$SaleDataUpdated,
											$author$project$SaleData$view(artwork.saleData))
										]))
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$SalesGallery$Deselect),
									A2($elm$html$Html$Attributes$style, 'background-color', 'inherit'),
									A2($elm$html$Html$Attributes$style, 'align-self', 'start'),
									A2($elm$html$Html$Attributes$style, 'margin', '10px 10px 0 0'),
									A2($elm$html$Html$Attributes$style, 'padding', '0')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(closeIconURL),
											A2($elm$html$Html$Attributes$style, 'height', '25px'),
											$elm$html$Html$Attributes$alt('x'),
											A2($elm$html$Html$Attributes$style, 'font-size', '34px'),
											A2($elm$html$Html$Attributes$style, 'color', 'rgba(0,0,0,0.125)')
										]),
									_List_Nil)
								]))
						]))
				]));
	});
var $NoRedInk$list_selection$List$Selection$toList = function (_v0) {
	var items = _v0.b;
	return items;
};
var $author$project$SalesGallery$view = function (model) {
	var hasSelected = function () {
		var _v0 = $NoRedInk$list_selection$List$Selection$selected(model.data);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('search-results-wrapper')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('searchResults'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('gallery-list', true),
								_Utils_Tuple2('center-block', true)
							]))
					]),
				($elm$core$List$length(
					$NoRedInk$list_selection$List$Selection$toList(model.data)) > 0) ? $NoRedInk$list_selection$List$Selection$toList(
					A2(
						$NoRedInk$list_selection$List$Selection$mapSelected,
						{
							rest: function (artwork) {
								return A2($author$project$SalesGallery$artworkView, false, artwork);
							},
							selected: function (artwork) {
								return A2($author$project$SalesGallery$selectedArtworkView, model.closeIconURL, artwork);
							}
						},
						model.data)) : _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('No Results Found')
							]))
					]))
			]));
};
var $author$project$SalesGallery$main = $elm$browser$Browser$element(
	{init: $author$project$SalesGallery$init, subscriptions: $author$project$SalesGallery$subscriptions, update: $author$project$SalesGallery$update, view: $author$project$SalesGallery$view});
var $author$project$SaleData$decodeFieldtoString = F2(
	function (field, flags) {
		var _v0 = A2(
			$elm$json$Json$Decode$decodeValue,
			A2($elm$json$Json$Decode$field, field, $elm$json$Json$Decode$string),
			flags);
		if (_v0.$ === 'Ok') {
			var str = _v0.a;
			return str;
		} else {
			var message = _v0.a;
			return '';
		}
	});
var $author$project$SaleData$newSaleData = {
	agent: $elm$core$Maybe$Nothing,
	agentFee: '',
	amountToArtist: '',
	artwork: $elm$core$Maybe$Nothing,
	buyer: $elm$core$Maybe$Nothing,
	discount: '',
	id: $elm$core$Maybe$Nothing,
	notes: A2($author$project$InputResize$fromContent, $author$project$SaleData$settingsNotes, ''),
	saleCurrency: '',
	saleDate: '',
	salePrice: ''
};
var $author$project$SaleData$init = function (flags) {
	var icons = {
		failIconURL: A2($author$project$SaleData$decodeFieldtoString, 'fail_icon', flags),
		loaderIconURL: A2($author$project$SaleData$decodeFieldtoString, 'loader_icon', flags),
		successIconURL: A2($author$project$SaleData$decodeFieldtoString, 'success_icon', flags)
	};
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$SaleData$decode, flags);
	if (_v0.$ === 'Ok') {
		var data = _v0.a;
		var log_init = A2($elm$core$Debug$log, 'initial saleData:', data);
		return _Utils_Tuple2(data, $elm$core$Platform$Cmd$none);
	} else {
		var e = _v0.a;
		var log_init = A2($elm$core$Debug$log, 'error reading flags', e);
		return _Utils_Tuple2(
			{
				csrftoken: A2($author$project$SaleData$decodeFieldtoString, 'csrftoken', flags),
				errors: _List_Nil,
				icons: icons,
				saleData: $author$project$SaleData$newSaleData,
				updated: $author$project$SaleData$Behind
			},
			$elm$core$Platform$Cmd$none);
	}
};
var $author$project$SaleData$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$SaleData$main = $elm$browser$Browser$element(
	{init: $author$project$SaleData$init, subscriptions: $author$project$SaleData$subscriptions, update: $author$project$SaleData$update, view: $author$project$SaleData$view});
var $author$project$ImageUpload$Waiting = {$: 'Waiting'};
var $author$project$ImageUpload$blank = {
	artwork_id: $elm$core$Maybe$Nothing,
	csrftoken: '',
	failIconURL: '',
	image_data: {image_id: $elm$core$Maybe$Nothing, image_url: $elm$core$Maybe$Nothing},
	loaderURL: '',
	status: $author$project$ImageUpload$Waiting,
	successIconURL: ''
};
var $author$project$ImageUpload$Model = F7(
	function (csrftoken, artwork_id, image_data, loaderURL, successIconURL, failIconURL, status) {
		return {artwork_id: artwork_id, csrftoken: csrftoken, failIconURL: failIconURL, image_data: image_data, loaderURL: loaderURL, status: status, successIconURL: successIconURL};
	});
var $author$project$ImageUpload$decoder = A2(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
	$author$project$ImageUpload$Waiting,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'fail_icon',
		$elm$json$Json$Decode$string,
		'',
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'success_icon',
			$elm$json$Json$Decode$string,
			'',
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'loader_icon',
				$elm$json$Json$Decode$string,
				'',
				A2(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
					A3(
						$elm$json$Json$Decode$map2,
						F2(
							function (id, url) {
								return {image_id: id, image_url: url};
							}),
						A2(
							$elm$json$Json$Decode$field,
							'image_id',
							$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int)),
						A2(
							$elm$json$Json$Decode$andThen,
							function (result) {
								return _Utils_eq(
									result,
									$elm$core$Maybe$Just('')) ? $elm$json$Json$Decode$fail('no URL') : $elm$json$Json$Decode$succeed(result);
							},
							A2(
								$elm$json$Json$Decode$field,
								'image_url',
								$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)))),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'artwork_id',
						$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'csrftoken',
							$elm$json$Json$Decode$string,
							$elm$json$Json$Decode$succeed($author$project$ImageUpload$Model))))))));
var $author$project$ImageUpload$init = function (flags) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$ImageUpload$decoder, flags);
	if (_v0.$ === 'Ok') {
		var model = _v0.a;
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	} else {
		var e = _v0.a;
		var init_log = A2($elm$core$Debug$log, 'failt imageUpload init', e);
		return _Utils_Tuple2($author$project$ImageUpload$blank, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$ImageUpload$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$ImageUpload$Done = {$: 'Done'};
var $author$project$ImageUpload$Fail = {$: 'Fail'};
var $author$project$ImageUpload$FileUploaded = F2(
	function (a, b) {
		return {$: 'FileUploaded', a: a, b: b};
	});
var $author$project$ImageUpload$GotCredentials = F2(
	function (a, b) {
		return {$: 'GotCredentials', a: a, b: b};
	});
var $author$project$ImageUpload$GotFile = function (a) {
	return {$: 'GotFile', a: a};
};
var $author$project$ImageUpload$GotPreview = function (a) {
	return {$: 'GotPreview', a: a};
};
var $author$project$ImageUpload$ImageSaved = function (a) {
	return {$: 'ImageSaved', a: a};
};
var $author$project$ImageUpload$Uploading = {$: 'Uploading'};
var $elm$http$Http$expectString = function (toMsg) {
	return A2(
		$elm$http$Http$expectStringResponse,
		toMsg,
		$elm$http$Http$resolve($elm$core$Result$Ok));
};
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $elm$http$Http$filePart = _Http_pair;
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $elm$file$File$name = _File_name;
var $author$project$ImageUpload$ImageData = F2(
	function (image_id, image_url) {
		return {image_id: image_id, image_url: image_url};
	});
var $author$project$ImageUpload$saveImageResultDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$ImageUpload$ImageData,
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'image_id', $elm$json$Json$Decode$int)),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'image_url', $elm$json$Json$Decode$string)));
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 'QueryParameter', a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $author$project$ImageUpload$stringifyArtworkID = function (artwork_id) {
	if (artwork_id.$ === 'Just') {
		var pk = artwork_id.a;
		return $elm$core$String$fromInt(pk);
	} else {
		return '';
	}
};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$file$File$toUrl = _File_toUrl;
var $author$project$ImageUpload$updateImageURL = F2(
	function (url, data) {
		return _Utils_update(
			data,
			{
				image_url: $elm$core$Maybe$Just(url)
			});
	});
var $author$project$ImageUpload$UploadCredentials = F7(
	function (url, key, awsAccessKeyID, policy, signature, acl, save_key) {
		return {acl: acl, awsAccessKeyID: awsAccessKeyID, key: key, policy: policy, save_key: save_key, signature: signature, url: url};
	});
var $elm$json$Json$Decode$map7 = _Json_map7;
var $author$project$ImageUpload$uploadCredentialsDecoder = A8(
	$elm$json$Json$Decode$map7,
	$author$project$ImageUpload$UploadCredentials,
	A2($elm$json$Json$Decode$field, 'url', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['fields', 'key']),
		$elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['fields', 'AWSAccessKeyId']),
		$elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['fields', 'policy']),
		$elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['fields', 'signature']),
		$elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['fields', 'acl']),
		$elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'save_key', $elm$json$Json$Decode$string));
var $author$project$ImageUpload$update = F2(
	function (msg, model) {
		var debug = A3($elm$core$Debug$log, 'State', $elm$core$Debug$toString, model.status);
		switch (msg.$) {
			case 'Pick':
				return _Utils_Tuple2(
					model,
					A2(
						$elm$file$File$Select$file,
						_List_fromArray(
							['image/*']),
						$author$project$ImageUpload$GotFile));
			case 'GotFile':
				var file = msg.a;
				var gotfile_debug = A2(
					$elm$core$Debug$log,
					'got file',
					$elm$core$Debug$toString(
						$elm$file$File$name(file)));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{status: $author$project$ImageUpload$Uploading}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$elm$http$Http$get(
								{
									expect: A2(
										$elm$http$Http$expectJson,
										$author$project$ImageUpload$GotCredentials(file),
										$author$project$ImageUpload$uploadCredentialsDecoder),
									url: '/c/api/imageuploadauth' + $elm$url$Url$Builder$toQuery(
										_List_fromArray(
											[
												A2(
												$elm$url$Url$Builder$string,
												'file_name',
												$elm$file$File$name(file))
											]))
								}),
								A2(
								$elm$core$Task$perform,
								$author$project$ImageUpload$GotPreview,
								$elm$file$File$toUrl(file))
							])));
			case 'GotPreview':
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							image_data: A2($author$project$ImageUpload$updateImageURL, url, model.image_data)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GotCredentials':
				var file = msg.a;
				var result = msg.b;
				if (result.$ === 'Ok') {
					var credentials = result.a;
					return _Utils_Tuple2(
						model,
						$elm$http$Http$request(
							{
								body: $elm$http$Http$multipartBody(
									_List_fromArray(
										[
											A2($elm$http$Http$stringPart, 'key', credentials.key),
											A2($elm$http$Http$stringPart, 'AWSAccessKeyId', credentials.awsAccessKeyID),
											A2($elm$http$Http$stringPart, 'policy', credentials.policy),
											A2($elm$http$Http$stringPart, 'signature', credentials.signature),
											A2($elm$http$Http$stringPart, 'acl', credentials.acl),
											A2($elm$http$Http$filePart, 'file', file)
										])),
								expect: $elm$http$Http$expectString(
									$author$project$ImageUpload$FileUploaded(credentials.save_key)),
								headers: _List_Nil,
								method: 'POST',
								timeout: $elm$core$Maybe$Just(180000),
								tracker: $elm$core$Maybe$Just('upload'),
								url: credentials.url
							}));
				} else {
					var e = result.a;
					var cred_log = A2(
						$elm$core$Debug$log,
						'Error getting credentials',
						$elm$core$Debug$toString(e));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{status: $author$project$ImageUpload$Fail}),
						$elm$core$Platform$Cmd$none);
				}
			case 'FileUploaded':
				var file_url = msg.a;
				var result = msg.b;
				if (result.$ === 'Ok') {
					var a = result.a;
					var upload_log = A2(
						$elm$core$Debug$log,
						'successful upload',
						$elm$core$Debug$toString(a));
					return _Utils_Tuple2(
						model,
						$elm$http$Http$request(
							{
								body: $elm$http$Http$multipartBody(
									_List_fromArray(
										[
											A2($elm$http$Http$stringPart, 'csrfmiddlewaretoken', model.csrftoken),
											A2(
											$elm$http$Http$stringPart,
											'artwork',
											$author$project$ImageUpload$stringifyArtworkID(model.artwork_id)),
											A2($elm$http$Http$stringPart, 'uploaded_image_url', file_url)
										])),
								expect: A2($elm$http$Http$expectJson, $author$project$ImageUpload$ImageSaved, $author$project$ImageUpload$saveImageResultDecoder),
								headers: _List_Nil,
								method: 'POST',
								timeout: $elm$core$Maybe$Just(60000),
								tracker: $elm$core$Maybe$Just('save'),
								url: '/c/artwork/image/new'
							}));
				} else {
					var e = result.a;
					var upload_log = A2(
						$elm$core$Debug$log,
						'error uploading image',
						$elm$core$Debug$toString(e));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{status: $author$project$ImageUpload$Fail}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var result = msg.a;
				if (result.$ === 'Ok') {
					var image_data = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{image_data: image_data, status: $author$project$ImageUpload$Done}),
						$elm$core$Platform$Cmd$none);
				} else {
					var e = result.a;
					var save_log = A2(
						$elm$core$Debug$log,
						'Error saving to db',
						$elm$core$Debug$toString(e));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{status: $author$project$ImageUpload$Fail}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$ImageUpload$imageIdSelectionView = function (image_id) {
	if (image_id.$ === 'Just') {
		var id = image_id.a;
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$attribute, 'selected', ''),
					$elm$html$Html$Attributes$value(
					$elm$core$String$fromInt(id))
				]),
			_List_Nil);
	} else {
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value('')
				]),
			_List_Nil);
	}
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$required = $elm$html$Html$Attributes$boolProperty('required');
var $author$project$ImageUpload$hiddenInputView = function (image_id) {
	return A2(
		$elm$html$Html$select,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$name('artwork_image'),
				$elm$html$Html$Attributes$required(true),
				$elm$html$Html$Attributes$id('id_artwork_image'),
				A2($elm$html$Html$Attributes$style, 'display', 'none')
			]),
		_List_fromArray(
			[
				$author$project$ImageUpload$imageIdSelectionView(image_id)
			]));
};
var $author$project$ImageUpload$imageView = function (model) {
	var style_image_background = function () {
		var _v1 = model.image_data.image_url;
		if (_v1.$ === 'Just') {
			var image = _v1.a;
			return A2($elm$html$Html$Attributes$style, 'background-image', 'url(\'' + (image + '\')'));
		} else {
			return A2($elm$html$Html$Attributes$style, 'background-color', 'darkgrey');
		}
	}();
	var show_blurring = function () {
		var _v0 = model.status;
		switch (_v0.$) {
			case 'Waiting':
				return _List_Nil;
			case 'Uploading':
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'filter', 'blur(2px)'),
						A2($elm$html$Html$Attributes$style, '-webkit-filter', 'blur(2px)'),
						A2($elm$html$Html$Attributes$style, 'z-index', '-1')
					]);
			case 'Done':
				return _List_Nil;
			default:
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'filter', 'blur(2px)'),
						A2($elm$html$Html$Attributes$style, '-webkit-filter', 'blur(2px)'),
						A2($elm$html$Html$Attributes$style, 'z-index', '-1')
					]);
		}
	}();
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('bounding-box'),
					$elm$html$Html$Attributes$id('id_image'),
					style_image_background
				]),
			show_blurring),
		_List_Nil);
};
var $author$project$ImageUpload$Pick = {$: 'Pick'};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$ImageUpload$uploaderView = F3(
	function (successIconURL, failIconURL, status) {
		switch (status.$) {
			case 'Waiting':
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('btn'),
									$elm$html$Html$Attributes$class('action-button'),
									$elm$html$Html$Events$onClick($author$project$ImageUpload$Pick)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Upload Image')
								]))
						]));
			case 'Uploading':
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn'),
									$elm$html$Html$Attributes$class('action-button'),
									A2($elm$html$Html$Attributes$style, 'background-color', 'slategrey'),
									A2($elm$html$Html$Attributes$style, 'border-color', 'slategrey'),
									A2($elm$html$Html$Attributes$style, 'color', 'white')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Upload Image')
								]))
						]));
			case 'Done':
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('btn'),
									$elm$html$Html$Attributes$class('action-button'),
									$elm$html$Html$Events$onClick($author$project$ImageUpload$Pick)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Upload Image')
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'width', '40px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(successIconURL),
											A2($elm$html$Html$Attributes$style, 'height', '25px')
										]),
									_List_Nil)
								]))
						]));
			default:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('btn'),
									$elm$html$Html$Attributes$class('action-button'),
									$elm$html$Html$Events$onClick($author$project$ImageUpload$Pick)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Upload Image')
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'width', '40px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(failIconURL),
											A2($elm$html$Html$Attributes$style, 'height', '25px')
										]),
									_List_Nil)
								]))
						]));
		}
	});
var $author$project$ImageUpload$uploadingImageCoverView = F2(
	function (loader_url, status) {
		switch (status.$) {
			case 'Waiting':
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'id', 'image-loading-cover')
						]),
					_List_Nil);
			case 'Uploading':
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-top', '-405px'),
							A2($elm$html$Html$Attributes$style, 'background', 'rgba(256, 256, 256, 0.4)'),
							A2($elm$html$Html$Attributes$style, 'z-index', '2'),
							A2($elm$html$Html$Attributes$style, 'width', 'inherit'),
							A2($elm$html$Html$Attributes$style, 'height', 'inherit'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'id', 'image-loading-cover')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(loader_url),
									A2($elm$html$Html$Attributes$style, 'height', '32px'),
									A2($elm$html$Html$Attributes$style, 'z-index', '3')
								]),
							_List_Nil)
						]));
			case 'Done':
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'id', 'image-loading-cover')
						]),
					_List_Nil);
			default:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-top', '-405px'),
							A2($elm$html$Html$Attributes$style, 'background', 'rgba(256, 256, 256, 0.4)'),
							A2($elm$html$Html$Attributes$style, 'z-index', '2'),
							A2($elm$html$Html$Attributes$style, 'width', 'inherit'),
							A2($elm$html$Html$Attributes$style, 'height', 'inherit'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'id', 'image-loading-cover')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'z-index', '3'),
									A2($elm$html$Html$Attributes$style, 'color', 'white')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Upload Failed. Please try again')
								]))
						]));
		}
	});
var $author$project$ImageUpload$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'height', '405px')
					]),
				_List_fromArray(
					[
						$author$project$ImageUpload$imageView(model),
						A2($author$project$ImageUpload$uploadingImageCoverView, model.loaderURL, model.status)
					])),
				$author$project$ImageUpload$hiddenInputView(model.image_data.image_id),
				A3($author$project$ImageUpload$uploaderView, model.successIconURL, model.failIconURL, model.status)
			]));
};
var $author$project$ImageUpload$main = $elm$browser$Browser$element(
	{init: $author$project$ImageUpload$init, subscriptions: $author$project$ImageUpload$subscriptions, update: $author$project$ImageUpload$update, view: $author$project$ImageUpload$view});
var $author$project$ArtworkDetail$Create = F2(
	function (a, b) {
		return {$: 'Create', a: a, b: b};
	});
var $author$project$ArtworkDetail$Artwork = function (title) {
	return function (status) {
		return function (series) {
			return function (image) {
				return function (year) {
					return function (size) {
						return function (location) {
							return function (rolled) {
								return function (framed) {
									return function (medium) {
										return function (priceUSD) {
											return function (priceNIS) {
												return function (sizeCm) {
													return function (sizeIn) {
														return function (additional) {
															return function (saleData) {
																return function (worksInExhibition) {
																	return {additional: additional, framed: framed, image: image, location: location, medium: medium, priceNIS: priceNIS, priceUSD: priceUSD, rolled: rolled, saleData: saleData, series: series, size: size, sizeCm: sizeCm, sizeIn: sizeIn, status: status, title: title, worksInExhibition: worksInExhibition, year: year};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$ArtworkDetail$sizeDecoder = function (unit) {
	var widthField = 'width_' + unit;
	var heightField = 'height_' + unit;
	var depthField = 'depth_' + unit;
	return A5(
		$elm$json$Json$Decode$map4,
		F4(
			function (w, h, d, u) {
				return {depth: d, height: h, unit: u, width: w};
			}),
		A2(
			$elm$json$Json$Decode$field,
			heightField,
			A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float)),
		A2(
			$elm$json$Json$Decode$field,
			widthField,
			A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float)),
		A2(
			$elm$json$Json$Decode$field,
			depthField,
			A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float)),
		$elm$json$Json$Decode$succeed(unit));
};
var $author$project$ArtworkDetail$artworkDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'worksInExhibition',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
	_List_Nil,
	A2(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
		A2($elm$json$Json$Decode$field, 'sale_data', $author$project$SaleData$decode),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'additional',
			$elm$json$Json$Decode$string,
			A2(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
				$author$project$ArtworkDetail$sizeDecoder('in'),
				A2(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
					$author$project$ArtworkDetail$sizeDecoder('cm'),
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'price_usd',
						A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float),
						'',
						A4(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'price_nis',
							A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float),
							'',
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'medium',
								$elm$json$Json$Decode$string,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'framed',
									$elm$json$Json$Decode$bool,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'rolled',
										$elm$json$Json$Decode$string,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'location',
											$elm$json$Json$Decode$string,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'size',
												$elm$json$Json$Decode$string,
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'year',
													A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
													A2(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
														$author$project$ImageUpload$decoder,
														A2(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
															A3(
																$elm$json$Json$Decode$map2,
																F2(
																	function (index, name) {
																		return _Utils_Tuple2(index, name);
																	}),
																A2($elm$json$Json$Decode$field, 'series_id', $elm$json$Json$Decode$int),
																A2($elm$json$Json$Decode$field, 'series_name', $elm$json$Json$Decode$string)),
															A3(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																'status',
																$elm$json$Json$Decode$string,
																A3(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																	'title',
																	$elm$json$Json$Decode$string,
																	$elm$json$Json$Decode$succeed($author$project$ArtworkDetail$Artwork))))))))))))))))));
var $author$project$ArtworkDetail$decoder = A2(
	$elm$json$Json$Decode$map,
	function (artwork) {
		return A2($author$project$ArtworkDetail$Create, '', artwork);
	},
	$author$project$ArtworkDetail$artworkDecoder);
var $author$project$ArtworkDetail$initImage = {
	artwork_id: $elm$core$Maybe$Nothing,
	csrftoken: '',
	failIconURL: '',
	image_data: {image_id: $elm$core$Maybe$Nothing, image_url: $elm$core$Maybe$Nothing},
	loaderURL: '',
	status: $author$project$ImageUpload$Waiting,
	successIconURL: ''
};
var $author$project$ArtworkDetail$initSize = {depth: '', height: '', unit: '', width: ''};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$ArtworkDetail$newArtwork = {
	additional: '',
	framed: false,
	image: $author$project$ArtworkDetail$initImage,
	location: '',
	medium: '',
	priceNIS: '',
	priceUSD: '',
	rolled: '',
	saleData: $author$project$SaleData$init(
		$elm$json$Json$Encode$object(_List_Nil)).a,
	series: _Utils_Tuple2(1, ''),
	size: '',
	sizeCm: $author$project$ArtworkDetail$initSize,
	sizeIn: $author$project$ArtworkDetail$initSize,
	status: '',
	title: '',
	worksInExhibition: _List_Nil,
	year: ''
};
var $author$project$ArtworkDetail$init = function (flags) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$ArtworkDetail$decoder, flags);
	if (_v0.$ === 'Ok') {
		var model = _v0.a;
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	} else {
		var e = _v0.a;
		var debug_init = A2($elm$core$Debug$log, 'error initializing ArtworkDetail', e);
		return _Utils_Tuple2(
			A2($author$project$ArtworkDetail$Create, '', $author$project$ArtworkDetail$newArtwork),
			$elm$core$Platform$Cmd$none);
	}
};
var $author$project$ArtworkDetail$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$ArtworkDetail$Edit = F3(
	function (a, b, c) {
		return {$: 'Edit', a: a, b: b, c: c};
	});
var $author$project$ArtworkDetail$updateAdditional = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{additional: val});
	});
var $author$project$ArtworkDetail$updateFramed = F2(
	function (val, artwork) {
		return artwork;
	});
var $author$project$ArtworkDetail$updateImage = F2(
	function (msg, artwork) {
		return _Utils_update(
			artwork,
			{
				image: A2($author$project$ImageUpload$update, msg, artwork.image).a
			});
	});
var $author$project$ArtworkDetail$updateLocation = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{location: val});
	});
var $author$project$ArtworkDetail$updateMedium = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{medium: val});
	});
var $author$project$ArtworkDetail$updatePriceNIS = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{priceNIS: val});
	});
var $author$project$ArtworkDetail$updatePriceUSD = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{priceUSD: val});
	});
var $author$project$ArtworkDetail$updateRolled = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{rolled: val});
	});
var $author$project$ArtworkDetail$updateSaleData = F2(
	function (msg, artwork) {
		return _Utils_update(
			artwork,
			{
				saleData: A2($author$project$SaleData$update, msg, artwork.saleData).a
			});
	});
var $author$project$ArtworkDetail$updateSeries = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{
				series: _Utils_Tuple2(artwork.series.a, val)
			});
	});
var $author$project$ArtworkDetail$updateSize = F2(
	function (msg, size) {
		switch (msg.$) {
			case 'UpdateHeight':
				var height = msg.a;
				return _Utils_update(
					size,
					{height: height});
			case 'UpdateWidth':
				var width = msg.a;
				return _Utils_update(
					size,
					{width: width});
			default:
				var depth = msg.a;
				return _Utils_update(
					size,
					{depth: depth});
		}
	});
var $author$project$ArtworkDetail$updateSizeCm = F2(
	function (msg, artwork) {
		return _Utils_update(
			artwork,
			{
				sizeCm: A2($author$project$ArtworkDetail$updateSize, msg, artwork.sizeCm)
			});
	});
var $author$project$ArtworkDetail$updateSizeField = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{size: val});
	});
var $author$project$ArtworkDetail$updateSizeIn = F2(
	function (msg, artwork) {
		return _Utils_update(
			artwork,
			{
				sizeIn: A2($author$project$ArtworkDetail$updateSize, msg, artwork.sizeIn)
			});
	});
var $author$project$ArtworkDetail$updateTitle = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{title: val});
	});
var $author$project$ArtworkDetail$updateYear = F2(
	function (val, artwork) {
		return _Utils_update(
			artwork,
			{year: val});
	});
var $author$project$ArtworkDetail$update = F2(
	function (msg, model) {
		var updateArtwork = F2(
			function (updateField, val) {
				if (model.$ === 'Create') {
					var csrf = model.a;
					var artwork = model.b;
					return A2(
						$author$project$ArtworkDetail$Create,
						csrf,
						A2(updateField, val, artwork));
				} else {
					var csrf = model.a;
					var id = model.b;
					var artwork = model.c;
					return A3(
						$author$project$ArtworkDetail$Edit,
						csrf,
						id,
						A2(updateField, val, artwork));
				}
			});
		switch (msg.$) {
			case 'UpdateTitle':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateTitle, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateSeries':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateSeries, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateImage':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateImage, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateYear':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateYear, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateSizeField':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateSizeField, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateLocation':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateLocation, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateRolled':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateRolled, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateFramed':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateFramed, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateMedium':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateMedium, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdatePriceUSD':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updatePriceUSD, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdatePriceNIS':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updatePriceNIS, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateSizeIn':
				var sizeMsg = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateSizeIn, sizeMsg),
					$elm$core$Platform$Cmd$none);
			case 'UpdateSizeCm':
				var sizeMsg = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateSizeCm, sizeMsg),
					$elm$core$Platform$Cmd$none);
			case 'UpdateAdditional':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateAdditional, val),
					$elm$core$Platform$Cmd$none);
			case 'UpdateSaleData':
				var val = msg.a;
				return _Utils_Tuple2(
					A2(updateArtwork, $author$project$ArtworkDetail$updateSaleData, val),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$Attributes$action = function (uri) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'action',
		_VirtualDom_noJavaScriptUri(uri));
};
var $elm$html$Html$Attributes$enctype = $elm$html$Html$Attributes$stringProperty('enctype');
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$Attributes$method = $elm$html$Html$Attributes$stringProperty('method');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$ArtworkDetail$viewField = function (value_) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('{% if ungroup %}ungroup{% endif %}'),
				$elm$html$Html$Attributes$class('form-group'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(value_),
						$elm$html$Html$Attributes$class('edit-field'),
						$elm$html$Html$Attributes$class('form-control'),
						$elm$html$Html$Attributes$class('form-control-sm')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(value_)
					]))
			]));
};
var $author$project$ArtworkDetail$viewDetails = F2(
	function (edit_mode, artwork) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('artwork-details'),
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-body')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card-title')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Details')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('object-details-body'),
									$elm$html$Html$Attributes$class('details-list'),
									$elm$html$Html$Attributes$class('form-inline')
								]),
							_List_fromArray(
								[
									$author$project$ArtworkDetail$viewField(artwork.year),
									$author$project$ArtworkDetail$viewField(artwork.size),
									$author$project$ArtworkDetail$viewField(artwork.location),
									$author$project$ArtworkDetail$viewField(artwork.rolled),
									$author$project$ArtworkDetail$viewField(
									function (a) {
										return a ? 'True' : 'False';
									}(artwork.framed)),
									$author$project$ArtworkDetail$viewField(artwork.medium),
									A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$for('size-fields-measures')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Size ( h w d ):')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('size-field-measures'),
											A2($elm$html$Html$Attributes$style, 'margin-top', '-0.5rem;')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$id('size-fields-in'),
													$elm$html$Html$Attributes$class('form-group'),
													A2($elm$html$Html$Attributes$style, 'display', 'flex;')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('id_size_in'),
															$elm$html$Html$Attributes$class('size-field-container')
														]),
													_List_fromArray(
														[
															$author$project$ArtworkDetail$viewField(artwork.sizeIn.height),
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('size-field-separator')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('x')
																])),
															$author$project$ArtworkDetail$viewField(artwork.sizeIn.width),
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('size-field-separator')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('x')
																])),
															$author$project$ArtworkDetail$viewField(artwork.sizeIn.depth)
														])),
													A2(
													$elm$html$Html$label,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$for('id_size_in')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('in')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$id('size-fields-cm'),
													$elm$html$Html$Attributes$class('form-group'),
													A2($elm$html$Html$Attributes$style, 'display', 'flex;')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('id_size_cm'),
															$elm$html$Html$Attributes$class('size-field-container')
														]),
													_List_fromArray(
														[
															$author$project$ArtworkDetail$viewField(artwork.sizeCm.height),
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('size-field-separator')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('x')
																])),
															$author$project$ArtworkDetail$viewField(artwork.sizeCm.width),
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('size-field-separator')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('x')
																])),
															$author$project$ArtworkDetail$viewField(artwork.sizeCm.depth)
														])),
													A2(
													$elm$html$Html$label,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$for('id_size_cm')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('cm')
														]))
												]))
										])),
									$author$project$ArtworkDetail$viewField(artwork.additional)
								]))
						]))
				]));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$table = _VirtualDom_node('table');
var $author$project$ArtworkDetail$viewExhibitions = F2(
	function (edit_mode, artwork) {
		return edit_mode ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('exhibitions'),
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-body')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card-title')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('All Exhibitions')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-inline'),
									$elm$html$Html$Attributes$id('add-work-to-exhibition')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$select,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('collapse'),
											$elm$html$Html$Attributes$id('workinexhibition-artwork')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('{{ object.pk }}'),
													$elm$html$Html$Attributes$selected(true)
												]),
											_List_Nil)
										])),
									$author$project$ArtworkDetail$viewField('exhibitionForm'),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('button'),
											$elm$html$Html$Attributes$class('btn'),
											$elm$html$Html$Attributes$class('btn-primary'),
											$elm$html$Html$Attributes$class('btn-sm'),
											$elm$html$Html$Attributes$id('new-exhibition-submit')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Add new')
										]))
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('workinexhibition-form-errors')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('table'),
									$elm$html$Html$Attributes$class('table-striped'),
									$elm$html$Html$Attributes$class('table-hover'),
									$elm$html$Html$Attributes$id('related-exhibitions')
								]),
							_List_Nil)
						]))
				])) : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('exhibitions')
				]),
			_List_Nil);
	});
var $author$project$ArtworkDetail$viewHeader = F2(
	function (edit_mode, artwork) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('page-header'),
					$elm$html$Html$Attributes$class('')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-inline')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group'),
									$elm$html$Html$Attributes$id('series-select')
								]),
							_List_fromArray(
								[
									$author$project$ArtworkDetail$viewField(artwork.series.b),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('header-item'),
											$elm$html$Html$Attributes$class('separator'),
											A2($elm$html$Html$Attributes$style, 'margin-left', '1rem'),
											A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(':')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-inline'),
							A2($elm$html$Html$Attributes$style, 'flex-wrap', 'nowrap')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('header-item'),
											$elm$html$Html$Attributes$class('separator'),
											A2($elm$html$Html$Attributes$style, 'padding-left', '0rem'),
											A2($elm$html$Html$Attributes$style, 'padding-right', '2rem'),
											A2($elm$html$Html$Attributes$style, 'margin-left', '1rem'),
											A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem')
										]),
									_List_Nil),
									$author$project$ArtworkDetail$viewField(artwork.title),
									$author$project$ArtworkDetail$viewField(artwork.status),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('header-item'),
											$elm$html$Html$Attributes$class('separator'),
											A2($elm$html$Html$Attributes$style, 'margin-left', '1.5rem'),
											A2($elm$html$Html$Attributes$style, 'margin-right', '1.5rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('/')
										])),
									A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('header-item'),
											$elm$html$Html$Attributes$id('breadcrumb'),
											$elm$html$Html$Attributes$for('{{ form.title.auto_id }}')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Artwork')
										]))
								])),
							edit_mode ? A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('clone-artwork'),
											$elm$html$Html$Attributes$class('btn'),
											$elm$html$Html$Attributes$href('{% url \'catalogue:artwork_clone\' artwork_pk=artwork.pk %}'),
											A2($elm$html$Html$Attributes$style, 'margin-left', '5rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Copy')
										]))
								])) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_Utils_ap(
										edit_mode ? _List_fromArray(
											[
												$elm$html$Html$Attributes$class('header-action'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '1rem')
											]) : _List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('submit'),
												$elm$html$Html$Attributes$id('detail-submit'),
												$elm$html$Html$Attributes$class('action-button'),
												$elm$html$Html$Attributes$class('btn'),
												$elm$html$Html$Attributes$value('{{ action_name }}')
											])),
									_List_Nil)
								]))
						]))
				]));
	});
var $author$project$ArtworkDetail$UpdateImage = function (a) {
	return {$: 'UpdateImage', a: a};
};
var $author$project$ArtworkDetail$viewImage = F2(
	function (edit_mode, artwork) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('artwork-image'),
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-body')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('elm-stuff')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('elm-image-upload-flags')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$img,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$src('{%, static \'images/spinner.svg\' %}'),
													A2($elm$html$Html$Attributes$style, 'display', 'none')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$img,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$src('{%, static \'images/upload_check.svg\' %}'),
													A2($elm$html$Html$Attributes$style, 'display', 'none')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$id('elm-image-upload')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$map,
													$author$project$ArtworkDetail$UpdateImage,
													$author$project$ImageUpload$view(artwork.image))
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$ArtworkDetail$UpdateSaleData = function (a) {
	return {$: 'UpdateSaleData', a: a};
};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $author$project$ArtworkDetail$viewSales = F2(
	function (edit_mode, artwork) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('sales-info'),
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-body'),
							$elm$html$Html$Attributes$class('sale-form')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card-title')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Sale Info')
								])),
							A2(
							$elm$html$Html$h4,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '18px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Pricing')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('details-list'),
									$elm$html$Html$Attributes$class('form-inline'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '1rem')
								]),
							_List_fromArray(
								[
									$author$project$ArtworkDetail$viewField(artwork.priceNIS),
									$author$project$ArtworkDetail$viewField(artwork.priceUSD)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('elm-sale-data-flags')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('elm-sale-data-app')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$ArtworkDetail$UpdateSaleData,
									$author$project$SaleData$view(artwork.saleData))
								]))
						]))
				]));
	});
var $author$project$ArtworkDetail$view = function (model) {
	var edit_mode = function () {
		if (model.$ === 'Create') {
			return false;
		} else {
			return true;
		}
	}();
	var artwork = function () {
		if (model.$ === 'Create') {
			var a = model.b;
			return a;
		} else {
			var a = model.c;
			return a;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$form,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$action('.'),
						$elm$html$Html$Attributes$method('POST'),
						$elm$html$Html$Attributes$enctype('multipart/form-data')
					]),
				_List_fromArray(
					[
						A2($author$project$ArtworkDetail$viewHeader, edit_mode, artwork),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row'),
								$elm$html$Html$Attributes$class('mx-auto'),
								$elm$html$Html$Attributes$id('artwork-details-wrapper'),
								A2($elm$html$Html$Attributes$style, 'max-width', '999px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-6'),
										A2($elm$html$Html$Attributes$style, 'padding', '0px'),
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
										A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
									]),
								_List_fromArray(
									[
										A2($author$project$ArtworkDetail$viewImage, edit_mode, artwork),
										A2($author$project$ArtworkDetail$viewSales, edit_mode, artwork)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-6'),
										A2($elm$html$Html$Attributes$style, 'padding', '0px'),
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
										A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
									]),
								_List_fromArray(
									[
										A2($author$project$ArtworkDetail$viewDetails, edit_mode, artwork),
										A2($author$project$ArtworkDetail$viewExhibitions, edit_mode, artwork)
									]))
							]))
					])),
				A2(
				$elm$html$Html$form,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('collapse'),
						$elm$html$Html$Attributes$action('{%, url \'catalogue:add_workinexhibition\' %}'),
						$elm$html$Html$Attributes$method('POST'),
						$elm$html$Html$Attributes$id('workinexhibition-form')
					]),
				_List_Nil)
			]));
};
var $author$project$ArtworkDetail$main = $elm$browser$Browser$element(
	{init: $author$project$ArtworkDetail$init, subscriptions: $author$project$ArtworkDetail$subscriptions, update: $author$project$ArtworkDetail$update, view: $author$project$ArtworkDetail$view});
_Platform_export({'ArtworkDetail':{'init':$author$project$ArtworkDetail$main($elm$json$Json$Decode$value)(0)},'SalesGallery':{'init':$author$project$SalesGallery$main($elm$json$Json$Decode$value)(0)},'SaleData':{'init':$author$project$SaleData$main($elm$json$Json$Decode$value)(0)},'ImageUpload':{'init':$author$project$ImageUpload$main($elm$json$Json$Decode$value)(0)}});}(this));