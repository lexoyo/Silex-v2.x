<?php

class silex_ServiceBase {
	public function __construct($serviceName) {
		if(!php_Boot::$skip_constructor) {
		$GLOBALS['%s']->push("silex.ServiceBase::new");
		$�spos = $GLOBALS['%s']->length;
		$this->serviceName = $serviceName;
		silex_ServiceBase::$context->addObject($serviceName, $this, null);
		$GLOBALS['%s']->pop();
	}}
	public $serviceName;
	public function __call($m, $a) {
		if(isset($this->$m) && is_callable($this->$m))
			return call_user_func_array($this->$m, $a);
		else if(isset($this->�dynamics[$m]) && is_callable($this->�dynamics[$m]))
			return call_user_func_array($this->�dynamics[$m], $a);
		else if('toString' == $m)
			return $this->__toString();
		else
			throw new HException('Unable to call �'.$m.'�');
	}
	static $context;
	function __toString() { return 'silex.ServiceBase'; }
}
silex_ServiceBase::$context = new haxe_remoting_Context();
