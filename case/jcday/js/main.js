yepnope({
    load: [
        "js/jquery.min.js",
        "js/jquery.tmpl.min.js",
        "js/jquery.jscrollpane.min.js",
        "css/jquery.jscrollpane.css",
        "js/jquery.mousewheel.min.js",
        "js/jquery.scrollto.min.js",
        "js/plugins.js"
    ],
    complete: function(){
        yepnope("js/app.js")
    }
});