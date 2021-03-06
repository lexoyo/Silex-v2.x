<?php

class cocktail_core_event_Event {
	public function __construct() {
		if(!php_Boot::$skip_constructor) {
		$GLOBALS['%s']->push("cocktail.core.event.Event::new");
		$製pos = $GLOBALS['%s']->length;
		$GLOBALS['%s']->pop();
	}}
	public function stopImmediatePropagation() {
		$GLOBALS['%s']->push("cocktail.core.event.Event::stopImmediatePropagation");
		$製pos = $GLOBALS['%s']->length;
		$this->immediatePropagationStopped = true;
		$GLOBALS['%s']->pop();
	}
	public function stopPropagation() {
		$GLOBALS['%s']->push("cocktail.core.event.Event::stopPropagation");
		$製pos = $GLOBALS['%s']->length;
		$this->propagationStopped = true;
		$GLOBALS['%s']->pop();
	}
	public function preventDefault() {
		$GLOBALS['%s']->push("cocktail.core.event.Event::preventDefault");
		$製pos = $GLOBALS['%s']->length;
		$this->defaultPrevented = true;
		$GLOBALS['%s']->pop();
	}
	public function initEvent($eventTypeArg, $canBubbleArg, $cancelableArg) {
		$GLOBALS['%s']->push("cocktail.core.event.Event::initEvent");
		$製pos = $GLOBALS['%s']->length;
		if($this->dispatched === true) {
			$GLOBALS['%s']->pop();
			return;
		}
		$this->type = $eventTypeArg;
		$this->bubbles = $canBubbleArg;
		$this->cancelable = $cancelableArg;
		$GLOBALS['%s']->pop();
	}
	public $dispatched;
	public $immediatePropagationStopped;
	public $propagationStopped;
	public $defaultPrevented;
	public $cancelable;
	public $bubbles;
	public $currentTarget;
	public $target;
	public $type;
	public $eventPhase;
	public function __call($m, $a) {
		if(isset($this->$m) && is_callable($this->$m))
			return call_user_func_array($this->$m, $a);
		else if(isset($this->蜿ynamics[$m]) && is_callable($this->蜿ynamics[$m]))
			return call_user_func_array($this->蜿ynamics[$m], $a);
		else if('toString' == $m)
			return $this->__toString();
		else
			throw new HException('Unable to call �'.$m.'�');
	}
	static $CAPTURING_PHASE = 1;
	static $AT_TARGET = 2;
	static $BUBBLING_PHASE = 3;
	function __toString() { return 'cocktail.core.event.Event'; }
}
