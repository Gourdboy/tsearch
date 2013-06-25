KISSY.add(function (S,O ,  TripSearch ,Template ,Slide) {
    var WIDTH = 437;
    var HEIGHT = 380;
    var MIN_WIDTH = 152;
    var MIN_HEIGHT = 30;
    var FixedSearch = function () {
        FixedSearch.superclass.constructor.apply(this, arguments);
        this.initializer();
    };
    S.extend(FixedSearch, S.Base, {
        initializer : function () {
            this.isInited = false;
            this.renderUI();
            this.bindUI();
        },
        renderUI    : function () {
            this.overlay = new O({
                width : MIN_WIDTH, //配置高和宽
                height: MIN_HEIGHT
            });
            this.overlay.set('content', '<div class="J_Pi_Search_TripSearchFixedBtn trip-search-fixed-btn"><a href="http://trip.taobao.com">定制我的旅行</a></div><div class="J_Pi_Search_TripSearchFixedContent trip-search-fixed-content"></div>');
            this.overlay.render();
            this.overlay.show();
            var el = this.overlay.get('el');
            el.addClass('trip-search-fixed-box');
            this.contentNode = el.one('.J_Pi_Search_TripSearchFixedContent');
            this.btnNode = el.one('.J_Pi_Search_TripSearchFixedBtn');
        },
        bindUI      : function () {
            //sync visible
            this.on('afterVisibleChange', function (e) {
                if (e.newVal) {
                    if (this.isInited == false) {
                        this.createSearch();
                        this.isInited = true;
                    }
                    this.show();
                } else {
                    this.hide();
                }
            });
            this.on('afterTabIndexChange', function (e) {
                this.slide.go(e.newVal);
            }, this);
            S.Event.on(this.btnNode, 'click', function (e) {
                e.preventDefault();
                if (this.get('visible')) {
                    this.set('visible', false);
                } else {
                    this.set('visible', true);
                }
            }, this);

            S.Event.on(window , 'scroll' , S.buffer(function (){
                if (this.get('visible')) {
                    this.set('visible', false);
                }
            } , 300 , this) , this);

            if (S.UA.ie === 6) {
                S.Event.on(window , 'scroll' , S.buffer(function (){
                    this.overlay.get('el')[0].className =  this.overlay.get('el')[0].className;
                } , 100 , this) , this);
            }
        },
        createSearch: function () {
            this.contentNode.html(Template.searchTemplate);
            this.slide = new Slide('J_Pi_Search_SearchModule', { // 直接指定id，也可以指定选择器，比如："#id .className"
                navClass    : 'J_Pi_Search_SearchTabNav',
                contentClass: 'search-bd',
                pannelClass : 'J_Pi_Search_TabPannel',
                eventype    : 'click' //通过点击页签来切换Tab
            });
            var NavMap = [
                'createFlightSearch',
                'createIflightSearch',
                'createHotelSearch',
                'createLodgeSearch',
                'createTicketSearch',
                'createTravelSearch',
                'createCarSearch'
            ];
            this.slide.on('switch', function (e) {
                var methodName = NavMap[e.index];
                if (methodName != '') {
                    TripSearch[methodName].call(this);
                    NavMap[e.index] = '';
                }
            });
            TripSearch[NavMap[ this.get('tabIndex')]].call(this);
            NavMap[ this.get('tabIndex')] = '';
            this.slide.go(this.get('tabIndex'));
        },
        show        : function () {
            this.overlay.set('width', WIDTH);
            this.overlay.set('height', HEIGHT + MIN_HEIGHT);
            this.btnNode.addClass('trip-search-fixed-btn-open');
        },
        hide        : function () {
            this.overlay.set('width', MIN_WIDTH);
            this.overlay.set('height', MIN_HEIGHT);
            this.btnNode.removeClass('trip-search-fixed-btn-open');
        }
    }, {
        ATTRS: {
            tabIndex: {
                value: 0
            },
            visible : {
                value: false
            }
        }
    });
    return FixedSearch;
}, {requires: ['overlay', './index' ,'./template', 'gallery/slide/1.1/index', 'node' , 'event' , 'base' , './fixed-btn.css']});