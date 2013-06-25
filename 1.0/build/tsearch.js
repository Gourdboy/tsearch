/**
 * @fileoverview ���޸��������
 * @author ���<shuke.cl@taobao.com>
 * @module tsearch
 **/
KISSY.add(function (S,Base, TripAutocomplete ,Tradio , Calendar , Placeholder) {
    var EMPTY = '';
    var $ = Node.all;
    var Widgets = {
        TripAutocomplete : TripAutocomplete,
        Calendar : Calendar ,
        Placeholder : Placeholder,
        Tradio : Tradio
    };
    /**
     * ���޸��������
     * @class Tsearch
     * @constructor
     * @extends Base
     */
    function Tsearch(comConfig) {
        var self = this;
        //���ø��๹�캯��
        Tsearch.superclass.constructor.call(self, comConfig);
        this.initializer();
    }

    S.extend(Tsearch, Base, /** @lends Tsearch.prototype*/{
        initializer    : function () {
            this.form = this.get('form');
            if (!this.form) {
                S.log('TSearch:û���ҵ����ڵ�,��ʼ��ʧ��');
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
            //�л�������
            if (this.get('switchSearchType')) {
                this.initRadioSwitch()
            }
            //�󶨱���������
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
         * �ؼ��� ,�������õĶ����ʼ������ʵ���ҽӵ���ǰ��
         * @param field
         */
        bindWidgets    : function (field) {
            var that = this;
            S.each(field.widgets, function (widget_config, widget_name) {
                var Widget = Widgets[widget_name];
                if (Widget) {
                    if(widget_name == 'TripAutocomplete'){//Autocomplete���ù���ģʽ
                        S.each(field.widgets[widget_name] , function (v , k){
                            field[widget_name] =  Widget[k](v);
                        })
                    } else {
                        field[widget_name] = new Widget(widget_config);
                    }
                    if (widget_name === 'Calendar' && widget_config.finalTriggerNode && that.fields[widget_config.finalTriggerNode]) { //hack for Calendar �����ͷ������ڹ���һ���������,�����ʵ����������̱�����
                        that.fields[widget_config.finalTriggerNode][widget_name] = field[widget_name];
                    }
                }
            });
            /**
             * �������showMessage�����������䣬ͳһ��showTip��ʽ��ʵ������ʾ
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
         * ��������swapper�������ֵ
         */
        swap           : function () {
            S.each(this.get('swapper').list, function (val, key) {
                this._swapItem(key, val);
            }, this);
        },
        /**
         * ���������ֶε�ֵ
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
         * ʵ���Զ��л����ܵİ�
         * @param cur_field_id
         */
        setSwitchInput : function (cur_field_id) {
            return false;//��ʱ�ر��Զ��л�
            var fields = this.fields;
            var cur_field = fields[cur_field_id];
            var switchToNext = function () {
                var next_field = fields[cur_field.autoSwitch.nextField],
                    next_node = next_field.node;
                if (!next_node) {
                    S.log('û��ָ���Զ��л���Ŀ��Ԫ��');
                    return this;
                }
                if (!next_field.disabled && next_field.node.val() == '') {//��ǰ���ش�����һ���ֶ�δ��
                    next_node[0].focus()
                }
            };

            if (cur_field.TripAutocomplete) {
                cur_field.TripAutocomplete.on('select', switchToNext);
            } else if (cur_field.Calendar) {
                cur_field.Calendar.on('dateclick', function () {
                    if (this.currentNode.attr('id') === cur_field_id.replace('#', '')) {//��ǰ����dateclick�¼�Ϊ��ǰ�����󶨵������ؼ�ʱִ���Զ��л�
                        switchToNext();
                    }
                });
            }
            return this;
        },
        /**
         * ��ʼ�����������л��¼�
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
            //��������û��ֵʱ�л�Ϊ����
            back_input.on('valuechange', function (e) {
                if (e.newVal === '') {
                    Tradio.val('0');
                }
            });
            //ѡ�񷵳�����ʱ���Զ��л�Ϊ����
            Calendar.on('dateclick', function (e) {
                if (this.currentNode.attr('id') === config.back_input.replace('#', '')) {
                    Tradio.val('1');
                }
            });
            this._setSearchType(Tradio.val());
        },
        /**
         * ���ݵ���������ֵ������������ѡ�񽻻�״̬
         * @param val
         * @private
         */
        _setSearchType : function (val) {
            var config = this.get('switchSearchType'),
                fields = this.fields,
                back_container = S.one(config.back_container);
            if (val === "1") {//��������
                back_container.removeClass('disabled');
                if (fields[config.go_input].autoSwitch) {
                    fields[config.back_input].disabled = false;
                }
            } else {//��������
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
         * ���ڼ��,����
         * @param date ���� ['2011-05-14','2011-06-14']
         * @return Array
         */
        _isResetDate   : function (date) {
            date = date.split('-');
            return new Date() > new Date(date[0], date[1] - 1, date[2]);
        },
        /*
         *��ȡָ�����ڵ�
         *@num_date ָ�����ڵ�ǰ������ 1Ϊ����,2Ϊ����,-1Ϊ����...
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
                        if (typeof rule.onValidateFailure === "function") {//���ûٵ�ʱ����ص�
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
         * ��֤�����ʵ��
         * @param rule ��ǰ��֤�Ĺ�������
         * @param field ��ǰ��֤���ֶ�
         * @return {Boolean} ��֤�Ƿ�ͨ��
         * @private
         */
        _validateRule  : function (rule, field) {
            var strToDate = function (str) {
                var arr = str.split('-');
                return new Date(arr[0], arr[1] - 1, arr[2]);
            };
            switch (rule.type) {
                case 'required' ://������У��
                    return field.node.val() != '';
                    break;
                case 'dateformat' :
                    var val = field.node.val();
                    return val.length == 10 && /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/.test(val);
                    break;
                case 'mindate'://����������֤:
                    var val = field.node.val();
                    var select_date = strToDate(val),
                        min_date;
                    if (typeof rule.minDate === "string") {//min_date����Ϊһ��fieldʱ��ȡ��ֵת��Ϊ����
                        min_date = strToDate(this.fields[rule.minDate].node.val());
                    } else {
                        min_date = rule.minDate;
                    }
                    return select_date >= min_date;
                    break;
                case 'identical' ://�����ֶβ�����ͬ����֤ �� ����������в�����ͬ
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
         * ���ֶ����ã�ÿһ������Ԫ����ID��Ϊkey�����������֤�������
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
         * ������������ʷ��¼����
         */
        storage         : {
            value: false
        },
        /**
         * ��֤˳������
         */
        validation_order: {
            value: null
        }
    }});
    return Tsearch;
}, {requires: ['base','./trip-autocomplete' , './radio-button' , 'gallery/calendar/1.1/index' , 'gallery/placeholder/1.0/index' , 'node', 'base']});