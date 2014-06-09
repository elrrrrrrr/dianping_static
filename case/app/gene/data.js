// pageTracker._trackPageview("events/market/ttzj/hangzhou");


//0-美甲 1-美发 2-遇见 3-密室
window.type = '3';
window.banner='img/banner.jpg';
window.storeList = [{
        "name": "Pulupulu主题游戏馆",
        "imgs": ["img/3/1-1.jpg","img/3/1-2.jpg"],
        "promotion": "",
        "coupon": "dianping://tuandeal?id=2031990",
        "link": "dianping://shopinfo?id=13813428"
    }, {
        "name": "X先生密室(黄浦旗舰店)",
        "imgs": ["img/3/2.jpg"],
        "promotion": "http://www.dianping.com/promo/221204?source=1",
        "coupon": "dianping://tuandeal?id=166787",
        "link": "dianping://shopinfo?id=6028133"
    }, {
        "name": "Black Queen黑桃皇后密室逃脱",
        "imgs": ["img/3/3.jpg"],
        "promotion": "",
        "coupon": "dianping://tuandeal?id=2082681",
        "link": "dianping://shopinfo?id=15859249"
    },
    {
        "name": "FBI真人密室",
        "imgs": ["img/3/4.jpg"],
        "promotion": "",
        "coupon": "",
        "link": "dianping://shopinfo?id=18217327"
    }, {
        "name": "极道真人密室逃脱(人民广场大世界店)",
        "imgs": ["img/3/5.jpg"],
        "promotion": "",
        "coupon": "",
        "link": "dianping://shopinfo?id=18179096"
    }, {
        "name": "睿趣Reach真人密室逃脱(四川北路店)",
        "imgs": ["img/3/6.jpg"],
        "promotion": "",
        "coupon": "dianping://tuandeal?id=2049465",
        "link": "dianping://shopinfo?id=8854466"
    }
];

( function  () {
    var os, promoid,
        platform = navigator.platform,
        ua = navigator.userAgent,
        map = {
            'android' : 'dianping://newpromoinfo?type=2&promoid=',
            'ios': 'dianping://promoinfo?promoid='
        };  

    if (platform.match(/iPhone|iPod|iPad/i)) {
        os = "ios";
    } else if (platform.match(/Linux/i) && ua.match(/android|Silk/i)) {
        os = "android";
    }

    _.each(window.storeList, function (item) {
        promoid = item.promotion.match(/(\d+)\?/);
        if (promoid) {
            item.promotion = map[os] +  promoid[1] + (os == 'ios' ? '&shopid=' + item.link.match(/\?id=(\d+)/)[1] : '');
        }
    });
})();
