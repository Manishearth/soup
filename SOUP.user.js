// ==UserScript==
// @name        Stack Overflow Unofficial Patch
// @namespace   https://github.com/vyznev/
// @description Miscellaneous client-side fixes for bugs on Stack Exchange sites
// @version     1.4.0
// @match       *://*.stackexchange.com/*
// @match       *://*.stackoverflow.com/*
// @match       *://*.superuser.com/*
// @match       *://*.serverfault.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.askubuntu.com/*
// @updateURL   https://github.com/vyznev/soup/raw/master/SOUP.user.js
// @downloadURL https://github.com/vyznev/soup/raw/master/SOUP.user.js
// @grant       none
// @run-at      document-start
// ==/UserScript==


// Copyright (C) 2014 Ilmari Karonen
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.


//
// CSS-only fixes:
//
var styles = "";

// All Stack Exchange sites in a small window causing display problems?
// http://meta.stackoverflow.com/q/114636 (credit: Ben Brocka)
// XXX: .new-topbar keeps this from applying to the mobile version
styles += "body.new-topbar { min-width: 1024px }\n";

// Add a non-breaking space to "reopen (1)" and its ilk
// http://meta.stackoverflow.com/q/215473
styles += ".post-menu a { white-space: nowrap }\n";
styles += ".post-menu .lsep:after { content: ' '; font-size: 0px }\n";

// Layout fix for Firefox in “Zoom text only” mode
// http://meta.stackoverflow.com/q/138685 (credit: jakub.g)
styles += "#question-mini-list, .user-header-left," +
	" .user-panel > .user-panel-content > table { clear: both }\n";

// Topbar text are pushed down on beta sites
// http://meta.stackoverflow.com/q/211547 (credit: hims056)
styles += ".topbar { line-height: 1 }\n";

// Background in OP's user name can obscure text in multiline comments
// http://meta.stackoverflow.com/q/114109
styles += ".comment-copy { position: relative }\n";

// Images can be pushed outside the boundaries of a post by using nested lists
// http://meta.stackoverflow.com/q/143973 (credit: animuson)
styles += ".post-text img, .wmd-preview img { max-width: 100% }\n";

// Ugly overflows when editing a deleted answer inline
// http://meta.stackoverflow.com/q/217120
styles += ".inline-editor { margin-left: -4px }\n";

// <hr/>'s do not get rendered in deleted answers
// http://meta.stackoverflow.com/q/145819
styles += ".wmd-preview hr { background-color: #ddd; color: #ddd }\n";
styles += ".deleted-answer .post-text hr, .deleted-answer .wmd-preview hr" +
	"{ background-color: #c3c3c3; color: #c3c3c3 }\n";

// Mouse cursor doesn't change to pointer when hovering “full site” on mobile
// http://meta.stackoverflow.com/q/108046
styles += "a[onclick] { cursor: pointer }\n";

//
// Chat CSS fixes (currently just mixing with general CSS fixes):
//
// Ignoring somebody screws up the avatar list
// http://meta.stackoverflow.com/q/155308 (credit: DaveRandom)
styles += "#present-users > .present-user.ignored { height: 16px }\n";

// The reply buttons in chat shouldn't reposition themselves on pinged messages
// http://meta.stackoverflow.com/q/216760
styles += ".message.highlight { margin-right: 0px }\n";


