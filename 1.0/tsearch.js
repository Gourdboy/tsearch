/**
 * @fileoverview 请修改组件描述
 * @author 舒克<shuke.cl@taobao.com>
 * @module tsearch
 **/
KISSY.add(function (S,Base, TripAutocomplete ,Tradio , Calendar , Placeholder) {
    var Widgets = {
        TripAutocomplete : TripAutocomplete,
        Calendar : Calendar ,
        Placeholder : Placeholder,
        Tradio : Tradio
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
            //this.get('storage') && this.setDefaultValue();
            this.fields = this.get('fields');
            S.each(this.fields, function (field, _id) {
                var _node = S.one(_id);
                if (!_node) {
                    S.log(_id + "is not find..")
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
                S.Event.on(swapper.trigger, 'click', function (e) {
                    e.halt();
                    this.swap();
                },  this)
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
                if (Widget) {
                    if(widget_name == 'TripAutocomplete'){//Autocomplete采用工厂模式
                        S.each(field.widgets[widget_name] , function (v , k){
                            field[widget_name] =  Widget[k](v);
                        })
                    } else {
                        field[widget_name] = new Widget(widget_config);
                    }
                    if (widget_name === 'Calendar' && widget_config.finalTriggerNode && that.fields[widget_config.finalTriggerNode]) { //hack for Calendar 出发和返程日期共用一个日历组件,将组件实力共享给返程表单对象
                        that.fields[widget_config.finalTriggerNode][widget_name] = field[widget_name];
                    }
                }
            });
            /**
             * 把组件的showMessage方法进行适配，统一用showTip方式现实错误提示
             * @type {*}
             */
            field.showTip = (function (field) {
                if (field.TripAutocomplete) {
                    return function (msg) {
                        field.node[0].focus();
                        field.TripAutocomplete.showMessage(msg);
                    }
                } else if (field.Calendar) {
                    return function (msg) {
                        field.node[0].focus();
                        field.Calendar.currentNode = field.node;
                        field.Calendar.set('message' , msg)
                        field.Calendar.showMessage(msg);
                    }
                }
            })(field);
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
            return false;//临时关闭自动切换
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
                    next_node[0].focus()
                }
            };

            if (cur_field.TripAutocomplete) {
                cur_field.TripAutocomplete.on('select', switchToNext);
            } else if (cur_field.Calendar) {
                cur_field.Calendar.on('dateclick', function () {
                    if (this.currentNode.attr('id') === cur_field_id.replace('#', '')) {//当前触发dateclick事件为当前输入框绑定的日历控件时执行自动切换
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
                back_container = S.one(config.back_container),
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
                if (this.currentNode.attr('id') === config.back_input.replace('#', '')) {
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
                back_container = S.one(config.back_container);
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
                fields: this.fields
            });
            //this._storageForm();
        },
        /**
         * 日期检查,返回
         * @param date 日期 ['2011-05-14','2011-06-14']
         * @return Array
         */
        _isResetDate   : function (date) {
            date = date.split('-');
            return new Date() > new Date(date[0], date[1] - 1, date[2]);
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
            var _T = new Date();
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
        }
    }});
    return Tsearch;
}, {requires: ['base','./trip-autocomplete' , './radio-button' , 'gallery/calendar/1.1/index' , 'gallery/placeholder/1.0/index' , 'node', 'base']});