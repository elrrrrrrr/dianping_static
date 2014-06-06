/**
 * Date: 14-4-25
 * Author: Jerry
 * Time: 下午4:47
 */

jQuery(function($){
    var login = false,
        noChance = false;

    var PrizeInfo = {},
        grid = new $.Grid({
            gridSize: 84,
            gap: 3,
            imgGroup:['get-0','get-0','get-0','get-0','get-1','get-1','get-1','get-1','get-1'],
            imgPath:'css/img/index/'
        });

    grid.listen('showWindow', function () {
        popupLayerPrize();
    });
    grid.bindCustomEvents(function(){
        switch (PrizeInfo.rank) {
            case 1: //中奖
                grid.prizeImage = 'get-1';
                break;
            default://没中奖
                grid.prizeImage = 'get-0';
                break;
        }
    });

    function popupLayerEnter() {
        var overlay = $('.float-layer'),

            box = $('<div class="pop-layer-button"></div>'),
            activeButton = $('<a class="btn" href="javascript:void(0);"></a>');

        if (login) {
            if(noChance){
                box.addClass('no-chance');
            }
            else{
                box.addClass('ready');

                activeButton.on('click', function () {
                    box.remove();
                    getNewPrize();
                }).appendTo(box);
            }
        }
        else {
            box.addClass('login');

            activeButton.on('click', function () {
                window.location = 'http://m.dianping.com/login?redir=' + encodeURIComponent(window.location.href);
                return false;
            }).appendTo(box);
        }
        box.appendTo(overlay);
    }

    var popupPrize = $.Popup.init('popup-prize', {
        className: 'popup-prize'
    });

    function popupLayerPrize() {

        var $container = $('#popup-prize').tmpl(PrizeInfo);

        $container.one('click', 'a.button-more', function () {
            popupPrize.close();
        });

        popupPrize.setWindow({
            content: $container,
            onClose: function () {
                popupLayerEnter();
            }
        });
        popupPrize.open();
    }

    function getNewPrize() {
        $.ajax({
            url: '/prize/ajax/prizeDraw',
            data: {
                groupId: 179
            },
            success: function (res) {
                switch (res.code) {
                    case 200:
                        PrizeInfo = res.msg.prize;
                        grid.trigger('gridReady');
                        break;
                    case 403:
                        alert('参与活动，请先登录大众点评网！');
                        window.location = 'http://m.dianping.com/login?redir=' + encodeURIComponent(window.location.href);
                        break;
                    case 501:
                        alert('您今天的抽奖机会已经用完啦！');
                        noChance = true;
                        popupLayerEnter();
                        break;
                    default :
                        PrizeInfo = { rank: 0, prizeName: ''};
                        grid.trigger('gridReady');
                        break;
                }
            },
            error: function(){
                PrizeInfo = { rank: 0, prizeName: '' };

                grid.trigger('gridReady');
            }
        });
    }

    function init(){
        $.ajax({
            url: '/ajax/json/account/info',
            data:{
                r : +new Date()
            },
            success: function(response){
                switch (response.code){
                    case 200:
                        login = true;
                        break;
                }
            },
            complete: function(){
                popupLayerEnter();
            }
        })
    }

    init();
});