//
// Fixes that need scripting (run in page context):
//
var scripts = function () {
	var ajaxHooks = [];

	// U+0008 inserted into chat @-pings (chat)
	// http://meta.stackoverflow.com/q/134268/174699
	// TODO: separate chat fixes from main SE fixes?
	$('body#chat-body').on( 'keypress', function (e) {
		if ( e.ctrlKey || e.altKey || e.metaKey ) return;
		if ( !e.which || e.which == 32 || e.which >= 32 ) return;
		e.stopPropagation();
	} );

	// Clicking on tags broken?
	// http://meta.stackoverflow.com/q/78989
	if ( !/[?&]sort[=]/.test( location.search ) &&
		$('body').hasClass('tagged-questions-page') &&
		$('#tabs a.youarehere').length == 0 ) {
		var href = $('#tabs a[href*="?sort="]:first').attr('href');
		if ( href ) location.replace( href );
	}

    // Cannot navigate into the multicollider with keyboard
	// http://meta.stackoverflow.com/q/207526
	hookAjax( /^\/topbar\//, function () {
		$('.js-site-switcher-button').after($('.siteSwitcher-dialog'));
		$('.js-inbox-button').after($('.inbox-dialog'));
		$('.js-achievements-button').after($('.achievements-dialog'));
	} );
	// fix bug causing clicks on the site search box to close the menu
	// XXX: this would be a lot easier if jQuery bubbled middle/right clicks :-(
	$._data(document, 'events').click.forEach( function (h) {
		if ( !/\$corral\b/.test( h.handler.toString() ) ) return;
		var oldHandler = h.handler;
		h.handler = function (e) {
			if ( $(e.target).closest('.topbar-dialog').length ) return;
			return oldHandler.apply(this, arguments);
		};
	} );

	// Un-fade low-score answers on rollover or click
	// http://meta.stackoverflow.com/q/129593 (based on fix by Manishearth)
	// XXX: this is ugly, but avoids assuming anything about site styles
	$('#answers').on('mouseover', '.downvoted-answer', function () {
		$(this).addClass('downvoted-answer-hover').removeClass('downvoted-answer');
	} ).on('mouseout',  '.downvoted-answer-hover:not(.clicked)', function () {
		$(this).addClass('downvoted-answer').removeClass('downvoted-answer-hover');
	} ).on('click', '.downvoted-answer-hover .post-text', function () {
		$(this).closest('.downvoted-answer-hover').toggleClass('clicked');
	} );
	
	// Allow flagging a comment after upvoting it
	// http://meta.stackoverflow.com/q/104184
	hookAjax( /^\/posts\/\d+\/comments\b/, function () {
		$('.comment-up-on').closest('table').not(':has(.comment-flag)').append(
			// better hardcode this, so it'll break cleanly if SE code changes
			'<tr><td>&nbsp;</td><td><a class="comment-flag soup-injected-fake"' +
			' title="flag this comment as unconstructive, offensive, or spam">' +
			'flag</a></td></tr>'
		);
	} ).code();
	hookAjax( /^\/posts\/comments\/\d+\/vote\b/, function () {
		$('.comment-up-on').closest('tr').siblings('tr:has(.comment-flag)').show();
	} );
	
	// The branch prediction answer is overflowing
	// http://meta.stackoverflow.com/q/214706
	$('.stats .vote-count-post strong').filter( function () {
		return this.textContent.length > 4
	} ).css( 'font-size', '80%' );
	
	// Confirming context menu entries via Enter triggers comment to be posted
	// http://meta.stackoverflow.com/q/66646
	StackExchange.options.desc = true;  // disable SE keyup/press handler
	$('body').on( 'keydown keypress', 'form[id*="-comment-"] textarea',
		function (e) {
			if ( e.which != 13 || e.shiftKey ) return;
			if (window.console) console.log('soup comment ' + e.type);
			e.preventDefault();
			if ( e.type == 'keydown' && $(this).prev('#tabcomplete:visible').length == 0 )
				$(this).closest('form').submit();
		}
	);

	// New top bar should render avatar with a transparent background
	// http://meta.stackoverflow.com/q/210132
	$('.topbar img.avatar-me[src^="http://i.stack.imgur.com/"]').attr(
		'src', function (i,v) { return v.replace( /\?.*$/, "" ) }
	);
	
	// Can we have the "50 more" link return items of the same type, please? (10k)
	// http://meta.stackoverflow.com/q/150069
	if ( /^\/tools\b/.test( location.pathname ) ) {
		$('body.tools-page .bottom-notice a[href="/tools/flagged"]').
			attr('href', location.href);
	}
	
	// Render MathJax in the 10k tools (10k, math)
	// http://meta.stackoverflow.com/q/209393
	if ( /^\/tools\b/.test( location.pathname ) ) {
		hookAjax( /^\/tools\b/, function () {
			typeof(MathJax) !== 'undefined' &&
				MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
		} );
		// similar unrelated issue: MathJax not shown in already flagged posts
		$('.flagged-posts .already-flagged.dno').hide().removeClass('dno');
	}
	
	// SSL breaks TeX rendering (math, SSL)
	// http://meta.stackoverflow.com/q/215450
	if ( 'https:' == location.protocol && 'undefined' === typeof(MathJax) ) {
		$('script[src^="http://cdn.mathjax.org/"]').remove().each( function () {
			$.ajax( {
				dataType: "script", cache: true,
				url: this.src.replace('http://cdn.mathjax.org',
					'https://c328740.ssl.cf1.rackcdn.com')
			} );
		} );
	}

	// Can we have the suggested questions' titles parsed by default? (math)
	// http://meta.math.stackexchange.com/q/11036
	hookAjax( /^\/search\/titles\b/, function () {
		typeof(MathJax) !== 'undefined' &&
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'question-suggestions']);
	} );
	// similar issue in user profiles:
	hookAjax( /^\/ajax\/users\/panel\/\b/, function () {
		if ( typeof(MathJax) === 'undefined' ) return;
		MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'user-panel-questions']);
		MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'user-panel-answers']);
	} );
	
	
	// utility: run code after any matching AJAX request
	function hookAjax ( regex, code ) {
		var hook = { regex: regex, code: code };
		ajaxHooks.push( hook );
		return hook;  // for chaining
	}
	$( document ).ajaxSuccess( function( event, xhr, settings ) {
		for (var i = 0; i < ajaxHooks.length; i++) {
			if ( ajaxHooks[i].regex.test( settings.url ) ) {
				setTimeout( ajaxHooks[i].code, 100 );
			}
		}
	} );
	
	if (window.console) console.log('soup scripts loaded');
};


