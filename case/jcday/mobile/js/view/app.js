/**
 * Date: 14-4-17
 * Author: Jerry
 * Time: 下午2:24
 */

jQuery(function($){
    var time = $.QueryString['time'],
        place = $.QueryString['place'];

    if(time && place){
        $('#time').text(time);
        $('#place').text(place);
    }
    else{
        $('.customize').remove();
    }
    WeixinApi.ready(function(wx){
        wx.hideOptionMenu();
    });
});