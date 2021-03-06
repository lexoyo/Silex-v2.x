(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var DateTools = function() { }
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	return (function($this) {
		var $r;
		switch(e) {
		case "%":
			$r = "%";
			break;
		case "C":
			$r = StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
			break;
		case "d":
			$r = StringTools.lpad(Std.string(d.getDate()),"0",2);
			break;
		case "D":
			$r = DateTools.__format(d,"%m/%d/%y");
			break;
		case "e":
			$r = Std.string(d.getDate());
			break;
		case "H":case "k":
			$r = StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
			break;
		case "I":case "l":
			$r = (function($this) {
				var $r;
				var hour = d.getHours() % 12;
				$r = StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
				return $r;
			}($this));
			break;
		case "m":
			$r = StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
			break;
		case "M":
			$r = StringTools.lpad(Std.string(d.getMinutes()),"0",2);
			break;
		case "n":
			$r = "\n";
			break;
		case "p":
			$r = d.getHours() > 11?"PM":"AM";
			break;
		case "r":
			$r = DateTools.__format(d,"%I:%M:%S %p");
			break;
		case "R":
			$r = DateTools.__format(d,"%H:%M");
			break;
		case "s":
			$r = Std.string(d.getTime() / 1000 | 0);
			break;
		case "S":
			$r = StringTools.lpad(Std.string(d.getSeconds()),"0",2);
			break;
		case "t":
			$r = "\t";
			break;
		case "T":
			$r = DateTools.__format(d,"%H:%M:%S");
			break;
		case "u":
			$r = (function($this) {
				var $r;
				var t = d.getDay();
				$r = t == 0?"7":Std.string(t);
				return $r;
			}($this));
			break;
		case "w":
			$r = Std.string(d.getDay());
			break;
		case "y":
			$r = StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
			break;
		case "Y":
			$r = Std.string(d.getFullYear());
			break;
		default:
			$r = (function($this) {
				var $r;
				throw "Date.format %" + e + "- not implemented yet.";
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.b += HxOverrides.substr(f,p,np - p);
		r.b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.b += HxOverrides.substr(f,p,f.length - p);
	return r.b;
}
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
}
DateTools.delta = function(d,t) {
	return (function($this) {
		var $r;
		var d1 = new Date();
		d1.setTime(d.getTime() + t);
		$r = d1;
		return $r;
	}(this));
}
DateTools.getMonthDays = function(d) {
	var month = d.getMonth();
	var year = d.getFullYear();
	if(month != 1) return DateTools.DAYS_OF_MONTH[month];
	var isB = year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	return isB?29:28;
}
DateTools.seconds = function(n) {
	return n * 1000.0;
}
DateTools.minutes = function(n) {
	return n * 60.0 * 1000.0;
}
DateTools.hours = function(n) {
	return n * 60.0 * 60.0 * 1000.0;
}
DateTools.days = function(n) {
	return n * 24.0 * 60.0 * 60.0 * 1000.0;
}
DateTools.parse = function(t) {
	var s = t / 1000;
	var m = s / 60;
	var h = m / 60;
	return { ms : t % 1000, seconds : s % 60 | 0, minutes : m % 60 | 0, hours : h % 24 | 0, days : h / 24 | 0};
}
DateTools.make = function(o) {
	return o.ms + 1000.0 * (o.seconds + 60.0 * (o.minutes + 60.0 * (o.hours + 24.0 * o.days)));
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
$hxClasses["Hash"] = Hash;
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = function() {
	this.h = { };
};
$hxClasses["IntHash"] = IntHash;
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIter"] = IntIter;
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("<");
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += Std.string(" ");
				s.b += Std.string(k);
				s.b += Std.string("=\"");
				s.b += Std.string(this._attributes.get(k));
				s.b += Std.string("\"");
			}
			if(this._children.length == 0) {
				s.b += Std.string("/>");
				return s.b;
			}
			s.b += Std.string(">");
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("</");
			s.b += Std.string(this._nodeName);
			s.b += Std.string(">");
		}
		return s.b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.splice(pos,0,x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = HxOverrides.remove(this._children,x);
		if(b) x._parent = null;
		return b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,getParent: function() {
		return this._parent;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,_parent: null
	,_children: null
	,_attributes: null
	,_nodeValue: null
	,_nodeName: null
	,parent: null
	,nodeValue: null
	,nodeName: null
	,nodeType: null
	,__class__: Xml
	,__properties__: {set_nodeName:"setNodeName",get_nodeName:"getNodeName",set_nodeValue:"setNodeValue",get_nodeValue:"getNodeValue",get_parent:"getParent"}
}
var brix = {}
brix.component = {}
brix.component.IBrixComponent = function() { }
$hxClasses["brix.component.IBrixComponent"] = brix.component.IBrixComponent;
brix.component.IBrixComponent.__name__ = ["brix","component","IBrixComponent"];
brix.component.IBrixComponent.prototype = {
	getBrixApplication: null
	,brixInstanceId: null
	,__class__: brix.component.IBrixComponent
}
brix.component.BrixComponent = function() { }
$hxClasses["brix.component.BrixComponent"] = brix.component.BrixComponent;
brix.component.BrixComponent.__name__ = ["brix","component","BrixComponent"];
brix.component.BrixComponent.initBrixComponent = function(component,brixInstanceId) {
	component.brixInstanceId = brixInstanceId;
}
brix.component.BrixComponent.getBrixApplication = function(component) {
	return brix.core.Application.get(component.brixInstanceId);
}
brix.component.BrixComponent.checkRequiredParameters = function(cmpClass,elt) {
	var requires = haxe.rtti.Meta.getType(cmpClass).requires;
	if(requires == null) return;
	var _g = 0;
	while(_g < requires.length) {
		var r = requires[_g];
		++_g;
		if(elt.getAttribute(Std.string(r)) == null || StringTools.trim(elt.getAttribute(Std.string(r))) == "") throw Std.string(r) + " parameter is required for " + Type.getClassName(cmpClass);
	}
}
brix.component.ui = {}
brix.component.ui.IDisplayObject = function() { }
$hxClasses["brix.component.ui.IDisplayObject"] = brix.component.ui.IDisplayObject;
brix.component.ui.IDisplayObject.__name__ = ["brix","component","ui","IDisplayObject"];
brix.component.ui.IDisplayObject.__interfaces__ = [brix.component.IBrixComponent];
brix.component.ui.IDisplayObject.prototype = {
	rootElement: null
	,__class__: brix.component.ui.IDisplayObject
}
brix.component.ui.DisplayObject = function(rootElement,brixId) {
	this.rootElement = rootElement;
	brix.component.BrixComponent.initBrixComponent(this,brixId);
	this.getBrixApplication().addAssociatedComponent(rootElement,this);
};
$hxClasses["brix.component.ui.DisplayObject"] = brix.component.ui.DisplayObject;
brix.component.ui.DisplayObject.__name__ = ["brix","component","ui","DisplayObject"];
brix.component.ui.DisplayObject.__interfaces__ = [brix.component.ui.IDisplayObject];
brix.component.ui.DisplayObject.isDisplayObject = function(cmpClass) {
	if(cmpClass == Type.resolveClass("brix.component.ui.DisplayObject")) return true;
	if(Type.getSuperClass(cmpClass) != null) return brix.component.ui.DisplayObject.isDisplayObject(Type.getSuperClass(cmpClass));
	return false;
}
brix.component.ui.DisplayObject.checkFilterOnElt = function(cmpClass,elt) {
	if(elt.nodeType != js.Lib.document.body.nodeType) throw "cannot instantiate " + Type.getClassName(cmpClass) + " on a non element node.";
	var tagFilter = haxe.rtti.Meta.getType(cmpClass) != null?haxe.rtti.Meta.getType(cmpClass).tagNameFilter:null;
	if(tagFilter == null) return;
	if(Lambda.exists(tagFilter,function(s) {
		return elt.nodeName.toLowerCase() == Std.string(s).toLowerCase();
	})) return;
	throw "cannot instantiate " + Type.getClassName(cmpClass) + " on this type of HTML element: " + elt.nodeName.toLowerCase();
}
brix.component.ui.DisplayObject.prototype = {
	clean: function() {
	}
	,init: function() {
	}
	,remove: function() {
		this.clean();
		this.getBrixApplication().removeAssociatedComponent(this.rootElement,this);
	}
	,getBrixApplication: function() {
		return brix.component.BrixComponent.getBrixApplication(this);
	}
	,rootElement: null
	,brixInstanceId: null
	,__class__: brix.component.ui.DisplayObject
}
brix.component.group = {}
brix.component.group.Group = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	var explodedClassName = rootElement.className.split(" ");
	if(Lambda.has(explodedClassName,"Group")) {
		brix.component.group.Group.GROUP_SEQ++;
		var newGroupId = "Group" + brix.component.group.Group.GROUP_SEQ + "r";
		HxOverrides.remove(explodedClassName,"Group");
		explodedClassName.unshift(newGroupId);
		rootElement.className = explodedClassName.join(" ");
		var $it0 = this.discoverGroupableChilds(rootElement).iterator();
		while( $it0.hasNext() ) {
			var gc = $it0.next();
			gc.setAttribute("data-group-id",newGroupId);
		}
	}
};
$hxClasses["brix.component.group.Group"] = brix.component.group.Group;
brix.component.group.Group.__name__ = ["brix","component","group","Group"];
brix.component.group.Group.__super__ = brix.component.ui.DisplayObject;
brix.component.group.Group.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	discoverGroupableChilds: function(elt) {
		var groupables = new List();
		var _g1 = 0, _g = elt.childNodes.length;
		while(_g1 < _g) {
			var childCnt = _g1++;
			if(elt.childNodes[childCnt].nodeType != 1) continue;
			if(elt.childNodes[childCnt].className != null) {
				var _g2 = 0, _g3 = elt.childNodes[childCnt].className.split(" ");
				while(_g2 < _g3.length) {
					var c = _g3[_g2];
					++_g2;
					var rc = this.getBrixApplication().resolveUIComponentClass(c,brix.component.group.IGroupable);
					if(rc == null) continue;
					groupables.add(elt.childNodes[childCnt]);
					break;
				}
				if(Lambda.has(elt.childNodes[childCnt].className.split(" "),"Group")) continue;
			}
			groupables = Lambda.concat(groupables,this.discoverGroupableChilds(elt.childNodes[childCnt]));
		}
		return groupables;
	}
	,__class__: brix.component.group.Group
});
brix.component.group.IGroupable = function() { }
$hxClasses["brix.component.group.IGroupable"] = brix.component.group.IGroupable;
brix.component.group.IGroupable.__name__ = ["brix","component","group","IGroupable"];
brix.component.group.IGroupable.__interfaces__ = [brix.component.ui.IDisplayObject];
brix.component.group.IGroupable.prototype = {
	groupElement: null
	,__class__: brix.component.group.IGroupable
}
brix.component.group.Groupable = function() { }
$hxClasses["brix.component.group.Groupable"] = brix.component.group.Groupable;
brix.component.group.Groupable.__name__ = ["brix","component","group","Groupable"];
brix.component.group.Groupable.startGroupable = function(groupable,rootElement) {
	var groupId = groupable.rootElement.getAttribute("data-group-id");
	if(groupId == null) return;
	if(rootElement == null) {
		var groupElements = groupable.getBrixApplication().body.getElementsByClassName(groupId);
		if(groupElements.length < 1) return;
		if(groupElements.length > 1) throw "ERROR " + groupElements.length + " Group components are declared with the same group id " + groupId;
		groupable.groupElement = groupElements[0];
	} else {
		var domElement = rootElement;
		while(domElement != null && !brix.util.DomTools.hasClass(domElement,groupId)) domElement = domElement.parentNode;
		if(domElement != null) groupable.groupElement = domElement; else return;
	}
}
brix.component.interaction = {}
brix.component.interaction.DraggableState = $hxClasses["brix.component.interaction.DraggableState"] = { __ename__ : ["brix","component","interaction","DraggableState"], __constructs__ : ["none","dragging"] }
brix.component.interaction.DraggableState.none = ["none",0];
brix.component.interaction.DraggableState.none.toString = $estr;
brix.component.interaction.DraggableState.none.__enum__ = brix.component.interaction.DraggableState;
brix.component.interaction.DraggableState.dragging = ["dragging",1];
brix.component.interaction.DraggableState.dragging.toString = $estr;
brix.component.interaction.DraggableState.dragging.__enum__ = brix.component.interaction.DraggableState;
brix.component.interaction.Draggable = function(rootElement,brixId) {
	this.isDirty = false;
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	if(this.groupElement == null) this.groupElement = js.Lib.document.body;
	this.phantom = js.Lib.document.createElement("div");
	this.miniPhantom = js.Lib.document.createElement("div");
	this.state = brix.component.interaction.DraggableState.none;
	this.phantomClassName = rootElement.getAttribute("data-phantom-class-name");
	if(this.phantomClassName == null || this.phantomClassName == "") this.phantomClassName = "draggable-phantom";
	this.dropZonesClassName = rootElement.getAttribute("data-dropzones-class-name");
	if(this.dropZonesClassName == null || this.dropZonesClassName == "") this.dropZonesClassName = "draggable-dropzone";
};
$hxClasses["brix.component.interaction.Draggable"] = brix.component.interaction.Draggable;
brix.component.interaction.Draggable.__name__ = ["brix","component","interaction","Draggable"];
brix.component.interaction.Draggable.__interfaces__ = [brix.component.group.IGroupable];
brix.component.interaction.Draggable.__super__ = brix.component.ui.DisplayObject;
brix.component.interaction.Draggable.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	setAsBestDropZone: function(zone) {
		if(zone == this.bestDropZone) return;
		if(this.bestDropZone != null) this.bestDropZone.parent.removeChild(this.phantom);
		if(zone != null) {
			if(zone.parent.childNodes.length <= zone.position) zone.parent.appendChild(this.phantom); else zone.parent.insertBefore(this.phantom,zone.parent.childNodes[zone.position]);
		}
		this.bestDropZone = zone;
	}
	,computeDistance: function(boundingBox1,mouseX,mouseY) {
		var centerBox1X = boundingBox1.x + boundingBox1.w / 2.0;
		var centerBox1Y = boundingBox1.y + boundingBox1.h / 2.0;
		return Math.sqrt(Math.pow(centerBox1X - mouseX,2) + Math.pow(centerBox1Y - mouseY,2));
	}
	,createDropZoneArray: function() {
		var dropZones = new List();
		var taggedDropZones = this.groupElement.getElementsByClassName(this.dropZonesClassName);
		var _g1 = 0, _g = taggedDropZones.length;
		while(_g1 < _g) {
			var dzi = _g1++;
			dropZones.add(taggedDropZones[dzi]);
		}
		if(dropZones.isEmpty()) dropZones.add(this.rootElement.parentNode);
		this.dropZoneArray = new Array();
		var $it0 = dropZones.iterator();
		while( $it0.hasNext() ) {
			var zone = $it0.next();
			if(zone.style.display != "none") {
				var _g1 = 0, _g = zone.childNodes.length;
				while(_g1 < _g) {
					var childIdx = _g1++;
					var child = zone.childNodes[childIdx];
					zone.insertBefore(this.miniPhantom,child);
					var bbPhantom = brix.util.DomTools.getElementBoundingBox(this.miniPhantom);
					this.dropZoneArray.push({ parent : zone, position : childIdx, boundingBox : bbPhantom});
				}
				zone.appendChild(this.miniPhantom);
				var bbPhantom = brix.util.DomTools.getElementBoundingBox(this.miniPhantom);
				this.dropZoneArray.push({ parent : zone, position : zone.childNodes.length + 1, boundingBox : bbPhantom});
				zone.removeChild(this.miniPhantom);
			}
		}
	}
	,deleteDropZoneArray: function() {
		this.dropZoneArray = null;
	}
	,getBestDropZone: function(mouseX,mouseY) {
		if(this.dropZoneArray == null) throw "The drop zones must have been computed before you can get the best drop zone. Call Draggable::createDropZoneArray method first.";
		var nearestDropZone = null;
		var nearestDistance = 999999999.0;
		var _g = 0, _g1 = this.dropZoneArray;
		while(_g < _g1.length) {
			var dropZone = _g1[_g];
			++_g;
			var dist = this.computeDistance(dropZone.boundingBox,mouseX,mouseY);
			if(dist < nearestDistance) {
				nearestDistance = dist;
				nearestDropZone = dropZone;
			}
		}
		return nearestDropZone;
	}
	,updateBestDropZone: function() {
		this.isDirty = false;
		if(this.state == brix.component.interaction.DraggableState.dragging) {
			this.setAsBestDropZone(null);
			this.setAsBestDropZone(this.getBestDropZone(this.currentMouseX,this.currentMouseY));
		}
	}
	,invalidateBestDropZone: function() {
		if(this.isDirty == false) {
			this.isDirty = true;
			haxe.Timer.delay($bind(this,this.updateBestDropZone),10);
		}
	}
	,stopDrag: function(e) {
		js.Lib.document.body.removeEventListener("mousemove",this.moveCallback,false);
		if(this.state == brix.component.interaction.DraggableState.dragging) {
			if(this.bestDropZone != null) {
				this.rootElement.parentNode.removeChild(this.rootElement);
				this.bestDropZone.parent.insertBefore(this.rootElement,this.bestDropZone.parent.childNodes[this.bestDropZone.position]);
				var event = js.Lib.document.createEvent("CustomEvent");
				event.initCustomEvent("dragEventDropped",true,true,{ dropZone : this.bestDropZone, target : this.bestDropZone.parent, draggable : this});
				this.bestDropZone.parent.dispatchEvent(event);
			}
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("dragEventDropped",true,true,{ dropZone : this.bestDropZone, target : this.rootElement, draggable : this});
			this.rootElement.dispatchEvent(event);
			this.state = brix.component.interaction.DraggableState.none;
			this.resetRootElementStyle();
			this.setAsBestDropZone(null);
			this.deleteDropZoneArray();
			e.preventDefault();
		}
	}
	,move: function(e) {
		if(this.state == brix.component.interaction.DraggableState.none) {
			var boundingBox = brix.util.DomTools.getElementBoundingBox(this.rootElement);
			this.state = brix.component.interaction.DraggableState.dragging;
			this.initialMouseX = e.clientX - boundingBox.x;
			this.initialMouseY = e.clientY - boundingBox.y;
			this.initRootElementStyle();
			this.initPhantomStyle();
			brix.util.DomTools.moveTo(this.rootElement,boundingBox.x,boundingBox.y);
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("dragEventDrag",true,true,{ dropZone : this.bestDropZone, target : this.rootElement, draggable : this});
			this.rootElement.dispatchEvent(event);
			this.createDropZoneArray();
		}
		this.currentMouseX = e.clientX;
		this.currentMouseY = e.clientY;
		brix.util.DomTools.moveTo(this.rootElement,this.currentMouseX - this.initialMouseX,this.currentMouseY - this.initialMouseY);
		this.invalidateBestDropZone();
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("dragEventMove",true,true,{ dropZone : this.bestDropZone, target : this.rootElement, draggable : this});
		this.rootElement.dispatchEvent(event);
	}
	,startDrag: function(e) {
		this.moveCallback = (function(f) {
			return function(e1) {
				return f(e1);
			};
		})($bind(this,this.move));
		js.Lib.document.body.addEventListener("mousemove",this.moveCallback,false);
		e.preventDefault();
	}
	,resetRootElementStyle: function() {
		var _g = 0, _g1 = Reflect.fields(this.initialStyle);
		while(_g < _g1.length) {
			var styleName = _g1[_g];
			++_g;
			try {
				var val = Reflect.field(this.initialStyle,styleName);
				this.rootElement.style[styleName] = val;
			} catch( e ) {
			}
		}
	}
	,initPhantomStyle: function(refHtmlDom) {
		if(refHtmlDom == null) refHtmlDom = this.rootElement;
		this.phantom.style.cssText = refHtmlDom.style.cssText;
		this.miniPhantom.style.cssText = refHtmlDom.style.cssText;
		this.phantom.className = this.phantomClassName;
		this.miniPhantom.className = this.phantomClassName;
		this.phantom.className += " " + refHtmlDom.className;
		this.miniPhantom.className += " " + refHtmlDom.className;
		this.phantom.style.width = refHtmlDom.clientWidth + "px";
		this.phantom.style.height = refHtmlDom.clientHeight + "px";
		this.miniPhantom.style.width = refHtmlDom.clientWidth + "px";
		this.miniPhantom.style.height = refHtmlDom.clientHeight + "px";
	}
	,initRootElementStyle: function() {
		this.initialStyle = { };
		var _g = 0, _g1 = Reflect.fields(this.rootElement.style);
		while(_g < _g1.length) {
			var styleName = _g1[_g];
			++_g;
			var val = Reflect.field(this.rootElement.style,styleName);
			this.initialStyle[styleName] = val;
		}
		this.initialStyle.width = this.rootElement.style.width;
		this.rootElement.style.width = this.rootElement.clientWidth + "px";
		this.initialStyle.height = this.rootElement.style.height;
		this.rootElement.style.height = this.rootElement.clientHeight + "px";
		this.initialStyle.position = this.rootElement.style.position;
		this.rootElement.style.position = "absolute";
	}
	,clean: function() {
		brix.component.ui.DisplayObject.prototype.clean.call(this);
		this.dragZone.removeEventListener("mousedown",$bind(this,this.startDrag),false);
		js.Lib.document.body.removeEventListener("mouseup",this.mouseUpCallback,false);
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
		this.dragZone = brix.util.DomTools.getSingleElement(this.rootElement,"draggable-dragzone",false);
		if(this.dragZone == null) this.dragZone = this.rootElement;
		this.dragZone.addEventListener("mousedown",$bind(this,this.startDrag),false);
		this.mouseUpCallback = (function(f) {
			return function(e) {
				return f(e);
			};
		})($bind(this,this.stopDrag));
		js.Lib.document.body.addEventListener("mouseup",this.mouseUpCallback,false);
		this.dragZone.style.cursor = "move";
	}
	,dropZoneArray: null
	,isDirty: null
	,currentMouseY: null
	,currentMouseX: null
	,initialMouseY: null
	,initialMouseX: null
	,initialStyle: null
	,bestDropZone: null
	,phantomClassName: null
	,dropZonesClassName: null
	,dragZone: null
	,state: null
	,miniPhantom: null
	,phantom: null
	,mouseUpCallback: null
	,moveCallback: null
	,groupElement: null
	,__class__: brix.component.interaction.Draggable
});
brix.component.interaction.NotificationManager = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	this.notifications = new Array();
	this.notificationZone = brix.util.DomTools.getSingleElement(rootElement,"notification-zone",true);
	this.notificationTemplate = this.notificationZone.innerHTML;
	this.notificationZone.innerHTML = "";
	this.initNotificationsCallback = (function(f) {
		return function(e) {
			return f(e);
		};
	})($bind(this,this.initNotifications));
	rootElement.addEventListener("click",this.initNotificationsCallback,false);
	rootElement.addEventListener("notificationEvent",$bind(this,this.onNotificationReceived),false);
};
$hxClasses["brix.component.interaction.NotificationManager"] = brix.component.interaction.NotificationManager;
brix.component.interaction.NotificationManager.__name__ = ["brix","component","interaction","NotificationManager"];
brix.component.interaction.NotificationManager.notifySuccess = function(title,body,rootElement) {
	brix.component.interaction.NotificationManager.notify("assets/admin/notification-info.png",title,body,rootElement);
}
brix.component.interaction.NotificationManager.notifyError = function(title,body,rootElement) {
	brix.component.interaction.NotificationManager.notify("assets/admin/notification-error.png",title,body,rootElement);
}
brix.component.interaction.NotificationManager.notify = function(iconUrl,title,body,rootElement) {
	if(rootElement == null) {
		var elements = js.Lib.document.body.getElementsByClassName("NotificationManager");
		if(elements.length <= 0) throw "Error: could not find a NotificationManager in the DOM";
		rootElement = elements[0];
	}
	var event = js.Lib.document.createEvent("CustomEvent");
	event.initCustomEvent("notificationEvent",true,true,{ iconUrl : iconUrl, title : title, body : body});
	rootElement.dispatchEvent(event);
}
brix.component.interaction.NotificationManager.__super__ = brix.component.ui.DisplayObject;
brix.component.interaction.NotificationManager.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	destroyCustomNotification: function(notification) {
		HxOverrides.remove(this.notifications,notification);
		this.refreshNotifications();
	}
	,refreshNotifications: function() {
		var t = new haxe.Template(this.notificationTemplate);
		try {
			this.notificationZone.innerHTML = t.execute({ notifications : this.notifications});
		} catch( e ) {
			null;
		}
		null;
	}
	,sendCustomNotification: function(notification,duration) {
		if(duration == null) duration = 10000;
		if(duration > 0) haxe.Timer.delay((function(f,a1) {
			return function() {
				return f(a1);
			};
		})($bind(this,this.destroyCustomNotification),notification),duration);
		this.notifications.push(notification);
		this.refreshNotifications();
	}
	,destroyNotification: function(notification) {
		notification.cancel();
	}
	,sendNotification: function(e,duration) {
		if(duration == null) duration = 10000;
		if(!this.hasNotification()) throw "NO NOTIFICATION SYSTEM";
		if(!this.hasPermission()) throw "NO NOTIFICATION PERMISSION";
		var notification;
		notification = window.webkitNotifications.createNotification(e.iconUrl,e.title,e.body);
		notification.show();
		if(duration > 0) haxe.Timer.delay((function(f,a1) {
			return function() {
				return f(a1);
			};
		})($bind(this,this.destroyNotification),notification),duration);
	}
	,requestPermission: function(acceptCallback,denyCallback) {
		if(this.hasNotification()) {
			if(this.hasPermission()) acceptCallback(); else window.webkitNotifications.requestPermission((function(f,a1,a2) {
				return function() {
					return f(a1,a2);
				};
			})($bind(this,this.permissionRequestCallback),acceptCallback,denyCallback));
		} else null;
	}
	,permissionRequestCallback: function(acceptCallback,denyCallback) {
		if(this.hasNotification() && this.hasPermission()) {
			if(acceptCallback != null) acceptCallback();
		} else if(denyCallback != null) denyCallback();
	}
	,hasPermission: function() {
		return this.hasNotification() && window.webkitNotifications.checkPermission() == 0;
	}
	,hasNotification: function() {
		return window.webkitNotifications != null;
	}
	,onNotificationReceived: function(e) {
		if(this.hasNotification()) {
			if(this.hasPermission()) this.sendNotification(e.detail); else {
				this.requestPermission(null,null);
				this.sendCustomNotification(e.detail);
			}
		} else this.sendCustomNotification(e.detail);
	}
	,initNotifications: function(e) {
		if(!this.hasPermission()) this.requestPermission(null,null);
		this.rootElement.removeEventListener("click",this.initNotificationsCallback,false);
		this.rootElement.style.display = "inline-block";
	}
	,initNotificationsCallback: null
	,notificationZone: null
	,notificationTemplate: null
	,notifications: null
	,__class__: brix.component.interaction.NotificationManager
});
brix.component.layout = {}
brix.component.layout.LayoutBase = function(rootElement,BrixId) {
	this.preventRedraw = false;
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	js.Lib.window.addEventListener("resize",$bind(this,this.redrawCallback),false);
	js.Lib.document.addEventListener("layoutRedraw",$bind(this,this.redrawCallback),true);
	js.Lib.document.addEventListener("pageOpenStop",$bind(this,this.redrawCallback),true);
	js.Lib.document.addEventListener("pageCloseStop",$bind(this,this.redrawCallback),true);
	js.Lib.document.addEventListener("changeContextEvent",$bind(this,this.redrawCallback),true);
	js.Lib.document.addEventListener("layoutRedraw",$bind(this,this.redrawCallback),true);
};
$hxClasses["brix.component.layout.LayoutBase"] = brix.component.layout.LayoutBase;
brix.component.layout.LayoutBase.__name__ = ["brix","component","layout","LayoutBase"];
brix.component.layout.LayoutBase.__super__ = brix.component.ui.DisplayObject;
brix.component.layout.LayoutBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	redraw: function() {
		if(this.preventRedraw) return;
		this.preventRedraw = true;
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("layoutRedraw",true,true,{ target : this.rootElement, component : this});
		this.rootElement.dispatchEvent(event);
		this.preventRedraw = false;
	}
	,redrawCallback: function(e) {
		this.redraw();
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
	}
	,preventRedraw: null
	,__class__: brix.component.layout.LayoutBase
});
brix.component.layout.Accordion = function(rootElement,BrixId) {
	brix.component.layout.LayoutBase.call(this,rootElement,BrixId);
};
$hxClasses["brix.component.layout.Accordion"] = brix.component.layout.Accordion;
brix.component.layout.Accordion.__name__ = ["brix","component","layout","Accordion"];
brix.component.layout.Accordion.__super__ = brix.component.layout.LayoutBase;
brix.component.layout.Accordion.prototype = $extend(brix.component.layout.LayoutBase.prototype,{
	redraw: function() {
		if(this.preventRedraw) return;
		var bodySize;
		var boundingBox = brix.util.DomTools.getElementBoundingBox(this.rootElement);
		if(this.isHorizontal) {
			bodySize = boundingBox.w;
			var margin = this.rootElement.offsetWidth - this.rootElement.clientWidth;
			bodySize -= margin;
			var elements = this.rootElement.getElementsByClassName("accordion-header");
			if(elements == null || elements.length == 0) throw "No headers found for the accordion.";
			var _g1 = 0, _g = elements.length;
			while(_g1 < _g) {
				var idx = _g1++;
				var element = elements[idx];
				bodySize -= element.offsetWidth;
				var margin1 = element.offsetWidth - element.clientWidth;
				bodySize -= margin1;
			}
			var elements1 = this.rootElement.getElementsByClassName("accordion-item");
			var _g1 = 0, _g = elements1.length;
			while(_g1 < _g) {
				var idx = _g1++;
				var element = elements1[idx];
				var margin1 = element.offsetWidth - element.clientWidth;
				element.style.width = bodySize - margin1 + "px";
			}
		} else {
			bodySize = boundingBox.h;
			var margin = this.rootElement.offsetHeight - this.rootElement.clientHeight;
			bodySize -= margin;
			var elements = this.rootElement.getElementsByClassName("accordion-header");
			if(elements == null || elements.length == 0) throw "No headers found for the accordion.";
			var _g1 = 0, _g = elements.length;
			while(_g1 < _g) {
				var idx = _g1++;
				var element = elements[idx];
				bodySize -= element.offsetHeight;
				var margin1 = element.offsetHeight - element.clientHeight;
				bodySize -= margin1;
			}
			var elements1 = this.rootElement.getElementsByClassName("accordion-item");
			var _g1 = 0, _g = elements1.length;
			while(_g1 < _g) {
				var idx = _g1++;
				var element = elements1[idx];
				var margin1 = element.offsetHeight - element.clientHeight;
				element.style.height = bodySize - margin1 + "px";
			}
		}
		brix.component.layout.LayoutBase.prototype.redraw.call(this);
	}
	,init: function() {
		brix.component.layout.LayoutBase.prototype.init.call(this);
		if(this.rootElement.getAttribute("data-accordion-is-horizontal") == "true") this.isHorizontal = true; else this.isHorizontal = false;
	}
	,isHorizontal: null
	,__class__: brix.component.layout.Accordion
});
brix.component.layout.Panel = function(rootElement,brixId) {
	brix.component.layout.LayoutBase.call(this,rootElement,brixId);
	var cssClassName = rootElement.getAttribute("data-panel-header-class-name");
	if(cssClassName == null) cssClassName = "panel-header";
	this.header = brix.util.DomTools.getSingleElement(rootElement,cssClassName,false);
	if(this.header == null) null;
	var cssClassName1 = rootElement.getAttribute("data-panel-body-class-name");
	if(cssClassName1 == null) cssClassName1 = "panel-body";
	this.body = brix.util.DomTools.getSingleElement(rootElement,cssClassName1,true);
	var cssClassName2 = rootElement.getAttribute("data-panel-footer-class-name");
	if(cssClassName2 == null) cssClassName2 = "panel-footer";
	this.footer = brix.util.DomTools.getSingleElement(rootElement,cssClassName2,false);
	if(this.footer == null) null;
	if(rootElement.getAttribute("data-panel-is-horizontal") == "true") this.isHorizontal = true; else this.isHorizontal = false;
};
$hxClasses["brix.component.layout.Panel"] = brix.component.layout.Panel;
brix.component.layout.Panel.__name__ = ["brix","component","layout","Panel"];
brix.component.layout.Panel.__super__ = brix.component.layout.LayoutBase;
brix.component.layout.Panel.prototype = $extend(brix.component.layout.LayoutBase.prototype,{
	redraw: function() {
		if(this.preventRedraw) return;
		var bodySize;
		var boundingBox = brix.util.DomTools.getElementBoundingBox(this.rootElement);
		if(this.isHorizontal) {
			var margin = this.rootElement.offsetWidth - this.rootElement.clientWidth;
			var bodyMargin = this.body.offsetWidth - this.body.clientWidth;
			bodySize = boundingBox.w;
			if(this.header != null) {
				var bbHeader = brix.util.DomTools.getElementBoundingBox(this.header);
				brix.util.DomTools.moveTo(this.body,bbHeader.w,null);
				bodySize -= bbHeader.w;
			} else brix.util.DomTools.moveTo(this.body,0,null);
			bodySize -= bodyMargin;
			bodySize -= margin;
			if(this.footer != null) {
				var footerMargin = this.footer.offsetWidth - this.footer.clientWidth;
				var boundingBox1 = brix.util.DomTools.getElementBoundingBox(this.footer);
				bodySize -= boundingBox1.w;
				bodySize -= footerMargin;
			}
			this.body.style.width = bodySize + "px";
		} else {
			var margin = this.rootElement.offsetHeight - this.rootElement.clientHeight;
			var bodyMargin = this.body.offsetHeight - this.body.clientHeight;
			bodySize = boundingBox.h;
			if(this.header != null) {
				var bbHeader = brix.util.DomTools.getElementBoundingBox(this.header);
				brix.util.DomTools.moveTo(this.body,null,bbHeader.h);
				bodySize -= bbHeader.h;
			} else brix.util.DomTools.moveTo(this.body,null,0);
			bodySize -= bodyMargin;
			bodySize -= margin;
			if(this.footer != null) {
				var footerMargin = this.footer.offsetHeight - this.footer.clientHeight;
				var boundingBox1 = brix.util.DomTools.getElementBoundingBox(this.footer);
				bodySize -= boundingBox1.h;
				bodySize -= footerMargin;
			}
			this.body.style.height = bodySize + "px";
		}
		brix.component.layout.LayoutBase.prototype.redraw.call(this);
	}
	,init: function() {
		brix.component.layout.LayoutBase.prototype.init.call(this);
	}
	,footer: null
	,header: null
	,body: null
	,isHorizontal: null
	,__class__: brix.component.layout.Panel
});
brix.component.list = {}
brix.component.list.List = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	this._selectedIndex = -1;
	this.dataProvider = [];
	this.listTemplate = rootElement.innerHTML;
	rootElement.innerHTML = "";
};
$hxClasses["brix.component.list.List"] = brix.component.list.List;
brix.component.list.List.__name__ = ["brix","component","list","List"];
brix.component.list.List.__super__ = brix.component.ui.DisplayObject;
brix.component.list.List.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	setSelectedIndex: function(idx) {
		if(idx != this._selectedIndex) {
			if(idx >= 0 && this.dataProvider.length > idx && this.dataProvider[idx] != null) this._selectedIndex = idx; else this._selectedIndex = -1;
			this.updateSelectionDisplay([this.getSelectedItem()]);
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("listChange",false,false,{ target : this.rootElement, item : this.getSelectedItem()});
			this.rootElement.dispatchEvent(event);
		}
		return idx;
	}
	,getSelectedIndex: function() {
		return this._selectedIndex;
	}
	,setSelectedItem: function(selected) {
		if(selected != this.getSelectedItem()) {
			if(selected != null) {
				var tmpIdx = -1;
				var _g1 = 0, _g = this.dataProvider.length;
				while(_g1 < _g) {
					var idx = _g1++;
					if(this.dataProvider[idx] == selected) {
						tmpIdx = idx;
						break;
					}
				}
				this.setSelectedIndex(tmpIdx);
			} else this.setSelectedIndex(-1);
		}
		return selected;
	}
	,getSelectedItem: function() {
		return this.dataProvider[this._selectedIndex];
	}
	,updateSelectionDisplay: function(selection) {
		var children = this.rootElement.getElementsByTagName("li");
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var idxElem = this.getItemIdx(children[idx]);
			if(idxElem >= 0) {
				var found = false;
				var _g2 = 0;
				while(_g2 < selection.length) {
					var elem = selection[_g2];
					++_g2;
					if(elem == this.dataProvider[idxElem]) {
						found = true;
						break;
					}
				}
				if(children[idx] == null) continue;
				if(found) brix.util.DomTools.addClass(children[idx],"listSelectedItem"); else brix.util.DomTools.removeClass(children[idx],"listSelectedItem");
			}
		}
	}
	,rollOver: function(e) {
		var element = e.target;
		var idx = this.getItemIdx(element);
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("listChange",false,false,{ target : this.rootElement, item : this.dataProvider[idx]});
		this.rootElement.dispatchEvent(event);
	}
	,click: function(e) {
		var element = e.target;
		var idx = this.getItemIdx(element);
		this.setSelectedItem(this.dataProvider[idx]);
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("listClick",false,false,{ target : this.rootElement, item : this.getSelectedItem()});
		this.rootElement.dispatchEvent(event);
	}
	,getItemIdx: function(childElement) {
		if(childElement == this.rootElement || childElement == null) throw "Error, could not find the element clicked in the list.";
		if(childElement.nodeType != this.rootElement.nodeType || childElement.getAttribute("data-list-item-idx") == null) return this.getItemIdx(childElement.parentNode);
		return Std.parseInt(childElement.getAttribute("data-list-item-idx"));
	}
	,setItemIds: function(reset) {
		if(reset == null) reset = false;
		var idx = 0;
		var _g1 = 0, _g = this.rootElement.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.rootElement.childNodes[i].nodeType != this.rootElement.nodeType || reset && this.rootElement.childNodes[i].getAttribute("data-list-item-idx") == null) continue;
			this.rootElement.childNodes[i].setAttribute("data-list-item-idx",Std.string(idx));
			idx++;
		}
	}
	,reloadData: function() {
		this.doRedraw();
	}
	,doRedraw: function() {
		var listInnerHtml = "";
		var t = new haxe.Template(this.listTemplate);
		var _g = 0, _g1 = this.dataProvider;
		while(_g < _g1.length) {
			var elem = _g1[_g];
			++_g;
			try {
				listInnerHtml += t.execute(elem,brix.component.template.TemplateMacros);
			} catch( e ) {
				throw "Error: an error occured while interpreting the template - " + this.listTemplate + " - for the element " + Std.string(elem);
			}
		}
		var _g1 = 0, _g = this.rootElement.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.getBrixApplication().cleanNode(this.rootElement.childNodes[i]);
		}
		this.rootElement.innerHTML = listInnerHtml;
		var _g1 = 0, _g = this.rootElement.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.getBrixApplication().initNode(this.rootElement.childNodes[i]);
		}
		this.setItemIds();
		this.updateSelectionDisplay([this.getSelectedItem()]);
	}
	,listDOMChanged: function(e) {
		e.stopPropagation();
		var newDataProvider = new Array();
		var _g1 = 0, _g = this.rootElement.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.rootElement.childNodes[i].nodeType != this.rootElement.nodeType || this.rootElement.childNodes[i].getAttribute("data-list-item-idx") == null) continue;
			newDataProvider.push(this.dataProvider[Std.parseInt(this.rootElement.childNodes[i].getAttribute("data-list-item-idx"))]);
		}
		this.dataProvider = newDataProvider;
		this.setItemIds(true);
	}
	,redraw: function() {
		this.reloadData();
	}
	,clean: function() {
		brix.component.ui.DisplayObject.prototype.clean.call(this);
		this.rootElement.removeEventListener("click",$bind(this,this.click),false);
		this.rootElement.removeEventListener("rollOver",$bind(this,this.rollOver),false);
		this.rootElement.removeEventListener("dragEventDropped",$bind(this,this.listDOMChanged),false);
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
		this.rootElement.addEventListener("click",$bind(this,this.click),false);
		this.rootElement.addEventListener("rollOver",$bind(this,this.rollOver),false);
		this.rootElement.addEventListener("dragEventDropped",$bind(this,this.listDOMChanged),false);
	}
	,_selectedIndex: null
	,selectedIndex: null
	,selectedItem: null
	,dataProvider: null
	,listTemplate: null
	,__class__: brix.component.list.List
	,__properties__: {set_selectedItem:"setSelectedItem",get_selectedItem:"getSelectedItem",set_selectedIndex:"setSelectedIndex",get_selectedIndex:"getSelectedIndex"}
});
brix.component.navigation = {}
brix.component.navigation.ContextManager = function(rootElement,brixId) {
	this.isDirty = false;
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	if(rootElement.getAttribute("data-context-list") != null) this.allContexts = this.string2ContextList(rootElement.getAttribute("data-context-list")); else throw "Error: Context component needs param in " + "data-context-list";
	rootElement.addEventListener("addContextsEvent",$bind(this,this.onAddContextEvent),true);
	rootElement.addEventListener("removeContextsEvent",$bind(this,this.onRemoveContextEvent),true);
	rootElement.addEventListener("resetContextsEvent",$bind(this,this.onResetContextEvent),true);
	rootElement.addEventListener("replaceContextsEvent",$bind(this,this.onReplaceContextsEvent),true);
};
$hxClasses["brix.component.navigation.ContextManager"] = brix.component.navigation.ContextManager;
brix.component.navigation.ContextManager.__name__ = ["brix","component","navigation","ContextManager"];
brix.component.navigation.ContextManager.styleSheet = null;
brix.component.navigation.ContextManager.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.ContextManager.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	contextList2String: function(contextList) {
		return contextList.concat(", ");
	}
	,cleanupContextValue: function(contextName) {
		return StringTools.trim(contextName).toLowerCase();
	}
	,string2ContextList: function(string) {
		var contextList = string.split(",");
		var _g1 = 0, _g = contextList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			contextList[idx] = this.cleanupContextValue(contextList[idx]);
		}
		return contextList;
	}
	,refresh: function() {
		if(brix.component.navigation.ContextManager.styleSheet != null) this.getBrixApplication().htmlRootElement.getElementsByTagName("head")[0].removeChild(brix.component.navigation.ContextManager.styleSheet);
		var cssText = "";
		var _g = 0, _g1 = this.allContexts;
		while(_g < _g1.length) {
			var context = _g1[_g];
			++_g;
			cssText += "." + context + " { display : none; visibility : hidden; } ";
		}
		var _g = 0, _g1 = this.currentContexts;
		while(_g < _g1.length) {
			var context = _g1[_g];
			++_g;
			cssText += "." + context + " { display : inline; visibility : visible; } ";
		}
		brix.component.navigation.ContextManager.styleSheet = brix.util.DomTools.addCssRules(cssText);
		this.isDirty = false;
	}
	,isOutContext: function(element) {
		if(element.className != null) {
			var elementClasses = element.className.split(" ");
			var _g = 0;
			while(_g < elementClasses.length) {
				var className = elementClasses[_g];
				++_g;
				className = this.cleanupContextValue(className);
				if(this.isContext(className) && !this.hasContext(className)) return true;
			}
		}
		return false;
	}
	,isInContext: function(element) {
		if(element.className != null) {
			var elementClasses = element.className.split(" ");
			var _g = 0;
			while(_g < elementClasses.length) {
				var className = elementClasses[_g];
				++_g;
				className = this.cleanupContextValue(className);
				if(this.isContext(className) && this.hasContext(className)) return true;
			}
		}
		return false;
	}
	,isContext: function(context) {
		return Lambda.has(this.allContexts,context);
	}
	,hasContext: function(context) {
		return Lambda.has(this.currentContexts,context);
	}
	,removeContext: function(context) {
		if(!this.isContext(context)) throw "Error: unknown context \"" + context + "\". It should be defined in the \"" + "data-context-list" + "\" parameter of the Context component.";
		if(this.hasContext(context)) {
			HxOverrides.remove(this.currentContexts,context);
			this.invalidate();
		} else {
		}
	}
	,addContext: function(context) {
		if(!this.isContext(context)) throw "Error: unknown context \"" + context + "\". It should be defined in the \"" + "data-context-list" + "\" parameter of the Context component.";
		if(!this.hasContext(context)) {
			this.currentContexts.push(context);
			this.invalidate();
		} else {
		}
	}
	,setCurrentContexts: function(contextList) {
		this.currentContexts = contextList;
		this.invalidate();
		return contextList;
	}
	,invalidate: function() {
		this.refresh();
		this.isDirty = true;
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("changeContextEvent",false,false,this.currentContexts);
		this.rootElement.dispatchEvent(event);
	}
	,onResetContextEvent: function(e) {
		this.resetContexts();
	}
	,onReplaceContextsEvent: function(e) {
		var contextValues = e.detail;
		this.setCurrentContexts(contextValues);
	}
	,onRemoveContextEvent: function(e) {
		var contextValues = e.detail;
		var _g = 0;
		while(_g < contextValues.length) {
			var contextValue = contextValues[_g];
			++_g;
			this.removeContext(contextValue);
		}
	}
	,onAddContextEvent: function(e) {
		var contextValues = e.detail;
		var _g = 0;
		while(_g < contextValues.length) {
			var contextValue = contextValues[_g];
			++_g;
			this.addContext(contextValue);
		}
	}
	,resetContexts: function() {
		if(this.rootElement.getAttribute("data-initial-context") != null) this.setCurrentContexts(this.string2ContextList(this.rootElement.getAttribute("data-initial-context"))); else this.setCurrentContexts(new Array());
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
		this.resetContexts();
	}
	,isDirty: null
	,currentContexts: null
	,allContexts: null
	,__class__: brix.component.navigation.ContextManager
	,__properties__: {set_currentContexts:"setCurrentContexts"}
});
brix.component.navigation.LayerStatus = $hxClasses["brix.component.navigation.LayerStatus"] = { __ename__ : ["brix","component","navigation","LayerStatus"], __constructs__ : ["showTransition","hideTransition","visible","hidden","notInit"] }
brix.component.navigation.LayerStatus.showTransition = ["showTransition",0];
brix.component.navigation.LayerStatus.showTransition.toString = $estr;
brix.component.navigation.LayerStatus.showTransition.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.hideTransition = ["hideTransition",1];
brix.component.navigation.LayerStatus.hideTransition.toString = $estr;
brix.component.navigation.LayerStatus.hideTransition.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.visible = ["visible",2];
brix.component.navigation.LayerStatus.visible.toString = $estr;
brix.component.navigation.LayerStatus.visible.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.hidden = ["hidden",3];
brix.component.navigation.LayerStatus.hidden.toString = $estr;
brix.component.navigation.LayerStatus.hidden.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.LayerStatus.notInit = ["notInit",4];
brix.component.navigation.LayerStatus.notInit.toString = $estr;
brix.component.navigation.LayerStatus.notInit.__enum__ = brix.component.navigation.LayerStatus;
brix.component.navigation.Layer = function(rootElement,brixId) {
	this.hasTransitionStarted = false;
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	this.childrenArray = new Array();
	this.setStatus(brix.component.navigation.LayerStatus.notInit);
	this.styleAttrDisplay = rootElement.style.display;
};
$hxClasses["brix.component.navigation.Layer"] = brix.component.navigation.Layer;
brix.component.navigation.Layer.__name__ = ["brix","component","navigation","Layer"];
brix.component.navigation.Layer.getLayerNodes = function(pageName,brixId,root) {
	if(pageName == null) pageName = "";
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	if(pageName != "") return body.getElementsByClassName(pageName); else return body.getElementsByClassName("Layer");
}
brix.component.navigation.Layer.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.Layer.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	cleanupVideoElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				element.pause();
				element.currentTime = 0;
			} catch( e ) {
				null;
			}
		}
	}
	,cleanupAudioElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				element.pause();
				element.currentTime = 0;
			} catch( e ) {
				null;
			}
		}
	}
	,setupVideoElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				if(element.autoplay == true) {
					element.currentTime = 0;
					element.play();
				}
				element.muted = brix.component.sound.SoundOn.isMuted;
			} catch( e ) {
				null;
			}
		}
	}
	,setupAudioElements: function(nodeList) {
		var _g1 = 0, _g = nodeList.length;
		while(_g1 < _g) {
			var idx = _g1++;
			try {
				var element = nodeList[idx];
				if(element.autoplay == true) {
					element.currentTime = 0;
					element.play();
				}
				element.muted = brix.component.sound.SoundOn.isMuted;
			} catch( e ) {
				null;
			}
		}
	}
	,doHide: function(transitionData,transitionObserver,preventTransitions,e) {
		if(e != null && e.target != this.rootElement) return;
		if(preventTransitions == false && this.doHideCallback == null) return;
		if(preventTransitions == false) {
			this.endTransition(brix.component.navigation.transition.TransitionType.hide,transitionData,this.doHideCallback);
			this.doHideCallback = null;
		}
		this.setStatus(brix.component.navigation.LayerStatus.hidden);
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("onLayerHideStop",false,false,{ transitionData : transitionData, target : this.rootElement, layer : this});
			this.rootElement.dispatchEvent(event);
		} catch( e1 ) {
			null;
		}
		if(transitionObserver != null) transitionObserver.removeTransition(this);
		while(this.rootElement.childNodes.length > 0) {
			var element = this.rootElement.childNodes[0];
			this.rootElement.removeChild(element);
			this.childrenArray.push(element);
		}
		this.rootElement.style.display = "none";
	}
	,hide: function(transitionData,transitionObserver,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		if(this.status == brix.component.navigation.LayerStatus.hideTransition) {
			this.doHideCallback(null);
			this.removeTransitionEvent(this.doHideCallback);
		} else if(this.status == brix.component.navigation.LayerStatus.showTransition) {
			this.doShowCallback(null);
			this.removeTransitionEvent(this.doShowCallback);
		}
		if(this.status != brix.component.navigation.LayerStatus.visible && this.status != brix.component.navigation.LayerStatus.notInit) return;
		this.setStatus(brix.component.navigation.LayerStatus.hideTransition);
		if(transitionObserver != null) transitionObserver.addTransition(this);
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("onLayerHideStart",false,false,{ transitionData : transitionData, target : this.rootElement, layer : this});
			this.rootElement.dispatchEvent(event);
		} catch( e ) {
			null;
		}
		var audioNodes = this.rootElement.getElementsByTagName("audio");
		this.cleanupAudioElements(audioNodes);
		var videoNodes = this.rootElement.getElementsByTagName("video");
		this.cleanupVideoElements(videoNodes);
		if(preventTransitions == false) {
			this.doHideCallback = (function(f,a1,a2,a3) {
				return function(e) {
					return f(a1,a2,a3,e);
				};
			})($bind(this,this.doHide),transitionData,transitionObserver,preventTransitions);
			this.startTransition(brix.component.navigation.transition.TransitionType.hide,transitionData,this.doHideCallback);
		} else this.doHide(transitionData,transitionObserver,preventTransitions,null);
	}
	,doShow: function(transitionData,transitionObserver,preventTransitions,e) {
		if(e != null && e.target != this.rootElement) return;
		if(preventTransitions == false && this.doShowCallback == null) return;
		if(preventTransitions == false) this.endTransition(brix.component.navigation.transition.TransitionType.show,transitionData,this.doShowCallback);
		this.doShowCallback = null;
		this.setStatus(brix.component.navigation.LayerStatus.visible);
		var audioNodes = this.rootElement.getElementsByTagName("audio");
		this.setupAudioElements(audioNodes);
		var videoNodes = this.rootElement.getElementsByTagName("video");
		this.setupVideoElements(videoNodes);
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("onLayerShowStop",false,false,{ transitionData : transitionData, target : this.rootElement, layer : this});
			this.rootElement.dispatchEvent(event);
		} catch( e1 ) {
			null;
		}
		if(transitionObserver != null) transitionObserver.removeTransition(this);
	}
	,show: function(transitionData,transitionObserver,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		if(this.status == brix.component.navigation.LayerStatus.hideTransition) {
			this.doHideCallback(null);
			this.removeTransitionEvent(this.doHideCallback);
		} else if(this.status == brix.component.navigation.LayerStatus.showTransition) {
			this.doShowCallback(null);
			this.removeTransitionEvent(this.doShowCallback);
		}
		if(this.status != brix.component.navigation.LayerStatus.hidden && this.status != brix.component.navigation.LayerStatus.notInit) return;
		this.setStatus(brix.component.navigation.LayerStatus.showTransition);
		while(this.childrenArray.length > 0) {
			var element = this.childrenArray.shift();
			this.rootElement.appendChild(element);
		}
		if(transitionObserver != null) transitionObserver.addTransition(this);
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("onLayerShowStart",false,false,{ transitionData : transitionData, target : this.rootElement, layer : this});
			this.rootElement.dispatchEvent(event);
		} catch( e ) {
			null;
		}
		if(preventTransitions == false) {
			this.doShowCallback = (function(f,a1,a2,a3) {
				return function(e) {
					return f(a1,a2,a3,e);
				};
			})($bind(this,this.doShow),transitionData,transitionObserver,preventTransitions);
			this.startTransition(brix.component.navigation.transition.TransitionType.show,transitionData,this.doShowCallback);
		} else this.doShow(transitionData,transitionObserver,preventTransitions,null);
		this.rootElement.style.display = this.styleAttrDisplay;
	}
	,removeTransitionEvent: function(onEndCallback) {
		this.rootElement.removeEventListener("transitionend",onEndCallback,false);
		this.rootElement.removeEventListener("transitionEnd",onEndCallback,false);
		this.rootElement.removeEventListener("webkitTransitionEnd",onEndCallback,false);
		this.rootElement.removeEventListener("oTransitionEnd",onEndCallback,false);
		this.rootElement.removeEventListener("MSTransitionEnd",onEndCallback,false);
	}
	,addTransitionEvent: function(onEndCallback) {
		this.rootElement.addEventListener("transitionend",onEndCallback,false);
		this.rootElement.addEventListener("transitionEnd",onEndCallback,false);
		this.rootElement.addEventListener("webkitTransitionEnd",onEndCallback,false);
		this.rootElement.addEventListener("oTransitionEnd",onEndCallback,false);
		this.rootElement.addEventListener("MSTransitionEnd",onEndCallback,false);
	}
	,endTransition: function(type,transitionData,onComplete) {
		this.removeTransitionEvent(onComplete);
		if(transitionData != null) brix.util.DomTools.removeClass(this.rootElement,transitionData.endStyleName);
		var transitionData2 = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,type);
		if(transitionData2 != null) brix.util.DomTools.removeClass(this.rootElement,transitionData2.endStyleName);
	}
	,doStartTransition: function(sumOfTransitions,onComplete) {
		var _g = 0;
		while(_g < sumOfTransitions.length) {
			var transition = sumOfTransitions[_g];
			++_g;
			brix.util.DomTools.removeClass(this.rootElement,transition.startStyleName);
		}
		if(onComplete != null) this.addTransitionEvent(onComplete);
		brix.component.navigation.transition.TransitionTools.setTransitionProperty(this.rootElement,"transitionDuration",null);
		var _g = 0;
		while(_g < sumOfTransitions.length) {
			var transition = sumOfTransitions[_g];
			++_g;
			brix.util.DomTools.addClass(this.rootElement,transition.endStyleName);
		}
	}
	,startTransition: function(type,transitionData,onComplete) {
		var transitionData2 = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,type);
		var sumOfTransitions = new Array();
		if(transitionData != null) sumOfTransitions.push(transitionData);
		if(transitionData2 != null) sumOfTransitions.push(transitionData2);
		if(sumOfTransitions.length == 0) {
			if(onComplete != null) onComplete(null);
		} else {
			this.hasTransitionStarted = true;
			brix.component.navigation.transition.TransitionTools.setTransitionProperty(this.rootElement,"transitionDuration","0");
			var _g = 0;
			while(_g < sumOfTransitions.length) {
				var transition = sumOfTransitions[_g];
				++_g;
				brix.util.DomTools.addClass(this.rootElement,transition.startStyleName);
			}
			brix.util.DomTools.doLater((function(f,a1,a2) {
				return function() {
					return f(a1,a2);
				};
			})($bind(this,this.doStartTransition),sumOfTransitions,onComplete));
		}
	}
	,checkForNeverEndingTransition: function() {
		if(this.status == brix.component.navigation.LayerStatus.showTransition || this.status == brix.component.navigation.LayerStatus.hideTransition) haxe.Timer.delay($bind(this,this.checkForNeverEndingTransition),2500);
	}
	,setStatus: function(newStatus) {
		this.status = newStatus;
		if(this.status == brix.component.navigation.LayerStatus.showTransition || this.status == brix.component.navigation.LayerStatus.hideTransition) haxe.Timer.delay($bind(this,this.checkForNeverEndingTransition),2500);
		return this.status;
	}
	,doHideCallback: null
	,doShowCallback: null
	,styleAttrDisplay: null
	,hasTransitionStarted: null
	,status: null
	,childrenArray: null
	,__class__: brix.component.navigation.Layer
	,__properties__: {set_status:"setStatus"}
});
brix.component.navigation.Page = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	if(this.groupElement == null) this.groupElement = this.getBrixApplication().body;
	this.name = rootElement.getAttribute("name");
	if(this.name == null || StringTools.trim(this.name) == "") throw "Pages must have a 'name' attribute";
	if(brix.component.navigation.Page.useDeeplink == null) brix.component.navigation.Page.useDeeplink = brix.util.DomTools.getMeta("useDeeplink") == null || brix.util.DomTools.getMeta("useDeeplink") == "true";
	if(brix.component.navigation.Page.useDeeplink) js.Lib.window.addEventListener("popstate",$bind(this,this.onPopState),true);
};
$hxClasses["brix.component.navigation.Page"] = brix.component.navigation.Page;
brix.component.navigation.Page.__name__ = ["brix","component","navigation","Page"];
brix.component.navigation.Page.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.Page.openPage = function(pageName,isPopup,transitionDataShow,transitionDataHide,brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	var pageURL = pageName.split("?");
	var page = brix.component.navigation.Page.getPageByName(pageURL[0],brixId,body);
	if(page == null) {
		page = brix.component.navigation.Page.getPageByName(pageURL[0],brixId);
		if(page == null) throw "Error, could not find a page with name " + pageName;
	}
	page.query = { };
	if(pageURL[1] != null) brix.component.navigation.Page.updateQuery(page,pageURL[1]);
	page.open(transitionDataShow,transitionDataHide,!isPopup);
}
brix.component.navigation.Page.closePage = function(pageName,transitionData,brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	var page = brix.component.navigation.Page.getPageByName(pageName,brixId,body);
	if(page == null) {
		page = brix.component.navigation.Page.getPageByName(pageName,brixId);
		if(page == null) throw "Error, could not find a page with name " + pageName;
	}
	page.close(transitionData);
}
brix.component.navigation.Page.getPageNodes = function(brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	return body.getElementsByClassName("Page");
}
brix.component.navigation.Page.getPageByName = function(pageName,brixId,root) {
	var body = root;
	if(root == null) body = brix.core.Application.get(brixId).body;
	var pages = brix.component.navigation.Page.getPageNodes(brixId,body);
	var _g1 = 0, _g = pages.length;
	while(_g1 < _g) {
		var pageIdx = _g1++;
		if(pages[pageIdx].getAttribute("name") == pageName) {
			var pageInstances = brix.core.Application.get(brixId).getAssociatedComponents(pages[pageIdx],brix.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var page = $it0.next();
				return page;
			}
			return null;
		}
	}
	return null;
}
brix.component.navigation.Page.updateQuery = function(page,queryString) {
	var queryParams = queryString.split("&");
	var _g1 = 0, _g = queryParams.length;
	while(_g1 < _g) {
		var i = _g1++;
		var param = queryParams[i].split("=");
		page.query[param[0]] = param[1];
	}
}
brix.component.navigation.Page.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.Page.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	close: function(transitionData,preventCloseByClassName,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var transitionObserver = new brix.component.navigation.transition.TransitionObserver(this,"pageCloseStart","pageCloseStop");
		if(preventCloseByClassName == null) preventCloseByClassName = new Array();
		var nodes = brix.component.navigation.Layer.getLayerNodes(this.name,this.brixInstanceId,this.groupElement);
		var layersToBeClosed = new Array();
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var hasForbiddenClass = false;
			var _g2 = 0;
			while(_g2 < preventCloseByClassName.length) {
				var className = preventCloseByClassName[_g2];
				++_g2;
				if(brix.util.DomTools.hasClass(layerNode,className)) hasForbiddenClass = true;
			}
			if(!hasForbiddenClass) {
				var layerInstances = this.getBrixApplication().getAssociatedComponents(layerNode,brix.component.navigation.Layer);
				var $it0 = layerInstances.iterator();
				while( $it0.hasNext() ) {
					var layerInstance = $it0.next();
					layersToBeClosed.push(layerInstance);
				}
			}
		}
		var _g = 0;
		while(_g < layersToBeClosed.length) {
			var layerInstance = layersToBeClosed[_g];
			++_g;
			layerInstance.hide(transitionData,transitionObserver,preventTransitions);
		}
		var nodes1 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href",this.name);
		var _g1 = 0, _g = nodes1.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes1[idxLayerNode];
			brix.util.DomTools.removeClass(element,"page-opened");
		}
		var nodes2 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href","#" + this.name);
		var _g1 = 0, _g = nodes2.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes2[idxLayerNode];
			brix.util.DomTools.removeClass(element,"page-opened");
		}
	}
	,doOpen: function(transitionData,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var transitionObserver = new brix.component.navigation.transition.TransitionObserver(this,"pageOpenStart","pageOpenStop");
		var nodes = brix.component.navigation.Layer.getLayerNodes(this.name,this.brixInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var layerInstances = this.getBrixApplication().getAssociatedComponents(layerNode,brix.component.navigation.Layer);
			var $it0 = layerInstances.iterator();
			while( $it0.hasNext() ) {
				var layerInstance = $it0.next();
				layerInstance.show(transitionData,transitionObserver,preventTransitions);
			}
		}
		var nodes1 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href",this.name);
		var _g1 = 0, _g = nodes1.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes1[idxLayerNode];
			brix.util.DomTools.addClass(element,"page-opened");
		}
		var nodes2 = brix.util.DomTools.getElementsByAttribute(this.groupElement,"href","#" + this.name);
		var _g1 = 0, _g = nodes2.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var element = nodes2[idxLayerNode];
			brix.util.DomTools.addClass(element,"page-opened");
		}
	}
	,closeOthers: function(transitionData,preventTransitions) {
		if(preventTransitions == null) preventTransitions = false;
		var nodes = brix.component.navigation.Page.getPageNodes(this.brixInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxPageNode = _g1++;
			var pageNode = nodes[idxPageNode];
			var pageInstances = this.getBrixApplication().getAssociatedComponents(pageNode,brix.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var pageInstance = $it0.next();
				if(pageInstance != this) pageInstance.close(transitionData,[this.name],preventTransitions);
			}
		}
	}
	,open: function(transitionDataShow,transitionDataHide,doCloseOthers,preventTransitions,recordInHistory) {
		if(recordInHistory == null) recordInHistory = true;
		if(preventTransitions == null) preventTransitions = false;
		if(doCloseOthers == null) doCloseOthers = true;
		if(doCloseOthers) this.closeOthers(transitionDataHide,preventTransitions);
		this.doOpen(transitionDataShow,preventTransitions);
		if(recordInHistory && brix.component.navigation.Page.useDeeplink) js.Lib.window.history.pushState({ name : this.name, transitionDataShow : transitionDataShow, transitionDataHide : transitionDataHide, doCloseOthers : doCloseOthers, preventTransitions : preventTransitions},this.name,"?/" + this.name);
	}
	,setPageName: function(newPageName) {
		this.rootElement.setAttribute("name",newPageName);
		this.name = newPageName;
		return newPageName;
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
		if(brix.component.navigation.Page.useDeeplink && js.Lib.window.history.state != null) {
			if(js.Lib.window.history.state.name == this.name) this.open(null,null,true,true,false);
		} else if(StringTools.startsWith(js.Lib.window.location.search,"?/")) {
			if(HxOverrides.substr(js.Lib.window.location.search,2,null) == this.name) this.open(null,null,true,true);
		} else if(brix.util.DomTools.getMeta("initialPageName") == this.name || this.groupElement.getAttribute("data-initial-page-name") == this.name) this.open(null,null,true,true);
	}
	,onPopState: function(e) {
		var event = e;
		if(event.state != null && event.state.name == this.name) this.open(event.state.transitionDataShow,event.state.transitionDataHide,event.state.doCloseOthers,event.state.preventTransitions,false);
	}
	,query: null
	,groupElement: null
	,name: null
	,__class__: brix.component.navigation.Page
});
brix.component.navigation.link = {}
brix.component.navigation.link.LinkBase = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	brix.component.group.Groupable.startGroupable(this);
	rootElement.addEventListener("click",$bind(this,this.onClick),false);
	rootElement.style.cursor = "pointer";
	if(rootElement.getAttribute("href") != null) {
		this.linkName = StringTools.trim(rootElement.getAttribute("href"));
		this.linkName = HxOverrides.substr(this.linkName,this.linkName.indexOf("#") + 1,null);
	} else if(rootElement.getAttribute("data-href") != null) this.linkName = StringTools.trim(rootElement.getAttribute("data-href")); else null;
	if(rootElement.getAttribute("target") != null && StringTools.trim(rootElement.getAttribute("target")) != "") this.targetAttr = StringTools.trim(rootElement.getAttribute("target"));
};
$hxClasses["brix.component.navigation.link.LinkBase"] = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkBase.__name__ = ["brix","component","navigation","link","LinkBase"];
brix.component.navigation.link.LinkBase.__interfaces__ = [brix.component.group.IGroupable];
brix.component.navigation.link.LinkBase.__super__ = brix.component.ui.DisplayObject;
brix.component.navigation.link.LinkBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		e.preventDefault();
		this.transitionDataShow = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,brix.component.navigation.transition.TransitionType.show);
		this.transitionDataHide = brix.component.navigation.transition.TransitionTools.getTransitionData(this.rootElement,brix.component.navigation.transition.TransitionType.hide);
	}
	,transitionDataHide: null
	,transitionDataShow: null
	,targetAttr: null
	,linkName: null
	,groupElement: null
	,__class__: brix.component.navigation.link.LinkBase
});
brix.component.navigation.link.LinkClosePage = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkClosePage"] = brix.component.navigation.link.LinkClosePage;
brix.component.navigation.link.LinkClosePage.__name__ = ["brix","component","navigation","link","LinkClosePage"];
brix.component.navigation.link.LinkClosePage.__super__ = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkClosePage.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		brix.component.navigation.Page.closePage(this.linkName,this.transitionDataHide,this.brixInstanceId);
	}
	,__class__: brix.component.navigation.link.LinkClosePage
});
brix.component.navigation.link.LinkToPage = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
};
$hxClasses["brix.component.navigation.link.LinkToPage"] = brix.component.navigation.link.LinkToPage;
brix.component.navigation.link.LinkToPage.__name__ = ["brix","component","navigation","link","LinkToPage"];
brix.component.navigation.link.LinkToPage.__super__ = brix.component.navigation.link.LinkBase;
brix.component.navigation.link.LinkToPage.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		brix.component.navigation.Page.openPage(this.linkName,this.targetAttr == "_top",this.transitionDataShow,this.transitionDataHide,this.brixInstanceId,this.groupElement);
	}
	,__class__: brix.component.navigation.link.LinkToPage
});
brix.component.navigation.transition = {}
brix.component.navigation.transition.TransitionType = $hxClasses["brix.component.navigation.transition.TransitionType"] = { __ename__ : ["brix","component","navigation","transition","TransitionType"], __constructs__ : ["show","hide"] }
brix.component.navigation.transition.TransitionType.show = ["show",0];
brix.component.navigation.transition.TransitionType.show.toString = $estr;
brix.component.navigation.transition.TransitionType.show.__enum__ = brix.component.navigation.transition.TransitionType;
brix.component.navigation.transition.TransitionType.hide = ["hide",1];
brix.component.navigation.transition.TransitionType.hide.toString = $estr;
brix.component.navigation.transition.TransitionType.hide.__enum__ = brix.component.navigation.transition.TransitionType;
brix.component.navigation.transition.TransitionObserver = function(page,startEvent,stopEvent) {
	this.pendingTransitions = 0;
	this.hasStoped = false;
	this.hasStarted = false;
	this.page = page;
	this.startEvent = startEvent;
	this.stopEvent = stopEvent;
};
$hxClasses["brix.component.navigation.transition.TransitionObserver"] = brix.component.navigation.transition.TransitionObserver;
brix.component.navigation.transition.TransitionObserver.__name__ = ["brix","component","navigation","transition","TransitionObserver"];
brix.component.navigation.transition.TransitionObserver.prototype = {
	dispatch: function(eventName) {
		try {
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent(eventName,true,true,this.page);
			this.page.rootElement.dispatchEvent(event);
		} catch( e ) {
			null;
		}
	}
	,doRemoveTransition: function() {
		if(this.hasStoped) return;
		this.pendingTransitions--;
		if(this.pendingTransitions == 0) {
			this.hasStoped = true;
			this.dispatch(this.stopEvent);
		}
	}
	,removeTransition: function(layer) {
		brix.util.DomTools.doLater($bind(this,this.doRemoveTransition));
	}
	,addTransition: function(layer) {
		if(this.pendingTransitions == 0) {
			if(this.hasStoped) return;
			this.hasStarted = true;
			this.dispatch(this.startEvent);
		}
		this.pendingTransitions++;
	}
	,stopEvent: null
	,startEvent: null
	,page: null
	,pendingTransitions: null
	,hasStoped: null
	,hasStarted: null
	,__class__: brix.component.navigation.transition.TransitionObserver
}
brix.component.navigation.transition.TransitionTools = function() { }
$hxClasses["brix.component.navigation.transition.TransitionTools"] = brix.component.navigation.transition.TransitionTools;
brix.component.navigation.transition.TransitionTools.__name__ = ["brix","component","navigation","transition","TransitionTools"];
brix.component.navigation.transition.TransitionTools.getTransitionData = function(rootElement,type) {
	var res = null;
	if(type == brix.component.navigation.transition.TransitionType.show) {
		var start = rootElement.getAttribute("data-show-start-style");
		var end = rootElement.getAttribute("data-show-end-style");
		if(start != null && end != null) res = { startStyleName : start, endStyleName : end};
	} else {
		var start = rootElement.getAttribute("data-hide-start-style");
		var end = rootElement.getAttribute("data-hide-end-style");
		if(start != null && end != null) res = { startStyleName : start, endStyleName : end};
	}
	return res;
}
brix.component.navigation.transition.TransitionTools.setTransitionProperty = function(rootElement,name,value) {
	Reflect.setProperty(rootElement.style,name,value);
	var prefixed = "MozT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed] = value;
	var prefixed1 = "webkitT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed1] = value;
	var prefixed2 = "oT" + HxOverrides.substr(name,1,null);
	rootElement.style[prefixed2] = value;
}
brix.component.sound = {}
brix.component.sound.SoundOn = function(rootElement,brixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,brixId);
	rootElement.onclick = $bind(this,this.onClick);
};
$hxClasses["brix.component.sound.SoundOn"] = brix.component.sound.SoundOn;
brix.component.sound.SoundOn.__name__ = ["brix","component","sound","SoundOn"];
brix.component.sound.SoundOn.mute = function(doMute) {
	var audioTags = js.Lib.document.getElementsByTagName("audio");
	var _g1 = 0, _g = audioTags.length;
	while(_g1 < _g) {
		var idx = _g1++;
		audioTags[idx].muted = doMute;
	}
	brix.component.sound.SoundOn.isMuted = doMute;
	var soundOffButtons = js.Lib.document.getElementsByClassName("SoundOff");
	var soundOnButtons = js.Lib.document.getElementsByClassName("SoundOn");
	var _g1 = 0, _g = soundOffButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(doMute) soundOffButtons[idx].style.visibility = "hidden"; else soundOffButtons[idx].style.visibility = "visible";
	}
	var _g1 = 0, _g = soundOnButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(!doMute) soundOnButtons[idx].style.visibility = "hidden"; else soundOnButtons[idx].style.visibility = "visible";
	}
}
brix.component.sound.SoundOn.__super__ = brix.component.ui.DisplayObject;
brix.component.sound.SoundOn.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		brix.component.sound.SoundOn.mute(false);
	}
	,init: function() {
		brix.util.DomTools.doLater(function() {
			return brix.component.sound.SoundOn.mute(false);
		});
	}
	,__class__: brix.component.sound.SoundOn
});
brix.component.sound.SoundOff = function(rootElement,brixId) {
	brix.component.sound.SoundOn.call(this,rootElement,brixId);
};
$hxClasses["brix.component.sound.SoundOff"] = brix.component.sound.SoundOff;
brix.component.sound.SoundOff.__name__ = ["brix","component","sound","SoundOff"];
brix.component.sound.SoundOff.__super__ = brix.component.sound.SoundOn;
brix.component.sound.SoundOff.prototype = $extend(brix.component.sound.SoundOn.prototype,{
	onClick: function(e) {
		brix.component.sound.SoundOn.mute(true);
	}
	,__class__: brix.component.sound.SoundOff
});
brix.component.template = {}
brix.component.template.TemplateMacros = function() { }
$hxClasses["brix.component.template.TemplateMacros"] = brix.component.template.TemplateMacros;
brix.component.template.TemplateMacros.__name__ = ["brix","component","template","TemplateMacros"];
brix.component.template.TemplateMacros.makeDateReadable = function(resolve,dateOrString,format) {
	if(format == null) format = "%Y/%m/%d %H:%M";
	var date;
	if(js.Boot.__instanceof(dateOrString,String)) {
		date = HxOverrides.strDate(dateOrString);
		null;
	} else if(js.Boot.__instanceof(dateOrString,Date)) date = dateOrString; else {
		date = null;
		throw "Error, the parameter is supposed to be String or Date";
	}
	var res = DateTools.format(date,format);
	return res;
}
brix.component.template.TemplateMacros.trace = function(resolve,obj) {
	return "";
}
brix.core = {}
brix.core.Application = function(id,args) {
	this.dataObject = args;
	this.id = id;
	this.nodesIdSequence = 0;
	this.registeredUIComponents = new Array();
	this.registeredGlobalComponents = new Array();
	this.nodeToCmpInstances = new Hash();
	this.globalCompInstances = new Hash();
	this.body = js.Lib.document.createElement("div");
	this.applicationContext = new brix.core.ApplicationContext();
};
$hxClasses["brix.core.Application"] = brix.core.Application;
$hxExpose(brix.core.Application, "silex-builder");
brix.core.Application.__name__ = ["brix","core","Application"];
brix.core.Application.get = function(BrixId) {
	return brix.core.Application.instances.get(BrixId);
}
brix.core.Application.main = function() {
	if(haxe.Firebug.detect()) {
		haxe.Firebug.redirectTraces();
		null;
	} else null;
}
brix.core.Application.createApplication = function(args) {
	var newId = brix.core.Application.generateUniqueId();
	var newInstance = new brix.core.Application(newId,args);
	brix.core.Application.instances.set(newId,newInstance);
	return newInstance;
}
brix.core.Application.generateUniqueId = function() {
	return Std.string(Math.round(Math.random() * 10000));
}
brix.core.Application.prototype = {
	resolveComponentClass: function(classname) {
		var componentClass = Type.resolveClass(classname);
		if(componentClass == null) {
			throw "ERROR cannot resolve " + classname;
			null;
		}
		return componentClass;
	}
	,resolveUIComponentClass: function(className,typeFilter) {
		var _g = 0, _g1 = this.getRegisteredUIComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			var componentClassAttrValues = [this.getUnconflictedClassTag(rc.classname)];
			if(componentClassAttrValues[0] != rc.classname) componentClassAttrValues.push(rc.classname);
			if(!Lambda.exists(componentClassAttrValues,function(s) {
				return s == className;
			})) continue;
			var componentClass = this.resolveComponentClass(rc.classname);
			if(componentClass == null) continue;
			if(typeFilter != null) {
				if(!js.Boot.__instanceof(Type.createEmptyInstance(componentClass),typeFilter)) return null;
			}
			return componentClass;
		}
		return null;
	}
	,getUnconflictedClassTag: function(displayObjectClassName) {
		var classTag = displayObjectClassName;
		if(classTag.indexOf(".") != -1) classTag = HxOverrides.substr(classTag,classTag.lastIndexOf(".") + 1,null);
		var _g = 0, _g1 = this.getRegisteredUIComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			if(rc.classname != displayObjectClassName && classTag == HxOverrides.substr(rc.classname,classTag.lastIndexOf(".") + 1,null)) return displayObjectClassName;
		}
		return classTag;
	}
	,getGlobalComponentList: function() {
		return Lambda.list({ iterator : ($_=this.globalCompInstances,$bind($_,$_.keys))});
	}
	,getGlobalComponent: function(classname) {
		return this.globalCompInstances.get(classname);
	}
	,getComponents: function(typeFilter) {
		var l = new List();
		var $it0 = this.nodeToCmpInstances.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			var $it1 = n.iterator();
			while( $it1.hasNext() ) {
				var i = $it1.next();
				if(js.Boot.__instanceof(i,typeFilter)) {
					var inst = i;
					l.add(inst);
				}
			}
		}
		return l;
	}
	,getAssociatedComponents: function(node,typeFilter) {
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			var l = new List();
			if(this.nodeToCmpInstances.exists(nodeId)) {
				var $it0 = this.nodeToCmpInstances.get(nodeId).iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					if(js.Boot.__instanceof(i,typeFilter)) {
						var inst = i;
						l.add(inst);
					}
				}
			}
			return l;
		}
		return new List();
	}
	,removeAllAssociatedComponent: function(node) {
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			node.removeAttribute("data-brix-id");
			var isError = !this.nodeToCmpInstances.remove(nodeId);
			if(isError) throw "Could not find the node in the associated components list.";
		} else null;
	}
	,removeAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-brix-id");
		var associatedCmps;
		if(nodeId != null) {
			associatedCmps = this.nodeToCmpInstances.get(nodeId);
			var isError = !associatedCmps.remove(cmp);
			if(isError) throw "Could not find the component in the node's associated components list.";
			if(associatedCmps.isEmpty()) {
				node.removeAttribute("data-brix-id");
				this.nodeToCmpInstances.remove(nodeId);
			}
		} else null;
	}
	,addAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-brix-id");
		var associatedCmps;
		if(nodeId != null) associatedCmps = this.nodeToCmpInstances.get(nodeId); else {
			this.nodesIdSequence++;
			nodeId = Std.string(this.nodesIdSequence);
			node.setAttribute("data-brix-id",nodeId);
			associatedCmps = new List();
		}
		associatedCmps.add(cmp);
		this.nodeToCmpInstances.set(nodeId,associatedCmps);
	}
	,cleanNode: function(node) {
		if(node.nodeType != js.Lib.document.body.nodeType) return;
		var comps = this.getAssociatedComponents(node,brix.component.ui.DisplayObject);
		var $it0 = comps.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			c.remove();
		}
		var _g1 = 0, _g = node.childNodes.length;
		while(_g1 < _g) {
			var childCnt = _g1++;
			this.cleanNode(node.childNodes[childCnt]);
		}
	}
	,createGlobalComponents: function() {
		var _g = 0, _g1 = this.getRegisteredGlobalComponents();
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			var componentClass = this.resolveComponentClass(rc.classname);
			if(componentClass == null) continue;
			var cmpInstance = null;
			if(rc.args != null) cmpInstance = Type.createInstance(componentClass,[rc.args]); else cmpInstance = Type.createInstance(componentClass,[]);
			if(cmpInstance != null && js.Boot.__instanceof(cmpInstance,brix.component.IBrixComponent)) brix.component.BrixComponent.initBrixComponent(cmpInstance,this.id);
			this.globalCompInstances.set(rc.classname,cmpInstance);
		}
	}
	,initUIComponents: function(compInstances) {
		var $it0 = compInstances.iterator();
		while( $it0.hasNext() ) {
			var ci = $it0.next();
			ci.init();
		}
	}
	,createUIComponents: function(node) {
		if(node.nodeType != 1) return null;
		var nodeId = node.getAttribute("data-brix-id");
		if(nodeId != null) {
			if(!this.nodeToCmpInstances.exists(nodeId)) node.removeAttribute("data-brix-id"); else return null;
		}
		var compsToInit = new List();
		if(node.className != null) {
			var _g = 0, _g1 = node.className.split(" ");
			while(_g < _g1.length) {
				var classValue = _g1[_g];
				++_g;
				var componentClass = this.resolveUIComponentClass(classValue);
				if(componentClass == null) continue;
				var newDisplayObject = null;
				newDisplayObject = Type.createInstance(componentClass,[node,this.id]);
				compsToInit.add(newDisplayObject);
			}
		}
		var _g1 = 0, _g = node.childNodes.length;
		while(_g1 < _g) {
			var cc = _g1++;
			var res = this.createUIComponents(node.childNodes[cc]);
			if(res != null) compsToInit = Lambda.concat(compsToInit,res);
		}
		return compsToInit;
	}
	,initNode: function(node) {
		var comps = this.createUIComponents(node);
		if(comps == null) return;
		this.initUIComponents(comps);
	}
	,initComponents: function() {
		this.createGlobalComponents();
		this.initNode(this.body);
	}
	,initDom: function(appendTo) {
		this.htmlRootElement = appendTo;
		if(this.htmlRootElement == null || this.htmlRootElement.nodeType != js.Lib.document.documentElement.nodeType) this.htmlRootElement = js.Lib.document.documentElement;
		if(this.htmlRootElement == null) return;
		this.body = js.Lib.document.body;
	}
	,attachBody: function(appendTo) {
		if(appendTo == null) appendTo = js.Lib.document.body;
		if(this.body.parentNode == null) appendTo.appendChild(this.body);
		this.body = appendTo;
	}
	,getRegisteredGlobalComponents: function() {
		return this.applicationContext.registeredGlobalComponents;
	}
	,registeredGlobalComponents: null
	,getRegisteredUIComponents: function() {
		return this.applicationContext.registeredUIComponents;
	}
	,registeredUIComponents: null
	,applicationContext: null
	,dataObject: null
	,body: null
	,htmlRootElement: null
	,globalCompInstances: null
	,nodeToCmpInstances: null
	,nodesIdSequence: null
	,id: null
	,__class__: brix.core.Application
	,__properties__: {get_registeredUIComponents:"getRegisteredUIComponents",get_registeredGlobalComponents:"getRegisteredGlobalComponents"}
}
brix.core.ApplicationContext = function() {
	this.registeredUIComponents = new Array();
	this.registeredGlobalComponents = new Array();
	this.registerComponentsforInit();
};
$hxClasses["brix.core.ApplicationContext"] = brix.core.ApplicationContext;
brix.core.ApplicationContext.__name__ = ["brix","core","ApplicationContext"];
brix.core.ApplicationContext.prototype = {
	registerComponentsforInit: function() {
		silex.ui.stage.SelectionDropHandler;
		this.registeredUIComponents.push({ classname : "silex.ui.stage.SelectionDropHandler", args : null});
		silex.ui.dialog.AuthDialog;
		this.registeredUIComponents.push({ classname : "silex.ui.dialog.AuthDialog", args : null});
		silex.ui.dialog.TextEditorDialog;
		this.registeredUIComponents.push({ classname : "silex.ui.dialog.TextEditorDialog", args : null});
		brix.component.sound.SoundOff;
		this.registeredUIComponents.push({ classname : "brix.component.sound.SoundOff", args : null});
		brix.component.interaction.NotificationManager;
		this.registeredUIComponents.push({ classname : "brix.component.interaction.NotificationManager", args : null});
		silex.ui.script.HScriptTag;
		this.registeredGlobalComponents.push({ classname : "silex.ui.script.HScriptTag", args : null});
		silex.ui.toolbox.editor.PropertyEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.PropertyEditor", args : null});
		silex.ui.toolbox.editor.HtmlEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.HtmlEditor", args : null});
		brix.component.sound.SoundOn;
		this.registeredUIComponents.push({ classname : "brix.component.sound.SoundOn", args : null});
		silex.ui.stage.InsertDropHandler;
		this.registeredUIComponents.push({ classname : "silex.ui.stage.InsertDropHandler", args : null});
		brix.component.navigation.Layer;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.Layer", args : null});
		silex.ui.toolbox.editor.InlineDropdownEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.InlineDropdownEditor", args : null});
		brix.component.navigation.link.LinkClosePage;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkClosePage", args : null});
		silex.ui.list.LayersList;
		this.registeredUIComponents.push({ classname : "silex.ui.list.LayersList", args : null});
		silex.ui.toolbox.editor.LinkEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.LinkEditor", args : null});
		silex.ui.toolbox.editor.UrlEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.UrlEditor", args : null});
		brix.component.group.Group;
		this.registeredUIComponents.push({ classname : "brix.component.group.Group", args : null});
		brix.component.layout.Accordion;
		this.registeredUIComponents.push({ classname : "brix.component.layout.Accordion", args : null});
		brix.component.navigation.Page;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.Page", args : null});
		silex.ui.toolbox.editor.StringEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.StringEditor", args : null});
		silex.ui.dialog.KCFinderDialog;
		this.registeredUIComponents.push({ classname : "silex.ui.dialog.KCFinderDialog", args : null});
		silex.ui.toolbox.editor.BackgroundPositionEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.BackgroundPositionEditor", args : null});
		silex.ui.toolbox.editor.BoolEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.BoolEditor", args : null});
		silex.ui.toolbox.MenuController;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.MenuController", args : null});
		brix.component.layout.Panel;
		this.registeredUIComponents.push({ classname : "brix.component.layout.Panel", args : null});
		silex.ui.stage.SelectionController;
		this.registeredUIComponents.push({ classname : "silex.ui.stage.SelectionController", args : null});
		silex.ui.stage.FileViewer;
		this.registeredUIComponents.push({ classname : "silex.ui.stage.FileViewer", args : null});
		silex.ui.toolbox.ToolBoxController;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.ToolBoxController", args : null});
		brix.component.interaction.Draggable;
		this.registeredUIComponents.push({ classname : "brix.component.interaction.Draggable", args : null});
		silex.ui.toolbox.editor.PercentageEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.PercentageEditor", args : null});
		silex.ui.toolbox.editor.ColorEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.ColorEditor", args : null});
		silex.ui.toolbox.editor.LengthEditor;
		this.registeredUIComponents.push({ classname : "silex.ui.toolbox.editor.LengthEditor", args : null});
		brix.component.navigation.link.LinkToPage;
		this.registeredUIComponents.push({ classname : "brix.component.navigation.link.LinkToPage", args : null});
		silex.ui.list.PageList;
		this.registeredUIComponents.push({ classname : "silex.ui.list.PageList", args : null});
		silex.ui.stage.SilexContextManager;
		this.registeredUIComponents.push({ classname : "silex.ui.stage.SilexContextManager", args : null});
	}
	,registeredGlobalComponents: null
	,registeredUIComponents: null
	,__class__: brix.core.ApplicationContext
}
brix.util = {}
brix.util.NodeTypes = function() { }
$hxClasses["brix.util.NodeTypes"] = brix.util.NodeTypes;
brix.util.NodeTypes.__name__ = ["brix","util","NodeTypes"];
brix.util.DomTools = function() { }
$hxClasses["brix.util.DomTools"] = brix.util.DomTools;
brix.util.DomTools.__name__ = ["brix","util","DomTools"];
brix.util.DomTools.doLater = function(callbackFunction,frames) {
	if(frames == null) frames = 1;
	var frameInterval = 200;
	haxe.Timer.delay(callbackFunction,frames * frameInterval);
}
brix.util.DomTools.abs2rel = function(url) {
	var initialUrl = url;
	var base = brix.util.DomTools.getBaseUrl();
	var idx = base.indexOf("://");
	if(idx == -1) return initialUrl; else base = HxOverrides.substr(base,idx + 3,null);
	var idx1 = url.indexOf("://");
	if(idx1 == -1) return initialUrl; else url = HxOverrides.substr(url,idx1 + 3,null);
	var baseArray = base.split("/");
	var urlArray = url.split("/");
	if(baseArray[0] != urlArray[0]) return initialUrl;
	var diffIdx = 0;
	var _g1 = 0, _g = baseArray.length;
	while(_g1 < _g) {
		var idx2 = _g1++;
		if(urlArray.length < idx2 || baseArray[idx2] != urlArray[idx2]) {
			diffIdx = idx2;
			break;
		}
	}
	var resUrl = "";
	if(baseArray.length > diffIdx + 1) {
		var _g1 = diffIdx, _g = baseArray.length - 1;
		while(_g1 < _g) {
			var idx2 = _g1++;
			resUrl += "../";
		}
	} else {
	}
	var _g1 = diffIdx, _g = urlArray.length;
	while(_g1 < _g) {
		var idx2 = _g1++;
		resUrl += urlArray[idx2];
		if(idx2 != urlArray.length - 1) resUrl += "/";
	}
	return resUrl;
}
brix.util.DomTools.rel2abs = function(url,base) {
	if(base == null) base = brix.util.DomTools.getBaseUrl();
	url = StringTools.replace(url,"\\","/");
	var idxBase = url.indexOf("://");
	if(idxBase == -1) url = base + url;
	var urlArray = url.split("/");
	var absoluteUrlArray = new Array();
	var _g1 = 0, _g = urlArray.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(urlArray[idx] == "..") absoluteUrlArray.pop(); else absoluteUrlArray.push(urlArray[idx]);
	}
	url = absoluteUrlArray.join("/");
	return url;
}
brix.util.DomTools.getElementsByAttribute = function(elt,attr,value) {
	var childElts = elt.getElementsByTagName("*");
	var filteredChildElts = new Array();
	var _g1 = 0, _g = childElts.length;
	while(_g1 < _g) {
		var cCount = _g1++;
		if(childElts[cCount].getAttribute(attr) != null && (value == "*" || childElts[cCount].getAttribute(attr) == value)) filteredChildElts.push(childElts[cCount]);
	}
	return filteredChildElts;
}
brix.util.DomTools.getSingleElement = function(rootElement,className,required) {
	if(required == null) required = true;
	var domElements = rootElement.getElementsByClassName(className);
	if(domElements.length > 1) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
	if(domElements != null && domElements.length == 1) return domElements[0]; else {
		if(required) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
		return null;
	}
}
brix.util.DomTools.getElementBoundingBox = function(htmlDom) {
	if(htmlDom.nodeType != 1) return null;
	var offsetTop = 0;
	var offsetLeft = 0;
	var offsetWidth = 0.0;
	var offsetHeight = 0.0;
	var element = htmlDom;
	while(element != null) {
		var borderH = (element.offsetWidth - element.clientWidth) / 2;
		var borderV = (element.offsetHeight - element.clientHeight) / 2;
		offsetWidth += borderH;
		offsetHeight += borderV;
		offsetWidth -= borderH;
		offsetHeight -= borderV;
		offsetTop -= Math.round(borderV / 2.0);
		offsetLeft -= Math.round(borderH / 2.0);
		offsetTop -= element.scrollTop;
		offsetLeft -= element.scrollLeft;
		offsetTop += element.offsetTop;
		offsetLeft += element.offsetLeft;
		element = element.offsetParent;
	}
	return { x : Math.round(offsetLeft), y : Math.round(offsetTop), w : Math.round(htmlDom.offsetWidth + offsetWidth), h : Math.round(htmlDom.offsetHeight + offsetHeight)};
}
brix.util.DomTools.getElementIndex = function(childNode) {
	var i = 0;
	var child = childNode;
	while((child = child.previousSibling) != null) i++;
	return i;
}
brix.util.DomTools.moveTo = function(htmlDom,x,y) {
	var elementBox = brix.util.DomTools.getElementBoundingBox(htmlDom);
	if(x != null) {
		var newPosX = htmlDom.offsetLeft + (x - elementBox.x);
		htmlDom.style.left = Math.round(newPosX) + "px";
	}
	if(y != null) {
		var newPosY = htmlDom.offsetTop + (y - elementBox.y);
		htmlDom.style.top = Math.round(newPosY) + "px";
	}
}
brix.util.DomTools.inspectTrace = function(obj,callingClass) {
	var _g = 0, _g1 = Reflect.fields(obj);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		null;
	}
	null;
}
brix.util.DomTools.toggleClass = function(element,className) {
	if(brix.util.DomTools.hasClass(element,className)) brix.util.DomTools.removeClass(element,className); else brix.util.DomTools.addClass(element,className);
}
brix.util.DomTools.addClass = function(element,className) {
	if(element.className == null) element.className = "";
	Lambda.iter(className.split(" "),function(cn) {
		if(!Lambda.has(element.className.split(" "),cn)) {
			if(element.className != "") element.className += " ";
			element.className += cn;
		}
	});
}
brix.util.DomTools.removeClass = function(element,className) {
	if(element.className == null || StringTools.trim(element.className) == "") return;
	var classNamesToKeep = new Array();
	var cns = className.split(" ");
	Lambda.iter(element.className.split(" "),function(ecn) {
		if(!Lambda.has(cns,ecn)) classNamesToKeep.push(ecn);
	});
	element.className = classNamesToKeep.join(" ");
}
brix.util.DomTools.hasClass = function(element,className,orderedClassName) {
	if(orderedClassName == null) orderedClassName = false;
	if(element.className == null || StringTools.trim(element.className) == "" || className == null || StringTools.trim(className) == "") return false;
	if(orderedClassName) {
		var cns = className.split(" ");
		var ecns = element.className.split(" ");
		var result = Lambda.map(cns,function(cn) {
			return Lambda.indexOf(ecns,cn);
		});
		var prevR = 0;
		var $it0 = result.iterator();
		while( $it0.hasNext() ) {
			var r = $it0.next();
			if(r < prevR) return false;
			prevR = r;
		}
		return true;
	} else {
		var _g = 0, _g1 = className.split(" ");
		while(_g < _g1.length) {
			var cn = _g1[_g];
			++_g;
			if(cn == null || StringTools.trim(cn) == "") continue;
			var found = Lambda.has(element.className.split(" "),cn);
			if(!found) return false;
		}
		return true;
	}
}
brix.util.DomTools.setMeta = function(metaName,metaValue,attributeName,head) {
	if(attributeName == null) attributeName = "content";
	var res = new Hash();
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var metaTags = head.getElementsByTagName("META");
	var found = false;
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName != null && configValue != null) {
			if(configName == metaName) {
				configValue = metaValue;
				node.setAttribute(attributeName,metaValue);
				found = true;
			}
			res.set(configName,configValue);
		}
	}
	if(!found) {
		var node = js.Lib.document.createElement("meta");
		node.setAttribute("name",metaName);
		node.setAttribute("content",metaValue);
		head.appendChild(node);
		res.set(metaName,metaValue);
	}
	return res;
}
brix.util.DomTools.getMeta = function(name,attributeName,head) {
	if(attributeName == null) attributeName = "content";
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var metaTags = head.getElementsByTagName("meta");
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName == name) return configValue;
	}
	return null;
}
brix.util.DomTools.addCssRules = function(css,head) {
	if(head == null) head = js.Lib.document.documentElement.getElementsByTagName("head")[0];
	var node = js.Lib.document.createElement("style");
	node.setAttribute("type","text/css");
	node.appendChild(js.Lib.document.createTextNode(css));
	head.appendChild(node);
	return node;
}
brix.util.DomTools.embedScript = function(src) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var scriptNodes = js.Lib.document.getElementsByTagName("script");
	var _g1 = 0, _g = scriptNodes.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = scriptNodes[idxNode];
		if(node.getAttribute("src") == src) return node;
	}
	var node = js.Lib.document.createElement("script");
	node.setAttribute("src",src);
	head.appendChild(node);
	return node;
}
brix.util.DomTools.getBaseTag = function() {
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	if(baseNodes.length > 0) return baseNodes[0].getAttribute("href"); else return null;
}
brix.util.DomTools.setBaseTag = function(href) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	href = brix.util.DomTools.rel2abs(href);
	if(baseNodes.length > 0) baseNodes[0].setAttribute("href",href); else {
		var node = js.Lib.document.createElement("base");
		node.setAttribute("href",href);
		if(head.childNodes.length > 0) head.insertBefore(node,head.childNodes[0]); else head.appendChild(node);
	}
}
brix.util.DomTools.removeBaseTag = function() {
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	while(baseNodes.length > 0) baseNodes[0].parentNode.removeChild(baseNodes[0]);
}
brix.util.DomTools.getBaseUrl = function() {
	var base = brix.util.DomTools.getBaseTag();
	if(base == null) {
		var idxSlash = js.Lib.window.location.href.lastIndexOf("/");
		var idxDot = js.Lib.window.location.href.lastIndexOf(".");
		if(idxSlash < idxDot) base = base = HxOverrides.substr(js.Lib.window.location.href,0,idxSlash + 1); else base = js.Lib.window.location.href;
	}
	return base;
}
brix.util.DomTools.isUndefined = function(value) {
	var ret = "undefined" === typeof value;
	return ret;
}
var haxe = {}
haxe.FastCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.FastCell"] = haxe.FastCell;
haxe.FastCell.__name__ = ["haxe","FastCell"];
haxe.FastCell.prototype = {
	next: null
	,elt: null
	,__class__: haxe.FastCell
}
haxe.FastList = function() {
};
$hxClasses["haxe.FastList"] = haxe.FastList;
haxe.FastList.__name__ = ["haxe","FastList"];
haxe.FastList.prototype = {
	toString: function() {
		var a = new Array();
		var l = this.head;
		while(l != null) {
			a.push(l.elt);
			l = l.next;
		}
		return "{" + a.join(",") + "}";
	}
	,iterator: function() {
		var l = this.head;
		return { hasNext : function() {
			return l != null;
		}, next : function() {
			var k = l;
			l = k.next;
			return k.elt;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.head;
		while(l != null) {
			if(l.elt == v) {
				if(prev == null) this.head = l.next; else prev.next = l.next;
				break;
			}
			prev = l;
			l = l.next;
		}
		return l != null;
	}
	,isEmpty: function() {
		return this.head == null;
	}
	,pop: function() {
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,first: function() {
		return this.head == null?null:this.head.elt;
	}
	,add: function(item) {
		this.head = new haxe.FastCell(item,this.head);
	}
	,head: null
	,__class__: haxe.FastList
}
haxe.Firebug = function() { }
$hxClasses["haxe.Firebug"] = haxe.Firebug;
haxe.Firebug.__name__ = ["haxe","Firebug"];
haxe.Firebug.detect = function() {
	try {
		return console != null && console.error != null;
	} catch( e ) {
		return false;
	}
}
haxe.Firebug.redirectTraces = function() {
	haxe.Log.trace = haxe.Firebug.trace;
	js.Lib.onerror = haxe.Firebug.onError;
}
haxe.Firebug.onError = function(err,stack) {
	var buf = err + "\n";
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		buf += "Called from " + s + "\n";
	}
	haxe.Firebug.trace(buf,null);
	return true;
}
haxe.Firebug.trace = function(v,inf) {
	var type = inf != null && inf.customParams != null?inf.customParams[0]:null;
	if(type != "warn" && type != "info" && type != "debug" && type != "error") type = inf == null?"error":"log";
	console[type]((inf == null?"":inf.fileName + ":" + inf.lineNumber + " : ") + Std.string(v));
}
haxe.Http = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		var r = new js.XMLHttpRequest();
		var onreadystatechange = function() {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
			case null: case undefined:
				me.onError("Failed to connect or resolve host");
				break;
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange();
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,params: null
	,headers: null
	,postData: null
	,async: null
	,url: null
	,__class__: haxe.Http
}
haxe.Int32 = function() { }
$hxClasses["haxe.Int32"] = haxe.Int32;
haxe.Int32.__name__ = ["haxe","Int32"];
haxe.Int32.make = function(a,b) {
	return a << 16 | b;
}
haxe.Int32.ofInt = function(x) {
	return x | 0;
}
haxe.Int32.clamp = function(x) {
	return x | 0;
}
haxe.Int32.toInt = function(x) {
	if((x >> 30 & 1) != x >>> 31) throw "Overflow " + Std.string(x);
	return x;
}
haxe.Int32.toNativeInt = function(x) {
	return x;
}
haxe.Int32.add = function(a,b) {
	return a + b | 0;
}
haxe.Int32.sub = function(a,b) {
	return a - b | 0;
}
haxe.Int32.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
}
haxe.Int32.div = function(a,b) {
	return a / b | 0;
}
haxe.Int32.mod = function(a,b) {
	return a % b;
}
haxe.Int32.shl = function(a,b) {
	return a << b;
}
haxe.Int32.shr = function(a,b) {
	return a >> b;
}
haxe.Int32.ushr = function(a,b) {
	return a >>> b;
}
haxe.Int32.and = function(a,b) {
	return a & b;
}
haxe.Int32.or = function(a,b) {
	return a | b;
}
haxe.Int32.xor = function(a,b) {
	return a ^ b;
}
haxe.Int32.neg = function(a) {
	return -a;
}
haxe.Int32.isNeg = function(a) {
	return a < 0;
}
haxe.Int32.isZero = function(a) {
	return a == 0;
}
haxe.Int32.complement = function(a) {
	return ~a;
}
haxe.Int32.compare = function(a,b) {
	return a - b;
}
haxe.Int32.ucompare = function(a,b) {
	if(a < 0) return b < 0?~b - ~a:1;
	return b < 0?-1:a - b;
}
haxe.Log = function() { }
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serializeException: function(e) {
		this.buf.b += Std.string("x");
		this.serialize(e);
	}
	,serialize: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 0:
			this.buf.b += Std.string("n");
			break;
		case 1:
			if(v == 0) {
				this.buf.b += Std.string("z");
				return;
			}
			this.buf.b += Std.string("i");
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += Std.string("k"); else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += Std.string("d");
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) return;
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += Std.string("a");
				var l = v.length;
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += Std.string("n"); else {
								this.buf.b += Std.string("u");
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += Std.string("n"); else {
						this.buf.b += Std.string("u");
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += Std.string("h");
				break;
			case List:
				this.buf.b += Std.string("l");
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += Std.string("h");
				break;
			case Date:
				var d = v;
				this.buf.b += Std.string("v");
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case Hash:
				this.buf.b += Std.string("b");
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case IntHash:
				this.buf.b += Std.string("q");
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += Std.string(":");
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += Std.string("s");
				this.buf.b += Std.string(chars.length);
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += Std.string("C");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += Std.string("g");
				} else {
					this.buf.b += Std.string("c");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += Std.string("o");
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += Std.string(":");
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g = 2;
			while(_g < l) {
				var i = _g++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += Std.string("g");
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += Std.string("r");
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += Std.string("R");
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += Std.string("y");
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += Std.string(":");
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe._Template = {}
haxe._Template.TemplateExpr = $hxClasses["haxe._Template.TemplateExpr"] = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe.Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + Std.string(tokens.first().s) + "'";
};
$hxClasses["haxe.Template"] = haxe.Template;
haxe.Template.__name__ = ["haxe","Template"];
haxe.Template.prototype = {
	run: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			this.buf.b += Std.string(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = $e[2];
			this.buf.b += Std.string(Std.string(e1()));
			break;
		case 2:
			var eelse = $e[4], eif = $e[3], e1 = $e[2];
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = $e[2];
			this.buf.b += Std.string(str);
			break;
		case 4:
			var l = $e[2];
			var $it0 = l.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				this.run(e1);
			}
			break;
		case 5:
			var loop = $e[3], e1 = $e[2];
			var v = e1();
			try {
				var x = $iterator(v)();
				if(x.hasNext == null) throw null;
				v = x;
			} catch( e2 ) {
				try {
					if(v.hasNext == null) throw null;
				} catch( e3 ) {
					throw "Cannot iter on " + Std.string(v);
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			while( v1.hasNext() ) {
				var ctx = v1.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = $e[3], m = $e[2];
			var v = Reflect.field(this.macros,m);
			var pl = new Array();
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var $it1 = params.iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var $e = (p);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					pl.push(this.resolve(v1));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				this.buf.b += Std.string(Std.string(v.apply(this.macros,pl)));
			} catch( e1 ) {
				var plstr = (function($this) {
					var $r;
					try {
						$r = pl.join(",");
					} catch( e2 ) {
						$r = "???";
					}
					return $r;
				}(this));
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
				throw msg;
			}
			break;
		}
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw "<eof>";
		if(p.s) return this.makeConst(p.p);
		switch(p.p) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw p1.p;
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw p2.p;
			return (function($this) {
				var $r;
				switch(p1.p) {
				case "+":
					$r = function() {
						return e1() + e2();
					};
					break;
				case "-":
					$r = function() {
						return e1() - e2();
					};
					break;
				case "*":
					$r = function() {
						return e1() * e2();
					};
					break;
				case "/":
					$r = function() {
						return e1() / e2();
					};
					break;
				case ">":
					$r = function() {
						return e1() > e2();
					};
					break;
				case "<":
					$r = function() {
						return e1() < e2();
					};
					break;
				case ">=":
					$r = function() {
						return e1() >= e2();
					};
					break;
				case "<=":
					$r = function() {
						return e1() <= e2();
					};
					break;
				case "==":
					$r = function() {
						return e1() == e2();
					};
					break;
				case "!=":
					$r = function() {
						return e1() != e2();
					};
					break;
				case "&&":
					$r = function() {
						return e1() && e2();
					};
					break;
				case "||":
					$r = function() {
						return e1() || e2();
					};
					break;
				default:
					$r = (function($this) {
						var $r;
						throw "Unknown operation " + p1.p;
						return $r;
					}($this));
				}
				return $r;
			}(this));
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e = this.makeExpr(l);
			return function() {
				return -e();
			};
		}
		throw p.p;
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw field.p;
		var f = field.p;
		haxe.Template.expr_trim.match(f);
		f = haxe.Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeConst: function(v) {
		haxe.Template.expr_trim.match(v);
		v = haxe.Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe.Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe.Template.expr_float.match(v)) {
			var f = Std.parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe.Template.expr_splitter.match(data)) {
			var p = haxe.Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			var p1 = haxe.Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe.Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw l.first().p;
		} catch( s ) {
			if( js.Boot.__instanceof(s,String) ) {
				throw "Unexpected '" + s + "' in " + expr;
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				throw "Error : " + Std.string(exc) + " in " + expr;
			}
		};
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe._Template.TemplateExpr.OpMacro(p,pe);
		}
		if(HxOverrides.substr(p,0,3) == "if ") {
			p = HxOverrides.substr(p,3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw "Unclosed 'if'";
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
			} else {
				t1.p = HxOverrides.substr(t1.p,4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe._Template.TemplateExpr.OpIf(e,eif,eelse);
		}
		if(HxOverrides.substr(p,0,8) == "foreach ") {
			p = HxOverrides.substr(p,8,p.length - 8);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'foreach'";
			return haxe._Template.TemplateExpr.OpForeach(e,efor);
		}
		if(haxe.Template.expr_splitter.match(p)) return haxe._Template.TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe._Template.TemplateExpr.OpVar(p);
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe._Template.TemplateExpr.OpBlock(l);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe.Template.splitter.match(data)) {
			var p = haxe.Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe.Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			while(npar > 0) {
				var c = HxOverrides.cca(data,parp);
				if(c == 40) npar++; else if(c == 41) npar--; else if(c == null) throw "Unclosed macro parenthesis";
				parp++;
			}
			var params = HxOverrides.substr(data,p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
			tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,resolve: function(v) {
		if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
		var $it0 = this.stack.iterator();
		while( $it0.hasNext() ) {
			var ctx = $it0.next();
			if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe.Template.globals,v);
	}
	,execute: function(context,macros) {
		this.macros = macros == null?{ }:macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
	,buf: null
	,stack: null
	,macros: null
	,context: null
	,expr: null
	,__class__: haxe.Template
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		switch(this.buf.charCodeAt(this.pos++)) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new Hash();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new IntHash();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntHash format";
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,b: null
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = function() { }
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	getDoubleSig: function(bytes) {
		return Std.parseInt((((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * Math.pow(2,32)).toString()) + Std.parseInt(((bytes[4] >> 7) * Math.pow(2,31)).toString()) + Std.parseInt(((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]).toString());
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		return this.bigEndian?(ch1 << 8 | ch2) << 16 | (ch3 << 8 | ch4):(ch4 << 8 | ch3) << 16 | (ch2 << 8 | ch1);
	}
	,readUInt30: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if((this.bigEndian?ch1:ch4) >= 64) throw haxe.io.Error.Overflow;
		return this.bigEndian?ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24:ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readInt31: function() {
		var ch1, ch2, ch3, ch4;
		if(this.bigEndian) {
			ch4 = this.readByte();
			ch3 = this.readByte();
			ch2 = this.readByte();
			ch1 = this.readByte();
		} else {
			ch1 = this.readByte();
			ch2 = this.readByte();
			ch3 = this.readByte();
			ch4 = this.readByte();
		}
		if((ch4 & 128) == 0 != ((ch4 & 64) == 0)) throw haxe.io.Error.Overflow;
		return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		return this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n = this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		return this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n = this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,readLine: function() {
		var buf = new StringBuf();
		var last;
		var s;
		try {
			while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
			s = buf.b;
			if(HxOverrides.cca(s,s.length - 1) == 13) s = HxOverrides.substr(s,0,-1);
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				s = buf.b;
				if(s.length == 0) throw e;
			} else throw(e);
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new StringBuf();
		var last;
		while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
		return buf.b;
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		return (function($this) {
			var $r;
			throw "Not implemented";
			return $r;
		}(this));
	}
	,bigEndian: null
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,len: null
	,pos: null
	,b: null
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = function() { }
$hxClasses["haxe.io.Output"] = haxe.io.Output;
haxe.io.Output.__name__ = ["haxe","io","Output"];
haxe.io.Output.prototype = {
	writeString: function(s) {
		var b = haxe.io.Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,writeInput: function(i,bufsize) {
		if(bufsize == null) bufsize = 4096;
		var buf = haxe.io.Bytes.alloc(bufsize);
		try {
			while(true) {
				var len = i.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				var p = 0;
				while(len > 0) {
					var k = this.writeBytes(buf,p,len);
					if(k == 0) throw haxe.io.Error.Blocked;
					p += k;
					len -= k;
				}
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
	}
	,prepare: function(nbytes) {
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(haxe.Int32.toInt(x >>> 24));
			this.writeByte(haxe.Int32.toInt(x >>> 16) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 8) & 255);
			this.writeByte(haxe.Int32.toInt(x & (255 | 0)));
		} else {
			this.writeByte(haxe.Int32.toInt(x & (255 | 0)));
			this.writeByte(haxe.Int32.toInt(x >>> 8) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 16) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 24));
		}
	}
	,writeUInt30: function(x) {
		if(x < 0 || x >= 1073741824) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeInt31: function(x) {
		if(x < -1073741824 || x >= 1073741824) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeUInt24: function(x) {
		if(x < 0 || x >= 16777216) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 16);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16);
		}
	}
	,writeInt24: function(x) {
		if(x < -8388608 || x >= 8388608) throw haxe.io.Error.Overflow;
		this.writeUInt24(x & 16777215);
	}
	,writeUInt16: function(x) {
		if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 8);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8);
		}
	}
	,writeInt16: function(x) {
		if(x < -32768 || x >= 32768) throw haxe.io.Error.Overflow;
		this.writeUInt16(x & 65535);
	}
	,writeInt8: function(x) {
		if(x < -128 || x >= 128) throw haxe.io.Error.Overflow;
		this.writeByte(x & 255);
	}
	,writeDouble: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * Math.pow(2,52));
		var sig_h = sig & 34359738367;
		var sig_l = Math.floor(sig / Math.pow(2,32));
		var b1 = exp + 1023 >> 4 | (exp > 0?x < 0?128:64:x < 0?128:0), b2 = exp + 1023 << 4 & 255 | sig_l >> 16 & 15, b3 = sig_l >> 8 & 255, b4 = sig_l & 255, b5 = sig_h >> 24 & 255, b6 = sig_h >> 16 & 255, b7 = sig_h >> 8 & 255, b8 = sig_h & 255;
		if(this.bigEndian) {
			this.writeByte(b8);
			this.writeByte(b7);
			this.writeByte(b6);
			this.writeByte(b5);
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
			this.writeByte(b5);
			this.writeByte(b6);
			this.writeByte(b7);
			this.writeByte(b8);
		}
	}
	,writeFloat: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
		var b1 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0), b2 = exp + 127 << 7 & 255 | sig >> 16 & 127, b3 = sig >> 8 & 255, b4 = sig & 255;
		if(this.bigEndian) {
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			l -= k;
		}
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,flush: function() {
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,writeByte: function(c) {
		throw "Not implemented";
	}
	,bigEndian: null
	,__class__: haxe.io.Output
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesOutput = function() {
	this.b = new haxe.io.BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe.io.BytesOutput;
haxe.io.BytesOutput.__name__ = ["haxe","io","BytesOutput"];
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	getBytes: function() {
		return this.b.getBytes();
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,writeByte: function(c) {
		this.b.b.push(c);
	}
	,b: null
	,__class__: haxe.io.BytesOutput
});
haxe.io.Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.io.StringInput = function(s) {
	haxe.io.BytesInput.call(this,haxe.io.Bytes.ofString(s));
};
$hxClasses["haxe.io.StringInput"] = haxe.io.StringInput;
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
haxe.io.StringInput.prototype = $extend(haxe.io.BytesInput.prototype,{
	__class__: haxe.io.StringInput
});
haxe.remoting = {}
haxe.remoting.AsyncConnection = function() { }
$hxClasses["haxe.remoting.AsyncConnection"] = haxe.remoting.AsyncConnection;
haxe.remoting.AsyncConnection.__name__ = ["haxe","remoting","AsyncConnection"];
haxe.remoting.AsyncConnection.prototype = {
	setErrorHandler: null
	,call: null
	,resolve: null
	,__class__: haxe.remoting.AsyncConnection
}
haxe.remoting.Context = function() {
	this.objects = new Hash();
};
$hxClasses["haxe.remoting.Context"] = haxe.remoting.Context;
haxe.remoting.Context.__name__ = ["haxe","remoting","Context"];
haxe.remoting.Context.share = function(name,obj) {
	var ctx = new haxe.remoting.Context();
	ctx.addObject(name,obj);
	return ctx;
}
haxe.remoting.Context.prototype = {
	call: function(path,params) {
		if(path.length < 2) throw "Invalid path '" + path.join(".") + "'";
		var inf = this.objects.get(path[0]);
		if(inf == null) throw "No such object " + path[0];
		var o = inf.obj;
		var m = Reflect.field(o,path[1]);
		if(path.length > 2) {
			if(!inf.rec) throw "Can't access " + path.join(".");
			var _g1 = 2, _g = path.length;
			while(_g1 < _g) {
				var i = _g1++;
				o = m;
				m = Reflect.field(o,path[i]);
			}
		}
		if(!Reflect.isFunction(m)) throw "No such method " + path.join(".");
		return m.apply(o,params);
	}
	,addObject: function(name,obj,recursive) {
		this.objects.set(name,{ obj : obj, rec : recursive});
	}
	,objects: null
	,__class__: haxe.remoting.Context
}
haxe.remoting.HttpAsyncConnection = function(data,path) {
	this.__data = data;
	this.__path = path;
};
$hxClasses["haxe.remoting.HttpAsyncConnection"] = haxe.remoting.HttpAsyncConnection;
haxe.remoting.HttpAsyncConnection.__name__ = ["haxe","remoting","HttpAsyncConnection"];
haxe.remoting.HttpAsyncConnection.__interfaces__ = [haxe.remoting.AsyncConnection];
haxe.remoting.HttpAsyncConnection.urlConnect = function(url) {
	return new haxe.remoting.HttpAsyncConnection({ url : url, error : function(e) {
		throw e;
	}},[]);
}
haxe.remoting.HttpAsyncConnection.prototype = {
	call: function(params,onResult) {
		var h = new haxe.Http(this.__data.url);
		var s = new haxe.Serializer();
		s.serialize(this.__path);
		s.serialize(params);
		h.setHeader("X-Haxe-Remoting","1");
		h.setParameter("__x",s.toString());
		var error = this.__data.error;
		h.onData = function(response) {
			var ok = true;
			var ret;
			try {
				if(HxOverrides.substr(response,0,3) != "hxr") throw "Invalid response : '" + response + "'";
				var s1 = new haxe.Unserializer(HxOverrides.substr(response,3,null));
				ret = s1.unserialize();
			} catch( err ) {
				ret = null;
				ok = false;
				error(err);
			}
			if(ok && onResult != null) onResult(ret);
		};
		h.onError = error;
		h.request(true);
	}
	,setErrorHandler: function(h) {
		this.__data.error = h;
	}
	,resolve: function(name) {
		var c = new haxe.remoting.HttpAsyncConnection(this.__data,this.__path.slice());
		c.__path.push(name);
		return c;
	}
	,__path: null
	,__data: null
	,__class__: haxe.remoting.HttpAsyncConnection
}
haxe.rtti = {}
haxe.rtti.Meta = function() { }
$hxClasses["haxe.rtti.Meta"] = haxe.rtti.Meta;
haxe.rtti.Meta.__name__ = ["haxe","rtti","Meta"];
haxe.rtti.Meta.getType = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.obj == null?{ }:meta.obj;
}
haxe.rtti.Meta.getStatics = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.statics == null?{ }:meta.statics;
}
haxe.rtti.Meta.getFields = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.fields == null?{ }:meta.fields;
}
haxe.xml = {}
haxe.xml._Fast = {}
haxe.xml._Fast.NodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeAccess"] = haxe.xml._Fast.NodeAccess;
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype = {
	resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname = this.__x.nodeType == Xml.Document?"Document":this.__x.getNodeName();
			throw xname + " is missing element " + name;
		}
		return new haxe.xml.Fast(x);
	}
	,__x: null
	,__class__: haxe.xml._Fast.NodeAccess
}
haxe.xml._Fast.AttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.AttribAccess"] = haxe.xml._Fast.AttribAccess;
haxe.xml._Fast.AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe.xml._Fast.AttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		var v = this.__x.get(name);
		if(v == null) throw this.__x.getNodeName() + " is missing attribute " + name;
		return v;
	}
	,__x: null
	,__class__: haxe.xml._Fast.AttribAccess
}
haxe.xml._Fast.HasAttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasAttribAccess"] = haxe.xml._Fast.HasAttribAccess;
haxe.xml._Fast.HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe.xml._Fast.HasAttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		return this.__x.exists(name);
	}
	,__x: null
	,__class__: haxe.xml._Fast.HasAttribAccess
}
haxe.xml._Fast.HasNodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasNodeAccess"] = haxe.xml._Fast.HasNodeAccess;
haxe.xml._Fast.HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe.xml._Fast.HasNodeAccess.prototype = {
	resolve: function(name) {
		return this.__x.elementsNamed(name).hasNext();
	}
	,__x: null
	,__class__: haxe.xml._Fast.HasNodeAccess
}
haxe.xml._Fast.NodeListAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeListAccess"] = haxe.xml._Fast.NodeListAccess;
haxe.xml._Fast.NodeListAccess.__name__ = ["haxe","xml","_Fast","NodeListAccess"];
haxe.xml._Fast.NodeListAccess.prototype = {
	resolve: function(name) {
		var l = new List();
		var $it0 = this.__x.elementsNamed(name);
		while( $it0.hasNext() ) {
			var x = $it0.next();
			l.add(new haxe.xml.Fast(x));
		}
		return l;
	}
	,__x: null
	,__class__: haxe.xml._Fast.NodeListAccess
}
haxe.xml.Fast = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + Std.string(x.nodeType);
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
};
$hxClasses["haxe.xml.Fast"] = haxe.xml.Fast;
haxe.xml.Fast.__name__ = ["haxe","xml","Fast"];
haxe.xml.Fast.prototype = {
	getElements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe.xml.Fast(x);
		}};
	}
	,getInnerHTML: function() {
		var s = new StringBuf();
		var $it0 = this.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			s.b += Std.string(x.toString());
		}
		return s.b;
	}
	,getInnerData: function() {
		var it = this.x.iterator();
		if(!it.hasNext()) throw this.getName() + " does not have data";
		var v = it.next();
		var n = it.next();
		if(n != null) {
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData && StringTools.trim(v.getNodeValue()) == "") {
				var n2 = it.next();
				if(n2 == null || n2.nodeType == Xml.PCData && StringTools.trim(n2.getNodeValue()) == "" && it.next() == null) return n.getNodeValue();
			}
			throw this.getName() + " does not only have data";
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw this.getName() + " does not have data";
		return v.getNodeValue();
	}
	,getName: function() {
		return this.x.nodeType == Xml.Document?"Document":this.x.getNodeName();
	}
	,elements: null
	,hasNode: null
	,has: null
	,att: null
	,nodes: null
	,node: null
	,innerHTML: null
	,innerData: null
	,name: null
	,x: null
	,__class__: haxe.xml.Fast
	,__properties__: {get_name:"getName",get_innerData:"getInnerData",get_innerHTML:"getInnerHTML",get_elements:"getElements"}
}
haxe.xml.Parser = function() { }
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
var hscript = {}
hscript.Const = $hxClasses["hscript.Const"] = { __ename__ : ["hscript","Const"], __constructs__ : ["CInt","CFloat","CString","CInt32"] }
hscript.Const.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CInt32 = function(v) { var $x = ["CInt32",3,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Expr = $hxClasses["hscript.Expr"] = { __ename__ : ["hscript","Expr"], __constructs__ : ["EConst","EIdent","EVar","EParent","EBlock","EField","EBinop","EUnop","ECall","EIf","EWhile","EFor","EBreak","EContinue","EFunction","EReturn","EArray","EArrayDecl","ENew","EThrow","ETry","EObject","ETernary"] }
hscript.Expr.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EIdent = function(v) { var $x = ["EIdent",1,v]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EVar = function(n,t,e) { var $x = ["EVar",2,n,t,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EParent = function(e) { var $x = ["EParent",3,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBlock = function(e) { var $x = ["EBlock",4,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EField = function(e,f) { var $x = ["EField",5,e,f]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBinop = function(op,e1,e2) { var $x = ["EBinop",6,op,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EUnop = function(op,prefix,e) { var $x = ["EUnop",7,op,prefix,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ECall = function(e,params) { var $x = ["ECall",8,e,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EIf = function(cond,e1,e2) { var $x = ["EIf",9,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EWhile = function(cond,e) { var $x = ["EWhile",10,cond,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EFor = function(v,it,e) { var $x = ["EFor",11,v,it,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBreak = ["EBreak",12];
hscript.Expr.EBreak.toString = $estr;
hscript.Expr.EBreak.__enum__ = hscript.Expr;
hscript.Expr.EContinue = ["EContinue",13];
hscript.Expr.EContinue.toString = $estr;
hscript.Expr.EContinue.__enum__ = hscript.Expr;
hscript.Expr.EFunction = function(args,e,name,ret) { var $x = ["EFunction",14,args,e,name,ret]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EReturn = function(e) { var $x = ["EReturn",15,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EArray = function(e,index) { var $x = ["EArray",16,e,index]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EArrayDecl = function(e) { var $x = ["EArrayDecl",17,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ENew = function(cl,params) { var $x = ["ENew",18,cl,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EThrow = function(e) { var $x = ["EThrow",19,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ETry = function(e,v,t,ecatch) { var $x = ["ETry",20,e,v,t,ecatch]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EObject = function(fl) { var $x = ["EObject",21,fl]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ETernary = function(cond,e1,e2) { var $x = ["ETernary",22,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.CType = $hxClasses["hscript.CType"] = { __ename__ : ["hscript","CType"], __constructs__ : ["CTPath","CTFun","CTAnon","CTParent"] }
hscript.CType.CTPath = function(path,params) { var $x = ["CTPath",0,path,params]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTFun = function(args,ret) { var $x = ["CTFun",1,args,ret]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTAnon = function(fields) { var $x = ["CTAnon",2,fields]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTParent = function(t) { var $x = ["CTParent",3,t]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.Error = $hxClasses["hscript.Error"] = { __ename__ : ["hscript","Error"], __constructs__ : ["EInvalidChar","EUnexpected","EUnterminatedString","EUnterminatedComment","EUnknownVariable","EInvalidIterator","EInvalidOp","EInvalidAccess"] }
hscript.Error.EInvalidChar = function(c) { var $x = ["EInvalidChar",0,c]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EUnexpected = function(s) { var $x = ["EUnexpected",1,s]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EUnterminatedString = ["EUnterminatedString",2];
hscript.Error.EUnterminatedString.toString = $estr;
hscript.Error.EUnterminatedString.__enum__ = hscript.Error;
hscript.Error.EUnterminatedComment = ["EUnterminatedComment",3];
hscript.Error.EUnterminatedComment.toString = $estr;
hscript.Error.EUnterminatedComment.__enum__ = hscript.Error;
hscript.Error.EUnknownVariable = function(v) { var $x = ["EUnknownVariable",4,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidIterator = function(v) { var $x = ["EInvalidIterator",5,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidOp = function(op) { var $x = ["EInvalidOp",6,op]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidAccess = function(f) { var $x = ["EInvalidAccess",7,f]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript._Interp = {}
hscript._Interp.Stop = $hxClasses["hscript._Interp.Stop"] = { __ename__ : ["hscript","_Interp","Stop"], __constructs__ : ["SBreak","SContinue","SReturn"] }
hscript._Interp.Stop.SBreak = ["SBreak",0];
hscript._Interp.Stop.SBreak.toString = $estr;
hscript._Interp.Stop.SBreak.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SContinue = ["SContinue",1];
hscript._Interp.Stop.SContinue.toString = $estr;
hscript._Interp.Stop.SContinue.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SReturn = function(v) { var $x = ["SReturn",2,v]; $x.__enum__ = hscript._Interp.Stop; $x.toString = $estr; return $x; }
hscript.Interp = function() {
	this.locals = new Hash();
	this.declared = new Array();
	this.variables = new Hash();
	this.variables.set("null",null);
	this.variables.set("true",true);
	this.variables.set("false",false);
	this.variables.set("trace",function(e) {
		haxe.Log.trace(Std.string(e),{ fileName : "hscript", lineNumber : 0});
	});
	this.initOps();
};
$hxClasses["hscript.Interp"] = hscript.Interp;
hscript.Interp.__name__ = ["hscript","Interp"];
hscript.Interp.prototype = {
	cnew: function(cl,args) {
		return Type.createInstance(Type.resolveClass(cl),args);
	}
	,call: function(o,f,args) {
		return f.apply(o,args);
	}
	,set: function(o,f,v) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		o[f] = v;
		return v;
	}
	,get: function(o,f) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		return Reflect.field(o,f);
	}
	,forLoop: function(n,it,e) {
		var old = this.declared.length;
		this.declared.push({ n : n, old : this.locals.get(n)});
		var it1 = this.makeIterator(this.expr(it));
		try {
			while(it1.hasNext()) {
				this.locals.set(n,{ r : it1.next()});
				try {
					this.expr(e);
				} catch( err ) {
					if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
						switch( (err)[1] ) {
						case 1:
							break;
						case 0:
							throw "__break__";
							break;
						case 2:
							throw err;
							break;
						}
					} else throw(err);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,makeIterator: function(v) {
		try {
			v = $iterator(v)();
		} catch( e ) {
		}
		if(v.hasNext == null || v.next == null) throw hscript.Error.EInvalidIterator(v);
		return v;
	}
	,whileLoop: function(econd,e) {
		var old = this.declared.length;
		try {
			while(this.expr(econd) == true) try {
				this.expr(e);
			} catch( err ) {
				if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
					switch( (err)[1] ) {
					case 1:
						break;
					case 0:
						throw "__break__";
						break;
					case 2:
						throw err;
						break;
					}
				} else throw(err);
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,expr: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var c = $e[2];
			var $e = (c);
			switch( $e[1] ) {
			case 0:
				var v = $e[2];
				return v;
			case 1:
				var f = $e[2];
				return f;
			case 2:
				var s = $e[2];
				return s;
			case 3:
				var v = $e[2];
				return v;
			}
			break;
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			if(l != null) return l.r;
			var v = this.variables.get(id);
			if(v == null && !this.variables.exists(id)) throw hscript.Error.EUnknownVariable(id);
			return v;
		case 2:
			var e1 = $e[4], n = $e[2];
			this.declared.push({ n : n, old : this.locals.get(n)});
			this.locals.set(n,{ r : e1 == null?null:this.expr(e1)});
			return null;
		case 3:
			var e1 = $e[2];
			return this.expr(e1);
		case 4:
			var exprs = $e[2];
			var old = this.declared.length;
			var v = null;
			var _g = 0;
			while(_g < exprs.length) {
				var e1 = exprs[_g];
				++_g;
				v = this.expr(e1);
			}
			this.restore(old);
			return v;
		case 5:
			var f = $e[3], e1 = $e[2];
			return this.get(this.expr(e1),f);
		case 6:
			var e2 = $e[4], e1 = $e[3], op = $e[2];
			var fop = this.binops.get(op);
			if(fop == null) throw hscript.Error.EInvalidOp(op);
			return fop(e1,e2);
		case 7:
			var e1 = $e[4], prefix = $e[3], op = $e[2];
			switch(op) {
			case "!":
				return this.expr(e1) != true;
			case "-":
				return -this.expr(e1);
			case "++":
				return this.increment(e1,prefix,1);
			case "--":
				return this.increment(e1,prefix,-1);
			case "~":
				return ~this.expr(e1);
			default:
				throw hscript.Error.EInvalidOp(op);
			}
			break;
		case 8:
			var params = $e[3], e1 = $e[2];
			var args = new Array();
			var _g = 0;
			while(_g < params.length) {
				var p = params[_g];
				++_g;
				args.push(this.expr(p));
			}
			var $e = (e1);
			switch( $e[1] ) {
			case 5:
				var f = $e[3], e2 = $e[2];
				var obj = this.expr(e2);
				if(obj == null) throw hscript.Error.EInvalidAccess(f);
				return this.call(obj,Reflect.field(obj,f),args);
			default:
				return this.call(null,this.expr(e1),args);
			}
			break;
		case 9:
			var e2 = $e[4], e1 = $e[3], econd = $e[2];
			return this.expr(econd) == true?this.expr(e1):e2 == null?null:this.expr(e2);
		case 10:
			var e1 = $e[3], econd = $e[2];
			this.whileLoop(econd,e1);
			return null;
		case 11:
			var e1 = $e[4], it = $e[3], v = $e[2];
			this.forLoop(v,it,e1);
			return null;
		case 12:
			throw hscript._Interp.Stop.SBreak;
			break;
		case 13:
			throw hscript._Interp.Stop.SContinue;
			break;
		case 15:
			var e1 = $e[2];
			throw hscript._Interp.Stop.SReturn(e1 == null?null:this.expr(e1));
			break;
		case 14:
			var name = $e[4], fexpr = $e[3], params = $e[2];
			var capturedLocals = this.duplicate(this.locals);
			var me = this;
			var f = function(args) {
				if(args.length != params.length) throw "Invalid number of parameters";
				var old = me.locals;
				me.locals = me.duplicate(capturedLocals);
				var _g1 = 0, _g = params.length;
				while(_g1 < _g) {
					var i = _g1++;
					me.locals.set(params[i].name,{ r : args[i]});
				}
				var r = null;
				try {
					r = me.exprReturn(fexpr);
				} catch( e1 ) {
					me.locals = old;
					throw e1;
				}
				me.locals = old;
				return r;
			};
			var f1 = Reflect.makeVarArgs(f);
			if(name != null) this.variables.set(name,f1);
			return f1;
		case 17:
			var arr = $e[2];
			var a = new Array();
			var _g = 0;
			while(_g < arr.length) {
				var e1 = arr[_g];
				++_g;
				a.push(this.expr(e1));
			}
			return a;
		case 16:
			var index = $e[3], e1 = $e[2];
			return this.expr(e1)[this.expr(index)];
		case 18:
			var params = $e[3], cl = $e[2];
			var a = new Array();
			var _g = 0;
			while(_g < params.length) {
				var e1 = params[_g];
				++_g;
				a.push(this.expr(e1));
			}
			return this.cnew(cl,a);
		case 19:
			var e1 = $e[2];
			throw this.expr(e1);
			break;
		case 20:
			var ecatch = $e[5], n = $e[3], e1 = $e[2];
			var old = this.declared.length;
			try {
				var v = this.expr(e1);
				this.restore(old);
				return v;
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,hscript._Interp.Stop) ) {
					var err = $e0;
					throw err;
				} else {
				var err = $e0;
				this.restore(old);
				this.declared.push({ n : n, old : this.locals.get(n)});
				this.locals.set(n,{ r : err});
				var v = this.expr(ecatch);
				this.restore(old);
				return v;
				}
			}
			break;
		case 21:
			var fl = $e[2];
			var o = { };
			var _g = 0;
			while(_g < fl.length) {
				var f = fl[_g];
				++_g;
				this.set(o,f.name,this.expr(f.e));
			}
			return o;
		case 22:
			var e2 = $e[4], e1 = $e[3], econd = $e[2];
			return this.expr(econd) == true?this.expr(e1):this.expr(e2);
		}
		return null;
	}
	,restore: function(old) {
		while(this.declared.length > old) {
			var d = this.declared.pop();
			this.locals.set(d.n,d.old);
		}
	}
	,duplicate: function(h) {
		var h2 = new Hash();
		var $it0 = h.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			h2.set(k,h.get(k));
		}
		return h2;
	}
	,exprReturn: function(e) {
		try {
			return this.expr(e);
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,hscript._Interp.Stop) ) {
				var $e = (e1);
				switch( $e[1] ) {
				case 0:
					throw "Invalid break";
					break;
				case 1:
					throw "Invalid continue";
					break;
				case 2:
					var v = $e[2];
					return v;
				}
			} else throw(e1);
		}
		return null;
	}
	,execute: function(expr) {
		this.locals = new Hash();
		return this.exprReturn(expr);
	}
	,increment: function(e,prefix,delta) {
		var $e = (e);
		switch( $e[1] ) {
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			var v = l == null?this.variables.get(id):l.r;
			if(prefix) {
				v += delta;
				if(l == null) this.variables.set(id,v); else l.r = v;
			} else if(l == null) this.variables.set(id,v + delta); else l.r = v + delta;
			return v;
		case 5:
			var f = $e[3], e1 = $e[2];
			var obj = this.expr(e1);
			var v = this.get(obj,f);
			if(prefix) {
				v += delta;
				this.set(obj,f,v);
			} else this.set(obj,f,v + delta);
			return v;
		case 16:
			var index = $e[3], e1 = $e[2];
			var arr = this.expr(e1);
			var index1 = this.expr(index);
			var v = arr[index1];
			if(prefix) {
				v += delta;
				arr[index1] = v;
			} else arr[index1] = v + delta;
			return v;
		default:
			throw hscript.Error.EInvalidOp(delta > 0?"++":"--");
		}
	}
	,evalAssignOp: function(op,fop,e1,e2) {
		var v;
		var $e = (e1);
		switch( $e[1] ) {
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			v = fop(this.expr(e1),this.expr(e2));
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = $e[3], e = $e[2];
			var obj = this.expr(e);
			v = fop(this.get(obj,f),this.expr(e2));
			v = this.set(obj,f,v);
			break;
		case 16:
			var index = $e[3], e = $e[2];
			var arr = this.expr(e);
			var index1 = this.expr(index);
			v = fop(arr[index1],this.expr(e2));
			arr[index1] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp(op);
		}
		return v;
	}
	,assignOp: function(op,fop) {
		var me = this;
		this.binops.set(op,function(e1,e2) {
			return me.evalAssignOp(op,fop,e1,e2);
		});
	}
	,assign: function(e1,e2) {
		var v = this.expr(e2);
		var $e = (e1);
		switch( $e[1] ) {
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = $e[3], e = $e[2];
			v = this.set(this.expr(e),f,v);
			break;
		case 16:
			var index = $e[3], e = $e[2];
			this.expr(e)[this.expr(index)] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp("=");
		}
		return v;
	}
	,initOps: function() {
		var me = this;
		this.binops = new Hash();
		this.binops.set("+",function(e1,e2) {
			return me.expr(e1) + me.expr(e2);
		});
		this.binops.set("-",function(e1,e2) {
			return me.expr(e1) - me.expr(e2);
		});
		this.binops.set("*",function(e1,e2) {
			return me.expr(e1) * me.expr(e2);
		});
		this.binops.set("/",function(e1,e2) {
			return me.expr(e1) / me.expr(e2);
		});
		this.binops.set("%",function(e1,e2) {
			return me.expr(e1) % me.expr(e2);
		});
		this.binops.set("&",function(e1,e2) {
			return me.expr(e1) & me.expr(e2);
		});
		this.binops.set("|",function(e1,e2) {
			return me.expr(e1) | me.expr(e2);
		});
		this.binops.set("^",function(e1,e2) {
			return me.expr(e1) ^ me.expr(e2);
		});
		this.binops.set("<<",function(e1,e2) {
			return me.expr(e1) << me.expr(e2);
		});
		this.binops.set(">>",function(e1,e2) {
			return me.expr(e1) >> me.expr(e2);
		});
		this.binops.set(">>>",function(e1,e2) {
			return me.expr(e1) >>> me.expr(e2);
		});
		this.binops.set("==",function(e1,e2) {
			return me.expr(e1) == me.expr(e2);
		});
		this.binops.set("!=",function(e1,e2) {
			return me.expr(e1) != me.expr(e2);
		});
		this.binops.set(">=",function(e1,e2) {
			return me.expr(e1) >= me.expr(e2);
		});
		this.binops.set("<=",function(e1,e2) {
			return me.expr(e1) <= me.expr(e2);
		});
		this.binops.set(">",function(e1,e2) {
			return me.expr(e1) > me.expr(e2);
		});
		this.binops.set("<",function(e1,e2) {
			return me.expr(e1) < me.expr(e2);
		});
		this.binops.set("||",function(e1,e2) {
			return me.expr(e1) == true || me.expr(e2) == true;
		});
		this.binops.set("&&",function(e1,e2) {
			return me.expr(e1) == true && me.expr(e2) == true;
		});
		this.binops.set("=",$bind(this,this.assign));
		this.binops.set("...",function(e1,e2) {
			return new IntIter(me.expr(e1),me.expr(e2));
		});
		this.assignOp("+=",function(v1,v2) {
			return v1 + v2;
		});
		this.assignOp("-=",function(v1,v2) {
			return v1 - v2;
		});
		this.assignOp("*=",function(v1,v2) {
			return v1 * v2;
		});
		this.assignOp("/=",function(v1,v2) {
			return v1 / v2;
		});
		this.assignOp("%=",function(v1,v2) {
			return v1 % v2;
		});
		this.assignOp("&=",function(v1,v2) {
			return v1 & v2;
		});
		this.assignOp("|=",function(v1,v2) {
			return v1 | v2;
		});
		this.assignOp("^=",function(v1,v2) {
			return v1 ^ v2;
		});
		this.assignOp("<<=",function(v1,v2) {
			return v1 << v2;
		});
		this.assignOp(">>=",function(v1,v2) {
			return v1 >> v2;
		});
		this.assignOp(">>>=",function(v1,v2) {
			return v1 >>> v2;
		});
	}
	,declared: null
	,binops: null
	,locals: null
	,variables: null
	,__class__: hscript.Interp
}
hscript.Token = $hxClasses["hscript.Token"] = { __ename__ : ["hscript","Token"], __constructs__ : ["TEof","TConst","TId","TOp","TPOpen","TPClose","TBrOpen","TBrClose","TDot","TComma","TSemicolon","TBkOpen","TBkClose","TQuestion","TDoubleDot"] }
hscript.Token.TEof = ["TEof",0];
hscript.Token.TEof.toString = $estr;
hscript.Token.TEof.__enum__ = hscript.Token;
hscript.Token.TConst = function(c) { var $x = ["TConst",1,c]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TId = function(s) { var $x = ["TId",2,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TOp = function(s) { var $x = ["TOp",3,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TPOpen = ["TPOpen",4];
hscript.Token.TPOpen.toString = $estr;
hscript.Token.TPOpen.__enum__ = hscript.Token;
hscript.Token.TPClose = ["TPClose",5];
hscript.Token.TPClose.toString = $estr;
hscript.Token.TPClose.__enum__ = hscript.Token;
hscript.Token.TBrOpen = ["TBrOpen",6];
hscript.Token.TBrOpen.toString = $estr;
hscript.Token.TBrOpen.__enum__ = hscript.Token;
hscript.Token.TBrClose = ["TBrClose",7];
hscript.Token.TBrClose.toString = $estr;
hscript.Token.TBrClose.__enum__ = hscript.Token;
hscript.Token.TDot = ["TDot",8];
hscript.Token.TDot.toString = $estr;
hscript.Token.TDot.__enum__ = hscript.Token;
hscript.Token.TComma = ["TComma",9];
hscript.Token.TComma.toString = $estr;
hscript.Token.TComma.__enum__ = hscript.Token;
hscript.Token.TSemicolon = ["TSemicolon",10];
hscript.Token.TSemicolon.toString = $estr;
hscript.Token.TSemicolon.__enum__ = hscript.Token;
hscript.Token.TBkOpen = ["TBkOpen",11];
hscript.Token.TBkOpen.toString = $estr;
hscript.Token.TBkOpen.__enum__ = hscript.Token;
hscript.Token.TBkClose = ["TBkClose",12];
hscript.Token.TBkClose.toString = $estr;
hscript.Token.TBkClose.__enum__ = hscript.Token;
hscript.Token.TQuestion = ["TQuestion",13];
hscript.Token.TQuestion.toString = $estr;
hscript.Token.TQuestion.__enum__ = hscript.Token;
hscript.Token.TDoubleDot = ["TDoubleDot",14];
hscript.Token.TDoubleDot.toString = $estr;
hscript.Token.TDoubleDot.__enum__ = hscript.Token;
hscript.Parser = function() {
	this.line = 1;
	this.opChars = "+*/-=!><&|^%~";
	this.identChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	var priorities = [["%"],["*","/"],["+","-"],["<<",">>",">>>"],["|","&","^"],["==","!=",">","<",">=","<="],["..."],["&&"],["||"],["=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","&=","^="]];
	this.opPriority = new Hash();
	this.opRightAssoc = new Hash();
	var _g1 = 0, _g = priorities.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g2 = 0, _g3 = priorities[i];
		while(_g2 < _g3.length) {
			var x = _g3[_g2];
			++_g2;
			this.opPriority.set(x,i);
			if(i == 9) this.opRightAssoc.set(x,true);
		}
	}
	this.unops = new Hash();
	var _g = 0, _g1 = ["!","++","--","-","~"];
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		this.unops.set(x,x == "++" || x == "--");
	}
};
$hxClasses["hscript.Parser"] = hscript.Parser;
hscript.Parser.__name__ = ["hscript","Parser"];
hscript.Parser.prototype = {
	tokenString: function(t) {
		return (function($this) {
			var $r;
			var $e = (t);
			switch( $e[1] ) {
			case 0:
				$r = "<eof>";
				break;
			case 1:
				var c = $e[2];
				$r = $this.constString(c);
				break;
			case 2:
				var s = $e[2];
				$r = s;
				break;
			case 3:
				var s = $e[2];
				$r = s;
				break;
			case 4:
				$r = "(";
				break;
			case 5:
				$r = ")";
				break;
			case 6:
				$r = "{";
				break;
			case 7:
				$r = "}";
				break;
			case 8:
				$r = ".";
				break;
			case 9:
				$r = ",";
				break;
			case 10:
				$r = ";";
				break;
			case 11:
				$r = "[";
				break;
			case 12:
				$r = "]";
				break;
			case 13:
				$r = "?";
				break;
			case 14:
				$r = ":";
				break;
			}
			return $r;
		}(this));
	}
	,constString: function(c) {
		return (function($this) {
			var $r;
			var $e = (c);
			switch( $e[1] ) {
			case 0:
				var v = $e[2];
				$r = Std.string(v);
				break;
			case 1:
				var f = $e[2];
				$r = Std.string(f);
				break;
			case 2:
				var s = $e[2];
				$r = s;
				break;
			case 3:
				var v = $e[2];
				$r = Std.string(v);
				break;
			}
			return $r;
		}(this));
	}
	,tokenComment: function(op,$char) {
		var c = HxOverrides.cca(op,1);
		var s = this.input;
		if(c == 47) {
			try {
				while($char != 10 && $char != 13) $char = s.readByte();
				this["char"] = $char;
			} catch( e ) {
			}
			return this.token();
		}
		if(c == 42) {
			var old = this.line;
			try {
				while(true) {
					while($char != 42) {
						if($char == 10) this.line++;
						$char = s.readByte();
					}
					$char = s.readByte();
					if($char == 47) break;
				}
			} catch( e ) {
				this.line = old;
				throw hscript.Error.EUnterminatedComment;
			}
			return this.token();
		}
		this["char"] = $char;
		return hscript.Token.TOp(op);
	}
	,token: function() {
		if(!(this.tokens.head == null)) return this.tokens.pop();
		var $char;
		if(this["char"] < 0) $char = this.readChar(); else {
			$char = this["char"];
			this["char"] = -1;
		}
		while(true) {
			switch($char) {
			case 0:
				return hscript.Token.TEof;
			case 32:case 9:case 13:
				break;
			case 10:
				this.line++;
				break;
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				var n = ($char - 48) * 1.0;
				var exp = 0.;
				while(true) {
					$char = this.readChar();
					exp *= 10;
					switch($char) {
					case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						n = n * 10 + ($char - 48);
						break;
					case 46:
						if(exp > 0) {
							if(exp == 10 && this.readChar() == 46) {
								this.tokens.add(hscript.Token.TOp("..."));
								var i = n | 0;
								return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
							}
							this.invalidChar($char);
						}
						exp = 1.;
						break;
					case 120:
						if(n > 0 || exp > 0) this.invalidChar($char);
						var n1 = 0 | 0;
						while(true) {
							$char = this.readChar();
							switch($char) {
							case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
								n1 = (n1 << 4) + ($char - 48) | 0;
								break;
							case 65:case 66:case 67:case 68:case 69:case 70:
								n1 = (n1 << 4) + ($char - 55) | 0;
								break;
							case 97:case 98:case 99:case 100:case 101:case 102:
								n1 = (n1 << 4) + ($char - 87) | 0;
								break;
							default:
								this["char"] = $char;
								var v = (function($this) {
									var $r;
									try {
										$r = hscript.Const.CInt((function($this) {
											var $r;
											if((n1 >> 30 & 1) != n1 >>> 31) throw "Overflow " + Std.string(n1);
											$r = n1;
											return $r;
										}($this)));
									} catch( e ) {
										$r = hscript.Const.CInt32(n1);
									}
									return $r;
								}(this));
								return hscript.Token.TConst(v);
							}
						}
						break;
					default:
						this["char"] = $char;
						var i = n | 0;
						return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
					}
				}
				break;
			case 59:
				return hscript.Token.TSemicolon;
			case 40:
				return hscript.Token.TPOpen;
			case 41:
				return hscript.Token.TPClose;
			case 44:
				return hscript.Token.TComma;
			case 46:
				$char = this.readChar();
				switch($char) {
				case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
					var n = $char - 48;
					var exp = 1;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							n = n * 10 + ($char - 48);
							break;
						default:
							this["char"] = $char;
							return hscript.Token.TConst(hscript.Const.CFloat(n / exp));
						}
					}
					break;
				case 46:
					$char = this.readChar();
					if($char != 46) this.invalidChar($char);
					return hscript.Token.TOp("...");
				default:
					this["char"] = $char;
					return hscript.Token.TDot;
				}
				break;
			case 123:
				return hscript.Token.TBrOpen;
			case 125:
				return hscript.Token.TBrClose;
			case 91:
				return hscript.Token.TBkOpen;
			case 93:
				return hscript.Token.TBkClose;
			case 39:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(39)));
			case 34:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(34)));
			case 63:
				return hscript.Token.TQuestion;
			case 58:
				return hscript.Token.TDoubleDot;
			default:
				if(this.ops[$char]) {
					var op = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.ops[$char]) {
							if(HxOverrides.cca(op,0) == 47) return this.tokenComment(op,$char);
							this["char"] = $char;
							return hscript.Token.TOp(op);
						}
						op += String.fromCharCode($char);
					}
				}
				if(this.idents[$char]) {
					var id = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.idents[$char]) {
							this["char"] = $char;
							return hscript.Token.TId(id);
						}
						id += String.fromCharCode($char);
					}
				}
				this.invalidChar($char);
			}
			$char = this.readChar();
		}
		return null;
	}
	,readString: function(until) {
		var c = 0;
		var b = new haxe.io.BytesOutput();
		var esc = false;
		var old = this.line;
		var s = this.input;
		while(true) {
			try {
				c = s.readByte();
			} catch( e ) {
				this.line = old;
				throw hscript.Error.EUnterminatedString;
			}
			if(esc) {
				esc = false;
				switch(c) {
				case 110:
					b.writeByte(10);
					break;
				case 114:
					b.writeByte(13);
					break;
				case 116:
					b.writeByte(9);
					break;
				case 39:case 34:case 92:
					b.writeByte(c);
					break;
				case 47:
					if(this.allowJSON) b.writeByte(c); else this.invalidChar(c);
					break;
				case 117:
					if(!this.allowJSON) throw this.invalidChar(c);
					var code = null;
					try {
						code = s.readString(4);
					} catch( e ) {
						this.line = old;
						throw hscript.Error.EUnterminatedString;
					}
					var k = 0;
					var _g = 0;
					while(_g < 4) {
						var i = _g++;
						k <<= 4;
						var $char = HxOverrides.cca(code,i);
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += $char - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += $char - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += $char - 87;
							break;
						default:
							this.invalidChar($char);
						}
					}
					if(k <= 127) b.writeByte(k); else if(k <= 2047) {
						b.writeByte(192 | k >> 6);
						b.writeByte(128 | k & 63);
					} else {
						b.writeByte(224 | k >> 12);
						b.writeByte(128 | k >> 6 & 63);
						b.writeByte(128 | k & 63);
					}
					break;
				default:
					this.invalidChar(c);
				}
			} else if(c == 92) esc = true; else if(c == until) break; else {
				if(c == 10) this.line++;
				b.writeByte(c);
			}
		}
		return b.getBytes().toString();
	}
	,readChar: function() {
		return (function($this) {
			var $r;
			try {
				$r = $this.input.readByte();
			} catch( e ) {
				$r = 0;
			}
			return $r;
		}(this));
	}
	,incPos: function() {
	}
	,parseExprList: function(etk) {
		var args = new Array();
		var tk = this.token();
		if(tk == etk) return args;
		this.tokens.add(tk);
		try {
			while(true) {
				args.push(this.parseExpr());
				tk = this.token();
				switch( (tk)[1] ) {
				case 9:
					break;
				default:
					if(tk == etk) throw "__break__";
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return args;
	}
	,parseTypeNext: function(t) {
		var tk = this.token();
		var $e = (tk);
		switch( $e[1] ) {
		case 3:
			var op = $e[2];
			if(op != "->") {
				this.tokens.add(tk);
				return t;
			}
			break;
		default:
			this.tokens.add(tk);
			return t;
		}
		var t2 = this.parseType();
		var $e = (t2);
		switch( $e[1] ) {
		case 1:
			var ret = $e[3], args = $e[2];
			args.unshift(t);
			return t2;
		default:
			return hscript.CType.CTFun([t],t2);
		}
	}
	,parseType: function() {
		var t = this.token();
		var $e = (t);
		switch( $e[1] ) {
		case 2:
			var v = $e[2];
			var path = [v];
			while(true) {
				t = this.token();
				if(t != hscript.Token.TDot) break;
				t = this.token();
				var $e = (t);
				switch( $e[1] ) {
				case 2:
					var v1 = $e[2];
					path.push(v1);
					break;
				default:
					this.unexpected(t);
				}
			}
			var params = null;
			var $e = (t);
			switch( $e[1] ) {
			case 3:
				var op = $e[2];
				if(op == "<") {
					params = [];
					try {
						while(true) {
							params.push(this.parseType());
							t = this.token();
							var $e = (t);
							switch( $e[1] ) {
							case 9:
								continue;
								break;
							case 3:
								var op1 = $e[2];
								if(op1 == ">") throw "__break__";
								break;
							default:
							}
							this.unexpected(t);
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
				}
				break;
			default:
				this.tokens.add(t);
			}
			return this.parseTypeNext(hscript.CType.CTPath(path,params));
		case 4:
			var t1 = this.parseType();
			this.ensure(hscript.Token.TPClose);
			return this.parseTypeNext(hscript.CType.CTParent(t1));
		case 6:
			var fields = [];
			try {
				while(true) {
					t = this.token();
					var $e = (t);
					switch( $e[1] ) {
					case 7:
						throw "__break__";
						break;
					case 2:
						var name = $e[2];
						this.ensure(hscript.Token.TDoubleDot);
						fields.push({ name : name, t : this.parseType()});
						t = this.token();
						switch( (t)[1] ) {
						case 9:
							break;
						case 7:
							throw "__break__";
							break;
						default:
							this.unexpected(t);
						}
						break;
					default:
						this.unexpected(t);
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			return this.parseTypeNext(hscript.CType.CTAnon(fields));
		default:
			return this.unexpected(t);
		}
	}
	,parseExprNext: function(e1) {
		var tk = this.token();
		var $e = (tk);
		switch( $e[1] ) {
		case 3:
			var op = $e[2];
			if(this.unops.get(op)) {
				if(this.isBlock(e1) || (function($this) {
					var $r;
					switch( (e1)[1] ) {
					case 3:
						$r = true;
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) {
					this.tokens.add(tk);
					return e1;
				}
				return this.parseExprNext(hscript.Expr.EUnop(op,false,e1));
			}
			return this.makeBinop(op,e1,this.parseExpr());
		case 8:
			tk = this.token();
			var field = null;
			var $e = (tk);
			switch( $e[1] ) {
			case 2:
				var id = $e[2];
				field = id;
				break;
			default:
				this.unexpected(tk);
			}
			return this.parseExprNext(hscript.Expr.EField(e1,field));
		case 4:
			return this.parseExprNext(hscript.Expr.ECall(e1,this.parseExprList(hscript.Token.TPClose)));
		case 11:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TBkClose);
			return this.parseExprNext(hscript.Expr.EArray(e1,e2));
		case 13:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TDoubleDot);
			var e3 = this.parseExpr();
			return hscript.Expr.ETernary(e1,e2,e3);
		default:
			this.tokens.add(tk);
			return e1;
		}
	}
	,parseStructure: function(id) {
		return (function($this) {
			var $r;
			switch(id) {
			case "if":
				$r = (function($this) {
					var $r;
					var cond = $this.parseExpr();
					var e1 = $this.parseExpr();
					var e2 = null;
					var semic = false;
					var tk = $this.token();
					if(tk == hscript.Token.TSemicolon) {
						semic = true;
						tk = $this.token();
					}
					if(Type.enumEq(tk,hscript.Token.TId("else"))) e2 = $this.parseExpr(); else {
						$this.tokens.add(tk);
						if(semic) $this.tokens.add(hscript.Token.TSemicolon);
					}
					$r = hscript.Expr.EIf(cond,e1,e2);
					return $r;
				}($this));
				break;
			case "var":
				$r = (function($this) {
					var $r;
					var tk = $this.token();
					var ident = null;
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						ident = id1;
						break;
					default:
						$this.unexpected(tk);
					}
					tk = $this.token();
					var t = null;
					if(tk == hscript.Token.TDoubleDot && $this.allowTypes) {
						t = $this.parseType();
						tk = $this.token();
					}
					var e = null;
					if(Type.enumEq(tk,hscript.Token.TOp("="))) e = $this.parseExpr(); else $this.tokens.add(tk);
					$r = hscript.Expr.EVar(ident,t,e);
					return $r;
				}($this));
				break;
			case "while":
				$r = (function($this) {
					var $r;
					var econd = $this.parseExpr();
					var e = $this.parseExpr();
					$r = hscript.Expr.EWhile(econd,e);
					return $r;
				}($this));
				break;
			case "for":
				$r = (function($this) {
					var $r;
					$this.ensure(hscript.Token.TPOpen);
					var tk = $this.token();
					var vname = null;
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						vname = id1;
						break;
					default:
						$this.unexpected(tk);
					}
					tk = $this.token();
					if(!Type.enumEq(tk,hscript.Token.TId("in"))) $this.unexpected(tk);
					var eiter = $this.parseExpr();
					$this.ensure(hscript.Token.TPClose);
					var e = $this.parseExpr();
					$r = hscript.Expr.EFor(vname,eiter,e);
					return $r;
				}($this));
				break;
			case "break":
				$r = hscript.Expr.EBreak;
				break;
			case "continue":
				$r = hscript.Expr.EContinue;
				break;
			case "else":
				$r = $this.unexpected(hscript.Token.TId(id));
				break;
			case "function":
				$r = (function($this) {
					var $r;
					var tk = $this.token();
					var name = null;
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						name = id1;
						break;
					default:
						$this.tokens.add(tk);
					}
					$this.ensure(hscript.Token.TPOpen);
					var args = new Array();
					tk = $this.token();
					if(tk != hscript.Token.TPClose) {
						var arg = true;
						while(arg) {
							var name1 = null;
							var $e = (tk);
							switch( $e[1] ) {
							case 2:
								var id1 = $e[2];
								name1 = id1;
								break;
							default:
								$this.unexpected(tk);
							}
							tk = $this.token();
							var t = null;
							if(tk == hscript.Token.TDoubleDot && $this.allowTypes) {
								t = $this.parseType();
								tk = $this.token();
							}
							args.push({ name : name1, t : t});
							switch( (tk)[1] ) {
							case 9:
								tk = $this.token();
								break;
							case 5:
								arg = false;
								break;
							default:
								$this.unexpected(tk);
							}
						}
					}
					var ret = null;
					if($this.allowTypes) {
						tk = $this.token();
						if(tk != hscript.Token.TDoubleDot) $this.tokens.add(tk); else ret = $this.parseType();
					}
					var body = $this.parseExpr();
					$r = hscript.Expr.EFunction(args,body,name,ret);
					return $r;
				}($this));
				break;
			case "return":
				$r = (function($this) {
					var $r;
					var tk = $this.token();
					$this.tokens.add(tk);
					var e = tk == hscript.Token.TSemicolon?null:$this.parseExpr();
					$r = hscript.Expr.EReturn(e);
					return $r;
				}($this));
				break;
			case "new":
				$r = (function($this) {
					var $r;
					var a = new Array();
					var tk = $this.token();
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						a.push(id1);
						break;
					default:
						$this.unexpected(tk);
					}
					var next = true;
					while(next) {
						tk = $this.token();
						switch( (tk)[1] ) {
						case 8:
							tk = $this.token();
							var $e = (tk);
							switch( $e[1] ) {
							case 2:
								var id1 = $e[2];
								a.push(id1);
								break;
							default:
								$this.unexpected(tk);
							}
							break;
						case 4:
							next = false;
							break;
						default:
							$this.unexpected(tk);
						}
					}
					var args = $this.parseExprList(hscript.Token.TPClose);
					$r = hscript.Expr.ENew(a.join("."),args);
					return $r;
				}($this));
				break;
			case "throw":
				$r = (function($this) {
					var $r;
					var e = $this.parseExpr();
					$r = hscript.Expr.EThrow(e);
					return $r;
				}($this));
				break;
			case "try":
				$r = (function($this) {
					var $r;
					var e = $this.parseExpr();
					var tk = $this.token();
					if(!Type.enumEq(tk,hscript.Token.TId("catch"))) $this.unexpected(tk);
					$this.ensure(hscript.Token.TPOpen);
					tk = $this.token();
					var vname = (function($this) {
						var $r;
						var $e = (tk);
						switch( $e[1] ) {
						case 2:
							var id1 = $e[2];
							$r = id1;
							break;
						default:
							$r = $this.unexpected(tk);
						}
						return $r;
					}($this));
					$this.ensure(hscript.Token.TDoubleDot);
					var t = null;
					if($this.allowTypes) t = $this.parseType(); else {
						tk = $this.token();
						if(!Type.enumEq(tk,hscript.Token.TId("Dynamic"))) $this.unexpected(tk);
					}
					$this.ensure(hscript.Token.TPClose);
					var ec = $this.parseExpr();
					$r = hscript.Expr.ETry(e,vname,t,ec);
					return $r;
				}($this));
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,makeBinop: function(op,e1,e) {
		return (function($this) {
			var $r;
			var $e = (e);
			switch( $e[1] ) {
			case 6:
				var e3 = $e[4], e2 = $e[3], op2 = $e[2];
				$r = $this.opPriority.get(op) <= $this.opPriority.get(op2) && !$this.opRightAssoc.exists(op)?hscript.Expr.EBinop(op2,$this.makeBinop(op,e1,e2),e3):hscript.Expr.EBinop(op,e1,e);
				break;
			case 22:
				var e4 = $e[4], e3 = $e[3], e2 = $e[2];
				$r = $this.opRightAssoc.exists(op)?hscript.Expr.EBinop(op,e1,e):hscript.Expr.ETernary($this.makeBinop(op,e1,e2),e3,e4);
				break;
			default:
				$r = hscript.Expr.EBinop(op,e1,e);
			}
			return $r;
		}(this));
	}
	,makeUnop: function(op,e) {
		return (function($this) {
			var $r;
			var $e = (e);
			switch( $e[1] ) {
			case 6:
				var e2 = $e[4], e1 = $e[3], bop = $e[2];
				$r = hscript.Expr.EBinop(bop,$this.makeUnop(op,e1),e2);
				break;
			case 22:
				var e3 = $e[4], e2 = $e[3], e1 = $e[2];
				$r = hscript.Expr.ETernary($this.makeUnop(op,e1),e2,e3);
				break;
			default:
				$r = hscript.Expr.EUnop(op,true,e);
			}
			return $r;
		}(this));
	}
	,parseExpr: function() {
		var tk = this.token();
		var $e = (tk);
		switch( $e[1] ) {
		case 2:
			var id = $e[2];
			var e = this.parseStructure(id);
			if(e == null) e = hscript.Expr.EIdent(id);
			return this.parseExprNext(e);
		case 1:
			var c = $e[2];
			return this.parseExprNext(hscript.Expr.EConst(c));
		case 4:
			var e = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			return this.parseExprNext(hscript.Expr.EParent(e));
		case 6:
			tk = this.token();
			var $e = (tk);
			switch( $e[1] ) {
			case 7:
				return this.parseExprNext(hscript.Expr.EObject([]));
			case 2:
				var id = $e[2];
				var tk2 = this.token();
				this.tokens.add(tk2);
				this.tokens.add(tk);
				switch( (tk2)[1] ) {
				case 14:
					return this.parseExprNext(this.parseObject(0));
				default:
				}
				break;
			case 1:
				var c = $e[2];
				if(this.allowJSON) {
					switch( (c)[1] ) {
					case 2:
						var tk2 = this.token();
						this.tokens.add(tk2);
						this.tokens.add(tk);
						switch( (tk2)[1] ) {
						case 14:
							return this.parseExprNext(this.parseObject(0));
						default:
						}
						break;
					default:
						this.tokens.add(tk);
					}
				} else this.tokens.add(tk);
				break;
			default:
				this.tokens.add(tk);
			}
			var a = new Array();
			while(true) {
				a.push(this.parseFullExpr());
				tk = this.token();
				if(tk == hscript.Token.TBrClose) break;
				this.tokens.add(tk);
			}
			return hscript.Expr.EBlock(a);
		case 3:
			var op = $e[2];
			if(this.unops.exists(op)) return this.makeUnop(op,this.parseExpr());
			return this.unexpected(tk);
		case 11:
			var a = new Array();
			tk = this.token();
			while(tk != hscript.Token.TBkClose) {
				this.tokens.add(tk);
				a.push(this.parseExpr());
				tk = this.token();
				if(tk == hscript.Token.TComma) tk = this.token();
			}
			return this.parseExprNext(hscript.Expr.EArrayDecl(a));
		default:
			return this.unexpected(tk);
		}
	}
	,parseObject: function(p1) {
		var fl = new Array();
		try {
			while(true) {
				var tk = this.token();
				var id = null;
				var $e = (tk);
				switch( $e[1] ) {
				case 2:
					var i = $e[2];
					id = i;
					break;
				case 1:
					var c = $e[2];
					if(!this.allowJSON) this.unexpected(tk);
					var $e = (c);
					switch( $e[1] ) {
					case 2:
						var s = $e[2];
						id = s;
						break;
					default:
						this.unexpected(tk);
					}
					break;
				case 7:
					throw "__break__";
					break;
				default:
					this.unexpected(tk);
				}
				this.ensure(hscript.Token.TDoubleDot);
				fl.push({ name : id, e : this.parseExpr()});
				tk = this.token();
				switch( (tk)[1] ) {
				case 7:
					throw "__break__";
					break;
				case 9:
					break;
				default:
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return this.parseExprNext(hscript.Expr.EObject(fl));
	}
	,parseFullExpr: function() {
		var e = this.parseExpr();
		var tk = this.token();
		if(tk != hscript.Token.TSemicolon && tk != hscript.Token.TEof) {
			if(this.isBlock(e)) this.tokens.add(tk); else this.unexpected(tk);
		}
		return e;
	}
	,isBlock: function(e) {
		return (function($this) {
			var $r;
			var $e = (e);
			switch( $e[1] ) {
			case 4:
			case 21:
				$r = true;
				break;
			case 14:
				var e1 = $e[3];
				$r = $this.isBlock(e1);
				break;
			case 2:
				var e1 = $e[4];
				$r = e1 != null && $this.isBlock(e1);
				break;
			case 9:
				var e2 = $e[4], e1 = $e[3];
				$r = e2 != null?$this.isBlock(e2):$this.isBlock(e1);
				break;
			case 6:
				var e1 = $e[4];
				$r = $this.isBlock(e1);
				break;
			case 7:
				var e1 = $e[4], prefix = $e[3];
				$r = !prefix && $this.isBlock(e1);
				break;
			case 10:
				var e1 = $e[3];
				$r = $this.isBlock(e1);
				break;
			case 11:
				var e1 = $e[4];
				$r = $this.isBlock(e1);
				break;
			case 15:
				var e1 = $e[2];
				$r = e1 != null && $this.isBlock(e1);
				break;
			default:
				$r = false;
			}
			return $r;
		}(this));
	}
	,mk: function(e,pmin,pmax) {
		return e;
	}
	,pmax: function(e) {
		return 0;
	}
	,pmin: function(e) {
		return 0;
	}
	,expr: function(e) {
		return e;
	}
	,ensure: function(tk) {
		var t = this.token();
		if(t != tk) this.unexpected(t);
	}
	,push: function(tk) {
		this.tokens.add(tk);
	}
	,unexpected: function(tk) {
		throw hscript.Error.EUnexpected(this.tokenString(tk));
		return null;
	}
	,parse: function(s) {
		this.tokens = new haxe.FastList();
		this["char"] = -1;
		this.input = s;
		this.ops = new Array();
		this.idents = new Array();
		var _g1 = 0, _g = this.opChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.ops[HxOverrides.cca(this.opChars,i)] = true;
		}
		var _g1 = 0, _g = this.identChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.idents[HxOverrides.cca(this.identChars,i)] = true;
		}
		var a = new Array();
		while(true) {
			var tk = this.token();
			if(tk == hscript.Token.TEof) break;
			this.tokens.add(tk);
			a.push(this.parseFullExpr());
		}
		return a.length == 1?a[0]:hscript.Expr.EBlock(a);
	}
	,parseString: function(s) {
		this.line = 1;
		return this.parse(new haxe.io.StringInput(s));
	}
	,invalidChar: function(c) {
		throw hscript.Error.EInvalidChar(c);
	}
	,error: function(err,pmin,pmax) {
		throw err;
	}
	,tokens: null
	,idents: null
	,ops: null
	,'char': null
	,input: null
	,allowTypes: null
	,allowJSON: null
	,unops: null
	,opRightAssoc: null
	,opPriority: null
	,identChars: null
	,opChars: null
	,line: null
	,__class__: hscript.Parser
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib["eval"] = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var silex = {}
silex.ModelBase = function(hoverChangeEventName,selectionChangeEventName,debugInfo) {
	this.listeners = new List();
	this.hoverChangeEventName = hoverChangeEventName;
	this.selectionChangeEventName = selectionChangeEventName;
	this.debugInfo = debugInfo;
};
$hxClasses["silex.ModelBase"] = silex.ModelBase;
silex.ModelBase.__name__ = ["silex","ModelBase"];
silex.ModelBase.prototype = {
	createEvent: function(eventName,detail) {
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent(eventName,true,true,detail);
		return event;
	}
	,dispatchEvent: function(event,debugInfo) {
		var $it0 = this.listeners.iterator();
		while( $it0.hasNext() ) {
			var el = $it0.next();
			if(el.eventName == event.type) try {
				el.callbackFunction(event);
			} catch( e ) {
				throw "Error when dispatching \"" + el.eventName + "\" event, from " + debugInfo + ", to " + el.debugInfo + ". The error: " + Std.string(e);
			}
		}
	}
	,removeEventListener: function(eventName,callbackFunction) {
		var el = this.getEventListener(callbackFunction,eventName);
		if(el != null) this.listeners.remove(el);
	}
	,addEventListener: function(eventName,callbackFunction,debugInfo) {
		if(this.getEventListener(callbackFunction,eventName) == null) this.listeners.add({ callbackFunction : callbackFunction, eventName : eventName, debugInfo : debugInfo});
	}
	,isSameEventListeners: function(el1,el2) {
		return el1.callbackFunction == el2.callbackFunction && el1.eventName == el2.eventName;
	}
	,getEventListener: function(callbackFunction,eventName) {
		var $it0 = this.listeners.iterator();
		while( $it0.hasNext() ) {
			var el = $it0.next();
			if(el.eventName == eventName && el.callbackFunction == callbackFunction) return el;
		}
		return null;
	}
	,listeners: null
	,refresh: function() {
		this.dispatchEvent(this.createEvent(this.selectionChangeEventName,this.selectedItem),this.debugInfo);
	}
	,setSelectedItemNoEvent: function(item) {
		this.setSelectedItem(item);
		return item;
	}
	,setSelectedItem: function(item) {
		this.selectedItem = item;
		this.dispatchEvent(this.createEvent(this.selectionChangeEventName,item),this.debugInfo);
		return item;
	}
	,setHoveredItem: function(item) {
		this.hoveredItem = item;
		this.dispatchEvent(this.createEvent(this.hoverChangeEventName,item),this.debugInfo);
		return item;
	}
	,selectionChangeEventName: null
	,hoverChangeEventName: null
	,hoveredItem: null
	,selectedItem: null
	,debugInfo: null
	,getClasses: function(viewHtmlDom,brixInstanceId,finalType) {
		var classes = new Array();
		if(viewHtmlDom == null) return classes;
		var className = Type.getClassName(finalType);
		className = HxOverrides.substr(className,className.lastIndexOf(".") + 1,null);
		var nodes = viewHtmlDom.getElementsByClassName(className);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var instances = brix.core.Application.get(brixInstanceId).getAssociatedComponents(nodes[idx],finalType);
			if(instances.length == 1) classes.push(instances.first()); else throw "Error: there should be 1 and only 1 instance of " + Type.getClassName(finalType) + " associated with this node, and there is " + instances.length + " (" + nodes[idx].className + ")";
		}
		return classes;
	}
	,__class__: silex.ModelBase
	,__properties__: {set_selectedItem:"setSelectedItem",set_hoveredItem:"setHoveredItem"}
}
silex.ServiceBase = function(serviceName) {
	this.serviceName = serviceName;
};
$hxClasses["silex.ServiceBase"] = silex.ServiceBase;
silex.ServiceBase.__name__ = ["silex","ServiceBase"];
silex.ServiceBase.prototype = {
	callServerMethod: function(methodName,args,onResult,onError) {
		var connection = haxe.remoting.HttpAsyncConnection.urlConnect(silex.Silex.initialBaseUrl + silex.ServiceBase.GATEWAY_URL);
		connection.setErrorHandler(onError);
		connection.resolve(this.serviceName).resolve(methodName).call(args,onResult);
	}
	,serviceName: null
	,__class__: silex.ServiceBase
}
silex.Silex = function() { }
$hxClasses["silex.Silex"] = silex.Silex;
silex.Silex.__name__ = ["silex","Silex"];
silex.Silex.initialBaseUrl = null;
silex.Silex.main = function() {
	if(haxe.Firebug.detect()) {
		haxe.Firebug.redirectTraces();
		null;
	} else null;
	silex.Silex.initialBaseUrl = brix.util.DomTools.getBaseUrl();
	silex.Silex.startSilexInit();
}
silex.Silex.startSilexInit = function() {
	var fileService = new silex.file.client.FileService();
	fileService.checkInstall(silex.Silex.onCheckInstall,silex.Silex.onCheckInstallError);
}
silex.Silex.onCheckInstall = function(installStatus) {
	if(installStatus.redirect != null) js.Lib.window.location = installStatus.redirect; else silex.Silex.init();
}
silex.Silex.onCheckInstallError = function(error) {
	null;
}
silex.Silex.init = function() {
	if(js.Lib.document.body == null) js.Lib.window.onload = silex.Silex.onLoad; else silex.Silex.doInit();
}
silex.Silex.onLoad = function(e) {
	silex.Silex.doInit();
}
silex.Silex.doInit = function() {
	var application = brix.core.Application.createApplication();
	application.initDom();
	if(js.Lib.window.location.hash != "" && brix.util.DomTools.getMeta("useDeeplink") != "false") {
		var initialPageName = HxOverrides.substr(js.Lib.window.location.hash,1,null);
		brix.util.DomTools.setMeta("initialPageName",initialPageName);
	}
	application.initComponents();
	application.attachBody();
	js.Lib.document.body.style.visibility = "visible";
}
silex.component = {}
silex.component.ComponentModel = function() {
	silex.ModelBase.call(this,"onComponentHoverChange","onComponentSelectionChange","ComponentModel class");
	silex.interpreter.Interpreter.getInstance().expose("ComponentModel",silex.component.ComponentModel);
};
$hxClasses["silex.component.ComponentModel"] = silex.component.ComponentModel;
silex.component.ComponentModel.__name__ = ["silex","component","ComponentModel"];
silex.component.ComponentModel.instance = null;
silex.component.ComponentModel.getInstance = function() {
	if(silex.component.ComponentModel.instance == null) silex.component.ComponentModel.instance = new silex.component.ComponentModel();
	return silex.component.ComponentModel.instance;
}
silex.component.ComponentModel.__super__ = silex.ModelBase;
silex.component.ComponentModel.prototype = $extend(silex.ModelBase.prototype,{
	updateLink: function(htmlDom,oldLink,newLink,newLinkText) {
		if(newLinkText == null) newLinkText = "";
		var propertyModel = silex.property.PropertyModel.getInstance();
		if(propertyModel.getAttribute(htmlDom,"href") == oldLink) propertyModel.setAttribute(htmlDom,"href",newLink);
		if(propertyModel.getAttribute(htmlDom,"data-href") == oldLink) propertyModel.setAttribute(htmlDom,"data-href",newLink);
		if(newLinkText != "") {
			htmlDom.innerHTML = newLinkText;
			var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(htmlDom);
			modelHtmlDom.innerHTML = newLinkText;
		}
	}
	,resetLinkToPage: function(htmlDom) {
		var propertyModel = silex.property.PropertyModel.getInstance();
		propertyModel.removeAttribute(htmlDom,"data-href");
		propertyModel.removeAttribute(htmlDom,"href");
		propertyModel.removeClass(htmlDom,"SilexLink");
	}
	,makeLinkToPage: function(htmlDom,pageName) {
		var fileModel = silex.file.FileModel.getInstance();
		var propertyModel = silex.property.PropertyModel.getInstance();
		brix.util.DomTools.addClass(htmlDom,"SilexLink");
		silex.property.PropertyModel.getInstance().addClass(htmlDom,"SilexLink");
		propertyModel.setAttribute(htmlDom,"data-href",pageName);
		var linkToPage = new silex.ui.link.SilexLink(htmlDom,fileModel.application.id);
		linkToPage.init();
	}
	,removeComponent: function(element) {
		var fileModel = silex.file.FileModel.getInstance();
		var viewHtmlDom = element;
		var modelHtmlDom = fileModel.getModelFromView(element);
		fileModel.application.removeAllAssociatedComponent(viewHtmlDom);
		viewHtmlDom.parentNode.removeChild(viewHtmlDom);
		modelHtmlDom.parentNode.removeChild(modelHtmlDom);
		if(this.selectedItem == viewHtmlDom) this.setSelectedItem(null);
		this.dispatchEvent(this.createEvent("onComponentListChange"),"ComponentModel class");
	}
	,addComponent: function(nodeName,layer,position) {
		if(position == null) position = 0;
		var fileModel = silex.file.FileModel.getInstance();
		var viewHtmlDom = layer.rootElement;
		var modelHtmlDom = fileModel.getModelFromView(layer.rootElement);
		var newNode = js.Lib.document.createElement(nodeName);
		if(position > viewHtmlDom.childNodes.length - 1) viewHtmlDom.appendChild(newNode); else viewHtmlDom.insertBefore(newNode,viewHtmlDom.childNodes[position]);
		fileModel.prepareForEdit(newNode);
		var cloneNode = newNode.cloneNode(true);
		if(position > modelHtmlDom.childNodes.length - 1) modelHtmlDom.appendChild(cloneNode); else modelHtmlDom.insertBefore(cloneNode,modelHtmlDom.childNodes[position]);
		this.dispatchEvent(this.createEvent("onComponentListChange",newNode),"ComponentModel class");
		return newNode;
	}
	,setSelectedItem: function(item) {
		if(item != null) {
			var layer = silex.file.FileModel.getInstance().application.getAssociatedComponents(item.parentNode,brix.component.navigation.Layer).first();
			silex.layer.LayerModel.getInstance().setSelectedItem(layer);
		}
		return silex.ModelBase.prototype.setSelectedItem.call(this,item);
	}
	,__class__: silex.component.ComponentModel
});
silex.file = {}
silex.file.FileModel = function() {
	silex.ModelBase.call(this,null,null,"FileModel class");
	this.currentData = { modelHtmlDom : null, headHtmlDom : null, viewHtmlDom : null, rawHtml : "", name : "", isLoaded : false};
	this.initialDocumentTitle = "";
	var nodes = js.Lib.document.getElementsByTagName("title");
	if(nodes.length > 0) this.initialDocumentTitle = nodes[0].innerHTML;
	this.fileService = new silex.file.client.FileService();
	silex.interpreter.Interpreter.getInstance().expose("FileModel",silex.file.FileModel);
};
$hxClasses["silex.file.FileModel"] = silex.file.FileModel;
silex.file.FileModel.__name__ = ["silex","file","FileModel"];
silex.file.FileModel.instance = null;
silex.file.FileModel.getInstance = function() {
	if(silex.file.FileModel.instance == null) silex.file.FileModel.instance = new silex.file.FileModel();
	return silex.file.FileModel.instance;
}
silex.file.FileModel.__super__ = silex.ModelBase;
silex.file.FileModel.prototype = $extend(silex.ModelBase.prototype,{
	onSaveSuccess: function() {
		this.dispatchEvent(this.createEvent("onFileSaveSuccess"),this.debugInfo);
		brix.component.interaction.NotificationManager.notifySuccess("File saved",this.currentData.name + " has been saved successfully.",this.currentData.viewHtmlDom);
		this.updatePageTitle();
	}
	,onSaveError: function(msg) {
		this.dispatchEvent(this.createEvent("onFileSaveError"),this.debugInfo);
		brix.component.interaction.NotificationManager.notifyError("Error","An error occured while saving " + this.currentData.name + " (" + msg + ")",this.currentData.viewHtmlDom);
		throw "An error occured while saving the file (" + msg + ")";
	}
	,prepareForSave: function(modelDom) {
		if(modelDom.nodeType != 1) return;
		modelDom.removeAttribute("data-silex-component-id");
		modelDom.removeAttribute("data-silex-layer-id");
		if(modelDom.getAttribute("data-group-id") == "silex-main-group") modelDom.removeAttribute("data-group-id");
		brix.util.DomTools.removeClass(modelDom,"silex-view");
		var _g1 = 0, _g = modelDom.childNodes.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var modelChild = modelDom.childNodes[idx];
			this.prepareForSave(modelChild);
		}
	}
	,save: function(tempName) {
		if(this.currentData.isLoaded == false) {
			brix.component.interaction.NotificationManager.notifyError("Error","I can not save the file because no file is loaded.",this.currentData.viewHtmlDom);
			throw "Error: can not save the file because no file is loaded.";
		}
		if(tempName == null) {
			if(this.currentData.name == "creation-template.html") {
				var newName = js.Lib.window.prompt("New name for your file?","your-file-" + Math.round(Math.random() * 100) + ".html");
				newName = silex.util.SilexTools.cleanupName(newName);
				if(newName != null && newName != "") this.currentData.name = newName;
			}
			tempName = this.currentData.name;
		} else tempName = silex.util.SilexTools.cleanupName(tempName);
		this.dispatchEvent(this.createEvent("onFileSaveStart"),this.debugInfo);
		var tempModelHead = this.currentData.headHtmlDom.cloneNode(true);
		var tempModelBody = this.currentData.modelHtmlDom.cloneNode(true);
		this.prepareForSave(tempModelBody);
		this.currentData.rawHtml = "<HTML>\n\t\t<HEAD>\n\t\t\t" + tempModelHead.innerHTML + "\n\t\t</HEAD>\n\t\t<BODY class=\"silex-view\">\n\t\t\t" + tempModelBody.innerHTML + "\n\t\t</BODY>\n\t</HTML>\n\t\t";
		this.fileService.save(tempName,this.currentData.rawHtml,$bind(this,this.onSaveSuccess),$bind(this,this.onSaveError));
	}
	,saveAs: function(newName) {
		if(this.currentData.isLoaded == false) {
			brix.component.interaction.NotificationManager.notifyError("Error","I can not save the file because no file is loaded.",this.currentData.viewHtmlDom);
			throw "Error: can not save the file because no file is loaded.";
		}
		this.currentData.name = silex.util.SilexTools.cleanupName(newName);
		this.changeBaseTag(newName);
		this.save();
	}
	,saveACopy: function(newName) {
		if(this.currentData.isLoaded == false) {
			brix.component.interaction.NotificationManager.notifyError("Error","I can not save the file because no file is loaded.",this.currentData.viewHtmlDom);
			throw "Error: can not save the file because no file is loaded.";
		}
		this.save(newName);
	}
	,onDeleteSuccess: function() {
		this.create();
	}
	,trash: function(name) {
		this.fileService.trash(name,$bind(this,this.onDeleteSuccess),$bind(this,this.onSaveError));
	}
	,create: function() {
		this.load("creation-template.html");
	}
	,onError: function(msg) {
		this.dispatchEvent(this.createEvent("onFileError"),this.debugInfo);
		brix.component.interaction.NotificationManager.notifyError("Error","An error occured while loading the file \"" + this.currentData.name + "\" (" + msg + ")",this.currentData.viewHtmlDom);
		null;
	}
	,initBrixApplication: function() {
		this.application = brix.core.Application.createApplication();
		this.application.initDom(this.currentData.viewHtmlDom);
		this.application.attachBody(this.currentData.viewHtmlDom);
		this.application.initComponents();
		var initialPageName = brix.util.DomTools.getMeta("initialPageName",null,this.currentData.headHtmlDom);
		if(initialPageName != null) {
			var page = brix.component.navigation.Page.getPageByName(initialPageName,this.application.id,this.currentData.viewHtmlDom);
			if(page != null) silex.page.PageModel.getInstance().setSelectedItem(page); else null;
		} else null;
	}
	,generateNewId: function() {
		return silex.file.FileModel.nextId++ + "";
	}
	,prepareForEditVanilaHtml: function(modelDom) {
		if(modelDom.nodeType != 1) return;
		if(this.application == null) return;
		if(modelDom.parentNode == null) {
		} else if(this.application.getAssociatedComponents(modelDom,brix.component.ui.DisplayObject).length == 0) {
			if(modelDom.nodeName.toLowerCase() == "div") modelDom.setAttribute("data-silex-layer-id",this.generateNewId()); else {
				var nodeName = modelDom.nodeName.toLowerCase();
				if(nodeName == "img" || nodeName == "button" || nodeName == "video" || nodeName == "audio" || nodeName == "input") modelDom.setAttribute("data-silex-component-id",this.generateNewId());
			}
		}
		var _g1 = 0, _g = modelDom.childNodes.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var modelChild = modelDom.childNodes[idx];
			this.prepareForEditVanilaHtml(modelChild);
		}
	}
	,prepareForEdit: function(modelDom) {
		if(modelDom.nodeType != 1) return;
		if(modelDom.parentNode == null) this.fixDomRoot(modelDom); else if(brix.util.DomTools.hasClass(modelDom.parentNode,"Layer")) {
			modelDom.setAttribute("data-silex-component-id",this.generateNewId());
			if(brix.util.DomTools.hasClass(modelDom,"Layer")) throw "Error: the parent node of this layer is a layer";
		} else if(brix.util.DomTools.hasClass(modelDom,"Layer")) modelDom.setAttribute("data-silex-layer-id",this.generateNewId()); else if(brix.util.DomTools.hasClass(modelDom,"Page")) {
		}
		var _g1 = 0, _g = modelDom.childNodes.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var modelChild = modelDom.childNodes[idx];
			this.prepareForEdit(modelChild);
		}
	}
	,fixDomRoot: function(modelDom) {
		brix.util.DomTools.addClass(modelDom,"silex-main-group");
	}
	,initViewHtmlDom: function() {
		this.currentData.viewHtmlDom = this.currentData.modelHtmlDom.cloneNode(true);
		this.currentData.viewHtmlDom.className = "silex-view";
		this.currentData.viewHtmlDom.style.visibility = "visible";
	}
	,updatePageTitle: function() {
		var title = this.initialDocumentTitle;
		if(this.currentData.name != "") title = title + " (" + this.currentData.name + ")";
		js.Lib.document.title = title;
	}
	,onData: function(content) {
		this.currentData.rawHtml = content;
		this.currentData.isLoaded = true;
		this.currentData.modelHtmlDom = js.Lib.document.createElement("div");
		this.currentData.headHtmlDom = js.Lib.document.createElement("div");
		var lowerCaseHtml = this.currentData.rawHtml.toLowerCase();
		var headOpenIdx = lowerCaseHtml.indexOf("<head>");
		if(headOpenIdx == -1) headOpenIdx = lowerCaseHtml.indexOf("<head ");
		var headCloseIdx = lowerCaseHtml.indexOf("</head>");
		var bodyOpenIdx = lowerCaseHtml.indexOf("<body>");
		if(bodyOpenIdx == -1) bodyOpenIdx = lowerCaseHtml.indexOf("<body ");
		var bodyCloseIdx = lowerCaseHtml.indexOf("</body>");
		if(headOpenIdx > -1 && headCloseIdx > -1) {
			var closingTagIdx = lowerCaseHtml.indexOf(">",headOpenIdx);
			this.currentData.headHtmlDom.innerHTML = this.currentData.rawHtml.substring(closingTagIdx + 1,headCloseIdx);
		}
		if(bodyOpenIdx > -1 && bodyCloseIdx > -1) {
			var closingTagIdx = lowerCaseHtml.indexOf(">",bodyOpenIdx);
			this.currentData.modelHtmlDom.innerHTML = this.currentData.rawHtml.substring(closingTagIdx + 1,bodyCloseIdx);
		}
		this.prepareForEdit(this.currentData.modelHtmlDom);
		this.prepareForEditVanilaHtml(this.currentData.modelHtmlDom);
		this.initViewHtmlDom();
		this.initBrixApplication();
		this.dispatchEvent(this.createEvent("onLoadSuccess"),this.debugInfo);
		this.updatePageTitle();
		this.refresh();
		silex.page.PageModel.getInstance().refresh();
		silex.layer.LayerModel.getInstance().refresh();
		silex.component.ComponentModel.getInstance().refresh();
		silex.property.PropertyModel.getInstance().refresh();
	}
	,load: function(name) {
		this.currentData.name = name;
		this.changeBaseTag(name);
		var pageModel = silex.page.PageModel.getInstance();
		pageModel.setHoveredItem(null);
		pageModel.setSelectedItem(null);
		this.dispatchEvent(this.createEvent("onLoadStart"),this.debugInfo);
		this.fileService.load(this.currentData.name,$bind(this,this.onData),$bind(this,this.onError));
	}
	,changeBaseTag: function(name) {
		var idx = this.currentData.name.lastIndexOf("/");
		if(idx > 0) brix.util.DomTools.setBaseTag(HxOverrides.substr(name,0,idx + 1)); else brix.util.DomTools.removeBaseTag();
	}
	,getModelFromView: function(viewHtmlDom) {
		if(viewHtmlDom == null) return null;
		try {
			if(brix.util.DomTools.hasClass(viewHtmlDom,"silex-view")) return this.currentData.modelHtmlDom;
			var results = null;
			var id = viewHtmlDom.getAttribute("data-silex-component-id");
			if(id != null) results = brix.util.DomTools.getElementsByAttribute(this.currentData.modelHtmlDom,"data-silex-component-id",id); else {
				id = viewHtmlDom.getAttribute("data-silex-layer-id");
				if(id != null) results = brix.util.DomTools.getElementsByAttribute(this.currentData.modelHtmlDom,"data-silex-layer-id",id); else throw "Error: the selected layer has not a Silex ID. It should have the ID in the " + "data-silex-layer-id" + " or " + "data-silex-component-id" + " attributes";
			}
			if(results == null || results.length != 1) throw "Error: 1 and only 1 component or layer is expected to have ID \"" + id + "\" (" + Std.string(results) + ").";
			return results[0];
		} catch( e ) {
			throw "Error, could not retrieve the model for element " + Std.string(viewHtmlDom) + " (" + Std.string(e) + ").";
		}
		return null;
	}
	,initialDocumentTitle: null
	,application: null
	,currentData: null
	,fileService: null
	,__class__: silex.file.FileModel
});
silex.file.client = {}
silex.file.client.FileService = function() {
	silex.ServiceBase.call(this,silex.file.client.FileService.SERVICE_NAME);
};
$hxClasses["silex.file.client.FileService"] = silex.file.client.FileService;
silex.file.client.FileService.__name__ = ["silex","file","client","FileService"];
silex.file.client.FileService.__super__ = silex.ServiceBase;
silex.file.client.FileService.prototype = $extend(silex.ServiceBase.prototype,{
	importFile: function(url,name,onResult,onError) {
		this.callServerMethod("importFile",[url,name],onResult,onError);
	}
	,save: function(name,content,onResult,onError) {
		this.callServerMethod("save",[name,content],onResult,onError);
	}
	,rename: function(src,dst,onResult,onError) {
		this.callServerMethod("rename",[src,dst],onResult,onError);
	}
	,duplicate: function(src,dst,onResult,onError) {
		this.callServerMethod("duplicate",[src,dst],onResult,onError);
	}
	,trash: function(name,onResult,onError) {
		this.callServerMethod("trash",[name],onResult,onError);
	}
	,load: function(name,onResult,onError) {
		this.callServerMethod("load",[name],onResult,onError);
	}
	,checkInstall: function(onResult,onError) {
		this.callServerMethod("checkInstall",[],onResult,onError);
	}
	,__class__: silex.file.client.FileService
});
silex.file.kcfinder = {}
silex.file.kcfinder.FileBrowser = function() { }
$hxClasses["silex.file.kcfinder.FileBrowser"] = silex.file.kcfinder.FileBrowser;
silex.file.kcfinder.FileBrowser.__name__ = ["silex","file","kcfinder","FileBrowser"];
silex.file.kcfinder.FileBrowser.onValidate = null;
silex.file.kcfinder.FileBrowser.onValidateMultiple = null;
silex.file.kcfinder.FileBrowser.message = null;
silex.file.kcfinder.FileBrowser.intialPath = null;
silex.file.kcfinder.FileBrowser.manageFiles = function(brixInstanceId,msg,path) {
	if(path == null) path = "./";
	silex.file.kcfinder.FileBrowser.selectFile(null,brixInstanceId,msg,path);
}
silex.file.kcfinder.FileBrowser.downloadFolder = function(path) {
	if(path == null) path = "";
	silex.file.kcfinder.FileBrowser.openPageWithPostData("downloadDir",path);
}
silex.file.kcfinder.FileBrowser.downloadFile = function(fileUrl) {
	silex.file.kcfinder.FileBrowser.openPageWithPostData("download",fileUrl);
}
silex.file.kcfinder.FileBrowser.openPageWithPostData = function(url,data) {
	var form = js.Lib.document.createElement("form");
	form.setAttribute("target","_blank");
	form.setAttribute("method","post");
	form.setAttribute("action","../libs/kcfinder/browse.php?type=files&lng=en&act=" + url);
	var hiddenField = js.Lib.document.createElement("input");
	hiddenField.setAttribute("type","hidden");
	hiddenField.setAttribute("name","dir");
	hiddenField.setAttribute("value","../../files/" + data);
	form.appendChild(hiddenField);
	js.Lib.document.body.appendChild(form);
	form.submit();
	js.Lib.document.body.removeChild(form);
	form.removeChild(hiddenField);
}
silex.file.kcfinder.FileBrowser.selectMultipleFiles = function(userCallback,brixInstanceId,msg,path) {
	if(path == null) path = "files/";
	if(msg == null) msg = "Double click to select one or more files!";
	silex.file.kcfinder.FileBrowser.intialPath = path;
	silex.file.kcfinder.FileBrowser.onValidateMultiple = userCallback;
	silex.file.kcfinder.FileBrowser.message = msg;
	silex.file.kcfinder.FileBrowser.expectMultipleFiles = true;
	brix.component.navigation.Page.openPage("file-browser-dialog",true,null,null,brixInstanceId);
}
silex.file.kcfinder.FileBrowser.selectFile = function(userCallback,brixInstanceId,msg,path) {
	if(path == null) path = "files/";
	if(msg == null) msg = "Double click to select a file!";
	silex.file.kcfinder.FileBrowser.intialPath = path;
	silex.file.kcfinder.FileBrowser.onValidate = userCallback;
	silex.file.kcfinder.FileBrowser.message = msg;
	silex.file.kcfinder.FileBrowser.expectMultipleFiles = false;
	brix.component.navigation.Page.openPage("file-browser-dialog",true,null,null,brixInstanceId);
}
silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser = function(url) {
	var idx = url.indexOf("://");
	if(idx == -1) {
		var pubUrl = "files/";
		var idxPubFolder = url.indexOf(pubUrl);
		if(idxPubFolder >= 0) url = HxOverrides.substr(url,idxPubFolder + pubUrl.length,null);
	} else url = brix.util.DomTools.abs2rel(url);
	return url;
}
silex.interpreter = {}
silex.interpreter.Interpreter = function() {
	this.context = new Hash();
};
$hxClasses["silex.interpreter.Interpreter"] = silex.interpreter.Interpreter;
silex.interpreter.Interpreter.__name__ = ["silex","interpreter","Interpreter"];
silex.interpreter.Interpreter.instance = null;
silex.interpreter.Interpreter.getInstance = function() {
	if(silex.interpreter.Interpreter.instance == null) silex.interpreter.Interpreter.instance = new silex.interpreter.Interpreter();
	return silex.interpreter.Interpreter.instance;
}
silex.interpreter.Interpreter.prototype = {
	execScriptTags: function(rootElement) {
		var scriptTags = brix.util.DomTools.getElementsByAttribute(rootElement,"type","text/hscript");
		var _g1 = 0, _g = scriptTags.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var script = scriptTags[idx].innerHTML;
			try {
				this.exec(script);
			} catch( e ) {
				throw "Error while executing the script in the file. The error: " + Std.string(e);
				brix.component.interaction.NotificationManager.notifyError("Error","An error occured while executing the script. The error: " + Std.string(e));
			}
		}
	}
	,expose: function(key,obj) {
		this.context.set(key,obj);
	}
	,exec: function(script) {
		var parser = new hscript.Parser();
		var program = parser.parseString(script);
		var interp = new hscript.Interp();
		var _g = 0, _g1 = Reflect.fields({ Lib : js.Lib, Math : Math, Timer : haxe.Timer, StringTools : StringTools, DomTools : brix.util.DomTools, Application : brix.core.Application, Page : brix.component.navigation.Page, Layer : brix.component.navigation.Layer});
		while(_g < _g1.length) {
			var varName = _g1[_g];
			++_g;
			interp.variables.set(varName,Reflect.getProperty({ Lib : js.Lib, Math : Math, Timer : haxe.Timer, StringTools : StringTools, DomTools : brix.util.DomTools, Application : brix.core.Application, Page : brix.component.navigation.Page, Layer : brix.component.navigation.Layer},varName));
		}
		if(this.context != null) {
			var $it0 = this.context.keys();
			while( $it0.hasNext() ) {
				var varName = $it0.next();
				interp.variables.set(varName,this.context.get(varName));
			}
		}
		var res = interp.execute(program);
		return res;
	}
	,context: null
	,__class__: silex.interpreter.Interpreter
}
silex.layer = {}
silex.layer.LayerModel = function() {
	silex.ModelBase.call(this,"onLayerHoverChange","onLayerSelectionChange","LayerModel class");
	silex.interpreter.Interpreter.getInstance().expose("LayerModel",silex.layer.LayerModel);
};
$hxClasses["silex.layer.LayerModel"] = silex.layer.LayerModel;
silex.layer.LayerModel.__name__ = ["silex","layer","LayerModel"];
silex.layer.LayerModel.instance = null;
silex.layer.LayerModel.getInstance = function() {
	if(silex.layer.LayerModel.instance == null) silex.layer.LayerModel.instance = new silex.layer.LayerModel();
	return silex.layer.LayerModel.instance;
}
silex.layer.LayerModel.__super__ = silex.ModelBase;
silex.layer.LayerModel.prototype = $extend(silex.ModelBase.prototype,{
	addRequiredMasters: function(pageName,addEmptyContainer) {
		if(addEmptyContainer == null) addEmptyContainer = true;
		var fileModel = silex.file.FileModel.getInstance();
		var sideBarNode = brix.util.DomTools.getSingleElement(fileModel.currentData.viewHtmlDom,"side-bar",true);
		var nextPosition;
		if(sideBarNode.nextSibling != null) nextPosition = brix.util.DomTools.getElementIndex(sideBarNode.nextSibling); else nextPosition = brix.util.DomTools.getElementIndex(sideBarNode) + 1;
		this.addLayer(pageName,"container1",nextPosition);
		var _g1 = 0, _g = ["header","footer","nav","side-bar"].length;
		while(_g1 < _g) {
			var idx = _g1++;
			var masterName = ["header","footer","nav","side-bar"][idx];
			var masterNode = brix.util.DomTools.getSingleElement(fileModel.currentData.viewHtmlDom,masterName,true);
			var masterInstance = fileModel.application.getAssociatedComponents(masterNode,brix.component.navigation.Layer).first();
			this.addMaster(masterInstance,pageName);
		}
	}
	,removeLayer: function(layer,pageName) {
		var fileModel = silex.file.FileModel.getInstance();
		var viewHtmlDom = layer.rootElement;
		var modelHtmlDom = fileModel.getModelFromView(layer.rootElement);
		brix.util.DomTools.removeClass(viewHtmlDom,pageName);
		brix.util.DomTools.removeClass(modelHtmlDom,pageName);
		var allPageNodes = brix.component.navigation.Page.getPageNodes(fileModel.application.id,fileModel.currentData.viewHtmlDom);
		var found = false;
		var _g1 = 0, _g = allPageNodes.length;
		while(_g1 < _g) {
			var idx = _g1++;
			if(brix.util.DomTools.hasClass(viewHtmlDom,allPageNodes[idx].getAttribute("name"))) {
				found = true;
				break;
			}
		}
		if(layer.rootElement.getAttribute("data-master") == null && found == false) {
			fileModel.application.removeAllAssociatedComponent(viewHtmlDom);
			viewHtmlDom.parentNode.removeChild(viewHtmlDom);
			modelHtmlDom.parentNode.removeChild(modelHtmlDom);
		} else layer.hide(null,null,true);
		if(this.selectedItem == layer) this.setSelectedItem(null);
		this.dispatchEvent(this.createEvent("onLayerListChange"),"LayerModel class");
	}
	,addLayer: function(pageName,layerName,position) {
		if(position == null) position = 0;
		var fileModel = silex.file.FileModel.getInstance();
		var viewHtmlDom = fileModel.currentData.viewHtmlDom;
		var modelHtmlDom = fileModel.currentData.modelHtmlDom;
		var newNode = js.Lib.document.createElement("div");
		newNode.className = "Layer " + pageName + " " + "container";
		newNode.setAttribute("data-silex-name",layerName);
		if(position > viewHtmlDom.childNodes.length - 1) viewHtmlDom.appendChild(newNode); else viewHtmlDom.insertBefore(newNode,viewHtmlDom.childNodes[position]);
		fileModel.prepareForEdit(newNode);
		if(position > modelHtmlDom.childNodes.length - 1) modelHtmlDom.appendChild(newNode.cloneNode(true)); else modelHtmlDom.insertBefore(newNode.cloneNode(true),modelHtmlDom.childNodes[position]);
		var newLayer = new brix.component.navigation.Layer(newNode,fileModel.application.id);
		newLayer.init();
		newLayer.show();
		var textElement = silex.component.ComponentModel.getInstance().addComponent("div",newLayer);
		silex.property.PropertyModel.getInstance().setAttribute(textElement,"data-silex-name","New text field");
		silex.property.PropertyModel.getInstance().setProperty(textElement,"innerHTML","<p>Insert text here.</p>");
		this.dispatchEvent(this.createEvent("onLayerListChange",newLayer),"LayerModel class");
		return newLayer;
	}
	,addMaster: function(layer,pageName) {
		brix.util.DomTools.addClass(layer.rootElement,pageName);
		brix.util.DomTools.addClass(silex.file.FileModel.getInstance().getModelFromView(layer.rootElement),pageName);
		layer.show();
		this.dispatchEvent(this.createEvent("onLayerListChange",layer),"LayerModel class");
	}
	,setSelectedItem: function(item) {
		var model = silex.component.ComponentModel.getInstance();
		model.setSelectedItem(null);
		model.setHoveredItem(null);
		return silex.ModelBase.prototype.setSelectedItem.call(this,item);
	}
	,__class__: silex.layer.LayerModel
});
silex.page = {}
silex.page.PageModel = function() {
	silex.ModelBase.call(this,"onPageHoverChange","onPageSelectionChange","PageModel class");
	silex.interpreter.Interpreter.getInstance().expose("PageModel",silex.page.PageModel);
};
$hxClasses["silex.page.PageModel"] = silex.page.PageModel;
silex.page.PageModel.__name__ = ["silex","page","PageModel"];
silex.page.PageModel.instance = null;
silex.page.PageModel.getInstance = function() {
	if(silex.page.PageModel.instance == null) silex.page.PageModel.instance = new silex.page.PageModel();
	return silex.page.PageModel.instance;
}
silex.page.PageModel.__super__ = silex.ModelBase;
silex.page.PageModel.prototype = $extend(silex.ModelBase.prototype,{
	renamePage: function(page,newName) {
		var fileModel = silex.file.FileModel.getInstance();
		var className = silex.util.SilexTools.cleanupName(newName);
		var viewHtmlDom = fileModel.currentData.viewHtmlDom;
		var modelHtmlDom = fileModel.currentData.modelHtmlDom;
		var headHtmlDom = fileModel.currentData.headHtmlDom;
		var viewNodes = brix.component.navigation.Layer.getLayerNodes(page.name,fileModel.application.id,viewHtmlDom);
		var modelNodes = brix.component.navigation.Layer.getLayerNodes(page.name,fileModel.application.id,modelHtmlDom);
		var _g1 = 0, _g = viewNodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = viewNodes[0];
			brix.util.DomTools.removeClass(layerNode,page.name);
			brix.util.DomTools.addClass(layerNode,className);
		}
		var _g1 = 0, _g = modelNodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = modelNodes[0];
			brix.util.DomTools.removeClass(layerNode,page.name);
			brix.util.DomTools.addClass(layerNode,className);
		}
		var initialPageName = brix.util.DomTools.getMeta("initialPageName",null,headHtmlDom);
		if(initialPageName == page.name) brix.util.DomTools.setMeta("initialPageName",className,null,headHtmlDom);
		var links = fileModel.application.getComponents(brix.component.navigation.link.LinkBase);
		var $it0 = links.iterator();
		while( $it0.hasNext() ) {
			var link = $it0.next();
			if(link.linkName == page.name) {
				var linkText = "";
				if(silex.util.SilexTools.cleanupName(link.rootElement.innerHTML) == page.name) linkText = newName;
				silex.component.ComponentModel.getInstance().updateLink(link.rootElement,page.name,className,linkText);
				link.linkName = className;
			}
		}
		var viewPageNode = brix.util.DomTools.getElementsByAttribute(viewHtmlDom,"name",page.name)[0];
		var modelPageNode = brix.util.DomTools.getElementsByAttribute(modelHtmlDom,"name",page.name)[0];
		viewPageNode.setAttribute("name",className);
		modelPageNode.setAttribute("name",className);
		page.setPageName(className);
		this.refresh();
	}
	,removePage: function(page) {
		var fileModel = silex.file.FileModel.getInstance();
		var viewHtmlDom = fileModel.currentData.viewHtmlDom;
		var modelHtmlDom = fileModel.currentData.modelHtmlDom;
		var navBarNode = brix.util.DomTools.getSingleElement(fileModel.currentData.viewHtmlDom,"nav",true);
		var linkNodes = navBarNode.getElementsByClassName("SilexLink");
		var _g1 = 0, _g = linkNodes.length;
		while(_g1 < _g) {
			var nodeIdx = _g1++;
			var node = linkNodes[nodeIdx];
			if(node != null && (node.getAttribute("data-href") == page.name || node.getAttribute("href") == page.name)) silex.component.ComponentModel.getInstance().removeComponent(node);
		}
		var nodes = brix.component.navigation.Layer.getLayerNodes(page.name,fileModel.application.id,viewHtmlDom);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[0];
			var layerInstance = fileModel.application.getAssociatedComponents(layerNode,brix.component.navigation.Layer).first();
			silex.layer.LayerModel.getInstance().removeLayer(layerInstance,page.name);
		}
		var pages = brix.component.navigation.Page.getPageNodes(fileModel.application.id,modelHtmlDom);
		var _g1 = 0, _g = pages.length;
		while(_g1 < _g) {
			var pageIdx = _g1++;
			if(pages[pageIdx].getAttribute("name") == page.name) {
				pages[pageIdx].parentNode.removeChild(pages[pageIdx]);
				break;
			}
		}
		fileModel.application.removeAllAssociatedComponent(page.rootElement);
		page.rootElement.parentNode.removeChild(page.rootElement);
		if(this.selectedItem == page) this.setSelectedItem(null);
		var initialPageName = brix.util.DomTools.getMeta("initialPageName",null,fileModel.currentData.headHtmlDom);
		brix.component.navigation.Page.getPageByName(initialPageName,fileModel.application.id,viewHtmlDom).open(null,null,true,true);
		this.dispatchEvent(this.createEvent("onPageListChange"),"PageModel class");
	}
	,getNewName: function() {
		return "New Page Name " + Math.round(Math.random() * 999999);
	}
	,addPage: function(name) {
		if(name == null) name = "";
		if(name == "") name = this.getNewName();
		var className = silex.util.SilexTools.cleanupName(name);
		var fileModel = silex.file.FileModel.getInstance();
		var viewHtmlDom = fileModel.currentData.viewHtmlDom;
		var modelHtmlDom = fileModel.currentData.modelHtmlDom;
		var newNode = js.Lib.document.createElement("a");
		newNode.className = "Page";
		newNode.setAttribute("name",className);
		newNode.innerHTML = name;
		modelHtmlDom.appendChild(newNode.cloneNode(true));
		viewHtmlDom.appendChild(newNode);
		fileModel.prepareForEdit(newNode);
		var newPage = new brix.component.navigation.Page(newNode,fileModel.application.id);
		newPage.init();
		silex.layer.LayerModel.getInstance().addRequiredMasters(className,true);
		var navBarNode = brix.util.DomTools.getSingleElement(fileModel.currentData.viewHtmlDom,"nav",true);
		var layerInstance = fileModel.application.getAssociatedComponents(navBarNode,brix.component.navigation.Layer).first();
		var textElement = silex.component.ComponentModel.getInstance().addComponent("div",layerInstance,navBarNode.childNodes.length);
		silex.property.PropertyModel.getInstance().setAttribute(textElement,"title","Link to " + name);
		silex.property.PropertyModel.getInstance().setProperty(textElement,"innerHTML",name);
		silex.component.ComponentModel.getInstance().makeLinkToPage(textElement,className);
		newPage.open(null,null,true,true);
		this.setSelectedItem(newPage);
		this.dispatchEvent(this.createEvent("onPageListChange",newPage),"PageModel class");
	}
	,setSelectedItem: function(item) {
		var model = silex.layer.LayerModel.getInstance();
		model.setSelectedItem(null);
		model.setHoveredItem(null);
		return silex.ModelBase.prototype.setSelectedItem.call(this,item);
	}
	,__class__: silex.page.PageModel
});
silex.property = {}
silex.property.PropertyModel = function() {
	silex.ModelBase.call(this,null,null,"PropertyModel class");
	silex.interpreter.Interpreter.getInstance().expose("PropertyModel",silex.property.PropertyModel);
};
$hxClasses["silex.property.PropertyModel"] = silex.property.PropertyModel;
silex.property.PropertyModel.__name__ = ["silex","property","PropertyModel"];
silex.property.PropertyModel.instance = null;
silex.property.PropertyModel.getInstance = function() {
	if(silex.property.PropertyModel.instance == null) silex.property.PropertyModel.instance = new silex.property.PropertyModel();
	return silex.property.PropertyModel.instance;
}
silex.property.PropertyModel.__super__ = silex.ModelBase;
silex.property.PropertyModel.prototype = $extend(silex.ModelBase.prototype,{
	removeClass: function(viewHtmlDom,className) {
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			brix.util.DomTools.removeClass(viewHtmlDom,className);
			brix.util.DomTools.removeClass(modelHtmlDom,className);
		} catch( e ) {
			throw "Error: could not remove css class " + className + " or there was an error (" + Std.string(e) + ")";
		}
		var propertyData = { name : "className", value : className, viewHtmlDom : viewHtmlDom, modelHtmlDom : modelHtmlDom};
		this.dispatchEvent(this.createEvent("onStyleChange",propertyData),this.debugInfo);
	}
	,addClass: function(viewHtmlDom,className) {
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			brix.util.DomTools.addClass(viewHtmlDom,className);
			brix.util.DomTools.addClass(modelHtmlDom,className);
		} catch( e ) {
			throw "Error: could not add css class " + className + " or there was an error (" + Std.string(e) + ")";
		}
		var propertyData = { name : "className", value : className, viewHtmlDom : viewHtmlDom, modelHtmlDom : modelHtmlDom};
		this.dispatchEvent(this.createEvent("onStyleChange",propertyData),this.debugInfo);
	}
	,getStyle: function(viewHtmlDom,name) {
		var value;
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			value = Reflect.field(modelHtmlDom.style,name);
		} catch( e ) {
			throw "Error: the selected element has no field " + name + " or there was an error (" + Std.string(e) + ")";
		}
		return value;
	}
	,setStyle: function(viewHtmlDom,name,value) {
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			viewHtmlDom.style[name] = value;
			modelHtmlDom.style[name] = value;
		} catch( e ) {
			throw "Error: the selected element has no field " + name + " or there was an error (" + Std.string(e) + ")";
		}
		var propertyData = { name : name, value : value, viewHtmlDom : viewHtmlDom, modelHtmlDom : modelHtmlDom};
		this.dispatchEvent(this.createEvent("onStyleChange",propertyData),this.debugInfo);
	}
	,getProperty: function(viewHtmlDom,name) {
		var value;
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			value = Reflect.field(modelHtmlDom,name);
		} catch( e ) {
			throw "Error: the selected element has no field " + name + " or there was an error (" + Std.string(e) + ")";
		}
		return value;
	}
	,setProperty: function(viewHtmlDom,name,value) {
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			viewHtmlDom[name] = value;
			modelHtmlDom[name] = value;
		} catch( e ) {
			throw "Error: the selected element has no field " + name + " or there was an error (" + Std.string(e) + ")";
		}
		var propertyData = { name : name, value : value, viewHtmlDom : viewHtmlDom, modelHtmlDom : modelHtmlDom};
		this.dispatchEvent(this.createEvent("onPropertyChange",propertyData),this.debugInfo);
	}
	,getAttribute: function(viewHtmlDom,name) {
		var value;
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			value = modelHtmlDom.getAttribute(name);
		} catch( e ) {
			throw "Error: the selected element has no field " + name + " or there was an error (" + Std.string(e) + ")";
		}
		return value;
	}
	,removeAttribute: function(viewHtmlDom,name) {
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			viewHtmlDom.removeAttribute(name);
			modelHtmlDom.removeAttribute(name);
		} catch( e ) {
			throw "Error: the selected element has no field " + name + " or there was an error (" + Std.string(e) + ")";
		}
		var propertyData = { name : name, value : null, viewHtmlDom : viewHtmlDom, modelHtmlDom : modelHtmlDom};
		this.dispatchEvent(this.createEvent("onPropertyChange",propertyData),this.debugInfo);
	}
	,setAttribute: function(viewHtmlDom,name,value) {
		if(value == null) {
			this.removeAttribute(viewHtmlDom,name);
			return;
		}
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(viewHtmlDom);
		try {
			viewHtmlDom.setAttribute(name,value);
			modelHtmlDom.setAttribute(name,value);
		} catch( e ) {
			throw "Error: the selected element has no field " + name + " or there was an error (" + Std.string(e) + ")";
			brix.component.interaction.NotificationManager.notifyError("Error","The selected element has no field " + name + " or there was an error (" + Std.string(e) + ")");
		}
		var propertyData = { name : name, value : value, viewHtmlDom : viewHtmlDom, modelHtmlDom : modelHtmlDom};
		this.dispatchEvent(this.createEvent("onPropertyChange",propertyData),this.debugInfo);
	}
	,__class__: silex.property.PropertyModel
});
silex.property.TextEditor = function() { }
$hxClasses["silex.property.TextEditor"] = silex.property.TextEditor;
silex.property.TextEditor.__name__ = ["silex","property","TextEditor"];
silex.property.TextEditor.openTextEditor = function(onChange,textContent,brixInstanceId,msg) {
	if(msg == null) msg = "Edit text and click \"close\"";
	silex.ui.dialog.TextEditorDialog.onValidate = onChange;
	silex.ui.dialog.TextEditorDialog.textContent = textContent;
	silex.ui.dialog.TextEditorDialog.message = msg;
	brix.component.navigation.Page.openPage("text-editor-dialog",true,null,null,brixInstanceId);
}
silex.ui = {}
silex.ui.dialog = {}
silex.ui.dialog.DialogBase = function(rootElement,BrixId,onShow,onHide,onSubmit,onCancel) {
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	this.onShow = onShow;
	this.onHide = onHide;
	this.onSubmit = onSubmit;
	this.onCancel = onCancel;
	this.dialogName = rootElement.getAttribute("data-dialog-name");
	if(this.dialogName == null) null; else brix.util.DomTools.addClass(rootElement,this.dialogName);
	rootElement.addEventListener("onLayerShowStop",$bind(this,this.onLayerShow),false);
	rootElement.addEventListener("onLayerHideStop",$bind(this,this.onLayerHide),false);
	rootElement.addEventListener("click",$bind(this,this.onClick),false);
};
$hxClasses["silex.ui.dialog.DialogBase"] = silex.ui.dialog.DialogBase;
silex.ui.dialog.DialogBase.__name__ = ["silex","ui","dialog","DialogBase"];
silex.ui.dialog.DialogBase.__super__ = brix.component.ui.DisplayObject;
silex.ui.dialog.DialogBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		e.preventDefault();
		var target = e.target;
		if(brix.util.DomTools.hasClass(target,"validate-button")) {
			if(this.onSubmit != null) this.onSubmit();
		} else if(brix.util.DomTools.hasClass(target,"cancel-button")) {
			if(this.onCancel != null) this.onCancel();
		}
	}
	,close: function() {
		brix.component.navigation.Page.closePage(this.dialogName,null,this.brixInstanceId);
	}
	,onLayerHide: function(event) {
		var transitionData = event.detail.transitionData;
		if(this.onHide != null) this.onHide(transitionData);
	}
	,onLayerShow: function(event) {
		var transitionData = event.detail.transitionData;
		if(this.onShow != null) this.onShow(transitionData);
	}
	,dialogName: null
	,onCancel: null
	,onSubmit: null
	,onHide: null
	,onShow: null
	,__class__: silex.ui.dialog.DialogBase
});
silex.ui.dialog.AuthDialog = function(rootElement,BrixId) {
	silex.ui.dialog.DialogBase.call(this,rootElement,BrixId,null,null,$bind(this,this.validate),$bind(this,this.cancel));
};
$hxClasses["silex.ui.dialog.AuthDialog"] = silex.ui.dialog.AuthDialog;
silex.ui.dialog.AuthDialog.__name__ = ["silex","ui","dialog","AuthDialog"];
silex.ui.dialog.AuthDialog.__super__ = silex.ui.dialog.DialogBase;
silex.ui.dialog.AuthDialog.prototype = $extend(silex.ui.dialog.DialogBase.prototype,{
	onLoginError: function(msg) {
		brix.component.navigation.Page.openPage(this.dialogName,true,null,null,this.brixInstanceId);
		var inputElements = this.rootElement.getElementsByClassName("error-text");
		if(inputElements.length > 0) inputElements[0].innerHTML = msg;
	}
	,cancel: function() {
		this.close();
	}
	,validate: function() {
		var login;
		try {
			login = brix.util.DomTools.getSingleElement(this.rootElement,"input-field-login",true).value;
		} catch( e ) {
			throw "Could not find the input field for password. It is expected to have input-field-pass as a css class name.";
		}
		var pass;
		try {
			pass = brix.util.DomTools.getSingleElement(this.rootElement,"input-field-pass",true).value;
		} catch( e ) {
			throw "Could not find the input field for password. It is expected to have input-field-pass as a css class name.";
		}
		if(login == "" || pass == "") this.onLoginError("All fields are required."); else {
			brix.component.navigation.Page.openPage("loading-pending",true,null,null,this.brixInstanceId);
			haxe.Timer.delay((function(f,a1) {
				return function() {
					return f(a1);
				};
			})($bind(this,this.onLoginError),"Network error."),2000);
		}
	}
	,__class__: silex.ui.dialog.AuthDialog
});
silex.ui.dialog.KCFinderDialog = function(rootElement,BrixId) {
	silex.ui.dialog.DialogBase.call(this,rootElement,BrixId,$bind(this,this.requestRedraw),null,null,$bind(this,this.cancelSelection));
};
$hxClasses["silex.ui.dialog.KCFinderDialog"] = silex.ui.dialog.KCFinderDialog;
silex.ui.dialog.KCFinderDialog.__name__ = ["silex","ui","dialog","KCFinderDialog"];
silex.ui.dialog.KCFinderDialog.__super__ = silex.ui.dialog.DialogBase;
silex.ui.dialog.KCFinderDialog.prototype = $extend(silex.ui.dialog.DialogBase.prototype,{
	close: function() {
		var element = brix.util.DomTools.getSingleElement(this.rootElement,"file-browser-div",true);
		element.innerHTML = "";
		js.Lib.window.KCFinder = null;
		silex.file.kcfinder.FileBrowser.expectMultipleFiles = false;
		silex.ui.dialog.DialogBase.prototype.close.call(this);
	}
	,cancelSelection: function() {
		this.close();
	}
	,validateMultipleSelection: function(files) {
		if(files != null) {
			if(silex.file.kcfinder.FileBrowser.onValidateMultiple != null) {
				silex.file.kcfinder.FileBrowser.onValidateMultiple(files);
				silex.file.kcfinder.FileBrowser.onValidateMultiple = null;
			}
			this.close();
		}
	}
	,validateSelection: function(url) {
		if(url != null) {
			if(silex.file.kcfinder.FileBrowser.onValidate != null) {
				silex.file.kcfinder.FileBrowser.onValidate(url);
				silex.file.kcfinder.FileBrowser.onValidate = null;
			}
			this.close();
		}
	}
	,requestRedraw: function(transitionData) {
		var element = brix.util.DomTools.getSingleElement(this.rootElement,"file-browser-div",true);
		element.innerHTML = "<iframe name=\"kcfinder_iframe\" src=\"" + silex.Silex.initialBaseUrl + "../libs/kcfinder/browse.php?type=files&dir=" + silex.file.kcfinder.FileBrowser.intialPath + "\" " + "frameborder=\"0\" width=\"100%\" height=\"100%\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" />";
		if(silex.file.kcfinder.FileBrowser.message != null) {
			var element1 = brix.util.DomTools.getSingleElement(this.rootElement,"message-zone",false);
			if(element1 != null) element1.innerHTML = silex.file.kcfinder.FileBrowser.message;
		}
		if(silex.file.kcfinder.FileBrowser.expectMultipleFiles) js.Lib.window.KCFinder = { callBackMultiple : $bind(this,this.validateMultipleSelection)}; else js.Lib.window.KCFinder = { callBack : $bind(this,this.validateSelection)};
	}
	,__class__: silex.ui.dialog.KCFinderDialog
});
silex.ui.dialog.TextEditorDialog = function(rootElement,BrixId) {
	silex.ui.dialog.DialogBase.call(this,rootElement,BrixId,$bind(this,this.requestRedraw),null,null,$bind(this,this.cancelSelection));
};
$hxClasses["silex.ui.dialog.TextEditorDialog"] = silex.ui.dialog.TextEditorDialog;
silex.ui.dialog.TextEditorDialog.__name__ = ["silex","ui","dialog","TextEditorDialog"];
silex.ui.dialog.TextEditorDialog.onValidate = null;
silex.ui.dialog.TextEditorDialog.textContent = null;
silex.ui.dialog.TextEditorDialog.message = null;
silex.ui.dialog.TextEditorDialog.__super__ = silex.ui.dialog.DialogBase;
silex.ui.dialog.TextEditorDialog.prototype = $extend(silex.ui.dialog.DialogBase.prototype,{
	close: function() {
		var element = brix.util.DomTools.getSingleElement(this.rootElement,"text-editor-div",true);
		element.innerHTML = "";
		silex.ui.dialog.DialogBase.prototype.close.call(this);
	}
	,cancelSelection: function() {
		this.close();
	}
	,validateSelection: function(text) {
		if(text != null) {
			if(silex.ui.dialog.TextEditorDialog.onValidate != null) silex.ui.dialog.TextEditorDialog.onValidate(text);
		}
	}
	,contentLoaded: function(htmlString) {
		var element = brix.util.DomTools.getSingleElement(this.rootElement,"text-editor-div",true);
		element.innerHTML = htmlString;
		if(silex.ui.dialog.TextEditorDialog.message != null) {
			var element1 = brix.util.DomTools.getSingleElement(this.rootElement,"message-zone",false);
			if(element1 != null) element1.innerHTML = silex.ui.dialog.TextEditorDialog.message;
		}
		js.Lib.window.CKEDITOR = { textContent : silex.ui.dialog.TextEditorDialog.textContent, callBack : $bind(this,this.validateSelection)};
	}
	,requestRedraw: function(transitionData) {
		this.contentLoaded("<iframe name=\"kcfinder_iframe\" src=\"" + silex.Silex.initialBaseUrl + "../libs/ckeditor/ckeditor.html" + "\"" + " frameborder=\"0\" width=\"100%\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" />");
	}
	,__class__: silex.ui.dialog.TextEditorDialog
});
silex.ui.link = {}
silex.ui.link.SilexLink = function(rootElement,brixId) {
	brix.component.navigation.link.LinkBase.call(this,rootElement,brixId);
};
$hxClasses["silex.ui.link.SilexLink"] = silex.ui.link.SilexLink;
silex.ui.link.SilexLink.__name__ = ["silex","ui","link","SilexLink"];
silex.ui.link.SilexLink.isUrl = function(value) {
	if(value == null) return false;
	return StringTools.startsWith(value,"./") || StringTools.startsWith(value,"http://");
}
silex.ui.link.SilexLink.isPage = function(value,brixInstanceId) {
	if(value == null) return false;
	var pageList = brix.component.navigation.Page.getPageNodes(brixInstanceId);
	return pageList.length > 0;
}
silex.ui.link.SilexLink.__super__ = brix.component.navigation.link.LinkBase;
silex.ui.link.SilexLink.prototype = $extend(brix.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		brix.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		if(this.linkName == null) return;
		if(silex.ui.link.SilexLink.isUrl(this.linkName)) js.Lib.window.open(this.linkName,this.targetAttr); else if(silex.ui.link.SilexLink.isPage(this.linkName,this.brixInstanceId)) brix.component.navigation.Page.openPage(this.linkName,this.targetAttr == "_top",this.transitionDataShow,this.transitionDataHide,this.brixInstanceId,this.groupElement);
	}
	,__class__: silex.ui.link.SilexLink
});
silex.ui.list = {}
silex.ui.list.LayersList = function(rootElement,BrixId) {
	this.propertyChangePending = false;
	brix.component.list.List.call(this,rootElement,BrixId);
	var layerModel = silex.layer.LayerModel.getInstance();
	layerModel.addEventListener("onLayerListChange",$bind(this,this.onListChange),"LayersList class");
	layerModel.addEventListener("onLayerSelectionChange",$bind(this,this.onListChange),"LayersList class");
	silex.property.PropertyModel.getInstance().addEventListener("onPropertyChange",$bind(this,this.onListChange),"LayersList class");
};
$hxClasses["silex.ui.list.LayersList"] = silex.ui.list.LayersList;
silex.ui.list.LayersList.__name__ = ["silex","ui","list","LayersList"];
silex.ui.list.LayersList.__super__ = brix.component.list.List;
silex.ui.list.LayersList.prototype = $extend(brix.component.list.List.prototype,{
	setSelectedIndex: function(idx) {
		idx = brix.component.list.List.prototype.setSelectedIndex.call(this,idx);
		if(this.propertyChangePending == true) return idx;
		if(silex.layer.LayerModel.getInstance().selectedItem != this.getSelectedItem().classInstance) silex.layer.LayerModel.getInstance().setSelectedItem(this.getSelectedItem().classInstance);
		return idx;
	}
	,addLayer: function() {
		var page = silex.page.PageModel.getInstance().selectedItem;
		silex.layer.LayerModel.getInstance().addMaster(this.getSelectedItem().classInstance,page.name);
	}
	,onListChange: function(e) {
		this.reloadData();
	}
	,reloadData: function() {
		if(this.propertyChangePending == true) return;
		var fileModel = silex.file.FileModel.getInstance();
		if(fileModel.currentData.isLoaded == true) {
			var nodes = brix.util.DomTools.getElementsByAttribute(fileModel.currentData.viewHtmlDom,"data-master","*");
			var layers = new Array();
			var _g1 = 0, _g = nodes.length;
			while(_g1 < _g) {
				var idx = _g1++;
				var instances = fileModel.application.getAssociatedComponents(nodes[idx],brix.component.navigation.Layer);
				if(instances.length == 1) {
					var instance = instances.first();
					var name = nodes[idx].getAttribute("data-silex-name");
					layers.push({ name : name, classInstance : instance});
				} else throw "Error: there should be 1 and only 1 instance of Layer associated with this node, and there is " + instances.length;
			}
			this.dataProvider = layers;
			this.propertyChangePending = true;
			if(this.getSelectedItem() != null) this.addLayer();
			this.setSelectedItem(null);
		}
		brix.component.list.List.prototype.reloadData.call(this);
		this.propertyChangePending = false;
	}
	,propertyChangePending: null
	,__class__: silex.ui.list.LayersList
});
silex.ui.list.PageList = function(rootElement,BrixId) {
	brix.component.list.List.call(this,rootElement,BrixId);
	var pageModel = silex.page.PageModel.getInstance();
	pageModel.addEventListener("onPageSelectionChange",$bind(this,this.onListChange),"PageList class");
	silex.property.PropertyModel.getInstance().addEventListener("onPropertyChange",$bind(this,this.onListChange),"PageList class");
};
$hxClasses["silex.ui.list.PageList"] = silex.ui.list.PageList;
silex.ui.list.PageList.__name__ = ["silex","ui","list","PageList"];
silex.ui.list.PageList.__super__ = brix.component.list.List;
silex.ui.list.PageList.prototype = $extend(brix.component.list.List.prototype,{
	setSelectedIndex: function(idx) {
		idx = brix.component.list.List.prototype.setSelectedIndex.call(this,idx);
		if(silex.page.PageModel.getInstance().selectedItem != this.getSelectedItem()) silex.page.PageModel.getInstance().setSelectedItem(this.getSelectedItem());
		return idx;
	}
	,onListChange: function(e) {
		this.reloadData();
	}
	,buildDataProvider: function() {
		var fileModel = silex.file.FileModel.getInstance();
		if(fileModel.application != null) return this.dataProvider = silex.page.PageModel.getInstance().getClasses(fileModel.currentData.viewHtmlDom,fileModel.application.id,brix.component.navigation.Page);
		return new Array();
	}
	,reloadData: function() {
		this.dataProvider = this.buildDataProvider();
		this.setSelectedItem(silex.page.PageModel.getInstance().selectedItem);
		brix.component.list.List.prototype.reloadData.call(this);
	}
	,__class__: silex.ui.list.PageList
});
silex.ui.script = {}
silex.ui.script.HScriptTag = function(args) {
	if(silex.ui.script.HScriptTag.executed == false) {
		silex.ui.script.HScriptTag.executed = true;
		brix.util.DomTools.doLater($bind(this,this.findAndInterprete));
	}
};
$hxClasses["silex.ui.script.HScriptTag"] = silex.ui.script.HScriptTag;
silex.ui.script.HScriptTag.__name__ = ["silex","ui","script","HScriptTag"];
silex.ui.script.HScriptTag.__interfaces__ = [brix.component.IBrixComponent];
silex.ui.script.HScriptTag.prototype = {
	getBrixApplication: function() {
		return brix.component.BrixComponent.getBrixApplication(this);
	}
	,brixInstanceId: null
	,findAndInterprete: function() {
		var htmlTag = js.Lib.document.getElementsByTagName("head")[0];
		silex.interpreter.Interpreter.getInstance().execScriptTags(htmlTag);
	}
	,__class__: silex.ui.script.HScriptTag
}
silex.ui.stage = {}
silex.ui.stage.DropHandlerBase = function(rootElement,BrixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	this.initialMarkerParent = rootElement.parentNode;
	this.initialMarkerPopsition = brix.util.DomTools.getElementIndex(rootElement);
	rootElement.addEventListener("dragEventDropped",$bind(this,this.onDrop),false);
	rootElement.addEventListener("dragEventDrag",$bind(this,this.onDrag),false);
	rootElement.addEventListener("dragEventMove",$bind(this,this.onMove),false);
};
$hxClasses["silex.ui.stage.DropHandlerBase"] = silex.ui.stage.DropHandlerBase;
silex.ui.stage.DropHandlerBase.__name__ = ["silex","ui","stage","DropHandlerBase"];
silex.ui.stage.DropHandlerBase.__super__ = brix.component.ui.DisplayObject;
silex.ui.stage.DropHandlerBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	refresh: function() {
		if(silex.component.ComponentModel.getInstance().selectedItem != null) silex.component.ComponentModel.getInstance().refresh(); else if(silex.layer.LayerModel.getInstance().selectedItem != null) silex.layer.LayerModel.getInstance().refresh();
	}
	,resetDraggedMarker: function() {
		if(this.rootElement.parentNode != this.initialMarkerParent) {
			if(this.initialMarkerParent.childNodes.length > this.initialMarkerPopsition) this.initialMarkerParent.insertBefore(this.rootElement,this.initialMarkerParent.childNodes[this.initialMarkerPopsition]); else this.initialMarkerParent.appendChild(this.rootElement);
		}
		brix.util.DomTools.doLater($bind(this,this.refresh));
	}
	,onDrop: function(e) {
		if(this.currentDropContainer != null) {
			brix.util.DomTools.removeClass(this.currentDropContainer,"current-drop-container");
			this.currentDropContainer = null;
		}
		var event = e;
		var dropZone = event.detail.dropZone;
		var element;
		var position;
		var parent;
		element = this.getDraggedElement(event.detail);
		if(element != null) {
			var beforeElement = null;
			if(dropZone != null) {
				position = dropZone.position;
				parent = dropZone.parent;
				if(parent.childNodes.length > position) {
					var before = parent.childNodes[position];
					while(before != null && (before.nodeType != 1 || before.getAttribute("data-silex-component-id") == null && before.getAttribute("data-silex-layer-id") == null)) before = before.nextSibling;
					beforeElement = before;
				}
				if(parent.childNodes.length <= position) parent.appendChild(element); else parent.insertBefore(element,parent.childNodes[position]);
				try {
					var modelElement = silex.file.FileModel.getInstance().getModelFromView(element);
					var modelBeforeElement = silex.file.FileModel.getInstance().getModelFromView(beforeElement);
					var modelParent = silex.file.FileModel.getInstance().getModelFromView(parent);
					if(modelElement == null) throw "Error while moving the element: could not retrieve the element in the model.";
					if(modelElement.parentNode == null) throw "Error while moving the element: the element in the model has no parent.";
					if(modelBeforeElement == null) modelParent.appendChild(modelElement); else modelParent.insertBefore(modelElement,modelBeforeElement);
				} catch( e1 ) {
					null;
				}
			} else if(this.draggedElementParent.childNodes.length > this.draggedElementPosition) this.draggedElementParent.insertBefore(element,this.draggedElementParent.childNodes[this.draggedElementPosition]); else this.draggedElementParent.appendChild(element);
		} else null;
		this.resetDraggedMarker();
	}
	,onMove: function(e) {
		if(this.currentDropContainer != null) {
			brix.util.DomTools.removeClass(this.currentDropContainer,"current-drop-container");
			this.currentDropContainer = null;
		}
		var event = e;
		var dropZone = event.detail.dropZone;
		if(dropZone != null) {
			var layerClasses = silex.file.FileModel.getInstance().application.getAssociatedComponents(dropZone.parent,brix.component.navigation.Layer);
			if(layerClasses.length == 1) {
				brix.util.DomTools.addClass(dropZone.parent,"current-drop-container");
				this.currentDropContainer = dropZone.parent;
			}
		}
	}
	,onDrag: function(e) {
		var event = e;
		event.detail.draggable.groupElement = silex.file.FileModel.getInstance().currentData.viewHtmlDom.parentNode;
		this.setDraggedElement(event.detail);
		var draggedElement = this.getDraggedElement(event.detail);
		if(draggedElement != null) {
			this.draggedElementParent = draggedElement.parentNode;
			this.draggedElementPosition = brix.util.DomTools.getElementIndex(draggedElement);
			var draggable = event.detail.draggable;
			draggable.initPhantomStyle(draggedElement);
			this.rootElement.appendChild(draggedElement);
		}
	}
	,setDraggedElement: function(draggableEvent) {
		throw "virtual method to be implemented in derived classes";
	}
	,getDraggedElement: function(draggableEvent) {
		throw "virtual method to be implemented in derived classes";
		return null;
	}
	,init: function() {
		brix.component.ui.DisplayObject.prototype.init.call(this);
	}
	,draggedElementPosition: null
	,draggedElementParent: null
	,initialMarkerPopsition: null
	,initialMarkerParent: null
	,currentDropContainer: null
	,__class__: silex.ui.stage.DropHandlerBase
});
silex.ui.stage.FileViewer = function(rootElement,BrixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	this.fileModel = silex.file.FileModel.getInstance();
	this.fileModel.addEventListener("onLoadStart",$bind(this,this.onFileChange),"FileViewer class");
	this.fileModel.addEventListener("onLoadSuccess",$bind(this,this.onFileData),"FileViewer class");
	this.pageModel = silex.page.PageModel.getInstance();
	this.pageModel.addEventListener("onPageSelectionChange",$bind(this,this.onPageChange),"FileViewer class");
};
$hxClasses["silex.ui.stage.FileViewer"] = silex.ui.stage.FileViewer;
silex.ui.stage.FileViewer.__name__ = ["silex","ui","stage","FileViewer"];
silex.ui.stage.FileViewer.__super__ = brix.component.ui.DisplayObject;
silex.ui.stage.FileViewer.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onPageChange: function(event) {
		if(this.pageModel.selectedItem != null) brix.component.navigation.Page.openPage(this.pageModel.selectedItem.name,false,null,null,this.fileModel.application.id,this.fileModel.currentData.viewHtmlDom);
	}
	,redrawLayouts: function() {
	}
	,onFileData: function(event) {
		this.rootElement.innerHTML = "";
		this.rootElement.appendChild(this.fileModel.currentData.viewHtmlDom);
		this.rootElement.appendChild(this.fileModel.currentData.headHtmlDom);
		this.redrawLayouts();
	}
	,onFileChange: function(event) {
		this.rootElement.innerHTML = "";
		this.redrawLayouts();
	}
	,pageModel: null
	,fileModel: null
	,__class__: silex.ui.stage.FileViewer
});
silex.ui.stage.InsertDropHandler = function(rootElement,BrixId) {
	silex.ui.stage.DropHandlerBase.call(this,rootElement,BrixId);
};
$hxClasses["silex.ui.stage.InsertDropHandler"] = silex.ui.stage.InsertDropHandler;
silex.ui.stage.InsertDropHandler.__name__ = ["silex","ui","stage","InsertDropHandler"];
silex.ui.stage.InsertDropHandler.__super__ = silex.ui.stage.DropHandlerBase;
silex.ui.stage.InsertDropHandler.prototype = $extend(silex.ui.stage.DropHandlerBase.prototype,{
	addLayer: function(dropZone,page) {
		if(page == null) throw "Error: No selected page. Could not add a layer.";
		return silex.layer.LayerModel.getInstance().addLayer(page.name,"",dropZone.position);
	}
	,addComponent: function(dropZone,nodeName) {
		var layers = silex.file.FileModel.getInstance().application.getAssociatedComponents(dropZone.parent,brix.component.navigation.Layer);
		if(layers.length != 1) throw "Error: search for the layer gave " + layers.length + " results";
		return silex.component.ComponentModel.getInstance().addComponent(nodeName,layers.first(),dropZone.position);
	}
	,onFileChosen: function(element,fileUrl) {
		silex.property.PropertyModel.getInstance().setAttribute(element,"src",silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(fileUrl));
	}
	,initImageComp: function(element) {
		silex.component.ComponentModel.getInstance().setSelectedItem(element);
		var cbk = (function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.onFileChosen),element);
		silex.file.kcfinder.FileBrowser.selectFile(cbk,this.brixInstanceId,null,"files/assets/");
	}
	,onMultipleFilesChosen: function(element,files) {
		silex.property.PropertyModel.getInstance().setAttribute(element,"controls","controls");
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(element);
		var _g = 0;
		while(_g < files.length) {
			var sourceUrl = files[_g];
			++_g;
			var sourceElement = js.Lib.document.createElement("source");
			sourceElement.src = silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(sourceUrl);
			modelHtmlDom.appendChild(sourceElement);
			var sourceElement1 = js.Lib.document.createElement("source");
			sourceElement1.src = silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(sourceUrl);
			element.appendChild(sourceElement1);
		}
	}
	,initMediaComp: function(element) {
		silex.component.ComponentModel.getInstance().setSelectedItem(element);
		var cbk = (function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.onMultipleFilesChosen),element);
		silex.file.kcfinder.FileBrowser.selectMultipleFiles(cbk,this.brixInstanceId,null,"files/assets/");
	}
	,onDrop: function(e) {
		var event = e;
		var dropZone = event.detail.dropZone;
		silex.ui.stage.DropHandlerBase.prototype.onDrop.call(this,e);
		this.rootElement.style.position = null;
		this.rootElement.style.top = null;
		this.rootElement.style.left = null;
		if(dropZone == null && !brix.util.DomTools.hasClass(this.rootElement,"container")) {
			var defaultContainer = null;
			if(silex.layer.LayerModel.getInstance().selectedItem != null) defaultContainer = silex.layer.LayerModel.getInstance().selectedItem.rootElement; else {
				var nodes = brix.component.navigation.Layer.getLayerNodes(silex.page.PageModel.getInstance().selectedItem.name,silex.file.FileModel.getInstance().application.id,silex.file.FileModel.getInstance().currentData.viewHtmlDom);
				if(nodes.length > 0) defaultContainer = nodes[0];
			}
			if(defaultContainer != null) dropZone = { position : 0, parent : defaultContainer, boundingBox : null};
		}
		var element;
		if(dropZone != null) {
			if(brix.util.DomTools.hasClass(this.rootElement,"image")) {
				element = this.addComponent(dropZone,"img");
				silex.property.PropertyModel.getInstance().setAttribute(element,"data-silex-name","New image component");
				brix.util.DomTools.doLater((function(f,a1) {
					return function() {
						return f(a1);
					};
				})($bind(this,this.initImageComp),element));
			} else if(brix.util.DomTools.hasClass(this.rootElement,"text")) {
				element = this.addComponent(dropZone,"div");
				silex.property.PropertyModel.getInstance().setAttribute(element,"data-silex-name","New text field");
				silex.property.PropertyModel.getInstance().setProperty(element,"innerHTML","<p>Insert text here.</p>");
			} else if(brix.util.DomTools.hasClass(this.rootElement,"audio")) {
				element = this.addComponent(dropZone,"audio");
				silex.property.PropertyModel.getInstance().setAttribute(element,"data-silex-name","New media component");
				brix.util.DomTools.doLater((function(f,a1) {
					return function() {
						return f(a1);
					};
				})($bind(this,this.initMediaComp),element));
			} else if(brix.util.DomTools.hasClass(this.rootElement,"video")) {
				element = this.addComponent(dropZone,"video");
				silex.property.PropertyModel.getInstance().setAttribute(element,"data-silex-name","New media component");
				brix.util.DomTools.doLater((function(f,a1) {
					return function() {
						return f(a1);
					};
				})($bind(this,this.initMediaComp),element));
			} else if(brix.util.DomTools.hasClass(this.rootElement,"container")) {
				element = this.addLayer(dropZone,silex.page.PageModel.getInstance().selectedItem).rootElement;
				silex.property.PropertyModel.getInstance().setAttribute(element,"data-silex-name","New container");
			} else throw "unknown element has been drop on stage from the insert menu";
		} else null;
	}
	,resetDraggedMarker: function() {
		this.listElementClone.parentNode.removeChild(this.listElementClone);
		this.listElementClone = null;
		silex.ui.stage.DropHandlerBase.prototype.resetDraggedMarker.call(this);
	}
	,onDrag: function(e) {
		silex.ui.stage.DropHandlerBase.prototype.onDrag.call(this,e);
		var event = e;
		event.detail.draggable.groupElement = silex.file.FileModel.getInstance().currentData.viewHtmlDom.parentNode;
		var draggable = event.detail.draggable;
		draggable.phantom.style.position = "static";
	}
	,getDraggedElement: function(draggableEvent) {
		return null;
	}
	,setDraggedElement: function(draggableEvent) {
		this.listElementClone = draggableEvent.target.cloneNode(true);
		this.listElementClone.className = draggableEvent.target.className;
		this.listElementClone.style.position = null;
		draggableEvent.target.parentNode.insertBefore(this.listElementClone,draggableEvent.target);
	}
	,listElementClone: null
	,__class__: silex.ui.stage.InsertDropHandler
});
silex.ui.stage.SelectionController = function(rootElement,BrixId) {
	this.isDragging = false;
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	var selectionContainer = js.Lib.document.body;
	this.hoverLayerMarker = brix.util.DomTools.getSingleElement(rootElement,"hover-layer-marker",true);
	this.hoverLayerMarker.addEventListener("mousedown",$bind(this,this.onClickLayerHover),false);
	this.hoverLayerMarker.addEventListener("mouseout",$bind(this,this.onOutLayerHover),false);
	this.selectionLayerMarker = brix.util.DomTools.getSingleElement(rootElement,"selection-layer-marker",true);
	this.selectionLayerMarker.addEventListener("click",$bind(this,this.onClickLayerSelection),false);
	this.hoverMarker = brix.util.DomTools.getSingleElement(rootElement,"hover-marker",true);
	this.hoverMarker.addEventListener("mousedown",$bind(this,this.onClickHover),false);
	this.hoverMarker.addEventListener("mouseout",$bind(this,this.onOutHover),false);
	this.selectionMarker = brix.util.DomTools.getSingleElement(rootElement,"selection-marker",true);
	this.selectionMarker.addEventListener("click",$bind(this,this.onClickSelection),false);
	rootElement.addEventListener("dragEventDropped",$bind(this,this.onDrop),false);
	rootElement.addEventListener("dragEventDrag",$bind(this,this.onDrag),false);
	rootElement.addEventListener("mousemove",$bind(this,this.onMouseMove),false);
	this.componentModel = silex.component.ComponentModel.getInstance();
	this.componentModel.addEventListener("onComponentSelectionChange",$bind(this,this.onSelectionChanged),"SelectionController class");
	this.componentModel.addEventListener("onComponentHoverChange",$bind(this,this.onHoverChanged),"SelectionController class");
	this.componentModel.addEventListener("onComponentListChange",$bind(this,this.redraw),"SelectionController class");
	this.layerModel = silex.layer.LayerModel.getInstance();
	this.layerModel.addEventListener("onLayerSelectionChange",$bind(this,this.onLayerSelectionChanged),"SelectionController class");
	this.layerModel.addEventListener("onLayerHoverChange",$bind(this,this.onLayerHoverChanged),"SelectionController class");
	this.layerModel.addEventListener("onLayerListChange",$bind(this,this.redraw),"SelectionController class");
	silex.page.PageModel.getInstance().addEventListener("onPageListChange",$bind(this,this.redraw),"SelectionController class");
	silex.file.FileModel.getInstance().addEventListener("onLoadSuccess",$bind(this,this.redraw),"SelectionController class");
	silex.property.PropertyModel.getInstance().addEventListener("onPropertyChange",$bind(this,this.redraw),"SelectionController class");
	silex.property.PropertyModel.getInstance().addEventListener("onStyleChange",$bind(this,this.redraw),"SelectionController class");
	rootElement.addEventListener("scroll",$bind(this,this.redraw),false);
	js.Lib.window.addEventListener("resize",$bind(this,this.redraw),false);
};
$hxClasses["silex.ui.stage.SelectionController"] = silex.ui.stage.SelectionController;
silex.ui.stage.SelectionController.__name__ = ["silex","ui","stage","SelectionController"];
silex.ui.stage.SelectionController.__super__ = brix.component.ui.DisplayObject;
silex.ui.stage.SelectionController.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	doSetMarkerPosition: function(marker,left,top,width,height) {
		if(width < 10) width = 10;
		if(height < 10) height = 10;
		brix.util.DomTools.moveTo(marker,left,top);
		marker.style.width = width + "px";
		marker.style.height = height + "px";
	}
	,setMarkerPosition: function(marker,target) {
		if(target == null) {
			marker.style.display = "none";
			marker.style.visibility = "hidden";
		} else {
			marker.style.display = "inline";
			marker.style.visibility = "visible";
			var boundingBox = brix.util.DomTools.getElementBoundingBox(target);
			var markerMarginH = 0;
			var markerMarginV = 0;
			this.doSetMarkerPosition(marker,Math.floor(boundingBox.x - markerMarginH / 2),Math.floor(boundingBox.y - markerMarginV / 2),Math.floor(boundingBox.w + markerMarginH),Math.floor(boundingBox.h + markerMarginV));
		}
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("redraw",false,false,{ target : target});
		marker.dispatchEvent(event);
	}
	,onHoverChanged: function(event) {
		this.setMarkerPosition(this.hoverMarker,this.componentModel.hoveredItem);
		if(this.componentModel.hoveredItem != null) this.setMarkerPosition(this.hoverLayerMarker,null);
	}
	,onSelectionChanged: function(event) {
		this.setMarkerPosition(this.selectionMarker,this.componentModel.selectedItem);
		if(this.componentModel.selectedItem != null) this.setMarkerPosition(this.selectionLayerMarker,null);
	}
	,onLayerHoverChanged: function(event) {
		if(this.layerModel.hoveredItem == null || this.componentModel.hoveredItem != null) this.setMarkerPosition(this.hoverLayerMarker,null); else this.setMarkerPosition(this.hoverLayerMarker,this.layerModel.hoveredItem.rootElement);
	}
	,onLayerSelectionChanged: function(event) {
		if(this.layerModel.selectedItem == null || this.componentModel.selectedItem != null) this.setMarkerPosition(this.selectionLayerMarker,null); else this.setMarkerPosition(this.selectionLayerMarker,this.layerModel.selectedItem.rootElement);
	}
	,checkIsOver: function(boundingBox,mouseX,mouseY) {
		if(boundingBox.w < 10) boundingBox.w = 10;
		if(boundingBox.h < 10) boundingBox.h = 10;
		var res = mouseX > boundingBox.x && mouseX < boundingBox.x + boundingBox.w && mouseY > boundingBox.y && mouseY < boundingBox.y + boundingBox.h;
		return res;
	}
	,onMouseMove: function(e) {
		if(this.isDragging) {
			this.setMarkerPosition(this.hoverLayerMarker,null);
			this.setMarkerPosition(this.hoverMarker,null);
			return;
		}
		var layerFound = null;
		var layerFoundBoundingBox = null;
		var layers = brix.util.DomTools.getElementsByAttribute(this.rootElement,"data-silex-layer-id","*");
		var _g1 = 0, _g = layers.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var boundingBox = brix.util.DomTools.getElementBoundingBox(layers[idx]);
			if(boundingBox.w == 0 && boundingBox.h == 0) {
			}
			if(this.checkIsOver(boundingBox,e.clientX,e.clientY)) {
				if(layerFound == null || boundingBox.w * boundingBox.h < layerFoundBoundingBox.w * layerFoundBoundingBox.h) {
					var application = silex.file.FileModel.getInstance().application;
					var layerList = application.getAssociatedComponents(layers[idx],brix.component.navigation.Layer);
					if(layerList.length != 1) null;
					layerFound = layerList.first();
					layerFoundBoundingBox = boundingBox;
				}
			}
		}
		this.layerModel.setHoveredItem(layerFound);
		var compFound = null;
		var compFoundBoundingBox = null;
		var comps = brix.util.DomTools.getElementsByAttribute(this.rootElement,"data-silex-component-id","*");
		var _g1 = 0, _g = comps.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var boundingBox = brix.util.DomTools.getElementBoundingBox(comps[idx]);
			if(boundingBox.w == 0 && boundingBox.h == 0) {
			}
			if(this.checkIsOver(boundingBox,e.clientX,e.clientY)) {
				if(compFound == null || boundingBox.w * boundingBox.h < compFoundBoundingBox.w * compFoundBoundingBox.h) {
					compFound = comps[idx];
					compFoundBoundingBox = boundingBox;
				}
			}
		}
		this.componentModel.setHoveredItem(compFound);
		if(this.componentModel.selectedItem != null) {
			if(this.componentModel.selectedItem != compFound && compFound != null) this.setMarkerPosition(this.selectionMarker,null); else this.setMarkerPosition(this.selectionMarker,this.componentModel.selectedItem);
		} else if(this.layerModel.selectedItem != null) {
			if(this.layerModel.selectedItem != layerFound && layerFound != null) this.setMarkerPosition(this.selectionLayerMarker,null); else this.setMarkerPosition(this.selectionLayerMarker,this.layerModel.selectedItem.rootElement);
		}
	}
	,onOutLayerHover: function(e) {
		this.layerModel.setHoveredItem(null);
	}
	,onOutHover: function(e) {
		this.componentModel.setHoveredItem(null);
	}
	,onClickLayerSelection: function(e) {
		e.preventDefault();
	}
	,onClickSelection: function(e) {
		e.preventDefault();
	}
	,onClickLayerHover: function(e) {
		e.preventDefault();
		this.layerModel.setSelectedItem(this.layerModel.hoveredItem);
	}
	,onClickHover: function(e) {
		this.componentModel.setSelectedItem(this.componentModel.hoveredItem);
	}
	,onDrop: function(e) {
		this.isDragging = false;
	}
	,onDrag: function(e) {
		this.isDragging = true;
	}
	,redraw: function(e) {
		this.setMarkerPosition(this.selectionMarker,this.componentModel.selectedItem);
		this.setMarkerPosition(this.hoverMarker,this.componentModel.hoveredItem);
		if(this.componentModel.selectedItem != null || this.layerModel.selectedItem == null) this.setMarkerPosition(this.selectionLayerMarker,null); else this.setMarkerPosition(this.selectionLayerMarker,this.layerModel.selectedItem.rootElement);
		if(this.componentModel.hoveredItem != null || this.layerModel.hoveredItem == null) this.setMarkerPosition(this.hoverLayerMarker,null); else this.setMarkerPosition(this.hoverLayerMarker,this.layerModel.hoveredItem.rootElement);
	}
	,isDragging: null
	,layerModel: null
	,componentModel: null
	,hoverLayerMarker: null
	,selectionLayerMarker: null
	,hoverMarker: null
	,selectionMarker: null
	,__class__: silex.ui.stage.SelectionController
});
silex.ui.stage.SelectionDropHandler = function(rootElement,BrixId) {
	silex.ui.stage.DropHandlerBase.call(this,rootElement,BrixId);
	rootElement.addEventListener("click",$bind(this,this.onClick),false);
	rootElement.addEventListener("redraw",$bind(this,this.redraw),false);
	this.displayZone = brix.util.DomTools.getSingleElement(rootElement,"selection-ui-template",false);
	if(this.displayZone != null) this.displayZoneTemplate = StringTools.htmlUnescape(this.displayZone.innerHTML);
	this.displayZone.innerHTML = "";
};
$hxClasses["silex.ui.stage.SelectionDropHandler"] = silex.ui.stage.SelectionDropHandler;
silex.ui.stage.SelectionDropHandler.__name__ = ["silex","ui","stage","SelectionDropHandler"];
silex.ui.stage.SelectionDropHandler.draggedComponent = null;
silex.ui.stage.SelectionDropHandler.draggedLayer = null;
silex.ui.stage.SelectionDropHandler.__super__ = silex.ui.stage.DropHandlerBase;
silex.ui.stage.SelectionDropHandler.prototype = $extend(silex.ui.stage.DropHandlerBase.prototype,{
	onDrop: function(e) {
		silex.ui.stage.DropHandlerBase.prototype.onDrop.call(this,e);
		if(silex.ui.stage.SelectionDropHandler.draggedComponent != null) brix.util.DomTools.doLater(($_=silex.component.ComponentModel.getInstance(),$bind($_,$_.refresh))); else if(silex.ui.stage.SelectionDropHandler.draggedLayer != null) brix.util.DomTools.doLater(($_=silex.layer.LayerModel.getInstance(),$bind($_,$_.refresh)));
		silex.ui.stage.SelectionDropHandler.draggedComponent = null;
		silex.ui.stage.SelectionDropHandler.draggedLayer = null;
	}
	,getDraggedElement: function(draggableEvent) {
		if(silex.ui.stage.SelectionDropHandler.draggedComponent != null) return silex.ui.stage.SelectionDropHandler.draggedComponent; else if(silex.ui.stage.SelectionDropHandler.draggedLayer != null) return silex.ui.stage.SelectionDropHandler.draggedLayer.rootElement; else throw "No component nor layer being dragged";
	}
	,setDraggedElement: function(draggableEvent) {
		if(silex.ui.stage.SelectionDropHandler.draggedComponent != null || silex.ui.stage.SelectionDropHandler.draggedLayer != null) throw "Error: could not start dragging this component or layer, another layer is still being dragged";
		if(silex.component.ComponentModel.getInstance().selectedItem != null) silex.ui.stage.SelectionDropHandler.draggedComponent = silex.component.ComponentModel.getInstance().selectedItem; else if(silex.layer.LayerModel.getInstance().selectedItem != null) silex.ui.stage.SelectionDropHandler.draggedLayer = silex.layer.LayerModel.getInstance().selectedItem;
	}
	,onTextEditorChange: function(component,htmlText) {
		silex.property.PropertyModel.getInstance().setProperty(component,"innerHTML",htmlText);
	}
	,onMediaSourcesChosen: function(component,files) {
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(component);
		var _g = 0;
		while(_g < files.length) {
			var sourceUrl = files[_g];
			++_g;
			sourceUrl = silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(sourceUrl);
			var sourceElement = js.Lib.document.createElement("source");
			sourceElement.innerHTML = sourceUrl;
			modelHtmlDom.appendChild(sourceElement);
			var sourceElement1 = js.Lib.document.createElement("source");
			sourceElement1.innerHTML = sourceUrl;
			component.appendChild(sourceElement1);
		}
	}
	,onImageChosen: function(component,fileUrl) {
		fileUrl = silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(fileUrl);
		silex.property.PropertyModel.getInstance().setAttribute(component,"src",fileUrl);
	}
	,onBackgroundImageChosen: function(component,fileUrl) {
		fileUrl = silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(fileUrl);
		silex.property.PropertyModel.getInstance().setStyle(component,"backgroundImage","url('" + fileUrl + "')");
	}
	,editMedia: function() {
		var component = silex.component.ComponentModel.getInstance().selectedItem;
		if(component == null) throw "edit is not implemented for layers";
		var cbk = (function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.onMediaSourcesChosen),component);
		silex.file.kcfinder.FileBrowser.selectMultipleFiles(cbk,this.brixInstanceId,null,"files/assets/");
	}
	,editImage: function() {
		var component = silex.component.ComponentModel.getInstance().selectedItem;
		if(component == null) throw "edit is not implemented for layers";
		var cbk = (function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.onImageChosen),component);
		silex.file.kcfinder.FileBrowser.selectFile(cbk,this.brixInstanceId,null,"files/assets/");
	}
	,editText: function() {
		var component = silex.component.ComponentModel.getInstance().selectedItem;
		if(component == null) throw "edit is not implemented for layers";
		silex.property.TextEditor.openTextEditor((function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.onTextEditorChange),component),component.innerHTML,this.brixInstanceId);
	}
	,editLayer: function() {
		var layer = silex.layer.LayerModel.getInstance().selectedItem;
		if(layer == null) throw "Error: no container selected.";
		var element = layer.rootElement;
		var cbk = (function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.onBackgroundImageChosen),element);
		silex.file.kcfinder.FileBrowser.selectFile(cbk,this.brixInstanceId,null,"files/assets/");
	}
	,deleteSelection: function() {
		var component = silex.component.ComponentModel.getInstance().selectedItem;
		if(component == null) {
			var layer = silex.layer.LayerModel.getInstance().selectedItem;
			var page = silex.page.PageModel.getInstance().selectedItem;
			var name = layer.rootElement.getAttribute("data-silex-name");
			if(name == null) name = "";
			var confirm = js.Lib.window.confirm("I am about to delete the container " + name + ". Are you sure?");
			if(confirm == true) silex.layer.LayerModel.getInstance().removeLayer(layer,page.name);
		} else {
			var name = component.getAttribute("data-silex-name");
			if(name == null) name = "";
			var confirm = js.Lib.window.confirm("I am about to delete the component " + name + ". Are you sure?");
			if(confirm == true) silex.component.ComponentModel.getInstance().removeComponent(component);
		}
	}
	,onClick: function(e) {
		if(brix.util.DomTools.hasClass(e.target,"selection-marker-delete")) {
			e.preventDefault();
			this.deleteSelection();
		} else if(brix.util.DomTools.hasClass(e.target,"selection-marker-edit-image")) {
			e.preventDefault();
			this.editImage();
		} else if(brix.util.DomTools.hasClass(e.target,"selection-marker-edit-media")) {
			e.preventDefault();
			this.editMedia();
		} else if(brix.util.DomTools.hasClass(e.target,"selection-marker-edit-text")) {
			e.preventDefault();
			this.editText();
		} else if(brix.util.DomTools.hasClass(e.target,"selection-marker-edit-layer")) {
			e.preventDefault();
			this.editLayer();
		}
	}
	,redraw: function(e) {
		if(this.displayZoneTemplate != null && this.displayZone != null) try {
			var t = new haxe.Template(this.displayZoneTemplate);
			var context = { layerName : null, componentName : null, clientWidth : this.rootElement.clientWidth, clientHeight : this.rootElement.clientHeight};
			if(silex.layer.LayerModel.getInstance().selectedItem != null) context.layerName = silex.layer.LayerModel.getInstance().selectedItem.rootElement.getAttribute("data-silex-name"); else if(silex.component.ComponentModel.getInstance().selectedItem != null) context.layerName = silex.component.ComponentModel.getInstance().selectedItem.parentNode.getAttribute("data-silex-name");
			if(silex.component.ComponentModel.getInstance().selectedItem != null) context.componentName = silex.component.ComponentModel.getInstance().selectedItem.getAttribute("data-silex-name");
			var output = t.execute(context);
			this.displayZone.innerHTML = output;
		} catch( e1 ) {
			throw "Error while executing the template of the marker. The error: " + Std.string(e1);
		}
	}
	,currentContexts: null
	,displayZone: null
	,displayZoneTemplate: null
	,__class__: silex.ui.stage.SelectionDropHandler
});
silex.ui.stage.SilexContextManager = function(rootElement,brixId) {
	brix.component.navigation.ContextManager.call(this,rootElement,brixId);
	silex.component.ComponentModel.getInstance().addEventListener("onComponentSelectionChange",$bind(this,this.onSelectComponent),"silex.ui.stage.SilexContextManager");
	silex.layer.LayerModel.getInstance().addEventListener("onLayerSelectionChange",$bind(this,this.onSelectLayer),"silex.ui.stage.SilexContextManager");
};
$hxClasses["silex.ui.stage.SilexContextManager"] = silex.ui.stage.SilexContextManager;
silex.ui.stage.SilexContextManager.__name__ = ["silex","ui","stage","SilexContextManager"];
silex.ui.stage.SilexContextManager.__super__ = brix.component.navigation.ContextManager;
silex.ui.stage.SilexContextManager.prototype = $extend(brix.component.navigation.ContextManager.prototype,{
	onSelectLayer: function(e) {
		if(silex.layer.LayerModel.getInstance().selectedItem == null) this.removeContext("context-layer"); else this.addContext("context-layer");
	}
	,onSelectComponent: function(e) {
		var _g = 0, _g1 = ["context-video","context-audio","context-img","context-layer","context-div"];
		while(_g < _g1.length) {
			var contextValue = _g1[_g];
			++_g;
			this.removeContext(contextValue);
		}
		var item = silex.component.ComponentModel.getInstance().selectedItem;
		if(item != null) switch(item.nodeName.toLowerCase()) {
		case "audio":
			this.addContext("context-audio");
			break;
		case "video":
			this.addContext("context-video");
			break;
		case "img":
			this.addContext("context-img");
			break;
		case "div":
			this.addContext("context-div");
			break;
		}
	}
	,__class__: silex.ui.stage.SilexContextManager
});
silex.ui.toolbox = {}
silex.ui.toolbox.MenuController = function(rootElement,BrixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	rootElement.addEventListener("click",$bind(this,this.onClick),false);
	silex.ui.toolbox.MenuController.menuBrixId = BrixId;
	silex.interpreter.Interpreter.getInstance().expose("MenuController",silex.ui.toolbox.MenuController);
	js.Lib.window.onbeforeunload = function() {
		return "You're about to leave this page.";
	};
};
$hxClasses["silex.ui.toolbox.MenuController"] = silex.ui.toolbox.MenuController;
silex.ui.toolbox.MenuController.__name__ = ["silex","ui","toolbox","MenuController"];
silex.ui.toolbox.MenuController.menuBrixId = null;
silex.ui.toolbox.MenuController.createFile = function() {
	silex.file.FileModel.getInstance().create();
}
silex.ui.toolbox.MenuController.trashFile = function() {
	var confirm = js.Lib.window.confirm("I am about to trash the file " + silex.file.FileModel.getInstance().currentData.name + ". Are you sure?");
	if(confirm == true) silex.file.FileModel.getInstance().trash(silex.file.FileModel.getInstance().currentData.name);
}
silex.ui.toolbox.MenuController.openFile = function() {
	silex.file.kcfinder.FileBrowser.selectFile(silex.ui.toolbox.MenuController.onFileChosen,silex.ui.toolbox.MenuController.menuBrixId);
}
silex.ui.toolbox.MenuController.onFileChosen = function(fileUrl) {
	var file = silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(fileUrl);
	silex.file.FileModel.getInstance().load(file);
}
silex.ui.toolbox.MenuController.viewFile = function() {
	js.Lib.window.open(silex.Silex.initialBaseUrl + silex.file.FileModel.getInstance().currentData.name,"_blank");
}
silex.ui.toolbox.MenuController.saveFile = function() {
	silex.file.FileModel.getInstance().save();
}
silex.ui.toolbox.MenuController.saveFileAs = function() {
	var newName = js.Lib.window.prompt("New name for your file?",silex.file.FileModel.getInstance().currentData.name);
	if(newName != null) silex.file.FileModel.getInstance().saveAs(newName);
}
silex.ui.toolbox.MenuController.saveFileCopy = function() {
	var newName = js.Lib.window.prompt("What name for your copy?",silex.file.FileModel.getInstance().currentData.name);
	if(newName != null) silex.file.FileModel.getInstance().saveACopy(newName);
}
silex.ui.toolbox.MenuController.addPage = function() {
	var newName = js.Lib.window.prompt("What name for your new page?");
	if(newName != null) silex.page.PageModel.getInstance().addPage(newName);
}
silex.ui.toolbox.MenuController.delPage = function() {
	var confirm = js.Lib.window.confirm("I am about to delete the page " + silex.page.PageModel.getInstance().selectedItem.name + ". Are you sure?");
	if(confirm == true) silex.page.PageModel.getInstance().removePage(silex.page.PageModel.getInstance().selectedItem);
}
silex.ui.toolbox.MenuController.renamePage = function() {
	var newName = js.Lib.window.prompt("What name do your want to give to the page " + silex.page.PageModel.getInstance().selectedItem.name + "?");
	if(newName != null) silex.page.PageModel.getInstance().renamePage(silex.page.PageModel.getInstance().selectedItem,newName);
}
silex.ui.toolbox.MenuController.openFileBrowser = function() {
	silex.file.kcfinder.FileBrowser.manageFiles(silex.ui.toolbox.MenuController.menuBrixId,"Manage your files and click \"close\"");
}
silex.ui.toolbox.MenuController.bkpAllFileBrowser = function() {
	silex.file.kcfinder.FileBrowser.downloadFolder();
}
silex.ui.toolbox.MenuController.__super__ = brix.component.ui.DisplayObject;
silex.ui.toolbox.MenuController.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		e.preventDefault();
		var target = e.target;
		var itemName = target.getAttribute("data-menu-item");
		if(itemName == null) itemName = target.parentNode.getAttribute("data-menu-item");
		switch(itemName) {
		case "create-file":
			silex.ui.toolbox.MenuController.createFile();
			break;
		case "trash-file":
			silex.ui.toolbox.MenuController.trashFile();
			break;
		case "open-file":
			silex.ui.toolbox.MenuController.openFile();
			break;
		case "view-file":
			silex.ui.toolbox.MenuController.viewFile();
			break;
		case "save-file":
			silex.ui.toolbox.MenuController.saveFile();
			break;
		case "save-file-as":
			silex.ui.toolbox.MenuController.saveFileAs();
			break;
		case "save-file-copy":
			silex.ui.toolbox.MenuController.saveFileCopy();
			break;
		case "add-page":
			silex.ui.toolbox.MenuController.addPage();
			break;
		case "del-page":
			silex.ui.toolbox.MenuController.delPage();
			break;
		case "rename-page":
			silex.ui.toolbox.MenuController.renamePage();
			break;
		case "open-file-browser":
			silex.ui.toolbox.MenuController.openFileBrowser();
			break;
		case "back-up-all":
			silex.ui.toolbox.MenuController.bkpAllFileBrowser();
			break;
		}
	}
	,__class__: silex.ui.toolbox.MenuController
});
silex.ui.toolbox.ToolBoxController = function(rootElement,BrixId) {
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	silex.interpreter.Interpreter.getInstance().expose("ToolBoxController",silex.ui.toolbox.ToolBoxController);
	this.templateContainer = brix.util.DomTools.getSingleElement(rootElement,silex.ui.toolbox.ToolBoxController.TOOL_BOX_CONTROLLER_TEMPLATE,true);
	this.template = this.templateContainer.innerHTML;
	this.templateContainer.innerHTML = "";
	var req = new js.XMLHttpRequest();
	req.onreadystatechange = (function(f,a1) {
		return function() {
			return f(a1);
		};
	})($bind(this,this.onLoadEvent),req);
	req.open("GET",silex.ui.toolbox.ToolBoxController.CSS_DESCRIPTOR_FILE_URL,true);
	req.send(null);
};
$hxClasses["silex.ui.toolbox.ToolBoxController"] = silex.ui.toolbox.ToolBoxController;
silex.ui.toolbox.ToolBoxController.__name__ = ["silex","ui","toolbox","ToolBoxController"];
silex.ui.toolbox.ToolBoxController.__super__ = brix.component.ui.DisplayObject;
silex.ui.toolbox.ToolBoxController.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	redraw: function() {
		var innerHtml = "";
		var t;
		try {
			t = new haxe.Template(this.template);
			innerHtml += t.execute(this.dataProvider,brix.component.template.TemplateMacros);
		} catch( e ) {
			throw "Error: an error occured while interpreting the template - " + this.template + " - with the data " + Std.string(this.dataProvider) + " - error message: " + Std.string(e);
		}
		var _g1 = 0, _g = this.templateContainer.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.getBrixApplication().cleanNode(this.templateContainer.childNodes[i]);
		}
		this.templateContainer.innerHTML = innerHtml;
		var _g1 = 0, _g = this.templateContainer.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.getBrixApplication().initNode(this.templateContainer.childNodes[i]);
		}
	}
	,xmlToObj: function(xml) {
		var res = { categories : []};
		var $it0 = xml.nodes.resolve("category").iterator();
		while( $it0.hasNext() ) {
			var catXml = $it0.next();
			var cat = { name : catXml.node.resolve("name").getInnerData(), groups : []};
			var $it1 = catXml.nodes.resolve("group").iterator();
			while( $it1.hasNext() ) {
				var groupXml = $it1.next();
				var group = { name : groupXml.node.resolve("name").getInnerData(), properties : []};
				var $it2 = groupXml.nodes.resolve("property").iterator();
				while( $it2.hasNext() ) {
					var propXml = $it2.next();
					var prop = { name : propXml.node.resolve("name").getInnerData(), cssName : propXml.node.resolve("cssName").getInnerData(), types : []};
					var $it3 = propXml.nodes.resolve("type").iterator();
					while( $it3.hasNext() ) {
						var typeXml = $it3.next();
						var type = { name : typeXml.node.resolve("name").getInnerData(), options : []};
						var $it4 = typeXml.nodes.resolve("option").iterator();
						while( $it4.hasNext() ) {
							var optionXml = $it4.next();
							var option = { name : optionXml.getInnerData(), help : ""};
							if(optionXml.has.resolve("help")) option.help = optionXml.att.resolve("help");
							type.options.push(option);
						}
						prop.types.push(type);
					}
					group.properties.push(prop);
				}
				cat.groups.push(group);
			}
			res.categories.push(cat);
		}
		return res;
	}
	,onLoadSuccess: function(xmlString) {
		var xmlData = Xml.parse(xmlString);
		var fast = new haxe.xml.Fast(xmlData.firstElement());
		this.dataProvider = this.xmlToObj(fast);
		this.redraw();
		var initialPage = this.rootElement.getAttribute("data-initial-page-name");
		if(initialPage == null) null;
		brix.component.navigation.Page.openPage(initialPage,false,null,null,this.brixInstanceId,this.rootElement);
	}
	,onLoadError: function(message) {
		throw "Could not load the css descriptor XML file " + silex.ui.toolbox.ToolBoxController.CSS_DESCRIPTOR_FILE_URL + ". Error message: " + message;
	}
	,onLoadEvent: function(req) {
		if(req.readyState == 4) {
			if(req.status == 200) this.onLoadSuccess(req.responseText); else this.onLoadError(req.statusText);
		} else {
		}
	}
	,dataProvider: null
	,templateContainer: null
	,template: null
	,__class__: silex.ui.toolbox.ToolBoxController
});
silex.ui.toolbox.editor = {}
silex.ui.toolbox.editor.EditorBase = function(rootElement,BrixId) {
	this.propertyChangePending = false;
	brix.component.ui.DisplayObject.call(this,rootElement,BrixId);
	rootElement.addEventListener("input",$bind(this,this.onInput),true);
	rootElement.addEventListener("change",$bind(this,this.onInput),true);
	rootElement.addEventListener("click",$bind(this,this.onClick),true);
	silex.property.PropertyModel.getInstance().addEventListener("onPropertyChange",$bind(this,this.onPropertyChange),"silex.ui.toolbox.editor.EditorBase class");
	silex.property.PropertyModel.getInstance().addEventListener("onStyleChange",$bind(this,this.onPropertyChange),"silex.ui.toolbox.editor.EditorBase class");
	silex.component.ComponentModel.getInstance().addEventListener("onComponentSelectionChange",$bind(this,this.onSelectComponent),"silex.ui.toolbox.editor.EditorBase class");
	silex.layer.LayerModel.getInstance().addEventListener("onLayerSelectionChange",$bind(this,this.onSelectLayer),"silex.ui.toolbox.editor.EditorBase class");
};
$hxClasses["silex.ui.toolbox.editor.EditorBase"] = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.EditorBase.__name__ = ["silex","ui","toolbox","editor","EditorBase"];
silex.ui.toolbox.editor.EditorBase.__interfaces__ = [brix.component.group.IGroupable];
silex.ui.toolbox.editor.EditorBase.__super__ = brix.component.ui.DisplayObject;
silex.ui.toolbox.editor.EditorBase.prototype = $extend(brix.component.ui.DisplayObject.prototype,{
	onSelectLayer: function(e) {
		if(e.detail == null) this.setSelectedItem(null); else this.setSelectedItem(e.detail.rootElement);
	}
	,onSelectComponent: function(e) {
		this.setSelectedItem(e.detail);
	}
	,onPropertyChange: function(e) {
		if(this.propertyChangePending) return;
		if(e.detail.name == this.propertyName || this.propertyName == null) try {
			this.refresh();
		} catch( e1 ) {
			throw "Error in the implementation of the method reset: " + Std.string(e1);
		} else {
		}
	}
	,refreshSelection: function() {
		if(silex.component.ComponentModel.getInstance().selectedItem != null) silex.component.ComponentModel.getInstance().refresh(); else if(silex.layer.LayerModel.getInstance().selectedItem != null) silex.layer.LayerModel.getInstance().refresh();
	}
	,onClick: function(e) {
	}
	,onInput: function(e) {
		e.preventDefault();
		this.beforeApply();
		try {
			this.apply();
		} catch( e1 ) {
			throw "Error in the implementation of the method apply: " + Std.string(e1);
		}
		this.afterApply();
	}
	,getInputValue: function(name,inputProperty) {
		if(inputProperty == null) inputProperty = "value";
		var element = brix.util.DomTools.getSingleElement(this.rootElement,name,true);
		return Reflect.field(element,inputProperty);
	}
	,setInputValue: function(name,value,inputProperty) {
		if(inputProperty == null) inputProperty = "value";
		var element = brix.util.DomTools.getSingleElement(this.rootElement,name,true);
		element[inputProperty] = value;
	}
	,getOptions: function(name) {
		var element = brix.util.DomTools.getSingleElement(this.rootElement,name,true);
		var options = element.getElementsByTagName("option");
		return options;
	}
	,hasOptionValue: function(name,value) {
		var element = brix.util.DomTools.getSingleElement(this.rootElement,name,true);
		var options = element.getElementsByTagName("option");
		var _g1 = 0, _g = options.length;
		while(_g1 < _g) {
			var idx = _g1++;
			if(options[idx].value == value) return true;
		}
		return false;
	}
	,refresh: function() {
		if(this.selectedItem != null) try {
			this.load(this.selectedItem);
		} catch( e ) {
			throw "Error in the implementation of the method load: " + Std.string(e);
		} else try {
			this.reset();
		} catch( e ) {
			throw "Error in the implementation of the method reset: " + Std.string(e);
		}
	}
	,setSelectedItem: function(item) {
		this.selectedItem = item;
		this.refresh();
		return this.selectedItem;
	}
	,afterApply: function() {
		this.propertyChangePending = false;
	}
	,beforeApply: function() {
		this.propertyChangePending = true;
	}
	,apply: function() {
		throw "this method should be implemented in the derived class";
	}
	,load: function(element) {
		throw "this method should be implemented in the derived class";
	}
	,reset: function() {
		throw "this method should be implemented in the derived class";
	}
	,clean: function() {
		brix.component.ui.DisplayObject.prototype.clean.call(this);
		this.rootElement.removeEventListener("input",$bind(this,this.onInput),true);
		this.rootElement.removeEventListener("change",$bind(this,this.onInput),true);
		this.rootElement.removeEventListener("click",$bind(this,this.onClick),true);
		silex.property.PropertyModel.getInstance().removeEventListener("onPropertyChange",$bind(this,this.onPropertyChange));
		silex.property.PropertyModel.getInstance().removeEventListener("onStyleChange",$bind(this,this.onPropertyChange));
		silex.component.ComponentModel.getInstance().removeEventListener("onComponentSelectionChange",$bind(this,this.onSelectComponent));
		silex.layer.LayerModel.getInstance().removeEventListener("onLayerSelectionChange",$bind(this,this.onSelectLayer));
	}
	,init: function() {
		brix.component.group.Groupable.startGroupable(this,this.rootElement);
		if(this.groupElement == null) null; else {
			this.propertyName = this.groupElement.getAttribute("data-property-name");
			if(this.propertyName == null || this.propertyName == "") null;
		}
		try {
			this.reset();
		} catch( e ) {
			throw "Error in the implementation of the method reset: " + Std.string(e);
		}
	}
	,propertyName: null
	,propertyChangePending: null
	,selectedItem: null
	,groupElement: null
	,__class__: silex.ui.toolbox.editor.EditorBase
	,__properties__: {set_selectedItem:"setSelectedItem"}
});
silex.ui.toolbox.editor.BackgroundPositionEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	this.keywordX = brix.util.DomTools.getSingleElement(rootElement,"keyword-x");
	this.lengthSelectX = brix.util.DomTools.getSingleElement(rootElement,"length-select-x");
	this.lengthInputX = brix.util.DomTools.getSingleElement(rootElement,"length-input-x");
	this.percentageX = brix.util.DomTools.getSingleElement(rootElement,"percentage-x");
	this.keywordY = brix.util.DomTools.getSingleElement(rootElement,"keyword-y");
	this.lengthSelectY = brix.util.DomTools.getSingleElement(rootElement,"length-select-y");
	this.lengthInputY = brix.util.DomTools.getSingleElement(rootElement,"length-input-y");
	this.percentageY = brix.util.DomTools.getSingleElement(rootElement,"percentage-y");
};
$hxClasses["silex.ui.toolbox.editor.BackgroundPositionEditor"] = silex.ui.toolbox.editor.BackgroundPositionEditor;
silex.ui.toolbox.editor.BackgroundPositionEditor.__name__ = ["silex","ui","toolbox","editor","BackgroundPositionEditor"];
silex.ui.toolbox.editor.BackgroundPositionEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.BackgroundPositionEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		var valueX = "0%";
		if(this.percentageX.value != "" && this.percentageX.value != null) valueX = this.percentageX.value + "%"; else if(this.keywordX.value != "") valueX = this.keywordX.value; else if(this.lengthInputX.value != "") {
			valueX = this.lengthInputX.value;
			if(this.lengthSelectX.value != "") valueX += this.lengthSelectX.value; else valueX += "px";
		}
		var valueY = "0%";
		if(this.percentageY.value != "" && this.percentageY.value != null) valueY = this.percentageY.value + "%"; else if(this.keywordY.value != "") valueY = this.keywordY.value; else if(this.lengthInputY.value != "") {
			valueY = this.lengthInputY.value;
			if(this.lengthSelectY.value != "") valueY += this.lengthSelectY.value; else valueY += "px";
		}
		if(valueX != "0%" || valueY != "0%") silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,"background-position",valueX + " " + valueY); else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,"background-position",null);
	}
	,load: function(element) {
		this.reset();
		var value = silex.property.PropertyModel.getInstance().getStyle(element,"background-position");
		if(value != null) {
			value = StringTools.trim(value);
			if(value == "") return;
			var values = value.split(" ");
			var _g1 = 0, _g = values.length;
			while(_g1 < _g) {
				var idx = _g1++;
				values[idx] = StringTools.trim(values[idx]);
			}
			while(HxOverrides.remove(values,"")) {
			}
			if(values.length != 2) return;
			if(values[0] == "0%") values[0] = "left";
			if(values[0] == "50%") values[0] = "center";
			if(values[0] == "100%") values[0] = "right";
			if(values[0] == "left" || values[0] == "center" || values[0] == "right") this.keywordX.value = values[0]; else if(StringTools.endsWith(values[0],"%")) this.percentageX.value = HxOverrides.substr(values[0],0,-1); else {
				var options = this.lengthSelectX.getElementsByTagName("option");
				var unit = "";
				var _g1 = 0, _g = options.length;
				while(_g1 < _g) {
					var idx = _g1++;
					if(StringTools.endsWith(values[0],options[idx].value)) {
						this.lengthInputX.value = Std.string(Std.parseInt(values[0]));
						unit = options[idx].value;
						this.lengthSelectX.value = unit;
						break;
					}
				}
			}
			if(values[1] == "0%") values[1] = "top";
			if(values[1] == "50%") values[1] = "center";
			if(values[1] == "100%") values[1] = "bottom";
			if(values[1] == "top" || values[1] == "center" || values[1] == "bottom") this.keywordY.value = values[1]; else if(StringTools.endsWith(values[1],"%")) this.percentageY.value = HxOverrides.substr(values[1],0,-1); else {
				var options = this.lengthSelectY.getElementsByTagName("option");
				var unit = "";
				var _g1 = 0, _g = options.length;
				while(_g1 < _g) {
					var idx = _g1++;
					if(StringTools.endsWith(values[1],options[idx].value)) {
						this.lengthInputY.value = Std.string(Std.parseInt(values[1]));
						unit = options[idx].value;
						this.lengthSelectY.value = unit;
						break;
					}
				}
			}
		}
	}
	,reset: function() {
		this.keywordX.value = "";
		this.lengthSelectX.value = "";
		this.lengthInputX.value = "";
		this.percentageX.value = "";
		this.keywordY.value = "";
		this.lengthSelectY.value = "";
		this.lengthInputY.value = "";
		this.percentageY.value = "";
	}
	,percentageY: null
	,lengthInputY: null
	,lengthSelectY: null
	,keywordY: null
	,percentageX: null
	,lengthInputX: null
	,lengthSelectX: null
	,keywordX: null
	,__class__: silex.ui.toolbox.editor.BackgroundPositionEditor
});
silex.ui.toolbox.editor.BoolEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("input");
	this.inputElement = elements[0];
	this.dataValue = rootElement.getAttribute("data-value");
};
$hxClasses["silex.ui.toolbox.editor.BoolEditor"] = silex.ui.toolbox.editor.BoolEditor;
silex.ui.toolbox.editor.BoolEditor.__name__ = ["silex","ui","toolbox","editor","BoolEditor"];
silex.ui.toolbox.editor.BoolEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.BoolEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		if(this.inputElement.checked == true) silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,this.dataValue); else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null);
	}
	,load: function(element) {
		var value = silex.property.PropertyModel.getInstance().getStyle(element,this.propertyName);
		if(value == this.dataValue) this.inputElement.checked = true; else this.inputElement.checked = false;
	}
	,reset: function() {
		this.inputElement.checked = false;
	}
	,dataValue: null
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.BoolEditor
});
silex.ui.toolbox.editor.ColorEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("input");
	this.inputElement = elements[0];
	var elements1 = rootElement.getElementsByTagName("input");
	this.checkElement = elements1[1];
};
$hxClasses["silex.ui.toolbox.editor.ColorEditor"] = silex.ui.toolbox.editor.ColorEditor;
silex.ui.toolbox.editor.ColorEditor.__name__ = ["silex","ui","toolbox","editor","ColorEditor"];
silex.ui.toolbox.editor.ColorEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.ColorEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		if(this.checkElement.checked == true) silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null); else {
			var value = this.inputElement.value;
			if(value != "" && value != null) silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,value); else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null);
		}
	}
	,load: function(element) {
		var value = silex.property.PropertyModel.getInstance().getStyle(element,this.propertyName);
		if(value == null || value == "") {
			this.inputElement.value = "";
			this.checkElement.checked = true;
		} else {
			this.checkElement.checked = false;
			if(StringTools.startsWith(value.toLowerCase(),"rgb(") || StringTools.startsWith(value.toLowerCase(),"rgba(")) {
				var decValue = 0;
				value = HxOverrides.substr(value,value.indexOf("(") + 1,null);
				value = HxOverrides.substr(value,0,value.lastIndexOf(")"));
				var values = value.split(",");
				decValue = Std.parseInt(values[0]) * 255 * 255 + Std.parseInt(values[1]) * 255 + Std.parseInt(values[2]);
				if(values.length == 4) {
					decValue *= 255;
					decValue += Math.round(Std.parseFloat(values[3]) * 255);
				}
				this.inputElement.value = "#" + StringTools.hex(decValue,6);
			} else this.inputElement.value = value;
		}
	}
	,reset: function() {
		this.inputElement.value = "";
		this.checkElement.checked = true;
	}
	,checkElement: null
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.ColorEditor
});
silex.ui.toolbox.editor.HtmlEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
};
$hxClasses["silex.ui.toolbox.editor.HtmlEditor"] = silex.ui.toolbox.editor.HtmlEditor;
silex.ui.toolbox.editor.HtmlEditor.__name__ = ["silex","ui","toolbox","editor","HtmlEditor"];
silex.ui.toolbox.editor.HtmlEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.HtmlEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	reset: function() {
		var textArea = brix.util.DomTools.getSingleElement(this.rootElement,"text-input",true);
		textArea.value = "";
	}
	,load: function(element) {
		var textArea = brix.util.DomTools.getSingleElement(this.rootElement,"text-input",true);
		textArea.value = element.innerHTML;
	}
	,apply: function() {
		var textArea = brix.util.DomTools.getSingleElement(this.rootElement,"text-input",true);
		var value = textArea.value;
		silex.property.PropertyModel.getInstance().setProperty(this.selectedItem,"innerHTML",value);
	}
	,__class__: silex.ui.toolbox.editor.HtmlEditor
});
silex.ui.toolbox.editor.InlineDropdownEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("select");
	this.inputElement = elements[0];
};
$hxClasses["silex.ui.toolbox.editor.InlineDropdownEditor"] = silex.ui.toolbox.editor.InlineDropdownEditor;
silex.ui.toolbox.editor.InlineDropdownEditor.__name__ = ["silex","ui","toolbox","editor","InlineDropdownEditor"];
silex.ui.toolbox.editor.InlineDropdownEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.InlineDropdownEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		var value = this.inputElement.value;
		if(value != "" && value != null) silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,value); else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null);
	}
	,load: function(element) {
		var value = silex.property.PropertyModel.getInstance().getStyle(element,this.propertyName);
		this.inputElement.value = value;
	}
	,reset: function() {
		this.inputElement.value = "";
	}
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.InlineDropdownEditor
});
silex.ui.toolbox.editor.LengthEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("input");
	this.inputElement = elements[0];
	var elements1 = rootElement.getElementsByTagName("select");
	this.unitElement = elements1[0];
};
$hxClasses["silex.ui.toolbox.editor.LengthEditor"] = silex.ui.toolbox.editor.LengthEditor;
silex.ui.toolbox.editor.LengthEditor.__name__ = ["silex","ui","toolbox","editor","LengthEditor"];
silex.ui.toolbox.editor.LengthEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.LengthEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		var value = this.inputElement.value;
		var unit = this.unitElement.value;
		if(value != "" && value != null && unit != "" && unit != null) silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,value + unit); else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null);
	}
	,load: function(element) {
		var value = silex.property.PropertyModel.getInstance().getStyle(element,this.propertyName);
		if(value == null || value == "") this.reset(); else {
			var options = this.unitElement.getElementsByTagName("option");
			var unit = "";
			var _g1 = 0, _g = options.length;
			while(_g1 < _g) {
				var idx = _g1++;
				if(StringTools.endsWith(value,options[idx].value)) {
					this.inputElement.value = Std.string(Std.parseInt(value));
					unit = options[idx].value;
					this.unitElement.value = unit;
				}
			}
			if(unit == "") this.reset();
		}
	}
	,reset: function() {
		this.inputElement.value = "";
		this.unitElement.value = "px";
	}
	,unitElement: null
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.LengthEditor
});
silex.ui.toolbox.editor.LinkEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("input");
	this.inputElement = elements[0];
	var elements1 = rootElement.getElementsByTagName("select");
	this.targetElement = elements1[0];
	var elements2 = rootElement.getElementsByTagName("button");
	this.resetPageNameButton = elements2[0];
	var elements3 = rootElement.getElementsByTagName("select");
	this.pageSelectElement = elements3[1];
	this.resetPageNameButton.addEventListener("click",$bind(this,this.resetPageNameSelector),true);
};
$hxClasses["silex.ui.toolbox.editor.LinkEditor"] = silex.ui.toolbox.editor.LinkEditor;
silex.ui.toolbox.editor.LinkEditor.__name__ = ["silex","ui","toolbox","editor","LinkEditor"];
silex.ui.toolbox.editor.LinkEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.LinkEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		var value = this.inputElement.value;
		if(value != "" && value != null) {
			silex.component.ComponentModel.getInstance().makeLinkToPage(this.selectedItem,value);
			var value1 = this.targetElement.value;
			silex.property.PropertyModel.getInstance().setAttribute(this.selectedItem,"target",value1);
		} else if((value = this.pageSelectElement.value) != "") silex.component.ComponentModel.getInstance().makeLinkToPage(this.selectedItem,value); else {
			silex.component.ComponentModel.getInstance().resetLinkToPage(this.selectedItem);
			silex.property.PropertyModel.getInstance().setAttribute(this.selectedItem,"data-href",null);
			silex.property.PropertyModel.getInstance().removeAttribute(this.selectedItem,"target");
		}
	}
	,load: function(element) {
		if(!brix.util.DomTools.hasClass(element,"SilexLink") || silex.file.FileModel.getInstance().application == null) this.reset(); else {
			var value = silex.property.PropertyModel.getInstance().getAttribute(element,"data-href");
			if(silex.ui.link.SilexLink.isUrl(value)) {
				this.inputElement.value = value;
				var value1 = silex.property.PropertyModel.getInstance().getAttribute(element,"target");
				this.targetElement.value = value1;
			} else if(silex.ui.link.SilexLink.isPage(value,silex.file.FileModel.getInstance().application.id)) this.pageSelectElement.value = value; else this.reset();
		}
	}
	,reset: function() {
		this.inputElement.value = "";
		this.targetElement.value = "";
		this.pageSelectElement.selectedIndex = -1;
	}
	,resetPageNameSelector: function(e) {
		e.preventDefault();
		this.pageSelectElement.selectedIndex = -1;
		this.apply();
	}
	,pageSelectElement: null
	,resetPageNameButton: null
	,targetElement: null
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.LinkEditor
});
silex.ui.toolbox.editor.PercentageEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("input");
	if(elements.length == 0) elements = rootElement.getElementsByTagName("textarea");
	this.inputElement = elements[0];
};
$hxClasses["silex.ui.toolbox.editor.PercentageEditor"] = silex.ui.toolbox.editor.PercentageEditor;
silex.ui.toolbox.editor.PercentageEditor.__name__ = ["silex","ui","toolbox","editor","PercentageEditor"];
silex.ui.toolbox.editor.PercentageEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.PercentageEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		var value = this.inputElement.value;
		if(value != "" && value != null) silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,value + "%"); else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null);
	}
	,load: function(element) {
		var value = silex.property.PropertyModel.getInstance().getStyle(element,this.propertyName);
		value = StringTools.trim(value);
		if(StringTools.endsWith(value,"%")) this.inputElement.value = HxOverrides.substr(value,0,-1); else this.reset();
	}
	,reset: function() {
		this.inputElement.value = "";
	}
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.PercentageEditor
});
silex.ui.toolbox.editor.UrlEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("input");
	if(elements.length == 0) elements = rootElement.getElementsByTagName("textarea");
	this.inputElement = elements[0];
};
$hxClasses["silex.ui.toolbox.editor.UrlEditor"] = silex.ui.toolbox.editor.UrlEditor;
silex.ui.toolbox.editor.UrlEditor.__name__ = ["silex","ui","toolbox","editor","UrlEditor"];
silex.ui.toolbox.editor.UrlEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.UrlEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	onMultipleFilesChosen: function(inputControlClassName,files) {
		var inputElement = brix.util.DomTools.getSingleElement(this.rootElement,inputControlClassName,true);
		var value = inputElement.value;
		if(value != "") value += "\n";
		value = StringTools.replace(value,"none\n","");
		var _g = 0;
		while(_g < files.length) {
			var sourceUrl = files[_g];
			++_g;
			value += silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(sourceUrl) + "\n";
		}
		inputElement.value = value;
		this.beforeApply();
		try {
			this.apply();
		} catch( e ) {
			throw "Error in the implementation of the method apply: " + Std.string(e);
		}
		this.afterApply();
		brix.util.DomTools.doLater($bind(this,this.refreshSelection));
	}
	,onFileChosen: function(inputControlClassName,fileUrl) {
		var inputElement = brix.util.DomTools.getSingleElement(this.rootElement,inputControlClassName,true);
		inputElement.value = silex.file.kcfinder.FileBrowser.getRelativeURLFromFileBrowser(fileUrl);
		this.beforeApply();
		try {
			this.apply();
		} catch( e ) {
			throw "Error in the implementation of the method apply: " + Std.string(e);
		}
		this.afterApply();
		brix.util.DomTools.doLater($bind(this,this.refreshSelection));
	}
	,onClick: function(e) {
		silex.ui.toolbox.editor.EditorBase.prototype.onClick.call(this,e);
		if(brix.util.DomTools.hasClass(e.target,"add-multiple-files-button")) {
			e.preventDefault();
			var inputControlClassName = e.target.getAttribute("data-fb-target");
			var cbk = (function(f,a1) {
				return function(a2) {
					return f(a1,a2);
				};
			})($bind(this,this.onMultipleFilesChosen),inputControlClassName);
			silex.file.kcfinder.FileBrowser.selectMultipleFiles(cbk,this.brixInstanceId,null,"files/assets/");
		} else if(brix.util.DomTools.hasClass(e.target,"select-file-button")) {
			e.preventDefault();
			var inputControlClassName = e.target.getAttribute("data-fb-target");
			var cbk = (function(f,a1) {
				return function(a2) {
					return f(a1,a2);
				};
			})($bind(this,this.onFileChosen),inputControlClassName);
			silex.file.kcfinder.FileBrowser.selectFile(cbk,this.brixInstanceId,null,"files/assets/");
		}
	}
	,apply: function() {
		var value = this.inputElement.value;
		if(value != "" && value != null) {
			var urls = value.split("\n");
			var res = "";
			var _g = 0;
			while(_g < urls.length) {
				var entry = urls[_g];
				++_g;
				if(StringTools.trim(entry) == "") continue;
				if(res != "") res += ", ";
				if(entry == "none" || entry == "inherit") res += entry; else res += "url('" + brix.util.DomTools.abs2rel(entry) + "')";
			}
			silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,res);
		} else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null);
	}
	,load: function(element) {
		var value = silex.property.PropertyModel.getInstance().getStyle(element,this.propertyName);
		var values = value.split(",");
		var urls = new Array();
		var _g1 = 0, _g = values.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var value1 = values[idx];
			value1 = StringTools.trim(value1);
			if(StringTools.startsWith(value1.toLowerCase(),"url")) {
				value1 = HxOverrides.substr(value1,value1.indexOf("(") + 1,null);
				value1 = HxOverrides.substr(value1,0,value1.lastIndexOf(")"));
				value1 = StringTools.trim(value1);
				if(StringTools.startsWith(value1,"\"") || StringTools.startsWith(value1,"'")) {
					value1 = HxOverrides.substr(value1,1,null);
					value1 = HxOverrides.substr(value1,0,value1.length - 1);
					value1 = StringTools.trim(value1);
				}
				value1 = brix.util.DomTools.abs2rel(value1);
			}
			urls.push(value1);
		}
		this.inputElement.value = urls.join("\n");
	}
	,reset: function() {
		this.inputElement.value = "";
	}
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.UrlEditor
});
silex.ui.toolbox.editor.PropertyEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.UrlEditor.call(this,rootElement,BrixId);
};
$hxClasses["silex.ui.toolbox.editor.PropertyEditor"] = silex.ui.toolbox.editor.PropertyEditor;
silex.ui.toolbox.editor.PropertyEditor.__name__ = ["silex","ui","toolbox","editor","PropertyEditor"];
silex.ui.toolbox.editor.PropertyEditor.__super__ = silex.ui.toolbox.editor.UrlEditor;
silex.ui.toolbox.editor.PropertyEditor.prototype = $extend(silex.ui.toolbox.editor.UrlEditor.prototype,{
	apply: function() {
		var propertyModel = silex.property.PropertyModel.getInstance();
		var value = this.getInputValue("name-property");
		if(value != null && value != "") propertyModel.setAttribute(this.selectedItem,"data-silex-name",this.getInputValue("name-property")); else propertyModel.setAttribute(this.selectedItem,"data-silex-name",null);
		var value1 = this.getInputValue("title-property");
		if(value1 != null && value1 != "") propertyModel.setAttribute(this.selectedItem,"title",this.getInputValue("title-property")); else propertyModel.setAttribute(this.selectedItem,"title",null);
		var value2 = this.getInputValue("alt-property");
		if(value2 != null && value2 != "") propertyModel.setAttribute(this.selectedItem,"alt",this.getInputValue("alt-property")); else propertyModel.setAttribute(this.selectedItem,"alt",null);
		var value3 = this.getInputValue("src-property");
		if(value3 != null && value3 != "") propertyModel.setProperty(this.selectedItem,"src",brix.util.DomTools.abs2rel(value3)); else if(Reflect.hasField(this.selectedItem,"src")) propertyModel.setProperty(this.selectedItem,"src","");
		var modelHtmlDom = silex.file.FileModel.getInstance().getModelFromView(this.selectedItem);
		var sources = modelHtmlDom.getElementsByTagName("source");
		var _g1 = 0, _g = sources.length;
		while(_g1 < _g) {
			var idx = _g1++;
			sources[0].parentNode.removeChild(sources[0]);
		}
		var sources1 = this.selectedItem.getElementsByTagName("source");
		var _g1 = 0, _g = sources1.length;
		while(_g1 < _g) {
			var idx = _g1++;
			sources1[0].parentNode.removeChild(sources1[0]);
		}
		var value4 = this.getInputValue("multiple-src-property");
		if(value4 != null) {
			var urls = value4.split("\n");
			var _g = 0;
			while(_g < urls.length) {
				var sourceUrl = urls[_g];
				++_g;
				if(sourceUrl != "") {
					var sourceElement = js.Lib.document.createElement("source");
					sourceElement.src = brix.util.DomTools.abs2rel(sourceUrl);
					modelHtmlDom.appendChild(sourceElement);
					var sourceElement1 = js.Lib.document.createElement("source");
					sourceElement1.src = brix.util.DomTools.abs2rel(sourceUrl);
					this.selectedItem.appendChild(sourceElement1);
				}
			}
		}
		var value5 = this.getInputValue("auto-start-property","checked");
		if(value5 == true) propertyModel.setProperty(this.selectedItem,"autoplay","autoplay"); else propertyModel.setProperty(this.selectedItem,"autoplay",null);
		var value6 = this.getInputValue("controls-property","checked");
		if(value6 == true) propertyModel.setProperty(this.selectedItem,"controls","controls"); else propertyModel.setProperty(this.selectedItem,"controls",null);
		var value7 = this.getInputValue("loop-property","checked");
		if(value7 == true) propertyModel.setProperty(this.selectedItem,"loop","loop"); else propertyModel.setProperty(this.selectedItem,"loop",null);
		var value8 = this.getInputValue("master-property","checked");
		if(value8 == true) propertyModel.setAttribute(this.selectedItem,"data-master","true"); else propertyModel.setAttribute(this.selectedItem,"data-master",null);
	}
	,load: function(element) {
		var propertyModel = silex.property.PropertyModel.getInstance();
		var value = propertyModel.getAttribute(element,"data-silex-name");
		if(value != null) this.setInputValue("name-property",value);
		var value1 = propertyModel.getAttribute(element,"title");
		if(value1 != null) this.setInputValue("title-property",value1);
		var value2 = propertyModel.getAttribute(element,"alt");
		if(value2 != null) this.setInputValue("alt-property",value2);
		var value3 = propertyModel.getProperty(element,"src");
		if(value3 != null) this.setInputValue("src-property",brix.util.DomTools.abs2rel(value3)); else this.setInputValue("src-property","");
		var sources = silex.file.FileModel.getInstance().getModelFromView(element).getElementsByTagName("source");
		var value4 = "";
		var _g1 = 0, _g = sources.length;
		while(_g1 < _g) {
			var idx = _g1++;
			value4 += brix.util.DomTools.abs2rel(sources[idx].src) + "\n";
		}
		this.setInputValue("multiple-src-property",value4);
		var value5 = propertyModel.getProperty(element,"autoplay");
		if(value5 == null || value5 == false) this.setInputValue("auto-start-property",null,"checked"); else this.setInputValue("auto-start-property","checked","checked");
		var value6 = propertyModel.getProperty(element,"loop");
		if(value6 == null || value6 == false) this.setInputValue("loop-property",null,"checked"); else this.setInputValue("loop-property","checked","checked");
		var value7 = propertyModel.getProperty(element,"controls");
		if(value7 == null || value7 == false) this.setInputValue("controls-property",null,"checked"); else this.setInputValue("controls-property","checked","checked");
		var value8 = propertyModel.getAttribute(element,"data-master");
		if(value8 == null || value8 == false) this.setInputValue("master-property",null,"checked"); else this.setInputValue("master-property","checked","checked");
	}
	,reset: function() {
		this.setInputValue("name-property","");
		this.setInputValue("title-property","");
		this.setInputValue("alt-property","");
		this.setInputValue("multiple-src-property","");
		this.setInputValue("src-property","");
		this.setInputValue("auto-start-property",null,"checked");
		this.setInputValue("controls-property",null,"checked");
		this.setInputValue("loop-property",null,"checked");
		this.setInputValue("master-property",null,"checked");
	}
	,onTextEditorChange: function(item,htmlText) {
		silex.property.PropertyModel.getInstance().setProperty(item,"innerHTML",htmlText);
	}
	,onClick: function(e) {
		silex.ui.toolbox.editor.UrlEditor.prototype.onClick.call(this,e);
		var target = e.target;
		if(brix.util.DomTools.hasClass(target,"property-editor-delete-selected")) {
			e.preventDefault();
			if(brix.util.DomTools.hasClass(this.selectedItem,"Layer")) {
				var layer = silex.layer.LayerModel.getInstance().selectedItem;
				var page = silex.page.PageModel.getInstance().selectedItem;
				var name = layer.rootElement.getAttribute("data-silex-name");
				if(name == null) name = "";
				var confirm = js.Lib.window.confirm("I am about to delete the container " + name + ". Are you sure?");
				if(confirm == true) silex.layer.LayerModel.getInstance().removeLayer(layer,page.name);
			} else {
				var name = this.selectedItem.getAttribute("data-silex-name");
				if(name == null) name = "";
				var confirm = js.Lib.window.confirm("I am about to delete the component " + name + ". Are you sure?");
				if(confirm == true) silex.component.ComponentModel.getInstance().removeComponent(this.selectedItem);
			}
		} else if(brix.util.DomTools.hasClass(e.target,"property-editor-edit-text")) {
			e.preventDefault();
			silex.property.TextEditor.openTextEditor((function(f,a1) {
				return function(a2) {
					return f(a1,a2);
				};
			})($bind(this,this.onTextEditorChange),this.selectedItem),this.selectedItem.innerHTML,this.brixInstanceId);
		}
	}
	,onPropertyChange: function(e) {
		if(this.propertyChangePending) return;
		this.refresh();
	}
	,__class__: silex.ui.toolbox.editor.PropertyEditor
});
silex.ui.toolbox.editor.StringEditor = function(rootElement,BrixId) {
	silex.ui.toolbox.editor.EditorBase.call(this,rootElement,BrixId);
	var elements = rootElement.getElementsByTagName("input");
	if(elements.length == 0) elements = rootElement.getElementsByTagName("textarea");
	this.inputElement = elements[0];
};
$hxClasses["silex.ui.toolbox.editor.StringEditor"] = silex.ui.toolbox.editor.StringEditor;
silex.ui.toolbox.editor.StringEditor.__name__ = ["silex","ui","toolbox","editor","StringEditor"];
silex.ui.toolbox.editor.StringEditor.__super__ = silex.ui.toolbox.editor.EditorBase;
silex.ui.toolbox.editor.StringEditor.prototype = $extend(silex.ui.toolbox.editor.EditorBase.prototype,{
	apply: function() {
		var value = this.inputElement.value;
		if(value != "" && value != null) silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,value); else silex.property.PropertyModel.getInstance().setStyle(this.selectedItem,this.propertyName,null);
	}
	,load: function(element) {
		var value = silex.property.PropertyModel.getInstance().getStyle(element,this.propertyName);
		this.inputElement.value = value;
	}
	,reset: function() {
		this.inputElement.value = "";
	}
	,inputElement: null
	,__class__: silex.ui.toolbox.editor.StringEditor
});
silex.util = {}
silex.util.SilexTools = function() { }
$hxClasses["silex.util.SilexTools"] = silex.util.SilexTools;
silex.util.SilexTools.__name__ = ["silex","util","SilexTools"];
silex.util.SilexTools.cleanupName = function(name) {
	return name.toLowerCase().split(" ").join("-").split("'").join("-").split("\"").join("");
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.Prolog = "prolog";
Xml.Document = "document";
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
DateTools.DAYS_OF_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
brix.component.group.Group.GROUP_ID_ATTR = "data-group-id";
brix.component.group.Group.GROUP_SEQ = 0;
brix.component.interaction.Draggable.CSS_CLASS_DRAGZONE = "draggable-dragzone";
brix.component.interaction.Draggable.DEFAULT_CSS_CLASS_DROPZONE = "draggable-dropzone";
brix.component.interaction.Draggable.DEFAULT_CSS_CLASS_PHANTOM = "draggable-phantom";
brix.component.interaction.Draggable.ATTR_PHANTOM = "data-phantom-class-name";
brix.component.interaction.Draggable.ATTR_DROPZONE = "data-dropzones-class-name";
brix.component.interaction.Draggable.DELAY_BETWEEN_DROP_ZONE_CHECKS = 10;
brix.component.interaction.Draggable.EVENT_DRAG = "dragEventDrag";
brix.component.interaction.Draggable.EVENT_DROPPED = "dragEventDropped";
brix.component.interaction.Draggable.EVENT_MOVE = "dragEventMove";
brix.component.interaction.NotificationManager.DEFAULT_MESSAGE_DURATION = 10000;
brix.component.interaction.NotificationManager.DEFAULT_SUCCESS_ICON = "assets/admin/notification-info.png";
brix.component.interaction.NotificationManager.DEFAULT_ERROR_ICON = "assets/admin/notification-error.png";
brix.component.interaction.NotificationManager.CSS_CLASS_NOTIFICAITON_ZONE = "notification-zone";
brix.component.interaction.NotificationManager.NOTIFICATION_EVENT = "notificationEvent";
brix.component.layout.LayoutBase.EVENT_LAYOUT_REDRAW = "layoutRedraw";
brix.component.layout.Accordion.DEFAULT_CSS_CLASS_HEADER = "accordion-header";
brix.component.layout.Accordion.DEFAULT_CSS_CLASS_ITEM = "accordion-item";
brix.component.layout.Accordion.ATTR_IS_HORIZONTAL = "data-accordion-is-horizontal";
brix.component.layout.Panel.DEFAULT_CSS_CLASS_HEADER = "panel-header";
brix.component.layout.Panel.DEFAULT_CSS_CLASS_BODY = "panel-body";
brix.component.layout.Panel.DEFAULT_CSS_CLASS_FOOTER = "panel-footer";
brix.component.layout.Panel.ATTR_CSS_CLASS_HEADER = "data-panel-header-class-name";
brix.component.layout.Panel.ATTR_CSS_CLASS_BODY = "data-panel-body-class-name";
brix.component.layout.Panel.ATTR_CSS_CLASS_FOOTER = "data-panel-footer-class-name";
brix.component.layout.Panel.ATTR_IS_HORIZONTAL = "data-panel-is-horizontal";
brix.component.list.List.__meta__ = { obj : { tagNameFilter : ["ul"]}};
brix.component.list.List.LIST_SELECTED_ITEM_CSS_CLASS = "listSelectedItem";
brix.component.list.List.DATA_ATTR_LIST_ITEM_INDEX = "data-list-item-idx";
brix.component.list.List.EVENT_CHANGE = "listChange";
brix.component.list.List.EVENT_CLICK = "listClick";
brix.component.list.List.EVENT_ROLL_OVER = "listRollOver";
brix.component.navigation.ContextManager.PARAM_DATA_CONTEXT_LIST = "data-context-list";
brix.component.navigation.ContextManager.PARAM_DATA_INITIAL_CONTEXT = "data-initial-context";
brix.component.navigation.ContextManager.EVENT_CONTEXT_CHANGE = "changeContextEvent";
brix.component.navigation.ContextManager.EVENT_ADD_CONTEXTS = "addContextsEvent";
brix.component.navigation.ContextManager.EVENT_REMOVE_CONTEXTS = "removeContextsEvent";
brix.component.navigation.ContextManager.EVENT_REPLACE_CONTEXTS = "replaceContextsEvent";
brix.component.navigation.ContextManager.EVENT_RESET_CONTEXTS = "resetContextsEvent";
brix.component.navigation.Layer.EVENT_TYPE_SHOW_START = "onLayerShowStart";
brix.component.navigation.Layer.EVENT_TYPE_HIDE_START = "onLayerHideStart";
brix.component.navigation.Layer.EVENT_TYPE_SHOW_STOP = "onLayerShowStop";
brix.component.navigation.Layer.EVENT_TYPE_HIDE_STOP = "onLayerHideStop";
brix.component.navigation.Layer.MAX_DELAY_FOR_TRANSITION = 2500;
brix.component.navigation.Page.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.Page.CLASS_NAME = "Page";
brix.component.navigation.Page.CONFIG_NAME_ATTR = "name";
brix.component.navigation.Page.CONFIG_USE_DEEPLINK = "useDeeplink";
brix.component.navigation.Page.CONFIG_INITIAL_PAGE_NAME = "initialPageName";
brix.component.navigation.Page.ATTRIBUTE_INITIAL_PAGE_NAME = "data-initial-page-name";
brix.component.navigation.Page.OPENED_PAGE_CSS_CLASS = "page-opened";
brix.component.navigation.Page.EVENT_TYPE_OPEN_START = "pageOpenStart";
brix.component.navigation.Page.EVENT_TYPE_OPEN_STOP = "pageOpenStop";
brix.component.navigation.Page.EVENT_TYPE_CLOSE_START = "pageCloseStart";
brix.component.navigation.Page.EVENT_TYPE_CLOSE_STOP = "pageCloseStop";
brix.component.navigation.Page.useDeeplink = null;
brix.component.navigation.link.LinkBase.__meta__ = { obj : { tagNameFilter : ["a","div"]}};
brix.component.navigation.link.LinkBase.CONFIG_PAGE_NAME_ATTR = "href";
brix.component.navigation.link.LinkBase.CONFIG_PAGE_NAME_DATA_ATTR = "data-href";
brix.component.navigation.link.LinkBase.CONFIG_TARGET_ATTR = "target";
brix.component.navigation.link.LinkBase.CONFIG_TARGET_IS_POPUP = "_top";
brix.component.navigation.link.LinkClosePage.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.link.LinkToPage.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.navigation.transition.TransitionTools.SHOW_START_STYLE_ATTR_NAME = "data-show-start-style";
brix.component.navigation.transition.TransitionTools.SHOW_END_STYLE_ATTR_NAME = "data-show-end-style";
brix.component.navigation.transition.TransitionTools.HIDE_START_STYLE_ATTR_NAME = "data-hide-start-style";
brix.component.navigation.transition.TransitionTools.HIDE_END_STYLE_ATTR_NAME = "data-hide-end-style";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_REQUEST = "transitionEventTypeRequest";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_STARTED = "transitionEventTypeStarted";
brix.component.navigation.transition.TransitionTools.EVENT_TYPE_ENDED = "transitionEventTypeEnded";
brix.component.sound.SoundOn.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.sound.SoundOn.CLASS_NAME = "SoundOn";
brix.component.sound.SoundOn.isMuted = false;
brix.component.sound.SoundOff.__meta__ = { obj : { tagNameFilter : ["a"]}};
brix.component.sound.SoundOff.CLASS_NAME = "SoundOff";
brix.core.Application.BRIX_ID_ATTR_NAME = "data-brix-id";
brix.core.Application.instances = new Hash();
brix.util.NodeTypes.ELEMENT_NODE = 1;
brix.util.NodeTypes.ATTRIBUTE_NODE = 2;
brix.util.NodeTypes.TEXT_NODE = 3;
brix.util.NodeTypes.CDATA_SECTION_NODE = 4;
brix.util.NodeTypes.ENTITY_REFERENCE_NODE = 5;
brix.util.NodeTypes.ENTITY_NODE = 6;
brix.util.NodeTypes.PROCESSING_INSTRUCTION_NODE = 7;
brix.util.NodeTypes.COMMENT_NODE = 8;
brix.util.NodeTypes.DOCUMENT_NODE = 9;
brix.util.NodeTypes.DOCUMENT_TYPE_NODE = 10;
brix.util.NodeTypes.DOCUMENT_FRAGMENT_NODE = 11;
brix.util.NodeTypes.NOTATION_NODE = 12;
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
haxe.io.Output.LN2 = Math.log(2);
hscript.Parser.p1 = 0;
hscript.Parser.readPos = 0;
hscript.Parser.tokenMin = 0;
hscript.Parser.tokenMax = 0;
js.Lib.onerror = null;
silex.ServiceBase.GATEWAY_URL = "../";
silex.Silex.CONFIG_FILE_BODY = "fileBody";
silex.Silex.CONFIG_USE_DEEPLINK = "useDeeplink";
silex.Silex.CHECK_INSTALL_SCRIPT = "../libs/dropbox/checkInstall.php";
silex.component.ComponentModel.COMPONENT_ID_ATTRIBUTE_NAME = "data-silex-component-id";
silex.component.ComponentModel.NAME_ATTRIBUTE_NAME = "data-silex-name";
silex.component.ComponentModel.DEBUG_INFO = "ComponentModel class";
silex.component.ComponentModel.ON_SELECTION_CHANGE = "onComponentSelectionChange";
silex.component.ComponentModel.ON_HOVER_CHANGE = "onComponentHoverChange";
silex.component.ComponentModel.ON_LIST_CHANGE = "onComponentListChange";
silex.file.FileModel.DEBUG_INFO = "FileModel class";
silex.file.FileModel.DROPBOX_GET_FILE = "../libs/dropbox/";
silex.file.FileModel.CLASS_NAME_MAIN_GROUP = "silex-main-group";
silex.file.FileModel.BUILDER_ROOT_NODE_CLASS = "silex-view";
silex.file.FileModel.CREATION_TEMPLATE_FILE_NAME = "creation-template.html";
silex.file.FileModel.ON_LOAD_START = "onLoadStart";
silex.file.FileModel.ON_LOAD_SUCCESS = "onLoadSuccess";
silex.file.FileModel.ON_ERROR = "onFileError";
silex.file.FileModel.ON_SAVE_START = "onFileSaveStart";
silex.file.FileModel.ON_SAVE_SUCCESS = "onFileSaveSuccess";
silex.file.FileModel.ON_SAVE_ERROR = "onFileSaveError";
silex.file.FileModel.nextId = 0;
silex.file.client.FileService.SERVICE_NAME = "FileService";
silex.file.kcfinder.FileBrowser.FB_PAGE_NAME = "file-browser-dialog";
silex.file.kcfinder.FileBrowser.KC_FINDER_URL = "../libs/kcfinder/";
silex.file.kcfinder.FileBrowser.FB_CLASS_NAME = "file-browser-div";
silex.file.kcfinder.FileBrowser.FB_MESSAGE_CLASS_NAME = "message-zone";
silex.file.kcfinder.FileBrowser.expectMultipleFiles = false;
silex.interpreter.Interpreter.BASIC_CONTEXT = { Lib : js.Lib, Math : Math, Timer : haxe.Timer, StringTools : StringTools, DomTools : brix.util.DomTools, Application : brix.core.Application, Page : brix.component.navigation.Page, Layer : brix.component.navigation.Layer};
silex.layer.LayerModel.LAYER_ID_ATTRIBUTE_NAME = "data-silex-layer-id";
silex.layer.LayerModel.NAME_ATTRIBUTE_NAME = "data-silex-name";
silex.layer.LayerModel.DEBUG_INFO = "LayerModel class";
silex.layer.LayerModel.ON_SELECTION_CHANGE = "onLayerSelectionChange";
silex.layer.LayerModel.ON_HOVER_CHANGE = "onLayerHoverChange";
silex.layer.LayerModel.ON_LIST_CHANGE = "onLayerListChange";
silex.layer.LayerModel.MASTER_PROPERTY_NAME = "data-master";
silex.layer.LayerModel.NEW_LAYER_NAME = "container1";
silex.layer.LayerModel.NEW_LAYER_CSS_CLASS = "container";
silex.layer.LayerModel.HEADER_LAYER_NAME = "header";
silex.layer.LayerModel.FOOTER_LAYER_NAME = "footer";
silex.layer.LayerModel.NAV_LAYER_NAME = "nav";
silex.layer.LayerModel.SIDE_BAR_LAYER_NAME = "side-bar";
silex.layer.LayerModel.REQUIRED_CONTAINERS = ["header","footer","nav","side-bar"];
silex.page.PageModel.DEBUG_INFO = "PageModel class";
silex.page.PageModel.ON_SELECTION_CHANGE = "onPageSelectionChange";
silex.page.PageModel.ON_HOVER_CHANGE = "onPageHoverChange";
silex.page.PageModel.ON_LIST_CHANGE = "onPageListChange";
silex.property.PropertyModel.DEBUG_INFO = "PropertyModel class";
silex.property.PropertyModel.ON_STYLE_CHANGE = "onStyleChange";
silex.property.PropertyModel.ON_PROPERTY_CHANGE = "onPropertyChange";
silex.ui.dialog.DialogBase.SUBMIT_BUTTON_CLASS_NAME = "validate-button";
silex.ui.dialog.DialogBase.CANCEL_BUTTON_CLASS_NAME = "cancel-button";
silex.ui.dialog.DialogBase.CONFIG_DIALOG_NAME = "data-dialog-name";
silex.ui.dialog.AuthDialog.LOADING_PAGE_NAME = "loading-pending";
silex.ui.dialog.AuthDialog.ERROR_TEXT_FIELD_CLASS_NAME = "error-text";
silex.ui.dialog.AuthDialog.LOGIN_INPUT_FIELD_CLASS_NAME = "input-field-login";
silex.ui.dialog.AuthDialog.PASSWORD_INPUT_FIELD_CLASS_NAME = "input-field-pass";
silex.ui.dialog.AuthDialog.LOGIN_INPUT_FIELD_NOT_FOUND = "Could not find the input field for login. It is expected to have input-field-login as a css class name.";
silex.ui.dialog.AuthDialog.PASSWORD_INPUT_FIELD_NOT_FOUND = "Could not find the input field for password. It is expected to have input-field-pass as a css class name.";
silex.ui.dialog.AuthDialog.ALL_FIELDS_REQUIRED = "All fields are required.";
silex.ui.dialog.AuthDialog.NETWORK_ERROR = "Network error.";
silex.ui.dialog.TextEditorDialog.TEXT_EDITOR_CONTAINER_CLASS_NAME = "text-editor-div";
silex.ui.dialog.TextEditorDialog.MESSAGE_ZONE_CLASS_NAME = "message-zone";
silex.ui.dialog.TextEditorDialog.TEXT_EDITOR_PAGE_NAME = "text-editor-dialog";
silex.ui.dialog.TextEditorDialog.TEXT_EDITOR_HTML_PAGE = "../libs/ckeditor/ckeditor.html";
silex.ui.list.LayersList.__meta__ = { obj : { tagNameFilter : ["ul"]}};
silex.ui.list.LayersList.DEBUG_INFO = "LayersList class";
silex.ui.list.PageList.DEBUG_INFO = "PageList class";
silex.ui.script.HScriptTag.executed = false;
silex.ui.stage.DropHandlerBase.__meta__ = { obj : { tagNameFilter : ["DIV"]}};
silex.ui.stage.DropHandlerBase.CURRENT_DROP_CONTAINER_CLASS_NAME = "current-drop-container";
silex.ui.stage.FileViewer.__meta__ = { obj : { tagNameFilter : ["DIV"]}};
silex.ui.stage.FileViewer.DEBUG_INFO = "FileViewer class";
silex.ui.stage.FileViewer.BUILDER_MODE_PAGE_NAME = "builder-mode";
silex.ui.stage.InsertDropHandler.IMAGE_TYPE = "image";
silex.ui.stage.InsertDropHandler.TEXT_TYPE = "text";
silex.ui.stage.InsertDropHandler.LAYER_TYPE = "container";
silex.ui.stage.InsertDropHandler.AUDIO_TYPE = "audio";
silex.ui.stage.InsertDropHandler.VIDEO_TYPE = "video";
silex.ui.stage.SelectionController.__meta__ = { obj : { tagNameFilter : ["DIV"]}};
silex.ui.stage.SelectionController.DEBUG_INFO = "SelectionController class";
silex.ui.stage.SelectionController.REDRAW_MARKER_EVENT = "redraw";
silex.ui.stage.SelectionController.SELECTION_MARKER_STYLE_NAME = "selection-marker";
silex.ui.stage.SelectionController.SELECTION_LAYER_MARKER_STYLE_NAME = "selection-layer-marker";
silex.ui.stage.SelectionController.HOVER_MARKER_STYLE_NAME = "hover-marker";
silex.ui.stage.SelectionController.HOVER_LAYER_MARKER_STYLE_NAME = "hover-layer-marker";
silex.ui.stage.SelectionController.MIN_WIDTH = 10;
silex.ui.stage.SelectionController.MIN_HEIGHT = 10;
silex.ui.stage.SelectionDropHandler.__meta__ = { obj : { tagNameFilter : ["DIV"]}};
silex.ui.stage.SelectionDropHandler.DELETE_BUTTON_CLASS_NAME = "selection-marker-delete";
silex.ui.stage.SelectionDropHandler.EDIT_IMG_BUTTON_CLASS_NAME = "selection-marker-edit-image";
silex.ui.stage.SelectionDropHandler.EDIT_LAYER_BUTTON_CLASS_NAME = "selection-marker-edit-layer";
silex.ui.stage.SelectionDropHandler.EDIT_MEDIA_BUTTON_CLASS_NAME = "selection-marker-edit-media";
silex.ui.stage.SelectionDropHandler.EDIT_TEXT_BUTTON_CLASS_NAME = "selection-marker-edit-text";
silex.ui.stage.SelectionDropHandler.DISPLAY_ZONE_CLASS_NAME = "selection-ui-template";
silex.ui.stage.SilexContextManager.DEBUG_INFO = "silex.ui.stage.SilexContextManager";
silex.ui.stage.SilexContextManager.VIDEO_CONTEXT = "context-video";
silex.ui.stage.SilexContextManager.AUDIO_CONTEXT = "context-audio";
silex.ui.stage.SilexContextManager.IMG_CONTEXT = "context-img";
silex.ui.stage.SilexContextManager.LAYER_CONTEXT = "context-layer";
silex.ui.stage.SilexContextManager.DIV_CONTEXT = "context-div";
silex.ui.stage.SilexContextManager.ALL_CONTEXTS = ["context-video","context-audio","context-img","context-layer","context-div"];
silex.ui.toolbox.MenuController.__meta__ = { obj : { tagNameFilter : ["DIV"]}};
silex.ui.toolbox.ToolBoxController.CSS_DESCRIPTOR_FILE_URL = "assets/admin/css-styles.xml";
silex.ui.toolbox.ToolBoxController.TOOL_BOX_CONTROLLER_TEMPLATE = "tool-box-controller-template";
silex.ui.toolbox.editor.EditorBase.DEBUG_INFO = "silex.ui.toolbox.editor.EditorBase class";
silex.ui.toolbox.editor.HtmlEditor.TEXT_INPUT_CLASS_NAME = "text-input";
silex.ui.toolbox.editor.UrlEditor.ADD_MULTIPLE_FILE_BROWSER_CLASS_NAME = "add-multiple-files-button";
silex.ui.toolbox.editor.UrlEditor.OPEN_FILE_BROWSER_CLASS_NAME = "select-file-button";
silex.ui.toolbox.editor.PropertyEditor.OPEN_TEXT_EDITOR_CLASS_NAME = "property-editor-edit-text";
silex.ui.toolbox.editor.PropertyEditor.DELETE_BUTTON_CLASS_NAME = "property-editor-delete-selected";
silex.Silex.main();
function $hxExpose(src, path) {
	var o = window;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
