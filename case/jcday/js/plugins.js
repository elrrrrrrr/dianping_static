/**
 * Date: 14-4-8
 * Author: Jerry
 * Time: 上午10:39
 */

(function ($) {
    $.throttle = function (fn, scope, threshhold) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date(),
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }
})(jQuery);

(function ($) {
    var NOOP = function(){};

    var Popup = function (options) {
        this.init(options);
    };
    $.Popup = {
        init: function(name, options){
            var popup;
            if(typeof name === 'string'){
                //已经创建了该名称的弹出窗口对象
                if(this.hasOwnProperty(name)){
                    return this[name];
                }
                //新建弹出窗口对象
                popup = new Popup(options);
                this[name] = popup;
                return popup;
            }
            return null;
        },
        Defaults : {
            width: 'auto',
            height: 'auto',
            content: "",
            className: null,
            onOpen: null,
            onClose: null,
            closeable: true
        }
    };
    $.extend(Popup.prototype, {
        init: function (options) {
            var _this = this, o;
            _this.$el = $("<div class='popup-overlay'></div>");
            _this.$mask = $("<div class='popup-mask'></div>").on("click", function () {
                return false;
            });
            _this.$popupWindow = $("<div class='popup-window'></div>");

            _this.closed = true;

            _this.$el.addClass('invisible');

            _this.setWindow( options );

            _this.$popupWindow.appendTo(_this.$el);
            _this.$mask.appendTo(_this.$el);
            _this.$el.appendTo(document.body);
        },
        setWindow: function( options ){
            var _this = this,
                o = $.extend({}, $.Popup.Defaults, options);

            _this.width = o.width;
            _this.height = o.height;
            _this.content = o.content;
            _this.onOpen = o.onOpen;
            _this.onClose = o.onClose;
            _this.className = o.className;

            _this.$popupWindow.empty();
            _this.className && _this.$popupWindow.attr('class','popup-window').addClass(_this.className);
            $(_this.content).appendTo(_this.$popupWindow);

            if (o.closeable) {
                $("<a href='javascript:void(0);' title='关闭' class='popup-close'></a>").on("click",function (e) {
                    e.preventDefault();
                    _this.close();
                }).appendTo(_this.$popupWindow);
            }
        },
        _setSize: function () {
            this.$popupWindow.css({
                width: this.width,
                height: this.height
            });
            this.$popupWindow.css({
                marginLeft: -this.$popupWindow.width() / 2,
                marginTop: -this.$popupWindow.height() / 2
            });
        },
        open: function () {
            var _this = this;
            if (_this.closed) {
                _this.closed = false;
                _this._setSize();
                _this.$el.removeClass('invisible');

                _this.onOpen && _this.onOpen.call(_this, arguments);
            }
        },
        close: function () {
            var _this = this;
            if (!_this.closed) {
                _this.closed = true;
                _this.$el.addClass('invisible');

                _this.onClose && _this.onClose.call(_this, arguments);
            }
        }
    });
})(jQuery);

(function ($) {
    var Carousel = function (element, options) {
        var _this = this,
            option = $.extend($.Carousel.Defaults, options);

        _this.element = $(element);
        _this.wrapper = _this.element.find('.carousel-container');
        _this.roller = _this.wrapper.children('ul');
        _this.list = _this.roller.children('li');
        _this.size = _this.list.length;
        _this.distance = 0;
        _this.current = 1;

        _this.timer = null;

        _this.autoPlay = option.autoPlay;
        _this.duration = option.duration;
        _this.gap = option.gap;

        _this.stepLength = option.stepLength == 'auto' ? _this.list.eq(0).width() : option.stepLength;

        _this.buttons = {
            prev: _this.element.find('a.carousel-nav-left'),
            next: _this.element.find('a.carousel-nav-right')
        };
        _this.buttons.prev.on('click', function () {
            if(!$(this).hasClass('disabled')){
                _this.rollLeft();
            }
        });
        _this.buttons.next.on('click', function () {
            if(!$(this).hasClass('disabled')){
                _this.rollRight();
            }
        });

        _this.roll(_this.current);
        if (_this.autoPlay) {
            _this.start();
        }
    };

    Carousel.prototype.start = function () {
        var _this = this;
        _this.timer = setInterval(function () {
            _this.roll();
        }, _this.gap);
    };

    Carousel.prototype.stop = function () {
        clearInterval(this.timer);
    };

    Carousel.prototype.roll = function (index) {
        var _this = this;

        if(!$.isNumeric(index)){
            index = _this.current + 1;
        }

        if (index > _this.size) {
            _this.current = _this.size;
        }
        else if (index < 1) {
            _this.current = 1;
        }
        else {
            _this.current = index;
        }

        if(Modernizr.csstransforms3d && Modernizr.csstransitions){
            _this.roller.css({
                left: '-' + _this.stepLength * (_this.current - 1) + 'px'
            });
        }
        else{
            _this.roller.animate({
                left: '-' + _this.stepLength * (_this.current - 1) + 'px'
            }, 1000);
        }

        _this.check();
    };
    Carousel.prototype.rollLeft = function () {
        this.roll(this.current - 1);
    };
    Carousel.prototype.rollRight = function () {
        this.roll(this.current + 1);
    };
    Carousel.prototype.check = function () {
        var _this = this;
        if (_this.current == 1) {
            _this.buttons.prev.addClass('disabled');
        }
        else {
            _this.buttons.prev.removeClass('disabled');
        }
        if (_this.current == _this.size) {
            _this.buttons.next.addClass('disabled');
        }
        else {
            _this.buttons.next.removeClass('disabled');
        }
    };

    $.Carousel = {
        Defaults: {
            autoPlay: false,
            gap: 5000,
            stepLength: 'auto'
        },
        Manager: []
    };

    $.fn.carousel = function (options) {
        return this.each(function () {
            var carousel = new Carousel(this, options);
            $(this).data('carousel', carousel);
        });
    }
})(jQuery);

(function($){
    var Time = function(time, offset){
        offset = offset || 0;

        var d = time ? new Date(time) : new Date(),
            localTime = d.getTime(),
            newDate = new Date(localTime + (3600000 * offset));

        this.dateString = newDate.toUTCString().replace(/ GMT$/, "");
        this.dateArray = this.dateString.split(' ');

        this.date = d;
    };

    Time.prototype.getYear = function(){
        return parseInt(this.dateArray[3], 10);
    };
    Time.prototype.getMonth = function(){
        var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for(var i = 0; i < MONTHS.length; i++){
            if(this.dateArray[2] == MONTHS[i]){
                return i + 1;
            }
        }
        return null;
    };
    Time.prototype.getDate = function(){
        return parseInt(this.dateArray[1], 10);
    };

    $.Time = Time;
})(jQuery);

(function ($) {
    $.throttle = function (fn, scope, threshhold) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date(),
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }
})(jQuery);

(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);