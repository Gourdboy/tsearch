KISSY.add(function (S , Tsearch , Thotelsearch){
    var TripSearch = {
            createFlightSearch : function (cfg){
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
                                                codeInputNode : '.J_DepCityCode'
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
                                                codeInputNode : '.J_ArrCityCode'
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
                                        'Placeholder': {
                                            node: '.J_DepDate'
                                        },
                                        'Calendar'   : {
                                            triggerNode     : '.J_DepDate',
                                            finalTriggerNode: '.J_EndDate',
                                            minDate         : new Date(),
                                            isDateInfo      : 1,
                                            isDateIcon      : 1,
                                            afterDays       : 364,
                                            isKeyup         : false,
                                            isHoliday       : 1
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
                                                codeInputNode : '.J_DepCityCode'
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
                                                codeInputNode : '.J_ArrCityCode'
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
                                        'Placeholder': {
                                            node: '.J_DepDate'
                                        },
                                        'Calendar'   : {
                                            triggerNode     : '.J_DepDate',
                                            finalTriggerNode: '.J_EndDate',
                                            minDate         : new Date(),
                                            isDateInfo      : 1,
                                            isDateIcon      : 1,
                                            afterDays       : 364,
                                            isKeyup         : false,
                                            isHoliday       : 1
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
                    Thotelsearch(S.merge({
                        form               : cfg.node
                },cfg));
            },
            createLodgeSearch : function(cfg) {
                    Thotelsearch(S.merge({
                        form               : cfg.node,
                        isLodge : true
                },cfg));
            },
            createTravelSearch : function(cfg) {

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
            return new Tsearch(S.merge({
                        form            : cfg.node ,
                        fields          : {
                            '.J_DepCity'     : {
                                val       : '',
                                widgets   : {
                                    'TripAutocomplete': {
                                        city: {
                                            inputNode: '.J_DepCity',
                                            codeInputNode : '.J_DepCityCode'
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
                                        city: {
                                            inputNode : '.J_ArrCity',
                                            codeInputNode : '.J_ArrCityCode'
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
                                    },
                                    {
                                        type          : 'identical',
                                        identicalWidth: '.J_DepCity',
                                        tip           : '出发到达城市不能相同'
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
                                    'Placeholder': {
                                        node: '.J_DepDate'
                                    },
                                    'Calendar'   : {
                                        triggerNode     : '.J_DepDate',
                                        minDate         : new Date(),
                                        isDateInfo      : 1,
                                        isDateIcon      : 1,
                                        afterDays       : 19,
                                        isKeyup         : false,
                                        isHoliday       : 1
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