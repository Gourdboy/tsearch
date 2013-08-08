KISSY.add(function (S , Tsearch ,Common) {
    var DESTINATION_SOURCE = {
            cn        : 'http://kezhan.trip.taobao.com/citysuggest.do?t=0&q={query}',
            cnHot     : 'http://www.taobao.com/go/rgn/trip/hotelhotcityv2_jsonp.php',
            oversea   : 'http://kezhan.trip.taobao.com/citysuggest.do?t=1&q={query}',
            overseaHot: 'http://www.taobao.com/go/rgn/trip/hotoverseav2_jsonp.php'
        };

    var defaultInDate = Common.formatDate(Common.setDate(new Date(), 3)).yymmdd,
        defaultEndDate = Common.formatDate(Common.setDate(new Date(), 4)).yymmdd;
    var Thotelsearch = function (config) {
        var fields = {};
        if ('.J_Radio') {
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
                        codeInputNode    : config.Omni
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
        if (!'.J_Radio') {
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