package silex.ui.stage;

import js.Lib;
import js.Dom;

import org.slplayer.component.ui.DisplayObject;
import org.slplayer.util.DomTools;
import org.slplayer.component.navigation.Layer;
import org.slplayer.component.interaction.Draggable;
import silex.page.PageModel;
import silex.layer.LayerModel;
import silex.publication.PublicationModel;
import silex.component.ComponentModel;

/**
 * Element of the masters tool box, which can be dropped  on stage in order to insert a master on stage
 * use attribute like rthis: data-dropzones-class-name="Layer" data-dropzones-class-name="silex-view"
 * use with Draggable on the same node
 */
class MasterDropHandler extends StageDropHandler{
	/**
	 * constructor
	 * listen to the Draggable class events
	 */
	public function new(rootElement:HtmlDom, SLPId:String){
		super(rootElement, SLPId);
	}
	/**
	 * virtual method to be implemented in derived classes
	 */
	override private function setDraggedElement(draggableEvent:DraggableEvent) {
		trace("setDraggedElement "+draggableEvent);
	}
	/**
	 * virtual method to be implemented in derived classes
	 */
	override private function getDraggedElement(draggableEvent:DraggableEvent):HtmlDom {
		return null;
	}
	/**
	 * Handle Draggable events
	 */
	override public function onDrop(e:Event) {
		trace("onDrop "+e);
		super.onDrop(e);
		var event:CustomEvent = cast(e);
		DomTools.doLater(addLayer);
	}
	private function addLayer(){
		trace("addLayer "+LayerModel.getInstance().selectedItem);
		var layer = LayerModel.getInstance().selectedItem;
		var page = PageModel.getInstance().selectedItem;
		LayerModel.getInstance().addMaster(layer, page);
	}
}
