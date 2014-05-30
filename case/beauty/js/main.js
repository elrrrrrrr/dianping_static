/**
 * Date: 13-7-9
 * Author: Jerry
 * Time: 4:08 PM
 */

jQuery.noConflict();

jQuery(function ($) {
    $('.popup').each(function () {
        var $this = $(this),
            pane = $this.jScrollPane({
                hideFocus: true,
                mouseWheelSpeed: 50
            }),
            api = pane.data('jsp');

        $(window).on("refresh", function () {
            api.reinitialise();
            api.scrollToY(0);
        });
    });
});

jQuery(function ($) {
    var shopData = {},
        lastData,
        pageControl = {
            currentPage: 1,
            itemsPerPage: 9,
            totalPage: 0
        };

    //获取商户数据
    function getShopData(city, callback) {
        $.ajax({
            url: "data/shopData" + city + ".js",
            dataType: "json",
            success: function (response) {
                var data = {};
                data.shopList = response;
                data.length = data.shopList.length;

                (function () {
                    var i, shop, length, typeList, zoneList;
                    data.typeList = {};
                    data.zoneList = {};
                    length = data.length;
                    for (i = 0; i < length; i++) {

                        shop = data.shopList[i];
                        typeList = data.typeList[shop.type];
                        zoneList = data.zoneList[shop.zone];
                        if (typeList) {
                            data.typeList[shop.type].push(shop);
                        }
                        else {
                            data.typeList[shop.type] = [shop];
                        }
                        if (zoneList) {
                            data.zoneList[shop.zone].push(shop);
                        }
                        else {
                            data.zoneList[shop.zone] = [shop];
                        }
                    }

                })();

                if (callback && typeof(callback) === typeof(new Function())) {
                    callback.call(this, data);
                }
            },
            error: function () {
                setTimeout(function () {
                    getShopData(city, callback);
                }, 5000);
            }
        })
    }

    //渲染模板
    function render(data, templateId, containerId) {
        var $templateId = "#" + templateId,
            $containerId = "#" + containerId;

        $($containerId).empty();
        $($templateId).tmpl(data).appendTo($containerId);

        $(window).trigger("refresh");
    }

    //分页列表
    function paginateList(data, pageControl, toPage) {
        var destination = toPage || 1,
            count = data.length || 0,
            items = pageControl.itemsPerPage,
            subData = [],
            i;

        pageControl.totalPage = Math.ceil(count / items);
        if (count > 0) {
            for (i = 0; i < items; i++) {
                if (((destination - 1) * items + i) < count) {
                    subData.push(data[(destination - 1) * items + i]);
                }
            }
            pageControl.currentPage = destination;
        }
        setPaginateButtons("pagination", pageControl);
        return subData;
    }

    //分页按钮设置
    function setPaginateButtons(id, pageControl) {
        var $id = $("#" + id),
            current = pageControl.currentPage,
            totalPage = pageControl.totalPage;

        //只有一页或没有结果
        if (totalPage < 2) {
            $id.addClass("hide");
        }
        else {
            $id.removeClass("hide");
        }
        //当前在第一页
        if (current === 1) {
            $id.find(".arrow-left").addClass("hide");
        }
        else {

            $id.find(".arrow-left").removeClass("hide");
        }
        //当前在最后一页
        if (current === totalPage) {
            $id.find(".arrow-right").addClass("hide");
        }
        else {

            $id.find(".arrow-right").removeClass("hide");
        }
        //创建最多5个链接
        (function () {
            var i, num, k, $e;
            $id.find("li.link").remove();
            if (totalPage > 5) {
                if (current > 2) {
                    num = current - 2;
                }
                else {
                    num = 1;
                }

                if (totalPage - current < 2) {
                    num = totalPage - 4;
                }
            }
            else {
                num = 1;
            }
            for (i = 0; i < 5; i++) {
                k = num + i;

                $e = $('<li class="link"><a href="javascript:" >' + k + '</a></li>');

                if (k === current) {
                    $e.addClass("current");
                }
                if (k <= totalPage) {
                    $e.insertBefore($id.find(".next"));
                }

            }
        })();

    }

    function renderShopList(data, toPage) {
        var $container = $("#shopList_container").empty();
        if (data.length === 0) {
            render(paginateList(data, pageControl, toPage), "shopList_template", "shopList_container");
            $container.html("<li><p class='no-result'>没有符合条件的商家。</p></li>");
        }
        else {
            render(paginateList(data, pageControl, toPage), "shopList_template", "shopList_container");
        }

        return data;
    }

    //商区列表初始化
    function setZoneData(shopData) {
        var zone,
            zoneList = [],
            zoneData = shopData.zoneList;
        for (zone in zoneData) {
            if (zoneData.hasOwnProperty(zone)) {
                zoneList.push(zone);
            }
        }
        zoneList.splice(0, 0, "所有地区");
        render(zoneList, "List_template", "popDistrictList");
    }

    //菜系列表初始化
    function setTypeData(shopData) {
        var type,
            typeList = [],
            typeData = shopData.typeList;
        for (type in typeData) {
            if (typeData.hasOwnProperty(type)) {
                typeList.push(type);
            }
        }
        typeList.splice(0, 0, "所有菜系");
        render(typeList, "List_template", "popCuisineList");
    }

    //设置要显示的商户数据
    function setRenderData(dataList, callArgs, callFunc) {
        var renderData, func, args;
        if (!callArgs) {
            renderData = dataList;
        }
        else if (callArgs && $.isFunction(callArgs)) {
            func = callArgs;
            renderData = func.call(this, dataList);
        }
        else if (callFunc && $.isFunction(callFunc)) {
            args = callArgs;
            func = callFunc;
            renderData = func.call(this, dataList, args);
        }

        return renderData;
    }

    function filterByDataName(dataList, dataName) {
        return dataList[dataName];
    }

    function init() {

        //绑定按键事件
        $("#cityList").on("click", "a", function () {
            var $this = $(this),
                name = $this.html(),
                renderData = setRenderData(shopData.zoneList, name, filterByDataName);
            $this.parents('.popup').removeClass("visible");
            lastData = renderShopList(renderData);
            return false;
        });
        $("#districtList").on("click", "a", function () {
            var $this = $(this),
                name = $this.html(),
                renderData = setRenderData(shopData.zoneList, name, filterByDataName);
            $this.parents('.popup').removeClass("visible");
            lastData = renderShopList(renderData);
            return false;
        });
        $("#cuisineList").on("click", "a", function () {
            var $this = $(this),
                name = $this.html(),
                renderData = setRenderData(shopData.typeList, name, filterByDataName);
            $this.parents('.popup').removeClass("visible");
            lastData = renderShopList(renderData);
            return false;
        });
        //弹出菜单事件
        var $buttons = $(".button");

        $buttons.each(function () {
            var $this = $(this),
                $hint = $this.find('a.span'),
                $list = $this.find(".popup");

            function toggle(){
                if ($list.hasClass("visible")) {
                    $list.removeClass("visible");
                }
                else{
                    $list.addClass("visible");
                }
            }

            $(document).on('click', function (evt) {
                var target = evt.target;
                if (target == $hint[0]) {
                    toggle();
                    return false;
                }
                if (target == $list[0] || ($(target).parents('.popup').length && $(target).parents('.popup')[0] == $list[0])) {
                    return false;
                }
                $list.removeClass("visible");
                return true;
            });

        });
        //筛选列表初始化
        $("#popCityList").on("click", "a", function () {
            var $this = $(this),
                name = $this.html(),
                val = $this.attr('id');

            $this.parents('.popup').removeClass('visible');
            $("#chooseCity").find("a.span").html(name);

            getShopData(val, function (data) {
                var renderData,

                    $selects = $("#chooseCuisine").add("#chooseDistrict").add("#search");
                shopData = data;
                renderData = setRenderData(data.shopList);
                setZoneData(shopData);
                setTypeData(shopData);
                $("#popCuisineList").find("li:eq(0) a").click();
                $("#popDistrictList").find("li:eq(0) a").click();
//                if(data.length < 10){
//                    $selects.hide();
//                }
//                else{
//                    $selects.show();
//                }
                lastData = renderShopList(renderData);
            });
        });
        $("#popCuisineList").on("click", "a", function () {
            var $this = $(this),
                name = $this.html();
            $this.parents('.popup').removeClass('visible');
            $("#chooseCuisine").find("a.span").html(name);
            name = name === "所有菜系" ? "" : name;
            $("#searchCuisine").val(name);
        });
        $("#popDistrictList").on("click", "a", function () {
            var $this = $(this),
                name = $this.html();
            $this.parents('.popup').removeClass('visible');
            $("#chooseDistrict").find("a.span").html(name);
            name = name === "所有地区" ? "" : name;
            $("#searchDistrict").val(name);
        });

        //搜索按钮初始化
        $("#search").on("click", function () {
            var type = $("#searchCuisine").val(),
                zone = $("#searchDistrict").val(),
                renderData;

            renderData = setRenderData(shopData.shopList, function (data) {
                var i, length = data.length, renderData = [];

                if (zone || type) {
                    if (zone && type) {
                        for (i = 0; i < length; i++) {
                            if (data[i].zone === zone && data[i].type === type) {
                                renderData.push(data[i]);
                            }
                        }
                    }
                    else if (zone) {
                        for (i = 0; i < length; i++) {
                            if (data[i].zone === zone) {
                                renderData.push(data[i]);
                            }
                        }
                    }
                    else {
                        for (i = 0; i < length; i++) {
                            if (data[i].type === type) {
                                renderData.push(data[i]);
                            }
                        }
                    }
                }
                //所有的菜系和地区
                else {
                    renderData = data;
                }

                return renderData;
            });

            lastData = renderShopList(renderData);
        });

        //分页按钮初始化
        $("#pagination").each(function () {
            var $this = $(this);

            $this.on("click", "a", function () {
                var $a = $(this),
                    page = parseInt($(this).html(), 10);
                if ($a.parent("li").hasClass("current")) {
                    return false;
                }
                if ($a.parent("li").hasClass("first")) {
                    renderShopList(lastData, 1);
                    return false;

                }
                if ($a.parent("li").hasClass("prev")) {
                    renderShopList(lastData, pageControl.currentPage - 1);
                    return false;

                }
                if ($a.parent("li").hasClass("next")) {
                    renderShopList(lastData, pageControl.currentPage + 1);
                    return false;
                }
                if ($a.parent("li").hasClass("last")) {
                    renderShopList(lastData, pageControl.totalPage);
                    return false;
                }
                renderShopList(lastData, page);
                return false;
            });
        });
    }

    init();
});

