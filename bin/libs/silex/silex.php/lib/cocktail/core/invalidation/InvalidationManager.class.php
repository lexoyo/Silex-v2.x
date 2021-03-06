<?php

class cocktail_core_invalidation_InvalidationManager {
	public function __construct($htmlDocument) {
		if(!php_Boot::$skip_constructor) {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::new");
		$製pos = $GLOBALS['%s']->length;
		$this->_htmlDocument = $htmlDocument;
		$this->_invalidationScheduled = false;
		$this->_documentNeedsLayout = true;
		$this->_documentNeedsRendering = true;
		$this->_documentNeedsCascading = true;
		$this->_graphicsContextTreeNeedsUpdate = true;
		$this->_forceGraphicsContextUpdate = false;
		$this->_renderingTreeNeedsUpdate = true;
		$this->_layerTreeNeedsUpdate = true;
		$this->_nativeLayerTreeNeedsUpdate = true;
		$this->_stackingContextsNeedUpdate = true;
		$this->_pendingAnimationsNeedUpdate = true;
		$this->_forceLayout = false;
		$this->_viewportResized = false;
		$GLOBALS['%s']->pop();
	}}
	public function startLayout($forceLayout) {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::startLayout");
		$製pos = $GLOBALS['%s']->length;
		$this->_htmlDocument->documentElement->elementRenderer->layout($forceLayout);
		$this->_htmlDocument->documentElement->elementRenderer->setGlobalOrigins(0, 0, 0, 0, 0, 0);
		$GLOBALS['%s']->pop();
	}
	public function startCascade($programmaticChange) {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::startCascade");
		$製pos = $GLOBALS['%s']->length;
		$this->_htmlDocument->documentElement->cascade($this->_htmlDocument->cascadeManager, $programmaticChange);
		$this->_documentNeedsCascading = false;
		$GLOBALS['%s']->pop();
	}
	public function onUpdateSchedule($timeStamp) {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::onUpdateSchedule");
		$製pos = $GLOBALS['%s']->length;
		$this->_invalidationScheduled = false;
		$this->updateDocument();
		$GLOBALS['%s']->pop();
	}
	public function updateDocument() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::updateDocument");
		$製pos = $GLOBALS['%s']->length;
		if($this->_documentNeedsCascading === true) {
			$this->startCascade(true);
		}
		if($this->_renderingTreeNeedsUpdate === true) {
			$this->_htmlDocument->documentElement->updateElementRenderer();
			$this->_htmlDocument->documentElement->elementRenderer->updateAnonymousBlock();
			$this->_htmlDocument->documentElement->elementRenderer->updateLineBoxes();
			$this->_renderingTreeNeedsUpdate = false;
		}
		if($this->_layerTreeNeedsUpdate === true) {
			$this->_htmlDocument->documentElement->elementRenderer->updateLayerRenderer();
			$this->_layerTreeNeedsUpdate = false;
		}
		if($this->_stackingContextsNeedUpdate === true) {
			$this->_htmlDocument->documentElement->elementRenderer->layerRenderer->updateStackingContext();
			$this->_stackingContextsNeedUpdate = false;
		}
		if($this->_documentNeedsLayout === true) {
			$this->startLayout($this->_forceLayout);
			$this->_forceLayout = false;
			$this->_documentNeedsLayout = false;
		}
		if($this->_pendingAnimationsNeedUpdate === true) {
			$atLeastOneAnimationStarted = $this->_htmlDocument->documentElement->startPendingAnimation();
			if($atLeastOneAnimationStarted === true) {
				$this->startLayout(false);
			}
		}
		if($this->_graphicsContextTreeNeedsUpdate === true) {
			$this->_htmlDocument->documentElement->elementRenderer->layerRenderer->updateGraphicsContext($this->_forceGraphicsContextUpdate);
			$this->_graphicsContextTreeNeedsUpdate = false;
			$this->_forceGraphicsContextUpdate = false;
		}
		if($this->_nativeLayerTreeNeedsUpdate === true) {
			$this->_htmlDocument->documentElement->elementRenderer->layerRenderer->graphicsContext->updateNativeLayer();
			$this->_nativeLayerTreeNeedsUpdate = false;
		}
		if($this->_documentNeedsRendering === true) {
			$this->_htmlDocument->documentElement->elementRenderer->layerRenderer->updateLayerAlpha(1.0);
			$this->_htmlDocument->documentElement->elementRenderer->layerRenderer->render($this->_htmlDocument->window->get_innerWidth(), $this->_htmlDocument->window->get_innerHeight());
			$this->_documentNeedsRendering = false;
		}
		if($this->_pendingAnimationsNeedUpdate === true) {
			$this->_htmlDocument->documentElement->endPendingAnimation();
			$this->_pendingAnimationsNeedUpdate = false;
		}
		if($this->_viewportResized === true) {
			$this->_viewportResized = false;
			$resizeEvent = new cocktail_core_event_UIEvent();
			$resizeEvent->initUIEvent("resize", false, false, null, 0);
			$this->_htmlDocument->window->dispatchEvent($resizeEvent);
		}
		$GLOBALS['%s']->pop();
	}
	public function doInvalidate() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::doInvalidate");
		$製pos = $GLOBALS['%s']->length;
		$this->_invalidationScheduled = true;
		$this->_htmlDocument->timer->delay((isset($this->onUpdateSchedule) ? $this->onUpdateSchedule: array($this, "onUpdateSchedule")), null);
		$GLOBALS['%s']->pop();
	}
	public function invalidate() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidate");
		$製pos = $GLOBALS['%s']->length;
		if($this->_invalidationScheduled === false) {
			$this->doInvalidate();
		}
		$GLOBALS['%s']->pop();
	}
	public function invalidateCascade() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateCascade");
		$製pos = $GLOBALS['%s']->length;
		$this->_documentNeedsCascading = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateGraphicsContextTree($force) {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateGraphicsContextTree");
		$製pos = $GLOBALS['%s']->length;
		$this->_graphicsContextTreeNeedsUpdate = true;
		if($force === true) {
			$this->_forceGraphicsContextUpdate = true;
		}
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidatePendingAnimations() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidatePendingAnimations");
		$製pos = $GLOBALS['%s']->length;
		$this->_pendingAnimationsNeedUpdate = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateNativeLayerTree() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateNativeLayerTree");
		$製pos = $GLOBALS['%s']->length;
		$this->_nativeLayerTreeNeedsUpdate = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateStackingContexts() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateStackingContexts");
		$製pos = $GLOBALS['%s']->length;
		$this->_stackingContextsNeedUpdate = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateLayerTree() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateLayerTree");
		$製pos = $GLOBALS['%s']->length;
		$this->_layerTreeNeedsUpdate = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateRenderingTree() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateRenderingTree");
		$製pos = $GLOBALS['%s']->length;
		$this->_renderingTreeNeedsUpdate = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateRendering() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateRendering");
		$製pos = $GLOBALS['%s']->length;
		$this->_documentNeedsRendering = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateLayout($force) {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateLayout");
		$製pos = $GLOBALS['%s']->length;
		if($this->_forceLayout === true) {
			$this->_forceLayout = $force;
		}
		$this->_documentNeedsLayout = true;
		$this->invalidate();
		$GLOBALS['%s']->pop();
	}
	public function invalidateViewportSize() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::invalidateViewportSize");
		$製pos = $GLOBALS['%s']->length;
		$this->invalidateLayout(true);
		$this->invalidateRendering();
		$this->_viewportResized = true;
		$GLOBALS['%s']->pop();
	}
	public function updateDocumentImmediately() {
		$GLOBALS['%s']->push("cocktail.core.invalidation.InvalidationManager::updateDocumentImmediately");
		$製pos = $GLOBALS['%s']->length;
		$this->updateDocument();
		$GLOBALS['%s']->pop();
	}
	public $_htmlDocument;
	public $_viewportResized;
	public $_forceGraphicsContextUpdate;
	public $_graphicsContextTreeNeedsUpdate;
	public $_pendingAnimationsNeedUpdate;
	public $_nativeLayerTreeNeedsUpdate;
	public $_stackingContextsNeedUpdate;
	public $_layerTreeNeedsUpdate;
	public $_renderingTreeNeedsUpdate;
	public $_documentNeedsCascading;
	public $_documentNeedsRendering;
	public $_forceLayout;
	public $_documentNeedsLayout;
	public $_invalidationScheduled;
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
	function __toString() { return 'cocktail.core.invalidation.InvalidationManager'; }
}