//
// MathJax config tweaks (need to be injected early):
//
var mathJaxSetup = function () {
	// The scope of \newcommand is the entire page
	// http://meta.math.stackexchange.com/q/4130 (idea by Davide Cervone)
	var resetCmd = "resetstack";
	MathJax.Hub.Config( { TeX: {
		extensions: ["begingroup.js"],
		Macros: { resetstack: ["Extension", "begingroup"] }
	} } );
	MathJax.Hub.Register.StartupHook( "TeX begingroup Ready", function () {
		var TEX = MathJax.InputJax.TeX, TEXDEF = TEX.Definitions,
			NSSTACK = TEX.nsStack, NSFRAME = NSSTACK.nsFrame;
		// make sure user defs on stack can't clobber system defs in TEXDEF
		NSSTACK.Augment( {
			// don't store system defs on root stack...
			Init: function (eqn) {
				this.isEqn = eqn; this.stack = []; this.Push(NSFRAME());
			},
			// ...but fall back to them if nothing is found on the root stack
			Find: function (name, type) {
				// kluge: don't let the reset command be redefined
				if (type == "macros" && name == resetCmd) return "SoupResetStack";
				for (var i = this.top-1; i >= 0; i--) {
					var def = this.stack[i].Find(name,type);
					if (def) {return def}
				}
				// somebody needs to be hit with a giant "S"...
				if (type == "environments") type = "environment";
				return (this.isEqn ? null : TEXDEF[type][name]);
			}
		} );
		// reset definition stack and prevent further changes to system defs
		var resetStack = function () {
			TEX.rootStack.Init();
			TEX.eqnStack.Init(true);
		};
		resetStack();
		TEX.Parse.Augment( { SoupResetStack: resetStack } );
		MathJax.Hub.Startup.signal.Post("TeX SOUP reset Ready");
	} );
	// before processing, inject the reset command to any elements that should be isolated
	var select = '.post-text, .comment-text, .summary, .wmd-preview, .question-hyperlink';
	var reset = '<span class="soup-mathjax-reset"><script type="math/tex">\\' +
		resetCmd + '</script></span>';
	MathJax.Hub.Register.MessageHook( "Begin Process", function (message) {
		$(message[1]).find(select).andSelf().has('script').filter( function () {
			return 0 == $(this).children('.soup-mathjax-reset').length;
		} ).prepend(reset);
	} );

	// MathJax preview broken when equations contain `\label`s
	// http://meta.math.stackexchange.com/q/11392 (credit: Davide Cervone)
	MathJax.Hub.Register.MessageHook("Begin Process",function (message) {
		if (message[1].id && message[1].id.match(/^wmd-preview/)) {
			if ( MathJax.InputJax.TeX.resetEquationNumbers )
				MathJax.InputJax.TeX.resetEquationNumbers();
			MathJax.Hub.Config({TeX:{noErrors:{disabled:true}}});
		}
	});
	MathJax.Hub.Register.MessageHook("End Process",function (message) {
		if (message[1].id && message[1].id.match(/^wmd-preview/)) {
			MathJax.Hub.Config({TeX:{noErrors:{disabled:false}}});
		}
	});

	// debug
	//MathJax.Hub.Startup.signal.Interest(function (message) {console.log("Startup: "+message)});
	//MathJax.Hub.signal.Interest(function (message) {console.log("Hub: "+message)});
	if (window.console) console.log( 'soup mathjax fixes applied' );
};
styles += ".soup-mathjax-reset { display: none }\n";

var configScript = document.createElement( 'script' );
configScript.id = 'soup-mathjax-config';
configScript.type = 'text/x-mathjax-config';
configScript.textContent = "(" + mathJaxSetup + ")();";
(document.head || document.documentElement).appendChild( configScript );


//
// add collected styles and scripts to page
//
var injectScripts = function () {
	var styleElem = document.createElement( 'style' );
	styleElem.id = 'soup-styles';
	styleElem.type = 'text/css';
	styleElem.textContent = styles;
	(document.head || document.documentElement).appendChild( styleElem );

	var scriptElem = document.createElement( 'script' );
	scriptElem.id = 'soup-scripts';
	scriptElem.type = 'text/javascript';
	scriptElem.textContent = "(window.StackExchange || $(document)).ready(" + scripts + ");";
	document.body.appendChild( scriptElem );

	if (window.console) console.log('soup styles and scripts injected');
};
if (document.body) injectScripts();
else if (window.opera) addEventListener( 'load', injectScripts, false );
else document.addEventListener( 'DOMContentLoaded', injectScripts );