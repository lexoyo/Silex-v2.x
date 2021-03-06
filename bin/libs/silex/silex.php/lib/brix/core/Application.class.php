<?php

class brix_core_Application {
	public function __construct($id, $args = null) {
		if(!php_Boot::$skip_constructor) {
		$GLOBALS['%s']->push("brix.core.Application::new");
		$製pos = $GLOBALS['%s']->length;
		$this->dataObject = $args;
		$this->id = $id;
		$this->nodesIdSequence = 0;
		$this->registeredUIComponents = new _hx_array(array());
		$this->registeredGlobalComponents = new _hx_array(array());
		$this->nodeToCmpInstances = new Hash();
		$this->globalCompInstances = new Hash();
		$this->body = cocktail_Lib::get_document()->createElement("div");
		$this->applicationContext = new brix_core_ApplicationContext();
		$GLOBALS['%s']->pop();
	}}
	public function resolveComponentClass($classname) {
		$GLOBALS['%s']->push("brix.core.Application::resolveComponentClass");
		$製pos = $GLOBALS['%s']->length;
		$componentClass = Type::resolveClass($classname);
		if($componentClass === null) {
			throw new HException("ERROR cannot resolve " . $classname);
			null;
		}
		{
			$GLOBALS['%s']->pop();
			return $componentClass;
		}
		$GLOBALS['%s']->pop();
	}
	public function resolveUIComponentClass($className, $typeFilter = null) {
		$GLOBALS['%s']->push("brix.core.Application::resolveUIComponentClass");
		$製pos = $GLOBALS['%s']->length;
		{
			$_g = 0; $_g1 = $this->getRegisteredUIComponents();
			while($_g < $_g1->length) {
				$rc = $_g1[$_g];
				++$_g;
				$componentClassAttrValues = new _hx_array(array($this->getUnconflictedClassTag($rc->classname)));
				if($componentClassAttrValues[0] !== $rc->classname) {
					$componentClassAttrValues->push($rc->classname);
				}
				if(!Lambda::exists($componentClassAttrValues, array(new _hx_lambda(array(&$_g, &$_g1, &$className, &$componentClassAttrValues, &$rc, &$typeFilter), "brix_core_Application_0"), 'execute'))) {
					continue;
				}
				$componentClass = $this->resolveComponentClass($rc->classname);
				if($componentClass === null) {
					continue;
				}
				if($typeFilter !== null) {
					if(!Std::is(Type::createEmptyInstance($componentClass), $typeFilter)) {
						$GLOBALS['%s']->pop();
						return null;
					}
				}
				{
					$GLOBALS['%s']->pop();
					return $componentClass;
				}
				unset($rc,$componentClassAttrValues,$componentClass);
			}
		}
		{
			$GLOBALS['%s']->pop();
			return null;
		}
		$GLOBALS['%s']->pop();
	}
	public function getUnconflictedClassTag($displayObjectClassName) {
		$GLOBALS['%s']->push("brix.core.Application::getUnconflictedClassTag");
		$製pos = $GLOBALS['%s']->length;
		$classTag = $displayObjectClassName;
		if(_hx_index_of($classTag, ".", null) !== -1) {
			$classTag = _hx_substr($classTag, _hx_last_index_of($classTag, ".", null) + 1, null);
		}
		{
			$_g = 0; $_g1 = $this->getRegisteredUIComponents();
			while($_g < $_g1->length) {
				$rc = $_g1[$_g];
				++$_g;
				if($rc->classname !== $displayObjectClassName && $classTag === _hx_substr($rc->classname, _hx_last_index_of($classTag, ".", null) + 1, null)) {
					$GLOBALS['%s']->pop();
					return $displayObjectClassName;
				}
				unset($rc);
			}
		}
		{
			$GLOBALS['%s']->pop();
			return $classTag;
		}
		$GLOBALS['%s']->pop();
	}
	public function getGlobalComponentList() {
		$GLOBALS['%s']->push("brix.core.Application::getGlobalComponentList");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = Lambda::hlist(_hx_anonymous(array("iterator" => (isset($this->globalCompInstances->keys) ? $this->globalCompInstances->keys: array($this->globalCompInstances, "keys")))));
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public function getGlobalComponent($classname) {
		$GLOBALS['%s']->push("brix.core.Application::getGlobalComponent");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = $this->globalCompInstances->get($classname);
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public function getComponents($typeFilter) {
		$GLOBALS['%s']->push("brix.core.Application::getComponents");
		$製pos = $GLOBALS['%s']->length;
		$l = new HList();
		if(null == $this->nodeToCmpInstances) throw new HException('null iterable');
		$蜴t = $this->nodeToCmpInstances->iterator();
		while($蜴t->hasNext()) {
			$n = $蜴t->next();
			if(null == $n) throw new HException('null iterable');
			$蜴t2 = $n->iterator();
			while($蜴t2->hasNext()) {
				$i = $蜴t2->next();
				if(Std::is($i, $typeFilter)) {
					$inst = $i;
					$l->add($inst);
					unset($inst);
				}
			}
		}
		{
			$GLOBALS['%s']->pop();
			return $l;
		}
		$GLOBALS['%s']->pop();
	}
	public function getAssociatedComponents($node, $typeFilter) {
		$GLOBALS['%s']->push("brix.core.Application::getAssociatedComponents");
		$製pos = $GLOBALS['%s']->length;
		$nodeId = $node->getAttribute("data-brix-id");
		if($nodeId !== null) {
			$l = new HList();
			if($this->nodeToCmpInstances->exists($nodeId)) {
				if(null == $this->nodeToCmpInstances->get($nodeId)) throw new HException('null iterable');
				$蜴t = $this->nodeToCmpInstances->get($nodeId)->iterator();
				while($蜴t->hasNext()) {
					$i = $蜴t->next();
					if(Std::is($i, $typeFilter)) {
						$inst = $i;
						$l->add($inst);
						unset($inst);
					}
				}
			}
			{
				$GLOBALS['%s']->pop();
				return $l;
			}
		}
		{
			$裨mp = new HList();
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public function removeAllAssociatedComponent($node) {
		$GLOBALS['%s']->push("brix.core.Application::removeAllAssociatedComponent");
		$製pos = $GLOBALS['%s']->length;
		$nodeId = $node->getAttribute("data-brix-id");
		if($nodeId !== null) {
			$node->removeAttribute("data-brix-id");
			$isError = !$this->nodeToCmpInstances->remove($nodeId);
			if($isError) {
				throw new HException("Could not find the node in the associated components list.");
			}
		}
		$GLOBALS['%s']->pop();
	}
	public function removeAssociatedComponent($node, $cmp) {
		$GLOBALS['%s']->push("brix.core.Application::removeAssociatedComponent");
		$製pos = $GLOBALS['%s']->length;
		$nodeId = $node->getAttribute("data-brix-id");
		$associatedCmps = null;
		if($nodeId !== null) {
			$associatedCmps = $this->nodeToCmpInstances->get($nodeId);
			$isError = !$associatedCmps->remove($cmp);
			if($isError) {
				throw new HException("Could not find the component in the node's associated components list.");
			}
			if($associatedCmps->isEmpty()) {
				$node->removeAttribute("data-brix-id");
				$this->nodeToCmpInstances->remove($nodeId);
			}
		}
		$GLOBALS['%s']->pop();
	}
	public function addAssociatedComponent($node, $cmp) {
		$GLOBALS['%s']->push("brix.core.Application::addAssociatedComponent");
		$製pos = $GLOBALS['%s']->length;
		$nodeId = $node->getAttribute("data-brix-id");
		$associatedCmps = null;
		if($nodeId !== null) {
			$associatedCmps = $this->nodeToCmpInstances->get($nodeId);
		} else {
			$this->nodesIdSequence++;
			$nodeId = Std::string($this->nodesIdSequence);
			$node->setAttribute("data-brix-id", $nodeId);
			$associatedCmps = new HList();
		}
		$associatedCmps->add($cmp);
		$this->nodeToCmpInstances->set($nodeId, $associatedCmps);
		$GLOBALS['%s']->pop();
	}
	public function cleanNode($node) {
		$GLOBALS['%s']->push("brix.core.Application::cleanNode");
		$製pos = $GLOBALS['%s']->length;
		if($node->get_nodeType() !== cocktail_Lib::get_document()->body->get_nodeType()) {
			$GLOBALS['%s']->pop();
			return;
		}
		$comps = $this->getAssociatedComponents($node, _hx_qtype("brix.component.ui.DisplayObject"));
		if(null == $comps) throw new HException('null iterable');
		$蜴t = $comps->iterator();
		while($蜴t->hasNext()) {
			$c = $蜴t->next();
			$c->remove();
		}
		{
			$_g1 = 0; $_g = $node->childNodes->length;
			while($_g1 < $_g) {
				$childCnt = $_g1++;
				$this->cleanNode($node->childNodes[$childCnt]);
				unset($childCnt);
			}
		}
		$GLOBALS['%s']->pop();
	}
	public function createGlobalComponents() {
		$GLOBALS['%s']->push("brix.core.Application::createGlobalComponents");
		$製pos = $GLOBALS['%s']->length;
		$_g = 0; $_g1 = $this->getRegisteredGlobalComponents();
		while($_g < $_g1->length) {
			$rc = $_g1[$_g];
			++$_g;
			$componentClass = $this->resolveComponentClass($rc->classname);
			if($componentClass === null) {
				continue;
			}
			$cmpInstance = null;
			if($rc->args !== null) {
				$cmpInstance = Type::createInstance($componentClass, new _hx_array(array($rc->args)));
			} else {
				$cmpInstance = Type::createInstance($componentClass, new _hx_array(array()));
			}
			if($cmpInstance !== null && Std::is($cmpInstance, _hx_qtype("brix.component.IBrixComponent"))) {
				brix_component_BrixComponent::initBrixComponent($cmpInstance, $this->id);
			}
			$this->globalCompInstances->set($rc->classname, $cmpInstance);
			unset($rc,$componentClass,$cmpInstance);
		}
		$GLOBALS['%s']->pop();
	}
	public function initUIComponents($compInstances) {
		$GLOBALS['%s']->push("brix.core.Application::initUIComponents");
		$製pos = $GLOBALS['%s']->length;
		if(null == $compInstances) throw new HException('null iterable');
		$蜴t = $compInstances->iterator();
		while($蜴t->hasNext()) {
			$ci = $蜴t->next();
			$ci->init();
		}
		$GLOBALS['%s']->pop();
	}
	public function createUIComponents($node) {
		$GLOBALS['%s']->push("brix.core.Application::createUIComponents");
		$製pos = $GLOBALS['%s']->length;
		if($node->get_nodeType() !== 1) {
			$GLOBALS['%s']->pop();
			return null;
		}
		$nodeId = $node->getAttribute("data-brix-id");
		if($nodeId !== null) {
			if(!$this->nodeToCmpInstances->exists($nodeId)) {
				$node->removeAttribute("data-brix-id");
			} else {
				$GLOBALS['%s']->pop();
				return null;
			}
		}
		$compsToInit = new HList();
		if($node->get_className() !== null) {
			$_g = 0; $_g1 = _hx_explode(" ", $node->get_className());
			while($_g < $_g1->length) {
				$classValue = $_g1[$_g];
				++$_g;
				$componentClass = $this->resolveUIComponentClass($classValue, null);
				if($componentClass === null) {
					continue;
				}
				$newDisplayObject = null;
				$newDisplayObject = Type::createInstance($componentClass, new _hx_array(array($node, $this->id)));
				$compsToInit->add($newDisplayObject);
				unset($newDisplayObject,$componentClass,$classValue);
			}
		}
		{
			$_g1 = 0; $_g = $node->childNodes->length;
			while($_g1 < $_g) {
				$cc = $_g1++;
				$res = $this->createUIComponents($node->childNodes[$cc]);
				if($res !== null) {
					$compsToInit = Lambda::concat($compsToInit, $res);
				}
				unset($res,$cc);
			}
		}
		{
			$GLOBALS['%s']->pop();
			return $compsToInit;
		}
		$GLOBALS['%s']->pop();
	}
	public function initNode($node) {
		$GLOBALS['%s']->push("brix.core.Application::initNode");
		$製pos = $GLOBALS['%s']->length;
		$comps = $this->createUIComponents($node);
		if($comps === null) {
			$GLOBALS['%s']->pop();
			return;
		}
		$this->initUIComponents($comps);
		$GLOBALS['%s']->pop();
	}
	public function initComponents() {
		$GLOBALS['%s']->push("brix.core.Application::initComponents");
		$製pos = $GLOBALS['%s']->length;
		$this->createGlobalComponents();
		$this->initNode($this->body);
		$GLOBALS['%s']->pop();
	}
	public function initDom($appendTo = null) {
		$GLOBALS['%s']->push("brix.core.Application::initDom");
		$製pos = $GLOBALS['%s']->length;
		$this->htmlRootElement = $appendTo;
		if($this->htmlRootElement === null || $this->htmlRootElement->get_nodeType() !== cocktail_Lib::get_document()->documentElement->get_nodeType()) {
			$this->htmlRootElement = cocktail_Lib::get_document()->documentElement;
		}
		if($this->htmlRootElement === null) {
			$GLOBALS['%s']->pop();
			return;
		}
		$this->body = cocktail_Lib::get_document()->body;
		$GLOBALS['%s']->pop();
	}
	public function attachBody($appendTo = null) {
		$GLOBALS['%s']->push("brix.core.Application::attachBody");
		$製pos = $GLOBALS['%s']->length;
		if($appendTo === null) {
			$appendTo = cocktail_Lib::get_document()->body;
		}
		if($this->body->parentNode === null) {
			$appendTo->appendChild($this->body);
		}
		$this->body = $appendTo;
		$GLOBALS['%s']->pop();
	}
	public function getRegisteredGlobalComponents() {
		$GLOBALS['%s']->push("brix.core.Application::getRegisteredGlobalComponents");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = $this->applicationContext->registeredGlobalComponents;
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public $registeredGlobalComponents;
	public function getRegisteredUIComponents() {
		$GLOBALS['%s']->push("brix.core.Application::getRegisteredUIComponents");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = $this->applicationContext->registeredUIComponents;
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	public $registeredUIComponents;
	public $applicationContext;
	public $dataObject;
	public $body;
	public $htmlRootElement;
	public $globalCompInstances;
	public $nodeToCmpInstances;
	public $nodesIdSequence;
	public $id;
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
	static $BRIX_ID_ATTR_NAME = "data-brix-id";
	static $instances;
	static function get($BrixId) {
		$GLOBALS['%s']->push("brix.core.Application::get");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = brix_core_Application::$instances->get($BrixId);
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	static function main() {
		$GLOBALS['%s']->push("brix.core.Application::main");
		$製pos = $GLOBALS['%s']->length;
		$GLOBALS['%s']->pop();
	}
	static function createApplication($args = null) {
		$GLOBALS['%s']->push("brix.core.Application::createApplication");
		$製pos = $GLOBALS['%s']->length;
		$newId = brix_core_Application::generateUniqueId();
		$newInstance = new brix_core_Application($newId, $args);
		brix_core_Application::$instances->set($newId, $newInstance);
		{
			$GLOBALS['%s']->pop();
			return $newInstance;
		}
		$GLOBALS['%s']->pop();
	}
	static function generateUniqueId() {
		$GLOBALS['%s']->push("brix.core.Application::generateUniqueId");
		$製pos = $GLOBALS['%s']->length;
		{
			$裨mp = Std::string(Math::round(Math::random() * 10000));
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
	static $__properties__ = array("get_registeredUIComponents" => "getRegisteredUIComponents","get_registeredGlobalComponents" => "getRegisteredGlobalComponents");
	function __toString() { return 'brix.core.Application'; }
}
brix_core_Application::$instances = new Hash();
function brix_core_Application_0(&$_g, &$_g1, &$className, &$componentClassAttrValues, &$rc, &$typeFilter, $s) {
	$製pos = $GLOBALS['%s']->length;
	{
		$GLOBALS['%s']->push("brix.core.Application::resolveUIComponentClass@808");
		$製pos2 = $GLOBALS['%s']->length;
		{
			$裨mp = $s === $className;
			$GLOBALS['%s']->pop();
			return $裨mp;
		}
		$GLOBALS['%s']->pop();
	}
}
