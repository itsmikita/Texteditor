/**
 * Texteditor
 *
 * @package Texteditor
 * @version 0.1
 * @author Mikita Stankiewicz <designovermatter@gmail.com>
 */

;( function( $, window, document, undefined ) {
	'use strict';
	
	var TextEditor = function( selector ) {
		this.init( selector );
	};
	
	TextEditor.prototype = {
		editor: null,
		toolbar: null,
		content: null,
		code: null,
		selection: null,
		
		/**
		 * Init
		 *
		 * @param object selector - Should be a textarea jQuery selector
		 */
		init: function( selector ) {
			if( ! selector.is( 'textarea' ) )
				return;
			
			this.createEditor( selector );
			
			// Touch fix
			$( window ).on( 'touchend', function( e ) {
				if( this.editor.is( e.target ) || this.editor.has( e.target ).length > 0 )
					this.saveSelection();
			} );
		},
		
		/**
		 * Create editor
		 */
		createEditor: function( selector ) {
			var texteditor = this;
			selector.wrap( '<div id="text-editor" />' );
			
			this.editor = $( '#text-editor' );
			this.code = selector;
			this.editor
				.append( '<div class="text-editor-toolbar" />' )
				.append( '<div class="text-editor-content" />' );
			this.toolbar = $( '.text-editor-toolbar', this.editor );
			this.content = $( '.text-editor-content', this.editor )
				.attr( 'contenteditable', true )
				.html( this.code.val() );
			
			this.syncContent();
			this.setupToolbar();
		},
		
		/**
		 * Sync content
		 */
		syncContent: function() {
			var texteditor = this;
			
			this.code.keyup( function() {
				texteditor.content.html( $( this ).val() );
			} );
			
			this.content.keyup( function() {
				texteditor.code.val( $( this ).html() );
			} );
		},
		
		/**
		 * Setup toolbar
		 */
		setupToolbar: function() {
			var texteditor = this;
			
			this.toolbar
				.append( '<a class="text-editor-button" data-command="bold" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="italic" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="underline" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="strikethrough" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="insertunorderedlist" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="insertorderedlist" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="justifyleft" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="justifycenter" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="justifyright" href="#"></a>' )
				.append( '<a class="text-editor-button" data-command="createLink" href="#"></a>' );
			
			$( '[data-command]' ).on( 'click', function( e ) {
				e.preventDefault();
				
				texteditor.restoreSelection();
				texteditor.editor.focus();
				texteditor.format( $( this ).data( 'command' ) );
				texteditor.saveSelection();
				
				texteditor.code.val( texteditor.content.html() );
			} );
		},
		
		/**
		 * Get current selection
		 */
		getSelection: function() {
			var s = window.getSelection();
			
			if( s.getRangeAt && s.rangeCount )
				return s.getRangeAt( 0 );
		},
		
		/**
		 * Save selection
		 */
		saveSelection: function() {
			this.selection = this.getSelection();
		},
		
		/**
		 * Restore selection
		 */
		restoreSelection: function() {
			var s = window.getSelection();
			
			if( ! this.selection )
				return;
			
			try {
				s.removeAllRanges();
			}
			catch( e ) {
				document.body.createTextRange().select();
				document.selection.empty();
			}
			
			s.addRange( this.selection );
		},
		
		/** 
		 * Format
		 *
		 * @param string command
		 * @param string arg
		 */
		format: function( command, arg ) {
			var a = command.split( ' ' ),
				command = a.shift(),
				args = a.join( ' ' ) + ( arg || '' );
			
			document.execCommand( command, 0, args );
		},
		
		/**
		 * Get clean HTML
		 */
		cleanHtml: function() {
			var html = this.editor.html();
			
			return html && html.replace( /(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '' );
		}
	};
	
	/**
	 * jQuery wrapper
	 */
	$.fn.texteditor = function() {
		new TextEditor( this );
	};
} )( jQuery, window, document );