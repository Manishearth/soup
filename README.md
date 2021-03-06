The Stack Overflow Unofficial Patch (SOUP) is a project to collect various minor client-side bugfixes, work-arounds and usability improvements for [Stack Overflow][SO] and other Q&A sites on the [Stack Exchange Network][SE] into a single user script.

The intent of SOUP is not to make any substantial or controversial changes to the Stack Exchange user interface, but to fix minor problems and omissions that the SE developers have overlooked or haven't got around to fixing yet.  By combining these minor patches into a single user script, they become easier to install and maintain.


Installing
----------

The easiest way to install SOUP is to use the [GreaseMonkey][GM] (for Firefox) or [TamperMonkey][TM] (for Chrome) extension for managing user scripts.  (Other similar extensions, like Scriptish or NinjaKit, should also work.)  After installing the extension, clicking the ["download / install"][DL] button below should bring up a dialog asking you if you want to install SOUP.  Answer "yes".

> ### [<kbd>Download / Install</kbd>][DL]  
> <sup>[View source][source] / [GitHub repo][github] / [StackApps post][SA]</sup>

SOUP can also be used on other browsers with compatible user script support, such as Opera or Safari.  For detailed instructions on how to enable and install user scripts on different browsers, see the **["script" tag wiki on StackApps](http://stackapps.com/tags/script/info "'script' tag wiki - StackApps")**.

**Notes:**

* When installing SOUP on Opera, please *remove the "<code>.user</code>" part from the file name* to disable GreaseMonkey compatibility mode.  While SOUP can run in either native or compatibility mode, a few MathJax-related fixes require native mode.

* SOUP has not yet been tested on Safari, but in principle it _should_ work.  If you do try to use it, please let me know how / if it works.

Included fixes
--------------

SOUP v1.4 includes fixes or workarounds for the following issues:

* [All Stack Exchange sites in a small window causing display problems?](http://meta.stackoverflow.com/q/114636) ([CSS][CSS])
* [Add a non-breaking space to “reopen (1)” and its ilk](http://meta.stackoverflow.com/q/215473) ([CSS][CSS])
* [Layout fix for Firefox in “Zoom text only” mode](http://meta.stackoverflow.com/q/138685) ([CSS][CSS])
* [Topbar text are pushed down on beta sites](http://meta.stackoverflow.com/q/211547) ([CSS][CSS])
* [Background in OP's user name can obscure text in multiline comments](http://meta.stackoverflow.com/q/114109) ([CSS][CSS])
* [Images can be pushed outside the boundaries of a post by using nested lists](http://meta.stackoverflow.com/q/143973) ([CSS][CSS])
* [Ugly overflows when editing a deleted answer inline](http://meta.stackoverflow.com/q/217120) ([CSS][CSS])
* [&lt;hr/&gt;'s do not get rendered in deleted answers](http://meta.stackoverflow.com/q/145819) ([CSS][CSS])
* [Mouse cursor doesn't change to pointer when hovering “full site” on mobile](http://meta.stackoverflow.com/q/108046) ([CSS][CSS])
* [Ignoring somebody screws up the avatar list](http://meta.stackoverflow.com/q/155308) ([CSS][CSS], [chat][chat])
* [The reply buttons in chat shouldn't reposition themselves on pinged messages](http://meta.stackoverflow.com/q/216760) ([CSS][CSS], [chat][chat])
* [U+0008 inserted into chat @-pings](http://meta.stackoverflow.com/q/134268/174699) ([chat][chat])
* [Clicking on tags broken?](http://meta.stackoverflow.com/q/78989)
* [Cannot navigate into the multicollider with keyboard](http://meta.stackoverflow.com/q/207526)
* [Un-fade low-score answers on rollover or click](http://meta.stackoverflow.com/q/129593)
* [Allow flagging a comment after upvoting it](http://meta.stackoverflow.com/q/104184)
* [The branch prediction answer is overflowing](http://meta.stackoverflow.com/q/214706)
* [Confirming context menu entries via Enter triggers comment to be posted](http://meta.stackoverflow.com/q/66646)
* [New top bar should render avatar with a transparent background](http://meta.stackoverflow.com/q/210132)
* [Can we have the "50 more" link return items of the same type, please?](http://meta.stackoverflow.com/q/150069) ([10k][10k])
* [Render MathJax in the 10k tools](http://meta.stackoverflow.com/q/209393) ([math][math], [10k][10k])
* [SSL breaks TeX rendering](http://meta.stackoverflow.com/q/215450) ([math][math])
* [Can we have the suggested questions' titles parsed by default?](http://meta.math.stackexchange.com/q/11036) ([math][math])
* [The scope of \newcommand is the entire page](http://meta.math.stackexchange.com/q/4130) ([math][math])
* [MathJax preview broken when equations contain `\label`s](http://meta.math.stackexchange.com/q/11392) ([math][math])

Notes:

* <b id="note-css">CSS</b>: This is a pure CSS fix.  It will be applied even if site JavaScript is disabled.
* <b id="note-chat">chat</b>: This fix applies to the [Stack Exchange Network chat](http://chat.stackexchange.com "Stack Exchange Network chat").
* <b id="note-10k">10k</b>: This fix applies to the "moderator tools" interface available to users with 10,000+ rep (3,000+ on beta sites).
* <b id="note-math">math</b>: This fix applies only to sites using MathJax for LaTeX math rendering.


Credits
-------

SOUP is currently maintained by [Ilmari Karonen][vyznev].  Several of the fixes are based on suggestions or earlier user scripts made by others; see the [source code][source] and/or the meta.SO links above for details.


Contributing
------------

If you know a user script or stylesheet patch for SO or other SE sites that would be suitable for inclusion in SOUP, or an unfixed issue that you believe might be worth patching, please let me know (e.g. by posting a comment or an answer the [SOUP page on StackApps][SA]).

To be included in SOUP, a patch should:

* **address a known unfixed issue:** If you find a new interface bug on SO, please [report it on MSO](http://meta.stackoverflow.com/questions/ask) first, and give the devs some time to fix it.  There's no hard limit on this, but there's not much point in patching something via SOUP if it's going to be fixed by the devs in a few minutes / hours / days anyway.

* **be simple and fast:** The mean length of individual patches in SOUP (excluding shared infrastructure) is currently around three lines of code.  If adding a new patch would significantly increase the length of SOUP, cause a noticeable performance impact or introduce a significant external dependency (e.g. new syntax highlighting rules), it's probably not suitable.

* **be uncontroversial:** SOUP is intended to be a "least common denominator" patch set for everyone.  While a simple [`[status-declined]`](http://meta.stackoverflow.com/tags/status-declined/info "'status-declined' tag wiki - Meta Stack Overflow") doesn't necessarily disqualify an issue from being included in SOUP (sometimes it just means the devs are feeling lazy ;-), if a substantial number of people say they don't want it, it doesn't go in.  In particular, patches that add significant new functionality, significantly change the appearance of the site or [repaint the bikeshed](http://en.wikipedia.org/wiki/Parkinson%27s_Law_of_Triviality) are not suitable for SOUP.

* **be safe and unobtrusive:** This goes with the above points: if any patch in SOUP turns out to cause undesirable side effects (including usability or performance issues) on some platforms, it should be either fixed or removed.

If you notice that any fix included in SOUP is not working for you, causes undesirable side effects or has become obsolete (e.g. because the bug it's working around was fixed), please let me know!


See also
--------

* [SE Modifications — Username autocomplete in comments, inline revision source, and utility links](http://stackapps.com/questions/2138/se-modifications-username-autocomplete-in-comments-inline-revision-source-a)
* [SE Chat Modifications — Keyboard navigation and commands for chat](http://stackapps.com/questions/2105/se-chat-modifications-keyboard-navigation-and-commands-for-chat)
* [Official keyboard shortcuts](http://stackapps.com/questions/2567/official-keyboard-shortcuts)
* ...and other [popular user scripts on StackApps](http://stackapps.com/?tab=scripts)

   [SO]: http://stackoverflow.com/ "Stack Overflow"
   [SE]: http://stackexchange.com/ "Stack Exchange Network"
   [DL]: https://github.com/vyznev/soup/raw/master/SOUP.user.js "Download / install SOUP from GitHub"
   [source]: https://github.com/vyznev/soup/blob/master/SOUP.user.js "View SOUP source code"
   [GM]: https://addons.mozilla.org/firefox/addon/greasemonkey/ "Mozilla add-ons: GreaseMonkey"
   [TM]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo "Chrome Web Store: Tampermonkey"
   [chrome-ext]: https://support.google.com/chrome/answer/187443 "Chrome > Help > Manage your extensions"
   [CSS]: #note-css "This is a pure CSS fix.  It will be applied even if site JavaScript is disabled."
   [chat]: #note-chat "This fix applies to the Stack Exchange Network chat (chat.stackexchange.com)."
   [math]: #note-math "This fix applies only to sites using MathJax for LaTeX math rendering."
   [10k]: #note-10k " This fix applies to the "moderator tools" interface available to users with 10,000+ rep (3,000+ on beta sites)."
   [vyznev]: http://meta.stackoverflow.com/users/174699/ilmari-karonen "User Ilmari Karonen - Meta Stack Overflow"
   [github]: https://github.com/vyznev/soup "SOUP repository on GitHub"
   [SA]: http://stackapps.com/questions/4486/stack-overflow-unofficial-patch "Stack Overflow Unofficial Patch on StackApps"
