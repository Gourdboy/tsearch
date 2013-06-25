KISSY.add(function (S , Tsearch){
    var TripSearch = {
                createFlightSearch : function (){
                    return new Tsearch({
                                form            : '#J_Pi_Search_jipiao_form',
                                fields          : {
                                    '#J_Pi_Search_FlightRadio'        : {
                                        widgets: {
                                            'Tradio': {
                                                node: '#J_Pi_Search_FlightRadio',
                                                name: 'tripType'
                                            }
                                        }
                                    },
                                    '#J_Pi_Search_jipiao_depCity'     : {
                                        val       : '',
                                        widgets   : {
                                            'TripAutocomplete': {
                                                flight: {
                                                    inputNode: '#J_Pi_Search_jipiao_depCity',
                                                    codeInputNode : '#J_Pi_Search_jipiao_depCity_code'
                                                }
                                            },
                                            'Placeholder'    : {
                                                node: '#J_Pi_Search_jipiao_depCity'
                                            }
                                        },
                                        autoSwitch: {
                                            nextField: '#J_Pi_Search_jipiao_arrCity'
                                        },
                                        validation: [
                                            {
                                                type: 'required',
                                                when: 'blur',
                                                tip : '请填写出发城市'
                                            }
                                        ]
                                    },
                                    '#J_Pi_Search_jipiao_depCity_code': {

                                    },
                                    '#J_Pi_Search_jipiao_arrCity'     : {
                                        widgets   : {
                                            'TripAutocomplete': {
                                                flight: {
                                                    inputNode : '#J_Pi_Search_jipiao_arrCity',
                                                    codeInputNode : '#J_Pi_Search_jipiao_arrCity_code'
                                                }
                                            },
                                            'Placeholder'    : {
                                                node: '#J_Pi_Search_jipiao_arrCity'
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
                                                identicalWidth: '#J_Pi_Search_jipiao_depCity',
                                                tip           : '出发到达城市不能相同'
                                            }
                                        ]
                                    },
                                    '#J_Pi_Search_jipiao_arrCity_code': {

                                    },
                                    '#J_Pi_Search_FlightArrDate'      : {
                                        disabled  : true,
                                        widgets   : {
                                            'Placeholder': {
                                                node: '#J_Pi_Search_FlightArrDate'
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
                                                minDate: '#J_Pi_Search_FlightDepDate',
                                                tip    : '返程日期不能早于出发日期'
                                            }
                                        ]
                                    },
                                    '#J_Pi_Search_FlightDepDate'      : {
                                        widgets   : {
                                            'Placeholder': {
                                                node: '#J_Pi_Search_FlightDepDate'
                                            },
                                            'Calendar'   : {
                                                triggerNode     : '#J_Pi_Search_FlightDepDate',
                                                finalTriggerNode: '#J_Pi_Search_FlightArrDate',
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
                                            nextField: '#J_Pi_Search_FlightArrDate'
                                        }
                                    }
                                },
                                /**
                                 * 表单校验顺序
                                 */
                                validation_order: ['#J_Pi_Search_jipiao_depCity', '#J_Pi_Search_jipiao_arrCity', '#J_Pi_Search_FlightDepDate' , '#J_Pi_Search_FlightArrDate'],
                                /**
                                 * 出发到达城市切换配置
                                 * @param trigger 交换按钮ID
                                 * @param list 需要交换数据内容的容器列表 ,key 和 value 对应的inputNode 进行值的交换
                                 */
                                swapper         : {
                                    trigger: '#J_Pi_Search_FlightSwap',
                                    list   : {
                                        '#J_Pi_Search_jipiao_depCity'     : '#J_Pi_Search_jipiao_arrCity',
                                        '#J_Pi_Search_jipiao_depCity_code': '#J_Pi_Search_jipiao_arrCity_code'
                                    }
                                },
                                /**
                                 * 机票专用:往返切换配置
                                 * @param trigger 触发往返切换的radio控件所在容器
                                 * @param back_container 返程输入框所在的容器
                                 * @param back_input 返程输入框
                                 */
                                switchSearchType: {
                                    trigger       : '#J_Pi_Search_FlightRadio',
                                    back_container: '#J_Pi_Search_FlightBackField',
                                    go_input      : '#J_Pi_Search_FlightDepDate',
                                    back_input    : '#J_Pi_Search_FlightArrDate'
                                },
                                /**
                                 * 保存搜索历史记录开关  默认关闭
                                 */
                                storage         : true
                            });
                },
                createIflightSearch : function (){
                    return new Tsearch({
                        form            : '#J_Pi_Search_ijipiao_form',
                        fields          : {
                            '#J_Pi_Search_IFlightRadio'        : {
                                widgets: {
                                    'Tradio': {
                                        node: '#J_Pi_Search_IFlightRadio',
                                        name: '_fmie.ie._0.t'
                                    }
                                }
                            },
                            '#J_Pi_Search_ijipiao_depCity'     : {
                                widgets   : {
                                    'TripAutocomplete': {
                                        iflight : {
                                            inputNode    : '#J_Pi_Search_ijipiao_depCity',
                                            codeInputNode: '#J_Pi_Search_ijipiao_depCity_code',
                                            hotSource        : 'http://www.taobao.com/go/rgn/trip/chinahotcity_jsonp.php'//不指定及没有热门推荐
                                        }
                                    },
                                    'Placeholder'    : {
                                        node: '#J_Pi_Search_ijipiao_depCity'
                                    }
                                },
                                autoSwitch: {
                                    active   : true,
                                    nextField: '#J_Pi_Search_ijipiao_arrCity'
                                },
                                validation: [
                                    {
                                        type: 'required',
                                        when: 'blur',
                                        tip : '请填写出发城市'
                                    }
                                ]
                            },
                            '#J_Pi_Search_ijipiao_depCity_code': {

                            },
                            '#J_Pi_Search_ijipiao_arrCity'     : {
                                widgets   : {
                                    'TripAutocomplete': {
                                        iflight : {
                                            inputNode    : '#J_Pi_Search_ijipiao_arrCity',
                                            codeInputNode: '#J_Pi_Search_ijipiao_arrCity_code'
                                        }
                                    },
                                    'Placeholder'    : {
                                        node: '#J_Pi_Search_ijipiao_arrCity'
                                    }
                                },
                                validation: [
                                    {
                                        type: 'required',
                                        tip : '请填写到达城市'
                                    },
                                    {
                                        type          : 'identical',
                                        identicalWidth: '#J_Pi_Search_ijipiao_depCity',
                                        tip           : '出发到达城市不能相同'
                                    }
                                ]
                            },
                            '#J_Pi_Search_ijipiao_arrCity_code': {

                            },
                            '#J_Pi_Search_IFlightArrDate'      : {
                                disabled  : true,
                                widgets   : {
                                    'Placeholder': {
                                        node: '#J_Pi_Search_IFlightArrDate'
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
                                        minDate: '#J_Pi_Search_IFlightDepDate',
                                        tip    : '返程日期不能早于出发日期'
                                    }
                                ]
                            },
                            '#J_Pi_Search_IFlightDepDate'      : {
                                widgets   : {
                                    'Placeholder': {
                                        node: '#J_Pi_Search_IFlightDepDate'
                                    },
                                    'Calendar'   : {
                                        triggerNode     : '#J_Pi_Search_IFlightDepDate',
                                        finalTriggerNode: '#J_Pi_Search_IFlightArrDate',
                                        minDate         : new Date(),
                                        isDateInfo      : 1,
                                        isDateIcon      : 1,
                                        isKeyup         : false,
                                        afterDays       : 364,
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
                                    nextField: '#J_Pi_Search_IFlightArrDate'
                                }
                            }
                        },
                        /**
                         * 表单校验顺序
                         */
                        validation_order: ['#J_Pi_Search_ijipiao_depCity', '#J_Pi_Search_ijipiao_arrCity', '#J_Pi_Search_IFlightDepDate' , '#J_Pi_Search_IFlightArrDate'],
                        /**
                         * 出发到达城市切换配置
                         * @param trigger 交换按钮ID
                         * @param list 需要交换数据内容的容器列表 ,key 和 value 对应的inputNode 进行值的交换
                         */
                        swapper         : {
                            trigger: '#J_Pi_Search_IFlightSwap',
                            list   : {
                                '#J_Pi_Search_ijipiao_depCity'     : '#J_Pi_Search_ijipiao_arrCity',
                                '#J_Pi_Search_ijipiao_depCity_code': '#J_Pi_Search_ijipiao_arrCity_code'
                            }
                        },
                        /**
                         * 往返切换配置
                         * @param trigger 触发往返切换的radio控件所在容器
                         * @param back_container 返程输入框所在的容器
                         * @param back_input 返程输入框
                         */
                        switchSearchType: {
                            trigger       : '#J_Pi_Search_IFlightRadio',
                            back_container: '#J_Pi_Search_IFlightBackField',
                            go_input      : '#J_Pi_Search_IFlightDepDate',
                            back_input    : '#J_Pi_Search_IFlightArrDate'
                        },
                        storage         : true

                    });
                },
                createHotelSearch : function (){
                    S.use('pi/tsearch/1.0/hotel-search', function (S , Thotelsearch) {
                        Thotelsearch({
                            form               : '#J_Pi_Search_HotelForm',
                            radio              : '#J_Pi_Search_HotelLocationRadio',
                            radioName          : '_fmd.h._0.r',
                            HotelToCity        : '#J_Pi_Search_HotelToCity',
                            HotelDepDate       : '#J_Pi_Search_HotelDepDate',
                            HotelEndDate       : '#J_Pi_Search_HotelEndDate',
                            Omni               : '#J_Pi_Search_OmniCode',
                            HotelSearchKeywords: '#J_Pi_Search_HotelSearchKeywords'
                        })
                    });
                },
                createLodgeSearch : function() {
                    S.use('pi/tsearch/1.0/hotel-search', function (S , Thotelsearch) {
                        Thotelsearch({
                            form               : '#J_Pi_Search_LodgeForm',
                            radioName          : '_fmd.h._0.r',
                            HotelToCity        : '#J_Pi_Search_LodgeToCity',
                            HotelDepDate       : '#J_Pi_Search_LodgeDepDate',
                            HotelEndDate       : '#J_Pi_Search_LodgeEndDate',
                            Omni               : '#J_Pi_Search_LodgeOmniCode',
                            HotelSearchKeywords: '#J_Pi_Search_LodgeSearchKeywords'
                        })
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
                }
            };
    return TripSearch;
} , {requires : ['./tsearch' , 'node' , 'event' , 'base']});