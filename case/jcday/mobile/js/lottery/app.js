jQuery(function($){
    WeixinApi.ready(function(wx){
        wx.hideOptionMenu();
    });

    $('.rule-button').on('click', function(){
        $('.rule').toggleClass('expand');
    });
});

jQuery(function ($) {

    function turnIn(selector, callback) {
        var $this = $(selector),
            front = $this.children('.front'),
            back = $this.children('.back');

        if ($.browser.msie && $.browser.version < 10) {
            front.animate({
                width: '0%'
            }, 500);
            back.animate({
                width: '100%'
            }, 500);
        }
        else {
            front.addClass('animating').css({
                transform: 'rotateY(180deg)'
            });
            back.addClass('animating').css({
                transform: 'rotateY(360deg)'
            });
        }
        setTimeout(function () {
            front.removeClass('animating');
            back.removeClass('animating');

            callback && callback.call(this);
        }, 500);
    }

    function turnOut(selector, callback) {
        var $this = $(selector),
            front = $this.children('.front'),
            back = $this.children('.back');

        if (prize.rank) {
            front.find('img').attr('src', 'css/img/poker-front-atari.png');
        }
        else {
            front.find('img').attr('src', 'css/img/poker-front-hazure.png');
        }

        if ($.browser.msie && $.browser.version < 10) {
            front.animate({
                width: '100%'
            }, 500);
            back.animate({
                width: '0%'
            }, 500);
        }
        else {
            front.addClass('animating').css({
                transform: 'rotateY(0deg)'
            });
            back.addClass('animating').css({
                transform: 'rotateY(180deg)'
            });
        }
        setTimeout(function () {
            front.removeClass('animating');
            back.removeClass('animating');
            callback && callback.call(this);
        }, 500);
    }

    var processing = false,
        element,
        recordId = null,
        prize = {};

    var popupPrize = $.Popup.init('popup-prize', {
        className: 'popup-prize'
    });

    function popupWindow() {
        var $container = $('#popup-prize').tmpl(prize),
            ajax = false;

        $container.on('click', 'a.send-info',function(){
            var name = $('#userName').val(),
                mobileNo = $('#mobileNo').val(),
                address = $('#address').val();
            if(name && mobileNo && /1\d{10}/.test(mobileNo) && address){
                ajax = true;
                $.ajax({
                    url: "/prize/ajax/userInfo",
                    data: {
                        userName: name,
                        recordId: recordId,
                        mobileNo: mobileNo,
                        address: address
                    },
                    success: function (rsp) {
                        if (rsp.code == 200) {
                            alert("提交成功！");
                            popupPrize.close();
                        }
                        else{
                            alert(rsp.msg.message);
                        }
                    },
                    error: function () {
                        alert("系统出现错误，请重试！");
                    },
                    complete: function () {
                        ajax = false;
                    }
                });
            }
            else{
                alert('请输入正确的信息！');
            }
        });
        $container.one('click', 'a.button-more', function () {
            popupPrize.close();
        });

        popupPrize.setWindow({
            closeable: false,
            content: $container,
            onClose: function () {
                turnIn(element, function () {
                    processing = false;
                });
            }
        });
        popupPrize.open();
    }

    function login() {
        alert('参与活动，请先登录大众点评网！');
        window.location = 'http://m.dianping.com/login?redir=' + encodeURIComponent(window.location.href);
    }

    $('.poker').each(function () {

        var $this = $(this);

        $this.find('.front').css({
            transform: 'rotateY(180deg)'
        });
        $this.find('.back').css({
            transform: 'rotateY(360deg)'
        });

        $(this).on('click', function () {
            if (!processing) {
                element = this;
                processing = true;
                $.ajax({
                    url: '/prize/ajax/prizeDraw',
                    data: {
                        groupId: 169
                    },
                    success: function (res) {
                        switch (res.code) {
                            case 200:
                                prize = res.msg.prize;
                                recordId = res.msg.recordId;
                                turnOut(element, popupWindow);
                                break;
                            case 403:
                                login();
                                break;
                            default :
                                prize = { rank: 0, prizeName: '' };

                                turnOut(element, popupWindow);
                                break;
                        }
                    },
                    error: function(){
                        prize = { rank: 2, prizeName: '' };

                        turnOut(element, popupWindow);
                    },
                    complete: function () {
                    }
                })

            }
        });
    })
});
