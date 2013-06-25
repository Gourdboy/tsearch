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
                                                tip : '����д��������'
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
                                                tip : '����д�������'
                                            },
                                            {
                                                type          : 'identical',
                                                identicalWidth: '#J_Pi_Search_jipiao_depCity',
                                                tip           : '����������в�����ͬ'
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
                                                tip : '����д��������'
                                            },
                                            {
                                                type: 'dateformat',
                                                tip : '��������ȷ�����ڸ�ʽ �磺2018-01-01'
                                            },
                                            {
                                                type   : 'mindate',
                                                minDate: '#J_Pi_Search_FlightDepDate',
                                                tip    : '�������ڲ������ڳ�������'
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
                                                tip : '����д��������'
                                            },
                                            {
                                                type: 'dateformat',
                                                tip : '��������ȷ�����ڸ�ʽ �磺2018-01-01'
                                            },
                                            {
                                                type   : 'mindate',
                                                minDate: new Date() - 86400000,
                                                tip    : '�������ڲ������ڽ���'
                                            }
                                        ],
                                        autoSwitch: {
                                            active   : true,
                                            nextField: '#J_Pi_Search_FlightArrDate'
                                        }
                                    }
                                },
                                /**
                                 * ��У��˳��
                                 */
                                validation_order: ['#J_Pi_Search_jipiao_depCity', '#J_Pi_Search_jipiao_arrCity', '#J_Pi_Search_FlightDepDate' , '#J_Pi_Search_FlightArrDate'],
                                /**
                                 * ������������л�����
                                 * @param trigger ������ťID
                                 * @param list ��Ҫ�����������ݵ������б� ,key �� value ��Ӧ��inputNode ����ֵ�Ľ���
                                 */
                                swapper         : {
                                    trigger: '#J_Pi_Search_FlightSwap',
                                    list   : {
                                        '#J_Pi_Search_jipiao_depCity'     : '#J_Pi_Search_jipiao_arrCity',
                                        '#J_Pi_Search_jipiao_depCity_code': '#J_Pi_Search_jipiao_arrCity_code'
                                    }
                                },
                                /**
                                 * ��Ʊר��:�����л�����
                                 * @param trigger ���������л���radio�ؼ���������
                                 * @param back_container ������������ڵ�����
                                 * @param back_input ���������
                                 */
                                switchSearchType: {
                                    trigger       : '#J_Pi_Search_FlightRadio',
                                    back_container: '#J_Pi_Search_FlightBackField',
                                    go_input      : '#J_Pi_Search_FlightDepDate',
                                    back_input    : '#J_Pi_Search_FlightArrDate'
                                },
                                /**
                                 * ����������ʷ��¼����  Ĭ�Ϲر�
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
                                            hotSource        : 'http://www.taobao.com/go/rgn/trip/chinahotcity_jsonp.php'//��ָ����û�������Ƽ�
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
                                        tip : '����д��������'
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
                                        tip : '����д�������'
                                    },
                                    {
                                        type          : 'identical',
                                        identicalWidth: '#J_Pi_Search_ijipiao_depCity',
                                        tip           : '����������в�����ͬ'
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
                                        tip : '����д��������'
                                    },
                                    {
                                        type: 'dateformat',
                                        tip : '��������ȷ�����ڸ�ʽ �磺2018-01-01'
                                    },
                                    {
                                        type   : 'mindate',
                                        minDate: '#J_Pi_Search_IFlightDepDate',
                                        tip    : '�������ڲ������ڳ�������'
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
                                        tip : '����д��������'
                                    },
                                    {
                                        type: 'dateformat',
                                        tip : '��������ȷ�����ڸ�ʽ �磺2018-01-01'
                                    },
                                    {
                                        type   : 'mindate',
                                        minDate: new Date() - 86400000,
                                        tip    : '�������ڲ������ڽ���'
                                    }
                                ],
                                autoSwitch: {
                                    active   : true,
                                    nextField: '#J_Pi_Search_IFlightArrDate'
                                }
                            }
                        },
                        /**
                         * ��У��˳��
                         */
                        validation_order: ['#J_Pi_Search_ijipiao_depCity', '#J_Pi_Search_ijipiao_arrCity', '#J_Pi_Search_IFlightDepDate' , '#J_Pi_Search_IFlightArrDate'],
                        /**
                         * ������������л�����
                         * @param trigger ������ťID
                         * @param list ��Ҫ�����������ݵ������б� ,key �� value ��Ӧ��inputNode ����ֵ�Ľ���
                         */
                        swapper         : {
                            trigger: '#J_Pi_Search_IFlightSwap',
                            list   : {
                                '#J_Pi_Search_ijipiao_depCity'     : '#J_Pi_Search_ijipiao_arrCity',
                                '#J_Pi_Search_ijipiao_depCity_code': '#J_Pi_Search_ijipiao_arrCity_code'
                            }
                        },
                        /**
                         * �����л�����
                         * @param trigger ���������л���radio�ؼ���������
                         * @param back_container ������������ڵ�����
                         * @param back_input ���������
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
                                        tip : '������Ŀ�ĵ�'
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
                                        tip : '����д�⳵����'
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