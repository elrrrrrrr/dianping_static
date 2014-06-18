(function ($) {
    var Grid = function (options) {
            this.init(options);
        },
        fn = Grid.prototype;
    fn.init = function (options) {
        var _this = this;
        //var opt = $.extend({}, options);
        var opt = options ;
        this.clicked = false ;
        this.gap = opt.gap || 4;
        this.gridSize = opt.gridSize || 80;
        this.imgGroup = opt.imgGroup || [1,2,3,4,5,6,7,8];
        this.imgPath = opt.imgPath || "img/grid/";
        this.buttonSize = opt.buttonSize || 100;
        this.prizeImage = '';

        this.button = document.createElement("div");
        this.element = $('#grid').style.position = 'relative';
        this.element = $('#grid').css('margin','0 auto');
        this.element = $('#grid').css('width','248px');
        this.element = $('#grid').css('height','248px');
        this.element = $('#grid').css('overflow','hidden');
        this.element = $('#grid').css('background','white');
        this.element = $('#grid').css('border','4px white solid');
        this.element = $('#grid').css('border-radius','5px');

        this.button.className += ' grid-button'
        $('#grid').appendChild(this.button);

        this.cells = (function () {
            var x, y, cells = [];
            for (x = 0; x < 3; x++) {
                for (y = 0; y < 3; y++) {
                    var cell = document.createElement("div") ;
                    cell.className = 'cell';
                    cell.setAttribute('id','cell-' + x + '-' + y);                   
                    var img = document.createElement('img');
                    img.setAttribute('width','80')
                    img.setAttribute('height','80')
                    img.setAttribute('src',_this.imgPath + (3*x + y + 1 )+'.png');
                    cell.appendChild(img)
                    $('#grid').appendChild(cell);                      
                    cells.push({
                        $cell: cell
                    });
                }
            }
            return cells;
        })();
        this.setPosition();
    };

    fn.moveCenter = function () {
        var _this = this;
        var index = 0 ;
        var t ;
        t = setInterval(function(){
            if (index == 4) {
                index++;
            } 
            _this.cells[index].$cell.style.top = _this.gap + _this.gridSize +'px'
            _this.cells[index].$cell.style.left = _this.gap + _this.gridSize +'px'
            index++;
            console.log(1)
            if (index > 8 ){
                clearInterval(t)
            }
        },100);

        return 
    };

    fn.moveBack = function () {
        var _this = this;
        var index = 0 ;
        var t ;
        t = setInterval(function(){
            if (index == 4) {
                index++;
            } 
            _this.cells[index].$cell.style.top = parseInt(index/3) * (_this.gridSize + _this.gap) + 'px';
            _this.cells[index].$cell.style.left = parseInt(index%3)* (_this.gridSize + _this.gap) + 'px';
            index++;
            console.log(1)
            if (index > 8 ){
                clearInterval(t)
            }
        },100)
    };


    fn.setPosition = function () {
        var _this = this,
            x, y;
        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                var item = _this.cells[x * 3 + y].$cell ;                
                item.css('top',x * (_this.gridSize + _this.gap) + 'px');
                item.css('left', y * (_this.gridSize + _this.gap) + 'px');
                item.css('width',_this.gridSize + 'px');
                item.css('height', _this.gridSize + 'px');
                item.css('position','absolute');
            }
        }
        this.button.css('width','100px')
                    .css('height','100px')
                    .css('background','url(img/grid/button-ready.png) center')
                    .css('position','absolute')
                    .css('top',(_this.gridSize * 3 +_this.gap*2 - 100)/2 + 'px')
                    .css('left',(_this.gridSize * 3 +_this.gap*2 - 100)/2 + 'px')
                    .css('z-index','1')
                    .css('background-size','100% 100%')
                    .css('cursor','pointer')

        this.button.on('click',function(){

            $.ajaxPrize('/prize/ajax/prizeDraw?groupId=198',function(result){

            if(!result.code in [ 406 , 200 , 501]){
                console.log(result)
                alert('系统错误 请重试')
                return 
            }

            if(result.code == 403) {
                window.location.href = "http://www.dianping.com/login"
            }
            if(result.code == 406) {
                window.location.href = "http://www.dianping.com/login"
                
            }
            if(result.code == 200) {
                
                _this.rank = result.msg.prize.rank ;
                _this.prizeName = result.msg.prize.prizeName ;
                _this.recordId = result.msg.recordId ;
                   
            }
            if(result.code == 501) {
                _this.zero = true;
                //没有次数
            }
            })
            
            
            this.css('display','none')
            _this.turnBack.call(_this)
            setTimeout(function(){
                _this.moveCenter.call(_this)    
            },1000)
            setTimeout(function(){
                _this.moveBack.call(_this)
            },100*13 + 1000)    
            

            
            //_this.moveBack.call(_this)
        })            
    };


    fn.turnBack = function (){
        for ( var i=0 ; i<9 ; i++){
            this.itemturnBack(i)
        }
        this.bindClick();
    }
    fn.itemturnBack = function (index) {
                var item = this.cells[index].$cell.firstChild ;                
                //item.className += ' animating';
                item.css('-webkit-transform','rotateY(90deg)') ;
                setTimeout(function(){
                    item.setAttribute('src','img/grid/front.png')
                },500)
                setTimeout(function(){

                    item.css('-webkit-transform','rotateY(180deg)');
                    
                },500)          
    }
    fn.itemturnFront = function (index) {
        var _this = this;
        var img = 'img/grid/noprize1.png' ;
        if(_this.rank >0 ){
            img = 'img/grid/'+this.rank+'.png' ;
        }
        if (!this.clicked){

            if(_this.zero) {
                alert('亲,每天只能抽一次哟～');
                return 
            }
            var item = this.cells[index].$cell.firstChild ;                
            //item.className += ' animating';
            item.css('-webkit-transform','rotateY(90deg)') ;
            setTimeout(function(){
                item.setAttribute('src',img)
            },500)
            setTimeout(function(){
                item.css('-webkit-transform','rotateY(0deg)');
            },500)          
            this.clicked = true;
            setTimeout(function(){
                if (_this.rank > 0){
                    popShow(_this.prizeName);    
                }
            },1000)
        }
    }

    fn.bindClick = function(){
        var self = this;
        for (var i =0 ; i < 8 ; i ++) {
            var item = this.cells[i].$cell ; 
            (function(i){
                item.on('click',function(){
                    self.itemturnFront(i);
                })
            })(i)            
        }
    }

    
    $.Grid = function(options){
        return new Grid(options);
    };
})($);
 
