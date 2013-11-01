/*
combined files : 

gallery/tsearch/1.1/build/common
gallery/tsearch/1.1/build/trip-autocomplete
gallery/tsearch/1.1/build/tradio
gallery/tsearch/1.1/build/tsearch
gallery/tsearch/1.1/build/hotel-search
gallery/tsearch/1.1/build/index
gallery/tsearch/1.1/build/template
gallery/tsearch/1.1/build/fixed-btn

*/
/**
 * 旅行公共函数库
 */
KISSY.add('gallery/tsearch/1.1/build/common',function (S){
    var Common = {
        /**
         * 截取指定长度的字符串
         * @param string 被截取的字符串
         * @param len 截取的长度，单位：字节。1个汉汉字为2个字节
         * @return {string} 返回被截取的字符串
         */
        subString:function (string, len) {
            var r = /[^\x00-\xff]/g;
            if (!string) {
                return '';
            }
            if (string.replace(r, "mm").length <= len) return string;
            var m = Math.floor(len / 2);
            for (var i = m; i < string.length; i++) {
                if (string.substr(0, i).replace(r, "mm").length >= len) {
                    return string.substr(0, i);
                }
            }
            return string;
        },
        /**
         * 获取字符串长度 单位字节
         * @param string
         * @return {*}
         */
        stringLen :function (string) {
            if (!string) {
                return '';
            }
            return string.replace(/[^\x00-\xff]/g, "rr").length;
        },
        /**
         * 截取字符串，并在末尾加上'...'
         * @param str  被截取的字符串
         * @param len  截取的长度
         * @param more 省略符号
         * @return {*}
         */
        cutStr :function (str, len , more) {
            more = more || '...';
            if (Common.stringLen(str) > len) {
                return Common.subString(str, len - 4) + more;
            }
            return str;
        },
        /**
         * 处理对象的属性的长度
         * @param obj
         * @param attr
         * @param len
         */
        buildObjCutAttr:function (obj, attr, len) {
            obj[attr + '_sub'] = Common.cutStr(obj[attr], len);
        },
        /**
         * 把 '1' 转化为 '01'
         * @param n
         * @return {*}
         */
        singleDateToDouble:function (n) {
            return n.toString().length > 1 ? n.toString() : '0' + n.toString();
        },
        /**
         * 将 2012-12-12 字符串格式转换为 Date 对象
         * @param str
         */
        strToDate : function (str){
            var arr = str.split('-');
            return new Date(arr[0], arr[1]-1 , arr[2]);
        },
        /**
         * 计算日期间隔，2011-5-17至2011-05-18间隔为一天
         * @param fromDate 开始日期
         * @param toDate 结束日期
         * @return {Number} 间隔天数
         */
        getDateInterval : function (fromDate, toDate) {
            return parseInt(Math.abs(Common.strToDate(toDate) - Common.strToDate(fromDate)) / 1000 / 60 / 60 / 24);
        },
        /**
         * 返回一个对象包括各种需要的日期格式
         * @param n 标准日期或毫秒
         */
        formatDate:function (n) {
            var date = new Date(n),
                formentLen = Common.singleDateToDouble;
            var yy = date.getFullYear();
            var mm = formentLen(date.getMonth() + 1);
            var dd = formentLen(date.getDate());
            var hh = formentLen(date.getHours());
            var MM = formentLen(date.getMinutes());
            return {
                mmdd:mm + '-' + dd,
                yymmdd:yy + '-' + mm + '-' + dd,
                hhMM:hh + ':' + MM,
                yy:yy,
                mm:mm,
                dd:dd,
                hh:hh,
                MM:MM
            }
        },
        /**
         * 获取指定日期的偏移量 n=1为明天 n=2为后天，支持昨天前天...
         * @param date
         * @param n 偏移的天数
         * @return {Date}
         */
        setDate : function (date , n){
            return new Date(date.getTime()+n*86400000);
        },
        /**
         * 根据毫秒计算时长
         * @param t
         * @return {Object}
         */
        timeToDuration:function (t) {
            t = t / 1000;
            var h = Math.floor(t / 3600);
            var s = Math.floor((t - h * 3600) / 60);
            var m = t % 60;
            return {
                h:h,
                s:s,
                m:m
            }
        },
        /**
         * 将转以后的HTML字符进行还原
         * @param html
         * @return {*}
         */
        html2text:function (html) {
            var el = document.createElement("div");
            el.innerHTML = html;
            try {
                return typeof el.innerText === "string" ? el.innerText : el.textContent;
            } catch (e) {
                return html;
            }
        }
    };
    return Common;
});
KISSY.add('gallery/tsearch/1.1/build/trip-autocomplete',function (S, Ac , Common) {
    var ALIGH = {
        node    : null,
        points  : ['bl', 'tl'],
        overflow: {
            adjustX: false,
            adjustY: true
        }
    };
    var DOMAIN = location.href.indexOf('ac-daily') > -1? 'daily.taobao.net' : 'taobao.com';
    return  {
        flight : function (cfg) {
            var default_cfg = {
                source           : 'http://s.jipiao.trip.' + DOMAIN +'/city_search.do?lines={maxResults}&q={query}',
                resultListLocator: function (results) {
                    results = results.result;
                    var filtedData = [];
                    //根据接口进行临近城市的数据处理
                    S.each(results, function (_item) {
                        if (_item.hasAirport) {
                            filtedData.push(_item);
                        } else {
                            var nearCities = _item.nearCity;
                            S.each(nearCities, function (nearCity) {
                                var nearCityFormat = S.mix(nearCity, {
                                    nearCity: _item.cityName
                                });
                                filtedData.push(nearCityFormat);
                            });
                        }
                    });
                    return filtedData;
                },//指定返回数据里的数组位置
                resultTextLocator: 'cityName',//指定文本内容
                activeFirstItem  : true,
                align            : ALIGH,
                hotSource        : 'http://www.' + DOMAIN +'/go/rgn/trip/chinahotcity_jsonp.php',//不指定及没有热门推荐
                resultFormatter  : function (query, results) {//对展示进行格式化
                    var result = [];
                    var tmpl = '<div class="ks-ac-item-inner"><span class="ks-ac-name">{cityname}</span><span class="ks-ac-intro">{py}</span></div>';
                    var prevNearCity = '';
                    //临近城市的显示处理
                    for (var idx in results) {
                        var _item = results[idx];
                        if (!_item.raw.nearCity) {
                            //有机场，未设置nearCity
                            result.push(S.substitute(tmpl, {
                                cityname: _item.text,
                                py      : _item.raw.py
                            }));
                        } else {
                            //无机场，处理附近城市
                            var html = '<div class="ks-ac-item"><div class="ks-ac-near-tip">"' + _item.raw.nearCity + '"&nbsp;没有机场</div>';
                            var nearAirportTpl = '<div class="ks-ac-item-inner ks-ac-item-inner-sub"><span class="ks-ac-name">邻近机场：{cityName}&nbsp;--&nbsp;距离{distance}公里</span></div>';
                            var cityHtml = S.substitute(nearAirportTpl, {
                                cityName: _item.text,
                                distance: _item.raw.distance
                            });

                            if (_item.raw.nearCity != prevNearCity) {
                                //对于首个附近机场城市，加入tip
                                html += cityHtml + '</div>';
                                prevNearCity = _item.raw.nearCity;
                            } else {
                                html = cityHtml;
                            }
                            result.push(html);
                        }
                    }
                    return result;
                }
            };
            cfg = S.merge(default_cfg , cfg);
            var acInstance = new Ac(cfg);
            var codeInputNode = acInstance.get('codeInputNode');
            codeInputNode =  codeInputNode instanceof  S.NodeList ? codeInputNode : S.one(codeInputNode);
            codeInputNode &&  acInstance.on('select' , function (e){
                codeInputNode.val(e.result.raw.cityCode);
            });
            return acInstance;
        },
        iflight: function (cfg) {
            var default_cfg = {
                source       : 'http://ijipiao.trip.' + DOMAIN +'/ie/remote/auto_complete.do?flag=4&count=10&callback={callback}&q={query}',
                resultListLocator:'result',//指定返回数据里的数组位置
                resultTextLocator: 'cityName',//指定文本内容
                activeFirstItem  : true,
                align            : ALIGH ,
                hotSource    : 'http://www.' + DOMAIN +'/go/rgn/trip/international_jsonp.php'
            };
            cfg = S.merge(default_cfg, cfg);
            var acInstance = new Ac(cfg);
            var codeInputNode = acInstance.get('codeInputNode');
            codeInputNode = codeInputNode instanceof  S.NodeList ? codeInputNode : S.one(codeInputNode);
            codeInputNode && acInstance.on('select', function (e) {
                codeInputNode.val(e.result.raw.cityCode);
            });
            return acInstance;
        },
        hotel  : function (cfg) {

            // 目的地 suggest 结果预处理
            function hotelCityListLocator(data) {
                var rawResults = data.result;
                var results = [];
                if (S.isArray(rawResults) && rawResults.length) {
                    S.map(rawResults, function (item, index) {
                        var suggests = item.t.split('_');
                        results.push({
                            cityName: suggests[0],
                            cityCode: item.c,
                            py      : suggests[1]
                        })
                    });
                }
                return results;
            }

            // 目的地 suggest 结果格式化
            function hotelCityFormatter(query, results) {
                return S.map(results, function (item) {
                    var result = item.raw;
                    return S.substitute('<div class="ks-ac-item-inner"><span class="ks-ac-name">{cityName}</span><span class="ks-ac-intro">{py}</span></div>', {
                        cityName: Common.cutStr(result.cityName, 20),
                        py      : Common.cutStr(result.py, 10)
                    });
                });
            }
            var default_cfg = {
                activeFirstItem  : true,
                align            : ALIGH,
                resultListLocator: hotelCityListLocator,
                resultFormatter  : hotelCityFormatter,
                resultTextLocator: 'cityName',//指定文本内容
                source           : 'http://kezhan.trip.' + DOMAIN +'/citysuggest.do?t=0&q={query}',
                hotSource        : 'http://www.'+ DOMAIN +'/go/rgn/trip/jsonp/hotel.php'
            };
            cfg = S.merge(default_cfg, cfg);
            var acInstance = new Ac(cfg);
            var codeInputNode = acInstance.get('codeInputNode');
            codeInputNode = codeInputNode instanceof  S.NodeList ? codeInputNode : S.one(codeInputNode);
            codeInputNode && acInstance.on('select', function (e) {
                codeInputNode.val(e.result.raw.cityCode);
            });
            return acInstance;
        },
        travel : function (cfg) {
            var isDaily = document.domain.indexOf('daily.taobao.net') > 1,
                _resultTmpl = '<div class="ks-ac-item-inner"><span class="ks-ac-name">{first}</span><span class="ks-ac-intro" style="color:#999;float:left;">{second}</span></div>',
                _citycodeUrl = (isDaily ? 'http://go.daily.taobao.net/' : 'http://go.' + DOMAIN +'/') + 'data/areaTrip.htm?sn=1'; //城市联想接口
            _dep_citycodeUrl = (isDaily ? 'http://dujia.trip.daily.taobao.net/' : 'http://dujia.trip.' + DOMAIN +'/') + 'sell/ajax/get_sug_city.htm?max=10'; //城市联想接口


            function highLight(str, key) {
                //return str.replace(key,'<span class="yui3-highlight">'+ key +'</span>');
                return str;
            }

            function _acFormatter(query, results) {
                return S.map(results, function (result) {
                    var result = result.raw,
                        _name = result.cityName.split('-');
                    return S.substitute(_resultTmpl, {
                        first : highLight(_name[0], query),
                        second: highLight(_name[1], query) ? '&nbsp;-&nbsp;' + highLight(_name[1], query) : ''
                    });
                });
            }

            var default_cfg = {
                activeFirstItem  : true,
                align            : ALIGH,
                resultListLocator: 'result',
                resultTextLocator: 'cityName',
                resultFormatter: _acFormatter,
                source         : _dep_citycodeUrl + '&q={query}',
                hotSource      : 'http://www.' + DOMAIN +'/go/rgn/trip/dujiadephotcity_jsonp.php'
            };
            cfg = S.merge(default_cfg, cfg);
            var acInstance = new Ac(cfg);
            var codeInputNode = acInstance.get('codeInputNode');
            codeInputNode = codeInputNode instanceof  S.NodeList ? codeInputNode : S.one(codeInputNode);
            codeInputNode && acInstance.on('select', function (e) {
                codeInputNode.val(e.result.raw.cityCode);
            });
            return acInstance;
        },
        train : function (cfg){
            var default_cfg = {
                source           : 'http://train.trip.' + DOMAIN + '/station_suggestion.htm?lines={maxResults}&callback={callback}&q={query}',
                resultListLocator: 'results',//指定返回数据里的数组位置
                resultTextLocator: 'stationName',//指定文本内容
                activeFirstItem  : true,
                align            : ALIGH,
                hotSource        : 'http://www.' + DOMAIN + '/go/rgn/trip/chinahotcity_jsonp.php'
            };
            cfg = S.merge(default_cfg, cfg);
            var acInstance = new Ac(cfg);
            return acInstance;
        },
        city : function (cfg){
            var default_cfg = {
                source           : 'http://s.jipiao.trip.' + DOMAIN +'/city_search.do?lines={maxResults}&q={query}',
                resultListLocator: 'result',
                resultTextLocator: 'cityName',//指定文本内容
                activeFirstItem  : true,
                align            : ALIGH,
                hotSource        : 'http://www.' + DOMAIN +'/go/rgn/trip/chinahotcity_jsonp.php'//不指定及没有热门推荐
            };
            cfg = S.merge(default_cfg , cfg);
            var acInstance = new Ac(cfg);
            var codeInputNode = acInstance.get('codeInputNode');
            codeInputNode =  codeInputNode instanceof  S.NodeList ? codeInputNode : S.one(codeInputNode);
            codeInputNode &&  acInstance.on('select' , function (e){
                codeInputNode.val(e.result.raw.cityCode);
            });
            return acInstance;
        }
    };
}, {requires: ['gallery/autocomplete/1.2/index' , './common', 'node' , 'event' , 'base']});
/**
 * RadioButton组件
 *
 * @module Radiobutton
 * @submodule
 **/
