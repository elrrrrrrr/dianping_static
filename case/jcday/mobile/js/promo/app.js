/**
 * Date: 14-4-24
 * Author: Jerry
 * Time: 上午11:07
 */

jQuery(function($){
    var id = $.QueryString['promoId'],
        promo = {
            promoId : 0
        };

    if(id){
        promo.promoId = parseInt(id, 10);
    }
    $('#promo-info').tmpl(promo).appendTo('.promo-info');

    WeixinApi.ready(function(wx){
        wx.hideOptionMenu();
    });
});