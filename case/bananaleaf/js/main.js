/**
 * Created by Jerry on 2014/5/29.
 */


(function ($) {
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
            return this;
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
            return this;
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
            return this;
        },
        open: function () {
            var _this = this;
            if (_this.closed) {
                _this.closed = false;
                _this._setSize();
                _this.$el.removeClass('invisible');

                _this.onOpen && _this.onOpen.call(_this, arguments);
            }
            return this;
        },
        close: function () {
            var _this = this;
            if (!_this.closed) {
                _this.closed = true;
                _this.$el.addClass('invisible');

                _this.onClose && _this.onClose.call(_this, arguments);
            }
            return this;
        }
    });
})(jQuery);

(function ($) {
    var Roulette = function (o) {
        this._init(o);
    };

    $.extend(Roulette.prototype, {
        _init: function (o) {
            var _this = this;
            _this.options = o;
            _this.ajax = false;
            _this.responseData = {};

            _this.options.element.on('click', function () {
                _this.lottery();
            });
        },
        lottery: function () {
            var _this = this;
            if (!_this.ajax) {
                _this.ajax = true;
                $.ajax({
                    url: "/prize/ajax/prizeDraw",
                    data: _this.options.data,
                    success: function (response) {
                        _this._prizeCheck(response);
                    },
                    error: function () {
                        alert("系统发生错误，请重试！");
                    },
                    complete: function () {
                        _this.ajax = false;
                    }

                });
            }
        },
        _prizeCheck: function (response) {
            var _this = this;
            this.responseData = response;
            switch (_this.responseData.code) {
                case 200:
                    if ($.isFunction(_this.options.successCallback)) {
                        _this.options.successCallback.call(_this, response);
                    }
                    break;
                case 403:
                    if ($.isFunction(_this.options.loginCallback)) {
                        _this.options.loginCallback.call(_this, response);
                    }
                    break;
                case 406:
                    if ($.isFunction(_this.options.infoCallback)) {
                        _this.options.infoCallback.call(_this, "感谢您的关注，<br>活动已结束！");
                    }
                    break;
                case 501:
                    if ($.isFunction(_this.options.infoCallback)) {
                        _this.options.infoCallback.call(_this, "您今天已经抽过奖啦！<br>请明天再来！");
                    }
                    break;
                default:
                    if ($.isFunction(_this.options.infoCallback)) {
                        _this.options.infoCallback.call(_this, _this.responseData.msg.message);
                    }
                    break;
            }
        }
    });

    $.extend({
        Roulette: Roulette
    })
})(jQuery);

jQuery(function ($) {
    var GROUP_ID = 209;

    var info = $.Popup.init('popup-info');

    new $.Roulette({
        data: {
            groupId: GROUP_ID
        },
        element: $('#draw'),
        infoCallback: function( message ){
            var template = ""
                +"<div class='popup-info'>"
                +   "<h1>" + message + "</h1>"
                +"</div>";
            info.setWindow({
                content: template
            }).open();
        },
        loginCallback: function(){
            var template = ""
                +"<div class='popup-info'>"
                +   "<h1>您还未登录大众点评网，请先<a href='http://www.dianping.com/login?redir="
                +   encodeURIComponent(window.location.href) + "'>登录</a>！</h1>"
                +"</div>";

            info.setWindow({
                content: template
            }).open();
        },
        successCallback: function (response) {
            var prize = response.msg.prize,
                rank = ["","一等奖","二等奖","三等奖","四等奖","阳光普照奖"],
                name = prize.prizeName;

            var template = ""
                +"<div class='popup-info'>"
                +   "<h1>恭喜您中了" + rank[prize.rank] + "！</h1>"
                +   "<h2>" + name + "</h2>"
                +   "<div class='hint'>"
                +       "温馨提示：<br>"
                +       "亲，我们将在将每个周五发送短信验证码给您，<br>"
                +       "请确认个人资料完善以便收到中奖短信。<br>谢谢！"
                +   "</div>"
                +"</div>";
            info.setWindow({
                content: template
            }).open();
        }
    });
});