KISSY.add('gallery/tsearch/1.1/build/tradio',function (S) {
    /**
     * Radiobutton
     * @class Radiobutton
     * @extends S.Base
     * @uses
     * @constructor
     * @param {Object} 配置项
     **/
    function Radiobutton() {
        Radiobutton.superclass.constructor.apply(this, arguments);
        this.initializer();
    }
    S.extend(Radiobutton, S.Base, {
        initializer: function () {
            var node = this.node = this.get('node');
            var that = this;
            this.items = {};
            this.radios = node.all('input');
            this.radios.each(function (_item) {
                var item = {
                    input: _item
                };
                item.label = _item.parent('label');
                that.items[_item.val()] = item;
            });
            this.bindUI();
            this.set('value' , this.val());
        },
        bindUI     : function () {
            this.node.delegate('click', 'label', function (e) {
                var target = S.one(e.currentTarget);
                var radioInput =  target.one('input');
                radioInput.prop('checked' , true);
                this.set('value' , radioInput.val());
            },  this);
            this.on('afterValueChange' , this._syncUI , this);
        },
        _syncUI     : function (e) {
            var items = this.items;
            var next_item = items[e.newVal];
            var prev_item = items[e.prevVal];
            var SELECTED_CLASS = this.get('selectedClass');
            if (prev_item) {
                prev_item.label.removeClass(SELECTED_CLASS);
            }
            if (next_item) {
                next_item.label.addClass(SELECTED_CLASS);
            }
        },
        /**
         * 获取和设置radio的值
         *
         * @method val
         * @returns {*}
         */
        val : function (){
            if (arguments.length < 1) {
                return this._getValue();
            }else{
                return this._setValue.apply(this,arguments);
            }
        },
        _getValue   : function () {
            var checkedNode = this.node.one('input:checked');
            return checkedNode ? checkedNode.val() : undefined;
        },
        _setValue   : function (val) {
            var item = this.items[val];
            if (item) {
                item.input.attr('checked', true);
                this.set('value' , val);
            }
        }

    }, {
        ATTRS:{
            /**
             * Required radiobutton所在的父容器节点
             * @attribute node
             * @type NodeList
             * @default null
             **/
            node:{
                value:'',
                setter: function (val){
                    if (val instanceof S.NodeList) {
                        return val;
                    }else{
                        return S.one(val);
                    }
                }
            },
            /**
             * Required 输入框的name属性值, 将以此值去获取input节点
             * @attribute name
             * @type String
             * @default null
             **/
            name:{
                value:''
            },
            /**
             * 输入框选中时的ClassName
             * @attribute selectedClass
             * @type String
             * @default selected
             **/
            selectedClass:{
                value:'selected'
            },
            /**
             * 当前的checked为true的radio的值
             * @attribute value
             * @type String
             * @default null
             **/
            value : {
                value : null
            }

        }
    });
    return Radiobutton;
}, {requires: ['node' , 'event' , 'base' , 'sizzle']});
/**
 * @fileoverview 请修改组件描述
 * @author 舒克<shuke.cl@taobao.com>
 * @module tsearch
 **/
