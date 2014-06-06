/*!
 * jQuery.ScrollTo
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @author Ariel Flesler
 * @version 1.4.7

 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
 *		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
 *		- The string 'max' for go-to-end.
 * @param {Number, Function} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number, Function} duration The OVERALL length of the animation.
 *	 @option {Boolean} interrupt If true, the scrolling animation will stop on user scroll
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends.
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('#container').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('#container').scrollTo( '+=340px', { axis:'y' } );
 *
 * @desc Scroll using a selector (relative to the scrolled element)
 * @example $(window).scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @desc Scroll to a DOM element (same for jQuery object)
 * @example $(window).scrollTo( document.getElementById('element'), { duration:500, axis:'x', onAfter:function() {
 *				alert('scrolled!!');
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */

(function ($) {

    var $scrollTo = $.scrollTo = function (target, duration, settings) {
        return $(window).scrollTo(target, duration, settings);
    };

    $scrollTo.defaults = {
        axis: 'xy',
        duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
        limit: true
    };

    // Returns the element that needs to be animated to scroll the window.
    // Kept for backwards compatibility (specially for localScroll & serialScroll)
    $scrollTo.window = function (scope) {
        return $(window)._scrollable();
    };

    // Hack, hack, hack :)
    // Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
    $.fn._scrollable = function () {
        return this.map(function () {
            var elem = this,
                isWin = !elem.nodeName || $.inArray(elem.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;

            if (!isWin)
                return elem;

            var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;

            return /webkit/i.test(navigator.userAgent) || doc.compatMode == 'BackCompat' ?
                doc.body :
                doc.documentElement;
        });
    };

    $.fn.scrollTo = function (target, duration, settings) {
        if (typeof duration == 'object') {
            settings = duration;
            duration = 0;
        }
        if (typeof settings == 'function')
            settings = { onAfter: settings };

        if (target == 'max')
            target = 9e9;

        settings = $.extend({}, $scrollTo.defaults, settings);
        // Speed is still recognized for backwards compatibility
        duration = duration || settings.duration;
        // Make sure the settings are given right
        settings.queue = settings.queue && settings.axis.length > 1;

        if (settings.queue)
        // Let's keep the overall duration
            duration /= 2;
        settings.offset = both(settings.offset);
        settings.over = both(settings.over);

        return this._scrollable().each(function () {
            // Null target yields nothing, just like jQuery does
            if (target == null) return;

            var elem = this,
                $elem = $(elem),
                targ = target, toff, attr = {},
                win = $elem.is('html,body');

            switch (typeof targ) {
                // A number will pass the regex
                case 'number':
                case 'string':
                    if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
                        targ = both(targ);
                        // We are done
                        break;
                    }
                    // Relative selector, no break!
                    targ = $(targ, this);
                    if (!targ.length) return;
                case 'object':
                    // DOMElement / jQuery
                    if (targ.is || targ.style)
                    // Get the real position of the target
                        toff = (targ = $(targ)).offset();
            }
            $.each(settings.axis.split(''), function (i, axis) {
                var Pos = axis == 'x' ? 'Left' : 'Top',
                    pos = Pos.toLowerCase(),
                    key = 'scroll' + Pos,
                    old = elem[key],
                    max = $scrollTo.max(elem, axis);

                if (toff) {// jQuery / DOMElement
                    attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos] );

                    // If it's a dom element, reduce the margin
                    if (settings.margin) {
                        attr[key] -= parseInt(targ.css('margin' + Pos)) || 0;
                        attr[key] -= parseInt(targ.css('border' + Pos + 'Width')) || 0;
                    }

                    attr[key] += settings.offset[pos] || 0;

                    if (settings.over[pos])
                    // Scroll to a fraction of its width/height
                        attr[key] += targ[axis == 'x' ? 'width' : 'height']() * settings.over[pos];
                } else {
                    var val = targ[pos];
                    // Handle percentage values
                    attr[key] = val.slice && val.slice(-1) == '%' ?
                        parseFloat(val) / 100 * max
                        : val;
                }

                // Number or 'number'
                if (settings.limit && /^\d+$/.test(attr[key]))
                // Check the limits
                    attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);

                // Queueing axes
                if (!i && settings.queue) {
                    // Don't waste time animating, if there's no need.
                    if (old != attr[key])
                    // Intermediate animation
                        animate(settings.onAfterFirst);
                    // Don't animate this axis again in the next iteration.
                    delete attr[key];
                }
            });

            animate(settings.onAfter);

            function animate(callback) {
                $elem.animate(attr, duration, settings.easing, callback && function () {
                    callback.call(this, targ, settings);
                });
            };

        }).end();
    };

    // Max scrolling position, works on quirks mode
    // It only fails (not too badly) on IE, quirks mode.
    $scrollTo.max = function (elem, axis) {
        var Dim = axis == 'x' ? 'Width' : 'Height',
            scroll = 'scroll' + Dim;

        if (!$(elem).is('html,body'))
            return elem[scroll] - $(elem)[Dim.toLowerCase()]();

        var size = 'client' + Dim,
            html = elem.ownerDocument.documentElement,
            body = elem.ownerDocument.body;

        return Math.max(html[scroll], body[scroll])
            - Math.min(html[size], body[size]);
    };

    function both(val) {
        return typeof val == 'object' ? val : { top: val, left: val };
    };

})(jQuery);

/*!
 * jQuery.localScroll
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * http://flesler.blogspot.com/2007/10/jquerylocalscroll-10.html
 * @author Ariel Flesler
 * @version 1.3.1
 */
