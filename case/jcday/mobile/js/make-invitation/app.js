/**
 * Date: 14-4-10
 * Author: Jerry
 * Time: 下午5:50
 */

jQuery(function ($) {
    //日期设定
    function setNextDay() {
        var offset = 8,
            Timer = new $.Time(+new Date(), offset),
            year = Timer.getYear(),
            month = Timer.getMonth(),
            date = Timer.getDate(),
            nextYear = year,
            nextMonth = month,
            nextDate;

        //寻找最近的下一个9日
        if (date < 9) {
            nextDate = 9;
        }
        else if (date < 19) {
            nextDate = 19;
        }
        else if (date < 29) {
            if (month == 2) {
                //检查是否是闰年
                if ((!(year % 4) && (year % 100)) || !(year % 400)) {
                    nextDate = 29;
                }
                else {
                    nextDate = 9;
                    nextMonth = 3;
                }
            }
            else {
                nextDate = 29;
            }
        }
        else {
            nextDate = 9;
            nextMonth += 1;
            if (nextMonth > 12) {
                nextMonth = 1;
                nextYear += 1;
            }
        }
        return {
            nextYear: nextYear,
            nextMonth: nextMonth,
            nextDate: nextDate
        }
    }

    $('.select-group').each(function () {
        var $this = $(this),
            $select = $this.children('select'),
            $span = $this.children('span');

        $select.on('change', function () {
            $span.text($select.val());
        });
    });

    var nextDay = setNextDay(),
        tempDay = setNextDay();

    $('#invYear').on('change', function () {
        tempDay.nextYear = $(this).val();
        setMonth(1);
        setDate(1);
    });
    $('#invMonth').on('change', function () {
        tempDay.nextMonth = $(this).val();
        setDate(1);
    });
    $('#invDate').on('change', function () {
        tempDay.nextDay = $(this).val();
    });
    function setYear(year) {
        var $this = $('#invYear');
        $this.empty();
        for (var i = 0; i < 2; i++) {
            var value = nextDay.nextYear + i;
            $('<option></option>').text(value).val(value).appendTo($this);
        }
        $this.val(year);
        tempDay.nextYear = year;
        $this.trigger('change');
    }

    function setMonth(month) {
        var $this = $('#invMonth');
        $this.empty();
        for (var i = 1; i <= 12; i++) {
            var value = i < 10 ? '0' + i.toString() : i.toString();
            $('<option></option>').text(value).val(value).appendTo($this);
        }
        tempDay.nextMonth = month;
        month = month < 10 ? '0' + month.toString() : month.toString();
        $this.val(month);
        $this.trigger('change');
    }

    function setDate(date) {
        var $this = $('#invDate'),
            dates = (function () {
                var mon = tempDay.nextMonth ? parseInt(tempDay.nextMonth, 10) : 1;
                switch (mon) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        return 31;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        return 30;
                    case 2:
                        if ((!(nextDay.nextYear % 4) && (nextDay.nextYear % 100)) || !(nextDay.nextYear % 400)) {
                            return 29;
                        }
                        else return 28;
                }
            })();
        $this.empty();
        for (var i = 1; i <= dates; i++) {
            var value = i < 10 ? '0' + i.toString() : i.toString();
            $('<option></option>').text(value).val(value).appendTo($this);
        }

        date = date < 10 ? '0' + date.toString() : date.toString();
        $this.val(date);
        $this.trigger('change');
    }

    setYear(nextDay.nextYear);
    setMonth(nextDay.nextMonth);
    setDate(nextDay.nextDate);

    $('#invHours').each(function () {
        var $this = $(this);
        for (var i = 0; i < 24; i++) {
            var value = i < 10 ? '0' + i.toString() : i.toString();
            $('<option></option>').text(value).val(value).appendTo($this);
        }
    });
    $('#invMinutes').each(function () {
        var $this = $(this);
        for (var i = 0; i < 60; i++) {
            var value = i < 10 ? '0' + i.toString() : i.toString();
            $('<option></option>').text(value).val(value).appendTo($this);
        }
    });
});

jQuery(function ($) {
    //地点设定
    var $resInput = $('#invPlace'),

        $element = $(".choose-restaurant"),
        $list = $element.find('.item-list'),
        $template = $element.find('#template-restaurants');

    $.ajax({
        url: 'data/promo.js',
        dataType: 'json',
        success: function (items) {
            var item;
            while (items.length) {
                item = $template.tmpl(items.shift());
                item.appendTo($list);
            }

            $element.on('click', 'a.info', function (e) {
                var $this = $(this),
                    id = $this.find('input.promo').val(),
                    name = $this.find('h3').text(),
                    address = $this.find('.address').text();

                $resInput.val([name, address].join(' '));
                setTimeout(function () {
                    $element.find('a.info').removeClass('active');
                    $this.addClass('active');
                    $('#promoId').val(id);
                }, 1);
            });
        }
    });

    $resInput.on('change', function () {
        $('#promoId').val(0);
        $element.find('a.info').removeClass('active');
    });
});

