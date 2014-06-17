(function ($) {
    var Grid = function (options) {
            this.init(options);
        },
        fn = Grid.prototype;
    fn.init = function (options) {

        var _this = this;
        //var opt = $.extend({}, options);
        var opt = options ;

        this.gap = opt.gap || 10;
        this.gridSize = opt.gridSize || 80;
        this.imgGroup = opt.imgGroup || [1,2,3,4,5,6,7,8];
        this.imgPath = opt.imgPath || "img/grid/";

        this.drawState = false;
        this.prizeImage = '';

        this.element = $('#grid').style.position = 'relative';
        this.element = $('#grid').style.width = _this.gridSize * 3 + _this.gap * 2;
        this.element = $('#grid').style.height = _this.gridSize * 3 + _this.gap * 2 ;
        this.element = $('#grid').css('margin','0 auto');
        this.element = $('#grid').css('width','260px');
        this.element = $('#grid').css('height','290px');
        this.element = $('#grid').css('overflow','hidden');
        
        this.cells = (function () {
            var x, y, cells = [];

            for (x = 0; x < 3; x++) {
                for (y = 0; y < 3; y++) {
                    var cell = document.createElement("div") ;
                    cell.className = 'cell';
                    cell.setAttribute('id','cell-' + x + '-' + y);

                    var front = document.createElement("div");
                    front.className = "front";
                    front.css('transform','rotateY(0)');
                    

                    var back = document.createElement("div");
                    back.className = "back";
                    back.css('transform','rotateY(180deg)');

                    var img = document.createElement('img');
                    var img_ = document.createElement('img');
                    img.setAttribute('width','80')
                    img_.setAttribute('width','80')

                    img_.setAttribute('src',_this.imgPath + '1.png');
                    back.appendChild(img_);  
                    cell.appendChild(back);       
                    img.setAttribute('src',_this.imgPath + 'front.png');
                    front.appendChild(img);
                    cell.appendChild(front);

                    $('#grid').appendChild(cell);                      
                    cells.push({
                        $cell: cell,
                        $front: front,
                        $back: back
                    });
                }
            }
            return cells;
        })();

        
        this.setSize();
        return;
        this.bindClickGrid();

        $(window).on('dragstart', function () {
            return false;
        });

        this.initPrizeView();
    };

    fn.listen = function (eventName, func) {
        $(window).on(eventName, func);
    };

    fn.trigger = function (eventName, data) {
        $(window).trigger(eventName, data);
    };
    fn.bindCustomEvents = function (startCallback, endCallback) {
        var _this = this;
        this.listen('gridReady', function () {
            debugger
            _this.drawState = false;
            _this.initGuessView();

            setTimeout(function () {
                _this.trigger('gridMoveCenter');
            }, 700);
        });
        this.listen('gridMoveCenter', function () {
            _this.moveCenter();
        });
        this.listen('moveCenterEnd', function () {
            _this.moveBack();
        });
        this.listen('gridStart', function () {
            _this.drawState = true;
            startCallback && startCallback.call(_this, arguments);
        });
        this.listen('gridEnd', function () {
            _this.drawState = false;
            endCallback && endCallback.call(_this, arguments)
        });
    };
    fn.bindClickGrid = function () {
        var _this = this, i;

        for (i = 0; i < _this.cells.length; i++) {
            (function (index) {
                _this.cells[index].$cell.on('click', function () {
                    if (_this.drawState) {
                        _this.insertPicture(index, _this.prizeImage || 'miss-1');
                        _this.turn_in(index, function () {
                            _this.trigger('showWindow');
                        });
                        _this.trigger('gridEnd');
                    }
                });
            })(i);
        }
    };

    fn.turn_in = function (index, callback) {
        
        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                var item = _this.cells[x * 3 + y].$cell ;   
                
            }
        }
        var _this = this,
            front = _this.cells[index].$front,
            back = _this.cells[index].$back;

        setTimeout(function () {
            front.css('-webkit-transform','rotateY(90deg)') ;
            back.css('-webkit-transform','rotateY(180deg)') ;
            //back.classList.remove('animating');
            console.log(1)
            //callback && callback.call(_this);
        }, 225);
    };
    fn.turn_out = function (index, callback) {
        var _this = this,
            front = _this.cells[index].$front,
            back = _this.cells[index].$back;
        front.className += " animating";
        front.css('-webkit-transform','rotateY(90deg)') ;
        back.className += " animating";
        back.css('-webkit-transform','rotateY(180deg)') ;

        setTimeout(function () {
            front.css('-webkit-transform','rotateY(180deg)') ;
            back.css('-webkit-transform','rotateY(90deg)') ;
            //back.classList.remove('animating');
            console.log(1)
            callback && callback.call(_this);
        }, 225);
        //_this.moveCenter()
    };

    fn.moveCenter = function () {
        var _this = this;
        var index = 0 ;
        var t ;
        t = setInterval(function(){
            if (index == 4) {
                index++;
            } 
            _this.cells[index].$cell.style.top = "90px";
            _this.cells[index].$cell.style.left = "90px";
            index++;
            console.log(1)
            if (index > 8 ){
                clearInterval(t)
            }
        },300);

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
        },300)
    };

    fn.initPrizeView = function () {
        var imgGroup = this.imgGroup.slice(0), //copy the array
            targetGroup = [],
            temp;

        for (var i = 0; i < 9; i++) {
            temp = imgGroup.splice(Math.floor(Math.random() * imgGroup.length), 1);
            targetGroup.push(temp[0]);
            this.insertPicture(i, temp[0]);
            this.turn_in(i);
        }
    };
    fn.initGuessView = function () {
        var _this = this;
        for (var i = 0; i < 9; i++) {
            (function (index) {
                _this.turn_out(index, function () {
                    _this.removePicture(index);
                });
            })(i);
        }
    };

    fn.removePicture = function (index) {
        var _this = this;
        _this.cells[index].$back.find('img').attr('src', this.imgPath + 'front.png');
    };
    fn.insertPicture = function (index, name) {
        var _this = this;
        // console.log(isNaN((parseInt(name))));
        
        if ( name != 'noprize1'){
            console.log(name);
            // var item = window.storeList[Number(name)-1]
            _this.cells[index].$back.find('a').attr('href',0).find('img').attr('src', this.imgPath + name + '.jpg');
                // console.log(name);
        }
        
        _this.cells[index].$back.find('img').attr('src', this.imgPath + name + '.jpg');
        //_this.cells[index].$back.find('img').attr('src', this.imgPath + name + '.png');
    };

    fn.setSize = function () {
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
                
                //console.log(_this.cells[x*3 + y ].$cell.style.top)
                _this.turn_out(x * 3 + y);
            }
        }
    };



    $.Grid = function(options){
        return new Grid(options);
    };


})($);
 
