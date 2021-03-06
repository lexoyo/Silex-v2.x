<?php

class cocktail_core_window_Window extends cocktail_core_event_EventCallback {
	public function __construct() {
		if(!php_Boot::$skip_constructor) {
		$GLOBALS['%s']->push("cocktail.core.window.Window::new");
		$製pos = $GLOBALS['%s']->length;
		parent::__construct();
		$this->init();
		$GLOBALS['%s']->pop();
	}}
	public function get_innerWidth() {
		$GLOBALS['%s']->push("cocktail.core.window.Window::get_innerWidth");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = $this->platform->nativeWindow->get_innerWidth();
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public function get_innerHeight() {
		$GLOBALS['%s']->push("cocktail.core.window.Window::get_innerHeight");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = $this->platform->nativeWindow->get_innerHeight();
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public function onPlatformResizeEvent($e) {
		$GLOBALS['%s']->push("cocktail.core.window.Window::onPlatformResizeEvent");
		$製pos = $GLOBALS['%s']->length;
		$this->document->invalidationManager->invalidateViewportSize();
		$GLOBALS['%s']->pop();
	}
	public function onDocumentSetMouseCursor($cursor) {
		$GLOBALS['%s']->push("cocktail.core.window.Window::onDocumentSetMouseCursor");
		$製pos = $GLOBALS['%s']->length;
		if($this->_currentMouseCursor === null) {
			$this->_currentMouseCursor = $cursor;
			$this->platform->mouse->setMouseCursor($cursor);
		} else {
			if($cursor !== $this->_currentMouseCursor) {
				$this->_currentMouseCursor = $cursor;
				$this->platform->mouse->setMouseCursor($cursor);
			}
		}
		$GLOBALS['%s']->pop();
	}
	public function onDocumentExitFullscreen() {
		$GLOBALS['%s']->push("cocktail.core.window.Window::onDocumentExitFullscreen");
		$製pos = $GLOBALS['%s']->length;
		$this->platform->nativeWindow->exitFullscreen();
		$GLOBALS['%s']->pop();
	}
	public function onDocumentEnterFullscreen() {
		$GLOBALS['%s']->push("cocktail.core.window.Window::onDocumentEnterFullscreen");
		$製pos = $GLOBALS['%s']->length;
		$this->platform->nativeWindow->enterFullscreen();
		$GLOBALS['%s']->pop();
	}
	public function onPlatformFullScreenChange($event) {
		$GLOBALS['%s']->push("cocktail.core.window.Window::onPlatformFullScreenChange");
		$製pos = $GLOBALS['%s']->length;
		if($this->platform->nativeWindow->fullscreen() === false) {
			$this->document->exitFullscreen();
		}
		$GLOBALS['%s']->pop();
	}
	public function open($url, $name = null) {
		$GLOBALS['%s']->push("cocktail.core.window.Window::open");
		$製pos = $GLOBALS['%s']->length;
		if($name === null) {
			$name = "_blank";
		}
		$this->platform->nativeWindow->open($url, $name);
		$GLOBALS['%s']->pop();
	}
	public function init() {
		$GLOBALS['%s']->push("cocktail.core.window.Window::init");
		$製pos = $GLOBALS['%s']->length;
		$this->platform = new cocktail_port_platform_Platform();
		$htmlDocument = new cocktail_core_html_HTMLDocument($this);
		$this->platform->mouse->onMouseDown = (isset($htmlDocument->onPlatformMouseEvent) ? $htmlDocument->onPlatformMouseEvent: array($htmlDocument, "onPlatformMouseEvent"));
		$this->platform->mouse->onMouseUp = (isset($htmlDocument->onPlatformMouseEvent) ? $htmlDocument->onPlatformMouseEvent: array($htmlDocument, "onPlatformMouseEvent"));
		$this->platform->mouse->onMouseMove = (isset($htmlDocument->onPlatformMouseMoveEvent) ? $htmlDocument->onPlatformMouseMoveEvent: array($htmlDocument, "onPlatformMouseMoveEvent"));
		$this->platform->mouse->onMouseWheel = (isset($htmlDocument->onPlatformMouseWheelEvent) ? $htmlDocument->onPlatformMouseWheelEvent: array($htmlDocument, "onPlatformMouseWheelEvent"));
		$this->platform->keyboard->onKeyDown = (isset($htmlDocument->onPlatformKeyDownEvent) ? $htmlDocument->onPlatformKeyDownEvent: array($htmlDocument, "onPlatformKeyDownEvent"));
		$this->platform->keyboard->onKeyUp = (isset($htmlDocument->onPlatformKeyUpEvent) ? $htmlDocument->onPlatformKeyUpEvent: array($htmlDocument, "onPlatformKeyUpEvent"));
		$this->platform->nativeWindow->onResize = (isset($this->onPlatformResizeEvent) ? $this->onPlatformResizeEvent: array($this, "onPlatformResizeEvent"));
		$this->platform->touchListener->onTouchStart = (isset($htmlDocument->onPlatformTouchEvent) ? $htmlDocument->onPlatformTouchEvent: array($htmlDocument, "onPlatformTouchEvent"));
		$this->platform->touchListener->onTouchMove = (isset($htmlDocument->onPlatformTouchEvent) ? $htmlDocument->onPlatformTouchEvent: array($htmlDocument, "onPlatformTouchEvent"));
		$this->platform->touchListener->onTouchEnd = (isset($htmlDocument->onPlatformTouchEvent) ? $htmlDocument->onPlatformTouchEvent: array($htmlDocument, "onPlatformTouchEvent"));
		$htmlDocument->onEnterFullscreen = (isset($this->onDocumentEnterFullscreen) ? $this->onDocumentEnterFullscreen: array($this, "onDocumentEnterFullscreen"));
		$htmlDocument->onExitFullscreen = (isset($this->onDocumentExitFullscreen) ? $this->onDocumentExitFullscreen: array($this, "onDocumentExitFullscreen"));
		$this->platform->nativeWindow->onFullScreenChange = (isset($this->onPlatformFullScreenChange) ? $this->onPlatformFullScreenChange: array($this, "onPlatformFullScreenChange"));
		$htmlDocument->onSetMouseCursor = (isset($this->onDocumentSetMouseCursor) ? $this->onDocumentSetMouseCursor: array($this, "onDocumentSetMouseCursor"));
		$this->document = $htmlDocument;
		$this->history = new cocktail_core_history_History();
		$GLOBALS['%s']->pop();
	}
	public $_currentMouseCursor;
	public $history;
	public $platform;
	public $innerWidth;
	public $innerHeight;
	public $document;
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
	static $__properties__ = array("get_innerHeight" => "get_innerHeight","get_innerWidth" => "get_innerWidth","set_onclick" => "set_onClick","set_ondblclick" => "set_onDblClick","set_onmousedown" => "set_onMouseDown","set_onmouseup" => "set_onMouseUp","set_onmouseover" => "set_onMouseOver","set_onmouseout" => "set_onMouseOut","set_onmousemove" => "set_onMouseMove","set_onmousewheel" => "set_onMouseWheel","set_onkeydown" => "set_onKeyDown","set_onkeyup" => "set_onKeyUp","set_onfocus" => "set_onFocus","set_onblur" => "set_onBlur","set_onresize" => "set_onResize","set_onfullscreenchange" => "set_onFullScreenChange","set_onscroll" => "set_onScroll","set_onload" => "set_onLoad","set_onerror" => "set_onError","set_onloadstart" => "set_onLoadStart","set_onprogress" => "set_onProgress","set_onsuspend" => "set_onSuspend","set_onemptied" => "set_onEmptied","set_onstalled" => "set_onStalled","set_onloadedmetadata" => "set_onLoadedMetadata","set_onloadeddata" => "set_onLoadedData","set_oncanplay" => "set_onCanPlay","set_oncanplaythrough" => "set_onCanPlayThrough","set_onplaying" => "set_onPlaying","set_onwaiting" => "set_onWaiting","set_onseeking" => "set_onSeeking","set_onseeked" => "set_onSeeked","set_onended" => "set_onEnded","set_ondurationchange" => "set_onDurationChanged","set_ontimeupdate" => "set_onTimeUpdate","set_onplay" => "set_onPlay","set_onpause" => "set_onPause","set_onvolumechange" => "set_onVolumeChange","set_ontransitionend" => "set_onTransitionEnd","set_onpopstate" => "set_onPopState");
	function __toString() { return 'cocktail.core.window.Window'; }
}
