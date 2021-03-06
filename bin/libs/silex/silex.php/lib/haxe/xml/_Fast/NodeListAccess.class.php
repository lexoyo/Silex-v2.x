<?php

class haxe_xml__Fast_NodeListAccess {
	public function __construct($x) {
		if(!php_Boot::$skip_constructor) {
		$GLOBALS['%s']->push("haxe.xml._Fast.NodeListAccess::new");
		$�spos = $GLOBALS['%s']->length;
		$this->__x = $x;
		$GLOBALS['%s']->pop();
	}}
	public function resolve($name) {
		$GLOBALS['%s']->push("haxe.xml._Fast.NodeListAccess::resolve");
		$�spos = $GLOBALS['%s']->length;
		$l = new HList();
		if(null == $this->__x) throw new HException('null iterable');
		$�it = $this->__x->elementsNamed($name);
		while($�it->hasNext()) {
			$x = $�it->next();
			$l->add(new haxe_xml_Fast($x));
		}
		{
			$GLOBALS['%s']->pop();
			return $l;
		}
		$GLOBALS['%s']->pop();
	}
	public $__x;
	public $�dynamics = array();
	public function __get($n) {
		if(isset($this->�dynamics[$n]))
			return $this->�dynamics[$n];
	}
	public function __set($n, $v) {
		$this->�dynamics[$n] = $v;
	}
	public function __call($n, $a) {
		if(isset($this->�dynamics[$n]) && is_callable($this->�dynamics[$n]))
			return call_user_func_array($this->�dynamics[$n], $a);
		if('toString' == $n)
			return $this->__toString();
		throw new HException("Unable to call �".$n."�");
	}
	function __toString() { return 'haxe.xml._Fast.NodeListAccess'; }
}
