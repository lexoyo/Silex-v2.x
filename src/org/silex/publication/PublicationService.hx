package org.silex.publication;

import org.silex.service.ServiceBase;
import org.silex.publication.PublicationData;

import js.Lib;
import js.Dom;

#if SilexClientSide
#end

#if SilexServerSide
import org.silex.config.PublicationConfigManager;
import haxe.remoting.Context;
import sys.io.File;
import sys.FileSystem;
#end

/**
 * 
 */
class PublicationService extends ServiceBase{
	/**
	 * Constant for this service name, as exposed to Haxe remoting
	 */
	public static inline var SERVICE_NAME:String = "publicationService";

#if SilexClientSide
	/**
	 * folder where publications are stored
	 */
	public var publicationFolder:String;
	/**
	 * Constructor
	 * Store the publication name and the folder where to look for the publications
	 */
	public function new(publicationFolder:String = null, gatewayUrl:String = ServiceBase.DEFAULT_GATEWAY_URL){
		super(SERVICE_NAME, gatewayUrl);
		this.publicationFolder = publicationFolder;
	}
	/**
	 * Retrieve a publication raw HTML string
	 */
	public function getRawHtml(publicationName:String, onResult:String->Void, onError:String->Void=null) {
		// make the call
		callServerMethod("getRawHtml", [publicationName, publicationFolder], onResult, onError);
	}
	/**
	 * Set a publication raw HTML string
	 */
	public function setRawHtml(publicationName:String, rawHtml:String, onResult:Void->Void, onError:String->Void=null) {
		// make the call
		callServerMethod("setRawHtml", [publicationName, rawHtml, publicationFolder], onResult, onError);
	}
	/**
	 * Retrieve a publication data
	 */
/*	public function getPublicationData(publicationName:String, onResult:PublicationData->Void, onError:String->Void=null) {
		// make the call
		callServerMethod("getPublicationData", [publicationName, publicationFolder], onResult, onError);
	}
/**/
#end
#if SilexServerSide
	/**
	 * Constructor
	 */
	public function new(){
		super(SERVICE_NAME);
	}
	/**
	 * List available publication matching a state
	 */
	public function getPublications(publicationState:Null<PublicationState> = null, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		throw("not implemented");
	}
	/**
	 * Empty trash, i.e. browse all publications and check their state, then permanently delete the ones with the state Trashed
	 * @param	PublicationState 	use this parameter to filter the publications which are being deleted, e.g. by user or state 
	 */
	public function emptyTrash(publicationState:Null<PublicationState> = null, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		throw("not implemented");
	}
	/**
	 * Create a publication given a raw HTML string
	 */
	public function create(publicationName:String, publicationData:PublicationData, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		try{
			// update with actual date and author
			publicationData.publicationConfig.publicationFolder = publicationFolder;
			publicationData.publicationConfig.state = Private;
			publicationData.publicationConfig.creation.author = "to do this author";
			publicationData.publicationConfig.creation.date = Date.now();
			publicationData.publicationConfig.lastChange = publicationData.publicationConfig.creation;

			// create the empty directory for the publication
			FileSystem.createDirectory(publicationFolder+publicationName);
			// set the publication data
			setPublicationData(publicationName, publicationData, publicationFolder);
		}
		catch(e:Dynamic){
			throw(e);
		}
	}
	/**
	 * Duplicate an existing publication
	 */
	public function duplicate(srcPublicationName:String, publicationName:String, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		try{
			// retrieve the application data
			var publicationData:PublicationData = getPublicationData(srcPublicationName, publicationFolder);

			// create the new publication
			create(publicationName, publicationData, publicationFolder);
		}
		catch(e:Dynamic){
			throw(e);
		}
	}
	/**
	 * Rename an existing publication
	 * todo: handle empty names, security, same names, creation errors
	 */
	public function rename(srcPublicationName:String, publicationName:String, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		try{
			// retrieve the application data
			var publicationData:PublicationData = getPublicationData(srcPublicationName, publicationFolder);

			// create the new publication
			create(publicationName, publicationData, publicationFolder);

			// permanently delete this publication
			FileSystem.deleteDirectory(publicationFolder+publicationName);
		}
		catch(e:Dynamic){
			throw(e);
		}
	}
	/**
	 * Delete a publication
	 * Put it in the trash state
	 */
	public function trash(publicationName:String, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		try{
			// set the publication data
			var publicationConfig = getPublicationConfig(publicationName, publicationFolder);

			// trash state
			publicationConfig.state = Trashed({
				author: "todo: authors and security",
				date: Date.now()
			});

			// update with actual date and author
			publicationConfig.lastChange.author = "to do this author";
			publicationConfig.lastChange.date = Date.now();
			
			// set config data
			setPublicationConfig(publicationName, publicationConfig, publicationFolder);

		}
		catch(e:Dynamic){
			throw(e);
		}
	}
	/**
	 * Retrieve a publication raw HTML string
	 * TODO: handle the case where the publication does not exist
	 */
	public function getPublicationData(publicationName:String, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER):Null<PublicationData> {
		try{
			var html = File.getContent(publicationFolder + publicationName + "/" + PublicationConfigManager.PUBLICATION_HTML_FILE);
			var css = File.getContent(publicationFolder + publicationName + "/" + PublicationConfigManager.PUBLICATION_CSS_FILE);
			var publicationConfig = getPublicationConfig(publicationName, publicationFolder);
			return {
				html : html,
				css: css,
				publicationConfig: publicationConfig
			};
		}
		catch(e:Dynamic){
			throw(e);
		}
	}
	/**
	 * Set a publication raw HTML and css
	 * TODO: handle the case where the publication does not exist
	 */
	public function setPublicationData(publicationName:String, publicationData:PublicationData, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		try{
			File.saveContent(publicationFolder + publicationName + "/" + PublicationConfigManager.PUBLICATION_HTML_FILE, publicationData.html);
			File.saveContent(publicationFolder + publicationName + "/" + PublicationConfigManager.PUBLICATION_CSS_FILE, publicationData.css);
			setPublicationConfig(publicationName, publicationData.publicationConfig, publicationFolder);
		}
		catch(e:Dynamic){
			throw(e);
		}
	}
	/**
	 * Retrieve publication config
	 * TODO: handle the case where the publication does not exist
	 */
	public function getPublicationConfig(publicationName:String, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER):PublicationConfig {
		try{
			var config = new PublicationConfigManager(publicationFolder + publicationName + "/" + PublicationConfigManager.PUBLICATION_CONFIG_FILE);
			return config.publicationConfig;
		}
		catch(e:Dynamic){
			throw(e);
		}
	}
	/**
	 * Update publication config
	 * TODO: handle the case where the publication does not exist
	 */
	public function setPublicationConfig(publicationName:String, publicationConfig:PublicationConfig, publicationFolder:String = PublicationConfigManager.DEFAULT_PUBLICATION_FOLDER) {
		try{
			var config = new PublicationConfigManager(publicationFolder + publicationName + "/" + PublicationConfigManager.PUBLICATION_CONFIG_FILE);
			config.publicationConfig = {
				name : publicationConfig.name,
				publicationFolder : publicationConfig.publicationFolder, 
				state : publicationConfig.state,
				creation : publicationConfig.creation, 
				lastChange : publicationConfig.lastChange
			}
		}
		catch(e:Dynamic){
			throw(e);
		}
	}
#end
}