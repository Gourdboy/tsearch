/*
combined files : 

gallery/tsearch/1.1/common
gallery/tsearch/1.1/trip-autocomplete
gallery/tsearch/1.1/tradio
gallery/tsearch/1.1/tsearch
gallery/tsearch/1.1/hotel-search

*/
/**
 * 旅行公共函数库
 */
KISSY.add('gallery/tsearch/1.1/common',function (S){
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
KISSY.add('gallery/tsearch/1.1/trip-autocomplete',function (S, Ac , Common) {
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
KISSY.add('gallery/tsearch/1.1/tradio',function (S) {
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
KISSY.add('gallery/tsearch/1.1/tsearch',function (S,Base, TripAutocomplete ,Tradio , Calendar , Placeholder , LocalStorage , Common) {
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
KISSY.add('gallery/tsearch/1.1/hotel-search',function (S , Tsearch ,Common) {
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
