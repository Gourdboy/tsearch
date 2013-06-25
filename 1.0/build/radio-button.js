/**
 * RadioButton���
 *
 * @module Radiobutton
 * @submodule
 **/
KISSY.add(function (S) {
    /**
     * Radiobutton
     * @class Radiobutton
     * @extends S.Base
     * @uses
     * @constructor
     * @param {Object} ������
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
            this.radios = node.all('input[type="radio"]');
            this.radios.each(function (_item) {
                var item = {
                    input: _item
                };
                var _item_id = _item.attr('id');
                if (_item_id && node.one('label[for=' + _item_id + ']')) {
                    item.label = node.one('label[for=' + _item_id + ']');
                }
                that.items[_item.val()] = item;
            });
            this.bindUI();
            this.set('value' , this.val());
        },
        bindUI     : function () {
            this.node.delegate('click', 'label', function (e) {
                var target = S.one(e.currentTarget);
                S.one('#' + target.attr('for')).attr('checked' , true);
                this.set('value' , this.node.one('#' + target.attr('for')).val());
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
         * ��ȡ������radio��ֵ
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
            var checkedNode = S.one('input[type=radio][checked=checked]');
            if (!checkedNode) {
                return undefined;
            }else{
                return checkedNode.val();
            }
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
             * Required radiobutton���ڵĸ������ڵ�
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
             * Required ������name����ֵ, ���Դ�ֵȥ��ȡinput�ڵ�
             * @attribute name
             * @type String
             * @default null
             **/
            name:{
                value:''
            },
            /**
             * �����ѡ��ʱ��ClassName
             * @attribute selectedClass
             * @type String
             * @default selected
             **/
            selectedClass:{
                value:'selected'
            },
            /**
             * ��ǰ��checkedΪtrue��radio��ֵ
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