KISSY.add('gallery/tsearch/1.1/build/tsearch',function (S,Base, TripAutocomplete ,Tradio , Calendar , Placeholder , LocalStorage , Common) {
    var Widgets = {
        TripAutocomplete: TripAutocomplete,
        Calendar        : Calendar,
        Placeholder     : Placeholder,
        Tradio          : Tradio
    };
    /**
     * 请修改组件描述
     * @class Tsearch
     * @constructor
     * @extends Base
     */
    function Tsearch(comConfig) {
        var self = this;
        //调用父类构造函数
        Tsearch.superclass.constructor.call(self, comConfig);
        this.initializer();
    }

    S.extend(Tsearch, Base, /** @lends Tsearch.prototype*/{
        initializer    : function () {
            this.form = this.get('form');
            if (!this.form) {
                S.log('TSearch:没有找到表单节点,初始化失败');
                return;
            }
            this.fields = this.get('fields');
            S.each(this.fields, function (field, _id) {
                var _node = this.form.one(_id);
                if (!_node) {
                    S.log(_id + "is not find..");
                    return false;
                }
                field.node = _node;
                if (field.val) {
                    field.node.val(field.val);
                }
                this.bindWidgets(field);
                if (field.autoSwitch) {
                    this.setSwitchInput(_id);
                }
            }, this);
            this.bindEvent();
            this.get('storage') && this._restoreStorageValue();
        },
        bindEvent      : function () {
            this.form.on('submit', this._doSubmit, this);
            //切换往返程
            if (this.get('switchSearchType')) {
                this.initRadioSwitch()
            }
            //绑定表单交换操作
            var swapper = this.get('swapper');
            if (swapper) {
                S.Event.on(this.form.all(swapper.trigger), 'click', function (e) {
                    e.preventDefault();
                    this.swap();
                },  this);
            }
        },
        addField       : function () {

        },
        /**
         * 控件绑定 ,将所配置的对象初始化并把实例挂接到当前项
         * @param field
         */
        bindWidgets    : function (field) {
            var that = this;
            S.each(field.widgets, function (widget_config, widget_name) {
                var Widget = Widgets[widget_name];
                var finalTriggerSelector = '';
                if (Widget) {
                    if(widget_name == 'TripAutocomplete'){//Autocomplete采用工厂模式
                        S.each(field.widgets[widget_name] , function (v , k){
                            v.inputNode = (v.inputNode && that.form.one(v.inputNode));
                            v.codeInputNode = (v.codeInputNode && that.form.one(v.codeInputNode));
                            field[widget_name] =  Widget[k](v);
                        });
                        field.showTip = function (msg) {
                            field.node[0].focus();
                            field.TripAutocomplete.showMessage(msg);
                        }
                    } else {
                        widget_config.node && (widget_config.node = that.form.one(widget_config.node));
                        widget_config.triggerNode && (widget_config.triggerNode = that.form.one(widget_config.triggerNode));
                        finalTriggerSelector = widget_config.finalTriggerNode
                        widget_config.finalTriggerNode && (widget_config.finalTriggerNode = that.form.one(widget_config.finalTriggerNode));
                        field[widget_name] = new Widget(widget_config);
                    }
                    if (widget_name === 'Calendar'){
                        field.showTip = function (msg) {
                            field.node[0].focus();
                            field.Calendar.set('message' , msg);
                            field.Calendar.showMessage(msg);
                        };
                        var finalFiled = that.fields[finalTriggerSelector];
                        if(widget_config.finalTriggerNode && finalFiled) { //hack for Calendar 出发和返程日期共用一个日历组件,将组件实力共享给返程表单对象
                            finalFiled[widget_name] = field[widget_name];
                            finalFiled.showTip = function (msg) {
                                finalFiled.node[0].focus();
                                finalFiled.Calendar.set('message' , msg);
                                finalFiled.Calendar.showMessage(msg);
                            };
                        }
                    }
                }
            });
        },
        /**
         * 交换所有swapper配置里的值
         */
        swap           : function () {
            S.each(this.get('swapper').list, function (val, key) {
                this._swapItem(key, val);
            }, this);
        },
        /**
         * 交换两个字段的值
         * @param item_a
         * @param item_b
         * @private
         */
        _swapItem      : function (item_a, item_b) {
            var temp;
            item_a = this.fields[item_a];
            item_b = this.fields[item_b];
            temp = item_a.node.val();
            item_a.node.val(item_b.node.val());
            item_b.node.val(temp);
        },
        /**
         * 实现自动切换功能的绑定
         * @param cur_field_id
         */
        setSwitchInput : function (cur_field_id) {
            var fields = this.fields;
            var cur_field = fields[cur_field_id];
            var switchToNext = function () {
                var next_field = fields[cur_field.autoSwitch.nextField],
                    next_node = next_field.node;
                if (!next_node) {
                    S.log('没有指定自动切换的目标元素');
                    return this;
                }
                if (!next_field.disabled && next_field.node.val() == '') {//当前开关打开且下一个字段未填
                    setTimeout(function (){
                        next_node[0].focus()
                    },200);
                }
            };

            if (cur_field.TripAutocomplete) {
                cur_field.TripAutocomplete.on('select', switchToNext);
            } else if (cur_field.Calendar) {
                cur_field.Calendar.on('dateclick', function () {
                    if (this.currentNode.hasClass(cur_field_id.replace('.', ''))) {//当前触发dateclick事件为当前输入框绑定的日历控件时执行自动切换
                        switchToNext();
                    }
                });
            }
            return this;
        },
        /**
         * 初始化单程往返切换事件
         * @return {*}
         */
        initRadioSwitch: function () {
            var that = this,
                config = this.get('switchSearchType'),
                fields = this.fields,
                back_container = this.form.one(config.back_container),
                back_input = fields[config.back_input].node;
            var Tradio = fields[config.trigger].Tradio;
            var Calendar = fields[config.go_input].Calendar;
            if (!Tradio) {
                return this;
            }
            Tradio.on('afterValueChange', function (e) {
                if (e.newVal === '0') {
                    back_input.val('');
                    Calendar.currentNode = back_input;
                    Calendar._setDateInfo('');
                }
                this._setSearchType(e.newVal);
            }, this);
            //返程日期没有值时切换为单程
            back_input.on('valuechange', function (e) {
                if (e.newVal === '') {
                    Tradio.val('0');
                }
            });
            //选择返程日期时，自动切换为往返
            Calendar.on('dateclick', function (e) {
                if (this.currentNode.hasClass('J_EndDate')) {
                    Tradio.val('1');
                }
            });
            this._setSearchType(Tradio.val());
        },
        /**
         * 根据单程往返的值置往返的日历选择交互状态
         * @param val
         * @private
         */
        _setSearchType : function (val) {
            var config = this.get('switchSearchType'),
                fields = this.fields,
                back_container = this.form.one(config.back_container);
            if (val === "1") {//开启往返
                back_container.removeClass('disabled');
                if (fields[config.go_input].autoSwitch) {
                    fields[config.back_input].disabled = false;
                }
            } else {//开启单程
                back_container.addClass('disabled');
                if (fields[config.go_input].autoSwitch) {
                    fields[config.back_input].disabled = true;
                }
            }
        },
        _doSubmit      : function (e) {
            if (!this.validate()) {
                e.preventDefault();
                return false;
            }

            this.fire('submit', {
                form  : this.form,
                fields: this.fields,
                srcEvent : e    //要阻止默认的表单提交可以调用e.srcEvent.preventDefault()
            });
            this.get('storage') && this._storageForm();
        },
        /**
         * 存储搜索数据岛本地
         * @private
         */
        _storageForm: function () {
            var fields = this.get('fields'),
                storageArr = [],
                itemStr = '';
            S.each(fields , function (field , key) {
                var node = field.node;
                var attr = '';
                var val  = '';
                if (node.hasAttr('type')) {//是输入框
                    attr = node.attr('type');
                    val = node.val();
                    if (attr == 'text' || attr == 'hidden') {//文本框
                        if (node.val() != '' && !node.attr('disabled')) {
                            itemStr = key + ':' + val;
                            storageArr.push(itemStr);
                        }
                    }
                }else if(key.indexOf('J_Radio') > -1){//是radio
                    itemStr = key + ':' + field['Tradio'].val();
                    storageArr.push(itemStr);
                }
            });
            //保存到本地
            if (this.form.hasAttr('id')) {//必须依赖form的id
                var storage = new LocalStorage();
                storage.setItem(this.form.attr('id'), storageArr.join(','));
            }
        },
        /**
         * 还原本地数据
         * @private
         */
        _restoreStorageValue : function (){
            var storage = new LocalStorage();
            var fields = this.get('fields');
            var defaultValue = '';
            if (this.form.hasAttr('id') && storage.getItem(this.form.attr('id'))) {
                defaultValue = storage.getItem(this.form.attr('id'));
            }
            S.each(defaultValue.split(','),function (item , i){
                var field ;
                item = item.split(':');
                var dateVal=item[1];
                if (field = fields[item[0]]) {
                    if (item[0].indexOf('J_Radio') > -1) {
                        field.Tradio && field.Tradio.val(item[1]);
                    }else{
                        if (item[0].indexOf('J_DepDate') > -1) {//出发日期
                            dateVal = item[1];
                            if (this._isResetDate(item[1])) {
                                dateVal = this.getDate(1);
                            }

                        }else if(item[0].indexOf('J_EndDate') > -1){
                            dateVal = item[1];
                            if (this._isResetDate(item[1])) {
                                dateVal = this.getDate(2);
                            }

                        }
                        field.node.val(dateVal);
                    }
                }


            },this);
        },
        /**
         * 日期检查,返回
         * @param date 日期 ['2011-05-14','2011-06-14']
         * @return Array
         */
        _isResetDate   : function (date) {
            date = date.split('-');
            return this.get('time') > new Date(date[0], date[1] - 1, date[2]);
        },
        /*
         *获取指定日期的
         *@num_date 指定日期的前后天数 1为明天,2为后天,-1为昨天...
         */
        getDate        : function (num_date) {
            function formatdate(str) {
                str += '';
                if (str.length == 1) {
                    return '0' + str;
                } else {
                    return str;
                }
            }

            num_date = num_date || 0;
            var _y, _m, _d;
            var _T = this.get('time');
            _T.setDate(_T.getDate() + num_date);
            _y = _T.getFullYear();
            _m = formatdate(_T.getMonth() + 1);
            _d = formatdate(_T.getDate());
            return [_y, _m, _d].join('-');
        },
        validate       : function () {
            var fields = this.fields,
                that = this;
            var ok = true;
            var _id;
            var i , j , validaters , validatersLen , validation , validationLen;
            for(i = 0 , validaters = this.get('validation_order') , validatersLen = validaters.length; i < validatersLen ; i++ ) {
                _id = validaters[i];
                if (!fields[_id].validation || !ok || fields[_id].disabled) {
                    break;
                }
                for(j = 0 ,  validation = fields[_id].validation  , validationLen = validation.length; j < validationLen; j++) {
                    var rule = validation[j];
                    if (!that._validateRule(rule, fields[_id])) {
                        that.fire('validate', {
                            rule : rule,
                            field: fields[_id]
                        });
                        if (typeof rule.onValidateFailure === "function") {//设置毁掉时处理回调
                            rule.onValidateFailure.call(fields[_id], rule);
                        } else {
                            fields[_id].showTip && fields[_id].showTip(rule.tip);
                        }
                        ok = false;
                        break;
                    }
                }// end for
                if (ok == false) {
                    break;
                }
            }// end for
            return ok;
        },
        /**
         * 验证规则的实现
         * @param rule 当前验证的规则类型
         * @param field 当前验证的字段
         * @return {Boolean} 验证是否通过
         * @private
         */
        _validateRule  : function (rule, field) {
            var strToDate = function (str) {
                var arr = str.split('-');
                return new Date(arr[0], arr[1] - 1, arr[2]);
            };
            switch (rule.type) {
                case 'required' ://必填项校验
                    return field.node.val() != '';
                    break;
                case 'dateformat' :
                    var val = field.node.val();
                    return val.length == 10 && /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/.test(val);
                    break;
                case 'mindate'://最早日期验证:
                    var val = field.node.val();
                    var select_date = strToDate(val),
                        min_date;
                    if (typeof rule.minDate === "string") {//min_date配置为一个field时，取其值转化为日期
                        min_date = strToDate(this.fields[rule.minDate].node.val());
                    } else {
                        min_date = rule.minDate;
                    }
                    return select_date >= min_date;
                    break;
                case 'identical' ://两个字段不能相同的验证 ： 出发到达城市不能相同
                    var val = field.node.val();
                    var identical_field = this.fields[rule.identicalWidth];
                    return val != identical_field.node.val();
                    break;
                case 'custom' :
                    if (typeof rule.validateFn === "function") {
                        return rule.validateFn.call(field, rule.arg, this);
                    }
                    return true;
                    break;
                default :
                    break;
            }
            return true;
        }
    }, {ATTRS: /** @lends Tsearch*/{
        form            : {
            value : '',
            setter: function (val){
                if (val instanceof S.NodeList) {
                    return val;
                }else{
                    return S.one(val);
                }
            }
        },
        /**
         * 表单字段配置，每一个输入元素以ID作为key进行组件，验证项的配置
         */
        fields          : {
            value: {
                '#J_FlightDepCity': {
                    input_node: null,
                    widgets   : {
                        'Placeholder'      : {
                            inputNode: null
                        },
                        'TripAutocompleteV2': {

                        }
                    },
                    validation: [
                        {
                            'blur': [
                                {
                                    'required': ''
                                }
                            ]
                        }
                    ]
                }
            }
        },
        validate_order  : {
            value: []
        },
        swapper         : {
            value: {
                trigger : '#J_Pi_Search_FlightSwap',
                children: {
                    'from': 'to'
                }
            }
        },
        switchSearchType: {
            value: null
        },
        /**
         * 保存搜索的历史记录开关
         */
        storage         : {
            value: false
        },
        /**
         * 验证顺序配置
         */
        validation_order: {
            value: null
        },
        time : {
            value : new Date()
        }
    }});
    return Tsearch;
}, {requires: ['base','./trip-autocomplete' , './tradio' , 'gallery/calendar/1.2/index' , 'gallery/placeholder/1.0/index' , 'gallery/offline/1.1/index' ,'./common' , 'node', 'base']});
KISSY.add('gallery/tsearch/1.1/build/hotel-search',function (S , Tsearch ,Common) {
    var DESTINATION_SOURCE = {
            cn        : 'http://kezhan.trip.taobao.com/citysuggest.do?t=0&q={query}',
            cnHot     : 'http://www.taobao.com/go/rgn/trip/jsonp/hotel.php',
            oversea   : 'http://kezhan.trip.taobao.com/citysuggest.do?t=1&q={query}',
            overseaHot: 'http://www.taobao.com/go/rgn/trip/hotoverseav2_jsonp.php'
        };

    var defaultInDate = Common.formatDate(Common.setDate(new Date(), 3)).yymmdd,
        defaultEndDate = Common.formatDate(Common.setDate(new Date(), 4)).yymmdd;
    var Thotelsearch = function (config) {
        var fields = {};
        if (!config.isLodge) {
            fields['.J_Radio'] = {
                widgets: {
                    'Tradio': {
                        node :'.J_Radio'
                    }
                }
            };
        }
        fields['.J_ArrCity'] = {
            widgets   : {
                'TripAutocomplete': {
                    hotel : {
                        inputNode        : '.J_ArrCity',
                        codeInputNode    : '.J_ArrCityCode'
                    }
                },
                'Placeholder'    : {
                    node: '.J_ArrCity'
                }
            },
            validation: [
                {
                    type: 'required',
                    tip : '请填入住城市'
                }
            ]
        };
        fields['.J_ArrCityCode'] = {};
        fields['.J_EndDate'] = {
            val       : defaultEndDate,
            widgets   : {
                'Placeholder': {
                    node : '.J_EndDate'
                }
            },
            validation: [
                {
                    type: 'required',
                    tip : '请填写离店日期'
                },
                {
                    type: 'dateformat',
                    tip : '请输入正确的日期格式 如：2018-01-01'
                },
                {
                    type   : 'mindate',
                    minDate: '.J_DepDate',
                    tip    : '离店日期不能早于入住日期，请重新选择'
                },
                {
                    type      : 'custom',
                    tip       : '酒店预订时间不能超过28天，请重新选择',
                    validateFn: function (arg, that) {
                        return Common.getDateInterval(that.fields['.J_DepDate'].node.val(), this.node.val()) <= 28
                    }
                }
            ]
        };
        fields['.J_DepDate'] = {
            val       : defaultInDate,
            widgets   : {
                'Placeholder': {
                    node: '.J_DepDate'
                },
                'Calendar'   : {
                    triggerNode     : '.J_DepDate',
                    finalTriggerNode: '.J_EndDate',
                    minDate         : new Date(),
                    isDateInfo      : 1,
                    isDateIcon      : 1,
                    isHoliday       : 1,
                    isKeyup         : false,
                    startDate       : defaultInDate,
                    endDate         : defaultEndDate,
                    afterDays       : 89
                }
            },
            validation: [
                {
                    type: 'required',
                    tip : '请填入住日期'
                },
                {
                    type: 'dateformat',
                    tip : '请输入正确的日期格式 如：2018-01-01'
                },
                {
                    type   : 'mindate',
                    minDate: new Date() - 86400000,
                    tip    : '入住日期不能早于今天'
                }
            ],
            autoSwitch: {
                nextField: '.J_EndDate'
            }
        };
        fields['.J_Keywords'] = {
            widgets: {
                'Placeholder': {
                    node: '.J_Keywords'
                }
            }
        };
        var hotelSearch = new Tsearch({
            'form'            : config.form,
            'fields'          : fields,
            /**
             * 表单校验顺序
             */
            'validation_order': ['.J_ArrCity', '.J_DepDate' ,'.J_EndDate']
        });
        //酒店有radio时，绑定切换
        var endDateField = hotelSearch.fields['.J_EndDate'];
        if (endDateField.Calendar) {//hack for calendar
            endDateField.Calendar.currentNode = endDateField.node;
            endDateField.Calendar._setDateInfo(endDateField.node.val());
        }
        if (config.isLodge) {
            return hotelSearch;
        }
        var bindRadioSwitch = function () {
            var Tradio = hotelSearch.fields['.J_Radio'].Tradio;
            var field = hotelSearch.get('fields')['.J_ArrCity'],
                Autocomplete = field.TripAutocomplete;
            Tradio.on('afterValueChange', function (e) {
                field.node.val('');
                if (e.newVal === '0') {//国内
                    Autocomplete.set('source', DESTINATION_SOURCE.cn);
                    Autocomplete.set('hotSource', DESTINATION_SOURCE.cnHot);
                } else {//海外
                    Autocomplete.set('source', DESTINATION_SOURCE.oversea);
                    Autocomplete.set('hotSource', DESTINATION_SOURCE.overseaHot);
                }
            });
        };
        bindRadioSwitch();
        return hotelSearch;
    };
    return Thotelsearch;
},{requires: ['./tsearch' , './common']});
KISSY.add('gallery/tsearch/1.1/build/index',function (S , Tsearch , Thotelsearch){
    var global_cfg = {
        allowCreateIcon : true,
        storage : false
    };
    function parseDefaultCfg(cfg){
        cfg = S.merge(global_cfg , cfg);
        return cfg;
    }
    var TripSearch = {
            time : new Date(),
            createFlightSearch : function (cfg){
                cfg = parseDefaultCfg(cfg);
                return new Tsearch(S.merge({
                            form            : cfg.node ,
                            fields          : {
                                '.J_Radio'        : {
                                    widgets: {
                                        'Tradio': {
                                            node: '.J_Radio'
                                        }
                                    }
                                },
                                '.J_DepCity'     : {
                                    val       : '',
                                    widgets   : {
                                        'TripAutocomplete': {
                                            flight: {
                                                inputNode: '.J_DepCity',
                                                codeInputNode : '.J_DepCityCode',
                                                allowCreateIcon : cfg.allowCreateIcon
                                            }
                                        },
                                        'Placeholder'    : {
                                            node: '.J_DepCity'
                                        }
                                    },
                                    autoSwitch: {
                                        nextField: '.J_ArrCity'
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            when: 'blur',
                                            tip : '请填写出发城市'
                                        }
                                    ]
                                },
                                '.J_DepCityCode': {

                                },
                                '.J_ArrCity'     : {
                                    widgets   : {
                                        'TripAutocomplete': {
                                            flight: {
                                                inputNode : '.J_ArrCity',
                                                codeInputNode : '.J_ArrCityCode',
                                                allowCreateIcon : cfg.allowCreateIcon
                                            }
                                        },
                                        'Placeholder'    : {
                                            node: '.J_ArrCity'
                                        }
                                    },
                                    autoSwitch: {
                                        nextField: '.J_DepDate'
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            when: 'blur',
                                            tip : '请填写到达城市'
                                        },
                                        {
                                            type          : 'identical',
                                            identicalWidth: '.J_DepCity',
                                            tip           : '出发到达城市不能相同'
                                        }
                                    ]
                                },
                                '.J_ArrCityCode': {

                                },
                                '.J_DepDate': {
                                    widgets   : {
                                        'Calendar'   : {
                                            triggerNode     : '.J_DepDate',
                                            finalTriggerNode: '.J_EndDate',
                                            minDate         : TripSearch.time,
                                            isDateInfo      : 1,
                                            isDateIcon      : cfg.allowCreateIcon,
                                            afterDays       : 364,
                                            isSameDate      : true,
                                            isKeyup         : false,
                                            isHoliday       : 1
                                        },
                                        'Placeholder': {
                                            node: '.J_DepDate'
                                        }
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            tip : '请填写出发日期'
                                        },
                                        {
                                            type: 'dateformat',
                                            tip : '请输入正确的日期格式 如：2018-01-01'
                                        },
                                        {
                                            type   : 'mindate',
                                            minDate: TripSearch.time - 86400000,
                                            tip    : '出发日期不能早于今天'
                                        }
                                    ],
                                    autoSwitch: {
                                        active   : true,
                                        nextField: '.J_EndDate'
                                    }
                                },
                                '.J_EndDate'      : {
                                    disabled  : true,
                                    widgets   : {
                                        'Placeholder': {
                                            node: '.J_EndDate'
                                        }
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            tip : '请填写返程日期'
                                        },
                                        {
                                            type: 'dateformat',
                                            tip : '请输入正确的日期格式 如：2018-01-01'
                                        },
                                        {
                                            type   : 'mindate',
                                            minDate: '.J_DepDate',
                                            tip    : '返程日期不能早于出发日期'
                                        }
                                    ]
                                }
                            },
                            /**
                             * 表单校验顺序
                             */
                            validation_order: ['.J_DepCity', '.J_ArrCity', '.J_DepDate' , '.J_EndDate'],
                            /**
                             * 出发到达城市切换配置
                             * @param trigger 交换按钮ID
                             * @param list 需要交换数据内容的容器列表 ,key 和 value 对应的inputNode 进行值的交换
                             */
                            swapper         : {
                                trigger: '.J_Swap',
                                list   : {
                                    '.J_DepCity'     : '.J_ArrCity',
                                    '.J_DepCityCode': '.J_ArrCityCode'
                                }
                            },
                            /**
                             * 机票专用:往返切换配置
                             * @param trigger 触发往返切换的radio控件所在容器
                             * @param back_container 返程输入框所在的容器
                             * @param back_input 返程输入框
                             */
                            switchSearchType: {
                                trigger       : '.J_Radio',
                                back_container: '.J_EndField',
                                go_input      : '.J_DepDate',
                                back_input    : '.J_EndDate'
                            },
                            /**
                             * 保存搜索历史记录开关  默认关闭
                             */
                            storage         :  cfg.storage
                        } , cfg));
            },
            createIflightSearch : function (cfg){
                cfg.storage = cfg.storage || false;
                cfg = parseDefaultCfg(cfg);
                return new Tsearch(S.merge({
                            form            : cfg.node ,
                            fields          : {
                                '.J_Radio'        : {
                                    widgets: {
                                        'Tradio': {
                                            node: '.J_Radio'
                                        }
                                    }
                                },
                                '.J_DepCity'     : {
                                    val       : '',
                                    widgets   : {
                                        'TripAutocomplete': {
                                            iflight: {
                                                inputNode: '.J_DepCity',
                                                codeInputNode : '.J_DepCityCode',
                                                allowCreateIcon : cfg.allowCreateIcon
                                            }
                                        },
                                        'Placeholder'    : {
                                            node: '.J_DepCity'
                                        }
                                    },
                                    autoSwitch: {
                                        nextField: '.J_ArrCity'
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            when: 'blur',
                                            tip : '请填写出发城市'
                                        }
                                    ]
                                },
                                '.J_DepCityCode': {

                                },
                                '.J_ArrCity'     : {
                                    widgets   : {
                                        'TripAutocomplete': {
                                            iflight: {
                                                inputNode : '.J_ArrCity',
                                                codeInputNode : '.J_ArrCityCode',
                                                allowCreateIcon : cfg.allowCreateIcon
                                            }
                                        },
                                        'Placeholder'    : {
                                            node: '.J_ArrCity'
                                        }
                                    },
                                    autoSwitch: {
                                        nextField: '.J_DepDate'
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            when: 'blur',
                                            tip : '请填写到达城市'
                                        },
                                        {
                                            type          : 'identical',
                                            identicalWidth: '.J_DepCity',
                                            tip           : '出发到达城市不能相同'
                                        }
                                    ]
                                },
                                '.J_ArrCityCode': {

                                },
                                '.J_DepDate': {
                                    widgets   : {
                                        'Calendar'   : {
                                            triggerNode     : '.J_DepDate',
                                            finalTriggerNode: '.J_EndDate',
                                            minDate         : TripSearch.time,
                                            isDateInfo      : 1,
                                            isDateIcon      : cfg.allowCreateIcon,
                                            afterDays       : 364,
                                            isSameDate      : true,
                                            isKeyup         : false,
                                            isHoliday       : 1
                                        },
                                        'Placeholder': {
                                            node: '.J_DepDate'
                                        }
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            tip : '请填写出发日期'
                                        },
                                        {
                                            type: 'dateformat',
                                            tip : '请输入正确的日期格式 如：2018-01-01'
                                        },
                                        {
                                            type   : 'mindate',
                                            minDate: TripSearch.time - 86400000,
                                            tip    : '出发日期不能早于今天'
                                        }
                                    ],
                                    autoSwitch: {
                                        active   : true,
                                        nextField: '.J_EndDate'
                                    }
                                },
                                '.J_EndDate'      : {
                                    disabled  : true,
                                    widgets   : {
                                        'Placeholder': {
                                            node: '.J_EndDate'
                                        }
                                    },
                                    validation: [
                                        {
                                            type: 'required',
                                            tip : '请填写返程日期'
                                        },
                                        {
                                            type: 'dateformat',
                                            tip : '请输入正确的日期格式 如：2018-01-01'
                                        },
                                        {
                                            type   : 'mindate',
                                            minDate: '.J_DepDate',
                                            tip    : '返程日期不能早于出发日期'
                                        }
                                    ]
                                }
                            },
                            /**
                             * 表单校验顺序
                             */
                            validation_order: ['.J_DepCity', '.J_ArrCity', '.J_DepDate' , '.J_EndDate'],
                            /**
                             * 出发到达城市切换配置
                             * @param trigger 交换按钮ID
                             * @param list 需要交换数据内容的容器列表 ,key 和 value 对应的inputNode 进行值的交换
                             */
                            swapper         : {
                                trigger: '.J_Swap',
                                list   : {
                                    '.J_DepCity'     : '.J_ArrCity',
                                    '.J_DepCityCode': '.J_ArrCityCode'
                                }
                            },
                            /**
                             * 机票专用:往返切换配置
                             * @param trigger 触发往返切换的radio控件所在容器
                             * @param back_container 返程输入框所在的容器
                             * @param back_input 返程输入框
                             */
                            switchSearchType: {
                                trigger       : '.J_Radio',
                                back_container: '.J_EndField',
                                go_input      : '.J_DepDate',
                                back_input    : '.J_EndDate'
                            },
                            /**
                             * 保存搜索历史记录开关  默认关闭
                             */
                            storage         :  cfg.storage
                        } , cfg));
            },
            createHotelSearch : function (cfg){
                cfg = parseDefaultCfg(cfg);
                    Thotelsearch(S.merge({
                        form               : cfg.node
                },cfg));
            },
            createLodgeSearch : function(cfg) {
                cfg = parseDefaultCfg(cfg);
                    Thotelsearch(S.merge({
                        form               : cfg.node,
                        isLodge : true
                },cfg));
            },
            createTravelSearch : function(cfg) {
                parseDefaultCfg(cfg);
                return new Tsearch(S.merge({
                    form            : cfg.node,
                    fields          : {
                        '.J_DepCity': {
                            widgets: {
                                'Placeholder'    : {
                                    node: '.J_DepCity'
                                },
                                'TripAutocomplete': {
                                    travel : {inputNode : '.J_DepCity'}
                                }
                            }
                        },
                        '.J_ArrCity': {
                            widgets   : {
                                'Placeholder'    : {
                                    node: '.J_ArrCity'
                                },
                                'TripAutocomplete': {
                                    travel : {inputNode      : '.J_ArrCity'}
                                }
                            },
                            validation: [
                                {
                                    type: 'required',
                                    tip : '请输入目的地'
                                }
                            ]
                        }
                    },
                    validation_order: ['.J_ArrCity']
                },cfg));
            },
            createTicketSearch : function(cfg) {
                    return new Tsearch(S.merge({
                        form            : cfg.node,
                        fields          : {
                            '.J_ArrCity': {
                                widgets   : {
                                    'Placeholder': {
                                        node: '.J_ArrCity'
                                    }
                                },
                                validation: [
                                    {
                                        type             : 'required',
                                        onValidateFailure: function () {
                                            this.node[0].focus();
                                        }
                                    }
                                ]
                            }
                        },
                        validation_order: ['.J_ArrCity']
                    },cfg));
                },
            createCarSearch : function(cfg) {
                return new Tsearch(S.merge({
                    form            : cfg.node,
                    fields          : {
                        '.J_ArrCity': {
                            widgets   : {
                                'Placeholder'    : {
                                    node : '.J_ArrCity'
                                },
                                'TripAutocomplete': {
                                    city :{inputNode : '.J_ArrCity'}
                                }
                            },
                            validation: [
                                {
                                    type: 'required',
                                    tip : '请填写租车城市'
                                }
                            ]
                        }
                    },
                    validation_order: ['.J_ArrCity']
                },cfg));
            },
            createTrainSearch : function (cfg){
             cfg = parseDefaultCfg(cfg);
             return new Tsearch(S.merge({
                        form            : cfg.node ,
                        fields          : {
                            '.J_DepCity'     : {
                                val       : '',
                                widgets   : {
                                    'TripAutocomplete': {
                                        train: {
                                            inputNode: '.J_DepCity',
                                            codeInputNode : '.J_DepCityCode',
                                            allowCreateIcon : cfg.allowCreateIcon
                                        }
                                    },
                                    'Placeholder'    : {
                                        node: '.J_DepCity'
                                    }
                                },
                                autoSwitch: {
                                    nextField: '.J_ArrCity'
                                },
                                validation: [
                                    {
                                        type: 'required',
                                        when: 'blur',
                                        tip : '请填写出发城市'
                                    }
                                ]
                            },
                            '.J_DepCityCode': {

                            },
                            '.J_ArrCity'     : {
                                widgets   : {
                                    'TripAutocomplete': {
                                        train: {
                                            inputNode : '.J_ArrCity',
                                            codeInputNode : '.J_ArrCityCode',
                                            allowCreateIcon : cfg.allowCreateIcon
                                        }
                                    },
                                    'Placeholder'    : {
                                        node: '.J_ArrCity'
                                    }
                                },
                                validation: [
                                    {
                                        type: 'required',
                                        when: 'blur',
                                        tip : '请填写到达城市'
                                    }
                                ],
                                autoSwitch: {
                                    active   : true,
                                    nextField: '.J_DepDate'
                                }
                            },
                            '.J_ArrCityCode': {

                            },
                            '.J_DepDate': {
                                widgets   : {
                                    'Calendar'   : {
                                        triggerNode     : '.J_DepDate',
                                        minDate         : TripSearch.time,
                                        isDateInfo      : 1,
                                        isDateIcon      : cfg.allowCreateIcon,
                                        afterDays       : 19,
                                        isKeyup         : false,
                                        isHoliday       : 1
                                    },
                                    'Placeholder': {
                                        node: '.J_DepDate'
                                    }
                                },
                                validation: [
                                    {
                                        type: 'required',
                                        tip : '请填写出发日期'
                                    },
                                    {
                                        type: 'dateformat',
                                        tip : '请输入正确的日期格式 如：2018-01-01'
                                    },
                                    {
                                        type   : 'mindate',
                                        minDate: new Date() - 86400000,
                                        tip    : '出发日期不能早于今天'
                                    }
                                ]
                            }
                        },
                        /**
                         * 表单校验顺序
                         */
                        validation_order: ['.J_DepCity', '.J_ArrCity', '.J_DepDate'],
                        /**
                         * 出发到达城市切换配置
                         * @param trigger 交换按钮ID
                         * @param list 需要交换数据内容的容器列表 ,key 和 value 对应的inputNode 进行值的交换
                         */
                        swapper         : {
                            trigger: '.J_Swap',
                            list   : {
                                '.J_DepCity'     : '.J_ArrCity',
                                '.J_DepCityCode': '.J_ArrCityCode'
                            }
                        },
                        /**
                         * 保存搜索历史记录开关  默认关闭
                         */
                        storage         : false
                    },cfg));
        }
    };
    return TripSearch;
} , {requires : ['./tsearch' , './hotel-search' , 'node' , 'event' , 'base']});
KISSY.add('gallery/tsearch/1.1/build/template',function (S){
    return {
        searchTemplate : '<div class="mod-search" id="J_Pi_Search_SearchModule"><div class="search-hd"><div class="search-nav"><ul class="J_Pi_Search_SearchTabNav"><li class="swing-slice-indicator J_Pi_Search_NavItemFlight selected"><s class="search-nav-flight"></s><a href="http://trip.taobao.com/jipiao" hidefocus="true">国内机票</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemIFlight"><s class="search-nav-iflight"></s><a href="http://trip.taobao.com/ijipiao" hidefocus="true">国际 &#8226 港澳台</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemHotel"><s class="search-nav-hotel"></s><a href="http://trip.taobao.com/jiudian" hidefocus="true">酒店</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemLodge"><s class="search-nav-lodge"></s><a href="http://trip.taobao.com/kezhan" hidefocus="true">客栈</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemTicket"><s class="search-nav-ticket"></s><a href="http://trip.taobao.com/menpiao" hidefocus="true">景点门票</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemTravel"><s class="search-nav-travel"></s><a href="http://trip.taobao.com/dujia" hidefocus="true">旅游度假</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemCar"><s class="search-nav-car"></s><a href="http://trip.taobao.com/zuche" hidefocus="true">租车</a></li></ul></div></div><div class="search-bd"><div class="search-item swing-slice J_Pi_Search_TabPannel"><form method="get" target="_blank" action="http://s.jipiao.trip.taobao.com/flight_search_result.htm"class="search-form search-jipiao" id="J_Pi_Search_jipiao_form"><a href="javascript:void(0)" target="_self" class="search-trade" id="J_Pi_Search_FlightSwap">互换出发到达城市</a><fieldset><input type="hidden" name="spm" value="181.1113091.a1z0v.1"/><div class="search-field"><label class="search-item-intro search-tit">出发城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="depCityName" id="J_Pi_Search_jipiao_depCity" placeholder="城市名" value=""/><input name="depCity" type="hidden" id="J_Pi_Search_jipiao_depCity_code" data-trade="J_Pi_Search_jipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">到达城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="arrCityName"id="J_Pi_Search_jipiao_arrCity" placeholder="城市名" value="" data-description="到达城市"/><input name="arrCity" type="hidden" id="J_Pi_Search_jipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">航程类型：</label><div class="search-inputarea"><div class="search-radio" id="J_Pi_Search_FlightRadio"><label for="J_Pi_Search_jipiao_FlightTypeRadio_1" class="flight-type-radio first-label"><input type="radio" name="tripType" id="J_Pi_Search_jipiao_FlightTypeRadio_1" class="J_Pi_Search_type_radio" value="0" checked="checked"/>单程</label><label for="J_Pi_Search_jipiao_FlightTypeRadio_2" class="flight-type-radio last-label"><input type="radio" name="tripType" id="J_Pi_Search_jipiao_FlightTypeRadio_2" class="J_Pi_Search_type_radio" value="1"/>往返</label></div></div></div><div class="search-field"><label class="search-item-intro search-tit">出发日期：</label><div class="search-inputarea"><input type="text" class="search-input required dateformat J_Pi_Search_DateInput J_Pi_Search_depDate" name="depDate" id="J_Pi_Search_FlightDepDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-field disabled" id="J_Pi_Search_FlightBackField"><label class="search-item-intro search-tit">返程日期：</label><div class="search-inputarea"><input type="text" class="search-input J_Pi_Search_DateInput J_Pi_Search_endDate" name="arrDate" maxlength="10" id="J_Pi_Search_FlightArrDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" action="http://s.ijipiao.trip.taobao.com/ie/flight_search.htm"class="search-form search-jipiao" id="J_Pi_Search_ijipiao_form"><input type="hidden" name="spm" value="181.1113091.a1z0v.2"/><a href="javascript:void(0)" target="_self" class="search-trade" id="J_Pi_Search_IFlightSwap">互换出发到达城市</a><fieldset><div class="search-field"><label class="search-item-intro search-tit">出发城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="_fmie.ie._0.st"id="J_Pi_Search_ijipiao_depCity" placeholder="城市名" value=""data-trade="J_Pi_Search_ijipiao_arrCity" data-autotab="J_Pi_Search_ijipiao_arrCity"data-description="出发城市"/><input name="_fmie.ie._0.s" type="hidden" id="J_Pi_Search_ijipiao_depCity_code"data-trade="J_Pi_Search_ijipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">到达城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="_fmie.ie._0.en"id="J_Pi_Search_ijipiao_arrCity" placeholder="城市名" value="" data-description="到达城市"/><input name="_fmie.ie._0.e" type="hidden" id="J_Pi_Search_ijipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">航程类型：</label><div class="search-inputarea"><div class="search-radio" id="J_Pi_Search_IFlightRadio"><label for="J_Pi_Search_ijipiao_FlightTypeRadio_1" class="flight-type-radio first-label"><input type="radio" name="_fmie.ie._0.t" id="J_Pi_Search_ijipiao_FlightTypeRadio_1" class="J_Pi_Search_type_radio" value="0"/>单程</label><label for="J_Pi_Search_ijipiao_FlightTypeRadio_2" class="flight-type-radio last-label"><input type="radio" name="_fmie.ie._0.t" id="J_Pi_Search_ijipiao_FlightTypeRadio_2" class="J_Pi_Search_type_radio" value="1" checked="checked"/>往返</label></div></div></div><div class="search-field"><label class="search-item-intro search-tit">出发日期：</label><div class="search-inputarea"><input type="text" class="search-input required dateformat J_Pi_Search_DateInput J_Pi_Search_depDate" name="_fmie.ie._0.sta" id="J_Pi_Search_IFlightDepDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-field" id="J_Pi_Search_IFlightBackField"><label class="search-item-intro search-tit">返程日期：</label><div class="search-inputarea"><input type="text" class="search-input J_Pi_Search_DateInput J_Pi_Search_endDate J_Pi_Search_ieEndDate required" name="_fmie.ie._0.end" id="J_Pi_Search_IFlightArrDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" id="J_Pi_Search_HotelForm" action="http://kezhan.trip.taobao.com/hotel_list2.htm" class="search-form search-jiudian"><input type="hidden" name="spm" value="181.1113091.a1z0v.3"/><input type="hidden" id="J_Pi_Search_HotelSearchAction" name="action" value="hotel_list_action2"/><input type="hidden" id="J_Pi_Search_HotelSearchDoSearch" name="event_submit_do_search" value="submit"/><fieldset><div class="search-field"><div class="search-radio" id="J_Pi_Search_HotelLocationRadio"><label for="J_Pi_Search_HotelLocal" class="first-label"><input id="J_Pi_Search_HotelLocal" type="radio" value="0" name="_fmd.h._0.r" checked="checked" class="flight-type-radio">国内/港澳台</label><label for="J_Pi_Search_HotelInternational" class="last-label"><input id="J_Pi_Search_HotelInternational" type="radio" value="1" name="_fmd.h._0.r" class="flight-type-radio">海外</label></div></div><div class="search-field"><label class="search-item-intro search-tit J_Pi_Search_HotelToPlaceIndicator">目的城市：</label><div class="search-inputarea"><input type="text" class="search-input required" id="J_Pi_Search_HotelToCity"placeholder="城市名" name="city" value="" data-description="目的城市"/><input name="c" type="hidden" id="J_Pi_Search_OmniCode" value=""/></div></div><div class="search-field"><label class="search-item-intro search-tit">入住日期：</label><div class="search-inputarea"><div id="J_Pi_Search_jiudian_depDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_depDate"name="_fmd.h._0.ch" id="J_Pi_Search_HotelDepDate" placeholder="yyyy-mm-dd"value="" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">离店日期：</label><div class="search-inputarea"><div id="J_Pi_Search_jiudian_endDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_endDate"name="_fmd.h._0.che" id="J_Pi_Search_HotelEndDate" placeholder="yyyy-mm-dd"value="" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">　关键字：</label><div class="search-inputarea"><input type="text" class="search-input" name="_fmd.h._0.n" id="J_Pi_Search_HotelSearchKeywords" placeholder="输入酒店名、商圈、地标等" value=""/></div></div><div class="search-submitarea"><button type="submit" class="J_Pi_Search_HotelListSearch search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" id="J_Pi_Search_LodgeForm" action="http://kezhan.trip.taobao.com/hotel_list2.htm" class="search-form search-jiudian"><input type="hidden" name="spm" value="181.1113091.a1z0v.4"/><input type="hidden" id="J_Pi_Search_LodgeSearchAction" name="action" value="hotel_list_action2"/><input type="hidden" id="J_Pi_Search_LodgeSearchDoSearch" name="event_submit_do_search" value="submit"/><input type="hidden" name="from" value="kezhan"/><input type="hidden" name="searchBy" value="trip-kezhan"/><input type="hidden" name="_fmd.h._0.l" value="0"/><fieldset><div class="search-field"><label class="search-item-intro search-tit J_Pi_Search_HotelToPlaceIndicator">目的城市：</label><div class="search-inputarea"><input type="text" class="search-input required" id="J_Pi_Search_LodgeToCity"placeholder="城市名" name="city" value="" data-description="目的城市"/><input name="c" type="hidden" id="J_Pi_Search_LodgeOmniCode" value=""/><input type="text" class="search-input required hidden" id="J_Pi_Search_LodgeToOversea"placeholder="城市名" value="" data-description="目的城市"/></div></div><div class="search-field"><label class="search-item-intro search-tit">入住日期：</label><div class="search-inputarea"><div id="J_Pi_Search_LodgeDepDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_depDate"name="_fmd.h._0.ch" id="J_Pi_Search_LodgeDepDate" placeholder="yyyy-mm-dd"value="" data-autotab="J_Pi_Search_LodgeEndDate" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">离店日期：</label><div class="search-inputarea"><div id="J_Pi_Search_LodgeEndDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_endDate"name="_fmd.h._0.che" id="J_Pi_Search_LodgeEndDate" placeholder="yyyy-mm-dd"value="" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">　关键字：</label><div class="search-inputarea"><input type="text" class="search-input" name="_fmd.h._0.n" id="J_Pi_Search_LodgeSearchKeywords" placeholder="输入酒店名、商圈、地标等" value=""/></div></div><div class="search-submitarea"><button type="submit" class="J_Pi_Search_HotelListSearch search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" action="http://s.taobao.com/search?commend=all&tab=coefp&cd=false&ssid=s5-e&fs=1&bcoffset=2&cat=50037979&from=compass&navlog=compass-1-c-50037979" class="search-form search-menpiao" target="_blank" id="J_Pi_Search_menpiao_form"><fieldset><input type="hidden" name="cat" value="50037979"/><input type="hidden" name="spm" value="181.1113091.a1z0v.5"/><div class="search-field"><label class="search-tit">搜索门票：</label><div class="search-inputarea"><input type="text" class="search-input required" name="q" id="J_Pi_Search_menpiao_arrCity" placeholder="景点名或城市名" value=""/></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" id="J_Pi_Search_dujia_form" action="http://dujia.trip.taobao.com/search.htm"class="search-form search-dujia"><fieldset><input type="hidden" name="spm" value="181.1113091.a1z0v.6"/><div class="search-field"><label class="search-item-intro search-tit">出发城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="cq" id="J_Pi_Search_dujia_depCity"placeholder="城市名" value=""/></div></div><div class="search-field"><label class="search-item-intro search-tit">　目的地：</label><div class="search-inputarea"><input type="text" class="search-input required" name="mq" id="J_Pi_Search_dujia_arrCity"placeholder="景点名或城市名" value=""/></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" action="http://s.taobao.com/search?commend=all&tab=coefp&cd=false&ssid=s5-e&fs=1&bcoffset=1&bcoffset=2&cat=50036351&from=compass&navlog=compass-7-c-50036351" class="search-form search-zuche" target="_blank" id="J_Pi_Search_zuche_form"><fieldset><input type="hidden" name="cat" value="50036351"/><input type="hidden" name="spm" value="181.1113091.a1z0v.7"/><div class="search-field"><div class="search-inputarea"><label class="search-item-intro search-tit" for="J_Pi_Search_zuche_arrCity">租车城市：</label><input type="text" class="search-input required" name="q" id="J_Pi_Search_zuche_arrCity"placeholder="城市名" value=""/></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div></div></div>'
    }
})
KISSY.add('gallery/tsearch/1.1/build/fixed-btn',function (S,O ,  TripSearch ,Template ,Slide) {
    var WIDTH = 437;
    var HEIGHT = 380;
    var MIN_WIDTH = 152;
    var MIN_HEIGHT = 30;
    var BTN_TEXT = '搜索更多商品';
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
                height: MIN_HEIGHT,
                zIndex : this.get('zIndex')
            });
            this.overlay.set('content', '<div class="J_Pi_Search_TripSearchFixedBtn trip-search-fixed-btn"><a href="http://trip.taobao.com">' + BTN_TEXT + '</a></div><div class="J_Pi_Search_TripSearchFixedContent trip-search-fixed-content"></div>');
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
            zIndex: {
                value : 10000
            },
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