;
(function ($) {
    var URI = location.href.replace(/#.*/, ''); // local url without hash

    var $localScroll = $.localScroll = function (settings) {
        $('body').localScroll(settings);
    };

    // Many of these defaults, belong to jQuery.ScrollTo, check it's demo for an example of each option.
    // @see http://flesler.demos.com/jquery/scrollTo/
    // The defaults are public and can be overriden.
    $localScroll.defaults = {
        duration: 1000, // How long to animate.
        axis: 'y', // Which of top and left should be modified.
        event: 'click', // On which event to react.
        stop: true, // Avoid queuing animations
        target: window // What to scroll (selector or element). The whole window by default.
        /*
         lock:false, // ignore events if already animating
         lazy:false, // if true, links can be added later, and will still work.
         filter:null, // filter some anchors out of the matched elements.
         hash: false // if true, the hash of the selected link, will appear on the address bar.
         */
    };

    $.fn.localScroll = function (settings) {
        settings = $.extend({}, $localScroll.defaults, settings);

        if (settings.hash && location.hash) {
            if (settings.target) window.scrollTo(0, 0);
            scroll(0, location, settings);
        }

        return settings.lazy ?
            // use event delegation, more links can be added later.
            this.bind(settings.event, function (e) {
                // Could use closest(), but that would leave out jQuery -1.3.x
                var a = $([e.target, e.target.parentNode]).filter(filter)[0];
                // if a valid link was clicked
                if (a)
                    scroll(e, a, settings); // do scroll.
            }) :
            // bind concretely, to each matching link
            this.find('a,area')
                .filter(filter).bind(settings.event,function (e) {
                    scroll(e, this, settings);
                }).end()
                .end();

        function filter() {// is this a link that points to an anchor and passes a possible filter ? href is checked to avoid a bug in FF.
            return !!this.href && !!this.hash && this.href.replace(this.hash, '') == URI && (!settings.filter || $(this).is(settings.filter));
        };
    };

    // Not needed anymore, kept for backwards compatibility
    $localScroll.hash = function () {
    }

    function scroll(e, link, settings) {
        var id = link.hash.slice(1),
            elem = document.getElementById(id) || document.getElementsByName(id)[0];

        if (!elem)
            return;

        if (e)
            e.preventDefault();

        var $target = $(settings.target);

        if (settings.lock && $target.is(':animated') ||
            settings.onBefore && settings.onBefore(e, elem, $target) === false)
            return;

        if (settings.stop)
            $target._scrollable().stop(true); // remove all its animations

        if (settings.hash) {
            var offset = settings.offset;
            offset = offset && offset.top || offset || 0;
            var attr = elem.id == id ? 'id' : 'name',
                $a = $('<a> </a>').attr(attr, id).css({
                    position: 'absolute',
                    top: $(window).scrollTop() + offset,
                    left: $(window).scrollLeft()
                });

            elem[attr] = '';
            $('body').prepend($a);
            location = link.hash;
            $a.remove();
            elem[attr] = id;
        }

        $target
            .scrollTo(elem, settings) // do scroll
            .trigger('notify.serialScroll', [elem]); // notify serialScroll about this change
    };

})(jQuery);

/*!
 * jQuery Scrollspy Plugin
 * Author: @sxalexander
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    $.fn.extend({
        scrollspy: function ( options ) {

            var defaults = {
                min: 0,
                max: 0,
                mode: 'vertical',
                buffer: 0,
                container: window,
                onEnter: options.onEnter ? options.onEnter : [],
                onLeave: options.onLeave ? options.onLeave : [],
                onTick: options.onTick ? options.onTick : []
            }

            var options = $.extend( {}, defaults, options );

            return this.each(function (i) {

                var element = this;
                var o = options;
                var $container = $(o.container);
                var mode = o.mode;
                var buffer = o.buffer;
                var enters = leaves = 0;
                var inside = false;

                /* add listener to container */
                $container.bind('scroll', function(e){
                    var position = {top: $(this).scrollTop(), left: $(this).scrollLeft()};
                    var xy = (mode == 'vertical') ? position.top + buffer : position.left + buffer;
                    var max = o.max;
                    var min = o.min;

                    /* fix max */
                    if($.isFunction(o.max)){
                        max = o.max();
                    }

                    /* fix max */
                    if($.isFunction(o.min)){
                        min = o.min();
                    }

                    if(max == 0){
                        max = (mode == 'vertical') ? $container.height() : $container.outerWidth() + $(element).outerWidth();
                    }

                    /* if we have reached the minimum bound but are below the max ... */
                    if(xy >= min && xy <= max){
                        /* trigger enter event */
                        if(!inside){
                            inside = true;
                            enters++;

                            /* fire enter event */
                            $(element).trigger('scrollEnter', {position: position})
                            if($.isFunction(o.onEnter)){
                                o.onEnter(element, position);
                            }

                        }

                        /* triger tick event */
                        $(element).trigger('scrollTick', {position: position, inside: inside, enters: enters, leaves: leaves})
                        if($.isFunction(o.onTick)){
                            o.onTick(element, position, inside, enters, leaves);
                        }
                    }else{

                        if(inside){
                            inside = false;
                            leaves++;
                            /* trigger leave event */
                            $(element).trigger('scrollLeave', {position: position, leaves:leaves})

                            if($.isFunction(o.onLeave)){
                                o.onLeave(element, position);
                            }
                        }
                    }
                });

            });
        }

    })


})( jQuery, window );