KISSY.add(function (S , Tsearch , Thotelsearch){
    function initTabSearch(wapperId){

    };
    var TripSearch = {
            createFlightSearch : function (cfg){
                return new Tsearch({
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
                            storage         : false
                        });
            },
            createIflightSearch : function (cfg){
                return new Tsearch({
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
                            storage         : true
                        });
            },
            createHotelSearch : function (){
                    Thotelsearch({
                        form               : '#J_Pi_Search_HotelForm',
                        radio              : '.J_Radio',
                        HotelToCity        : '#J_Pi_Search_HotelToCity',
                        HotelDepDate       : '#J_Pi_Search_HotelDepDate',
                        HotelEndDate       : '#J_Pi_Search_HotelEndDate',
                        Omni               : '#J_Pi_Search_OmniCode',
                        HotelSearchKeywords: '#J_Pi_Search_HotelSearchKeywords'
                });
            },
            createLodgeSearch : function() {
                    Thotelsearch({
                        form               : '#J_Pi_Search_LodgeForm',
                        radioName          : '_fmd.h._0.r',
                        HotelToCity        : '#J_Pi_Search_LodgeToCity',
                        HotelDepDate       : '#J_Pi_Search_LodgeDepDate',
                        HotelEndDate       : '#J_Pi_Search_LodgeEndDate',
                        Omni               : '#J_Pi_Search_LodgeOmniCode',
                        HotelSearchKeywords: '#J_Pi_Search_LodgeSearchKeywords'
                });
            },
            createTravelSearch : function() {

                return new Tsearch({
                    form            : '#J_Pi_Search_dujia_form',
                    fields          : {
                        '#J_Pi_Search_dujia_depCity': {
                            widgets: {
                                'Placeholder'    : {
                                    node: '#J_Pi_Search_dujia_depCity'
                                },
                                'TripAutocomplete': {
                                    travel : {inputNode : '#J_Pi_Search_dujia_depCity'}
                                }
                            }
                        },
                        '#J_Pi_Search_dujia_arrCity': {
                            widgets   : {
                                'Placeholder'    : {
                                    node: '#J_Pi_Search_dujia_arrCity'
                                },
                                'TripAutocomplete': {
                                    travel : {inputNode      : '#J_Pi_Search_dujia_arrCity'}
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
                    validation_order: ['#J_Pi_Search_dujia_arrCity']
                })
            },
            createTicketSearch : function() {
                    return new Tsearch({
                        form            : '#J_Pi_Search_menpiao_form',
                        fields          : {
                            '#J_Pi_Search_menpiao_arrCity': {
                                widgets   : {
                                    'Placeholder': {
                                        node: '#J_Pi_Search_menpiao_arrCity'
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
                        validation_order: ['#J_Pi_Search_menpiao_arrCity']
                    })
                },
            createCarSearch : function() {
                return new Tsearch({
                    form            : '#J_Pi_Search_zuche_form',
                    fields          : {
                        '#J_Pi_Search_zuche_arrCity': {
                            widgets   : {
                                'Placeholder'    : {
                                    node : '#J_Pi_Search_zuche_arrCity'
                                },
                                'TripAutocomplete': {
                                    city :{inputNode : '#J_Pi_Search_zuche_arrCity'}
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
                    validation_order: ['#J_Pi_Search_zuche_arrCity']
                })
            },
            createTrainSearch : function (cfg){
            return new Tsearch({
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
                        storage         : true
                    });
        }
    };
    return TripSearch;
} , {requires : ['./tsearch' , './hotel-search' , 'node' , 'event' , 'base']});