jQuery(function ($) {

    //微信APP分享
    var wxData = {};

    function AppBridge(){
        var callbacksCount = 1;
        var callbacks = {};

        window.DPApp = {
            send_message: function (method, args, callback) {
                var hasCallback = callback && typeof callback == 'function';
                var callbackId = hasCallback ? callbacksCount++ : 0;
                if (hasCallback) {
                    callbacks[callbackId] = callback;
                }

                args['callbackId'] = callbackId;
                args = (typeof args === 'object') ? JSON.stringify(args) : args + '';
                window.location.href = 'js://_?method=' + method + '&args=' + encodeURIComponent(args) + '&callbackId=' + callbackId;
            },

            callback: function(callbackId, retValue) {
                try {
                    var callback = callbacks[callbackId];
                    if (!callback) {
                        return;
                    }

                    callback.apply(null, [retValue]);
                } catch(e) {
                    alert(e);
                }
            },

            share: function(args) {
                this.send_message('share', args, null);
            },

            unbindfinish: function(args) {
                this.send_message('unbindfinish', args, null);
            },
            bindfinish: function(args) {
                this.send_message('bindfinish', args, null);
            }
        };
    }
    //点评APP分享
    AppBridge();

    var $send = $('<a class="button app-send-invitation" href="javascript:void(0);">分享</a>');
    $send.on('click', function(){
        var shareData = {
            "image": 'http://event.dianping.com/jcday/mobile/css/img/weixin-logo.jpg',
            "url": 'http://event.dianping.com/jcday/mobile/view.html?time=' + encodeURIComponent(Info.time) +
                '&place=' + encodeURIComponent(Info.place),
            "title": '真情相约，逢9必聚',
            "desc": '#真情相约逢9必聚#亲爱的小伙伴们，是时候高端大气上档次地聚一回了！'
        };
        try {
            DPApp.share(shareData);
        } catch (e) {
        }
        finally{
            setTimeout(function(){
                //不管分享成功与否都直接跳转
                window.location = 'http://event.dianping.com/jcday/mobile/promo.html?promoId=' + Info.promo;
            }, 1000);
        }
    }).prependTo('#preview-group');

    WeixinApi.ready(function(wx){

        $('.no-weixin').removeClass('no-weixin');

        var wxCallbacks = {
            async: true,
            ready: function(){
                wxData = {
                    "imgUrl" : 'http://event.dianping.com/jcday/mobile/css/img/weixin-logo.jpg',
                    "link": 'http://event.dianping.com/jcday/mobile/view.html?time=' + encodeURIComponent(Info.time) +
                        '&place=' + encodeURIComponent(Info.place),
                    "desc": '#真情相约逢9必聚#亲爱的小伙伴们，是时候高端大气上档次地聚一回了！',
                    "title": '真情相约，逢9必聚'
                };
                this.dataLoaded(wxData);

                setTimeout(function(){
                    //不管分享成功与否都直接跳转
                    window.location = 'http://event.dianping.com/jcday/mobile/promo.html?promoId=' + Info.promo;
                }, 1000);
            }
        };
        wx.shareToFriend({}, wxCallbacks);
        wx.shareToTimeline({}, wxCallbacks);
        wx.shareToWeibo({}, {});

        wx.hideOptionMenu();

        $send.remove();
    });

    var Info = {};

    //下一步
    $('#goNext').on('click', function () {
        var place = $('#invPlace').val();
        if(!place || !$.trim(place)){
            alert('请输入聚会餐厅！');
        }
        else{
            Info = {
                time : $('#invYear').val() + '年' + $('#invMonth').val() + '月' + $('#invDate').val() + '日' +
                    $('#invHours').val() + '时' + $('#invMinutes').val() + '分',
                place : place,
                promo : $('#promoId').val()
            };
            $('.preview').removeClass('hide');
            $('.make-invitation').addClass('hide');

            $('#time').text(Info.time);
            $('#place').text(Info.place);
        }
        WeixinApi.ready(function(wx){
            wx.showOptionMenu();
        });
    });


    //返回
    $('#goPrev').on('click', function () {
        $('.preview').addClass('hide');
        $('.make-invitation').removeClass('hide');
        WeixinApi.ready(function(wx){
            wx.hideOptionMenu();
        });
    });
});