jQuery(function($){
    var cye = $.cookie('cye') || 'shanghai',
        $promo = $('#promotion'),
        $view = $('#view-now'),
        link = 'http://www.dianping.com/promo/';

    function track(url){
        var image = new Image();

        image.src = url;
    }

    switch (cye){
        case 'guangzhou':
            $promo.attr('href', link + 219860);
            break;
        case 'chongqing':
            $promo.attr('href', link + 219787);
            break;
        case 'xian':
            $promo.attr('href', link + 219799);
            break;
        case 'chengdu':
            $promo.attr('href', link + 219786);
            break;
        case 'hangzhou':
            $promo.attr('href', link + 219767);
            break;
        case 'zhengzhou':
            $promo.attr('href', link + 219828);
            break;
        case 'nanjing':
            $promo.attr('href', link + 219781);
            break;
        case 'dalian':
            $promo.attr('href', link + 219801);
            break;
        case 'changchun':
            $promo.attr('href', link + 219805);
            break;
        case 'haerbin':
            $promo.attr('href', link + 219837);
            break;
        case 'fuzhou':
            $promo.attr('href', link + 219797);
            break;
        case 'shenyang':
            $promo.attr('href', link + 219800);
            break;
        case 'tianjin':
            $promo.attr('href', link + 219788);
            break;
        case 'beijing':
            $promo.attr('href', link + 219752);
            break;
        case 'shanghai':
        default :
            $promo.attr('href', link + 219747);
            break;
    }
    $('.place-' + cye).click();

    $promo.on('click', function(){
        track('http://s.cr-nielsen.com/hat?_t=r&_htsinfo=QyYyJjgwMDAwMTYzJjEwMDAzMzA2JjMwMDU0MTI5JosT' + '&rnd=' + (+new Date));
    });

    $view.on('click', function(){
        track('http://s.cr-nielsen.com/hat?_t=r&_htsinfo=QyYyJjgwMDAwMTYzJjEwMDAzMzA2JjMwMDU0MTMwJtTA' + '&rnd=' + (+new Date));
    });
});