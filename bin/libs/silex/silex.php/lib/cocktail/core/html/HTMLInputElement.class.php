<?php

class cocktail_core_html_HTMLInputElement extends cocktail_core_html_EmbeddedElement {
	public function __construct() {
		if(!php_Boot::$skip_constructor) {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::new");
		$製pos = $GLOBALS['%s']->length;
		parent::__construct("INPUT");
		$GLOBALS['%s']->pop();
	}}
	public function get_value() {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::get_value");
		$製pos = $GLOBALS['%s']->length;
		if($this->elementRenderer !== null) {
			$textInputElementRenderer = $this->elementRenderer;
			{
				$裨mp = $textInputElementRenderer->get_value();
				$GLOBALS['%s']->pop();
				return $裨mp;
			}
		}
		{
			$裨mp = $this->getAttribute("value");
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public function set_value($value) {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::set_value");
		$製pos = $GLOBALS['%s']->length;
		$this->setAttribute("value", $value);
		if($this->elementRenderer !== null) {
			$textInputElementRenderer = $this->elementRenderer;
			$textInputElementRenderer->set_value($value);
		}
		{
			$GLOBALS['%s']->pop();
			return $value;
		}
		$GLOBALS['%s']->pop();
	}
	public function get_intrinsicHeight() {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::get_intrinsicHeight");
		$製pos = $GLOBALS['%s']->length;
		{
			$GLOBALS['%s']->pop();
			return 30;
		}
		$GLOBALS['%s']->pop();
	}
	public function get_intrinsicWidth() {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::get_intrinsicWidth");
		$製pos = $GLOBALS['%s']->length;
		{
			$GLOBALS['%s']->pop();
			return 150;
		}
		$GLOBALS['%s']->pop();
	}
	public function isDefaultFocusable() {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::isDefaultFocusable");
		$製pos = $GLOBALS['%s']->length;
		{
			$GLOBALS['%s']->pop();
			return true;
		}
		$GLOBALS['%s']->pop();
	}
	public function createElementRenderer() {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::createElementRenderer");
		$製pos = $GLOBALS['%s']->length;
		$this->elementRenderer = new cocktail_core_renderer_TextInputRenderer($this);
		$textInputElementRenderer = $this->elementRenderer;
		$value = $this->getAttribute("value");
		if($value !== null) {
			$textInputElementRenderer->set_value($value);
		}
		$GLOBALS['%s']->pop();
	}
	public function isVoidElement() {
		$GLOBALS['%s']->push("cocktail.core.html.HTMLInputElement::isVoidElement");
		$製pos = $GLOBALS['%s']->length;
		{
			$GLOBALS['%s']->pop();
			return true;
		}
		$GLOBALS['%s']->pop();
	}
	public $value;
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
	static $HTML_INPUT_TEXT_INTRINSIC_WIDTH = 150;
	static $HTML_INPUT_TEXT_INTRINSIC_HEIGHT = 30;
	static $__properties__ = array("set_value" => "set_value","get_value" => "get_value","set_height" => "set_height","get_height" => "get_height","set_width" => "set_width","get_width" => "get_width","get_intrinsicHeight" => "get_intrinsicHeight","get_intrinsicWidth" => "get_intrinsicWidth","get_intrinsicRatio" => "get_intrinsicRatio","set_tabIndex" => "set_tabIndex","get_tabIndex" => "get_tabIndex","set_id" => "set_id","get_id" => "get_id","set_className" => "set_className","get_className" => "get_className","set_hidden" => "set_hidden","get_hidden" => "get_hidden","set_scrollTop" => "set_scrollTop","get_scrollTop" => "get_scrollTop","set_scrollLeft" => "set_scrollLeft","get_scrollLeft" => "get_scrollLeft","get_scrollHeight" => "get_scrollHeight","get_scrollWidth" => "get_scrollWidth","set_innerHTML" => "set_innerHTML","get_innerHTML" => "get_innerHTML","set_outerHTML" => "set_outerHTML","get_outerHTML" => "get_outerHTML","get_offsetParent" => "get_offsetParent","get_offsetWidth" => "get_offsetWidth","get_offsetHeight" => "get_offsetHeight","get_offsetLeft" => "get_offsetLeft","get_offsetTop" => "get_offsetTop","get_clientWidth" => "get_clientWidth","get_clientHeight" => "get_clientHeight","get_clientLeft" => "get_clientLeft","get_clientTop" => "get_clientTop","get_attachedToDOM" => "get_attachedToDOM","get_firstElementChild" => "get_firstElementChild","get_lastElementChild" => "get_lastElementChild","get_previousElementSibling" => "get_previousElementSibling","get_nextElementSibling" => "get_nextElementSibling","get_childElementCount" => "get_childElementCount","get_firstChild" => "get_firstChild","get_lastChild" => "get_lastChild","get_nextSibling" => "get_nextSibling","get_previousSibling" => "get_previousSibling","get_nodeType" => "get_nodeType","set_nodeValue" => "set_nodeValue","get_nodeValue" => "get_nodeValue","get_nodeName" => "get_nodeName","set_ownerDocument" => "set_ownerDocument","set_onclick" => "set_onClick","set_ondblclick" => "set_onDblClick","set_onmousedown" => "set_onMouseDown","set_onmouseup" => "set_onMouseUp","set_onmouseover" => "set_onMouseOver","set_onmouseout" => "set_onMouseOut","set_onmousemove" => "set_onMouseMove","set_onmousewheel" => "set_onMouseWheel","set_onkeydown" => "set_onKeyDown","set_onkeyup" => "set_onKeyUp","set_onfocus" => "set_onFocus","set_onblur" => "set_onBlur","set_onresize" => "set_onResize","set_onfullscreenchange" => "set_onFullScreenChange","set_onscroll" => "set_onScroll","set_onload" => "set_onLoad","set_onerror" => "set_onError","set_onloadstart" => "set_onLoadStart","set_onprogress" => "set_onProgress","set_onsuspend" => "set_onSuspend","set_onemptied" => "set_onEmptied","set_onstalled" => "set_onStalled","set_onloadedmetadata" => "set_onLoadedMetadata","set_onloadeddata" => "set_onLoadedData","set_oncanplay" => "set_onCanPlay","set_oncanplaythrough" => "set_onCanPlayThrough","set_onplaying" => "set_onPlaying","set_onwaiting" => "set_onWaiting","set_onseeking" => "set_onSeeking","set_onseeked" => "set_onSeeked","set_onended" => "set_onEnded","set_ondurationchange" => "set_onDurationChanged","set_ontimeupdate" => "set_onTimeUpdate","set_onplay" => "set_onPlay","set_onpause" => "set_onPause","set_onvolumechange" => "set_onVolumeChange","set_ontransitionend" => "set_onTransitionEnd","set_onpopstate" => "set_onPopState");
	function __toString() { return 'cocktail.core.html.HTMLInputElement'; }
}
