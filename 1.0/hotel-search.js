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
        if (config.radio) {
            fields[config.radio] = {
                widgets: {
                    'Tradio': {
                        node : config.radio,
                        name : config.radioName
                    }
                }
            };
        }
        fields[config.HotelToCity] = {
            widgets   : {
                'TripAutocomplete': {
                    hotel : {
                        inputNode        : config.HotelToCity,
                        codeInputNode    : config.Omni
                    }
                },
                'Placeholder'    : {
                    node: config.HotelToCity
                }
            },
            validation: [
                {
                    type: 'required',
                    tip : '������ס����'
                }
            ]
        };
        fields[config.Omni] = {};
        fields[config.HotelDepDate] = {
            val       : defaultInDate,
            widgets   : {
                'Placeholder': {
                    node: config.HotelDepDate
                },
                'Calendar'   : {
                    triggerNode     : config.HotelDepDate,
                    finalTriggerNode: config.HotelEndDate,
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
                    tip : '������ס����'
                },
                {
                    type: 'dateformat',
                    tip : '��������ȷ�����ڸ�ʽ �磺2018-01-01'
                },
                {
                    type   : 'mindate',
                    minDate: new Date() - 86400000,
                    tip    : '��ס���ڲ������ڽ���'
                }
            ],
            autoSwitch: {
                nextField: config.HotelEndDate
            }
        };
        fields[config.HotelEndDate] = {
            val       : defaultEndDate,
            widgets   : {
                'Placeholder': {
                    node : config.HotelEndDate
                }
            },
            validation: [
                {
                    type: 'required',
                    tip : '����д�������'
                },
                {
                    type: 'dateformat',
                    tip : '��������ȷ�����ڸ�ʽ �磺2018-01-01'
                },
                {
                    type   : 'mindate',
                    minDate: config.HotelDepDate,
                    tip    : '������ڲ���������ס���ڣ�������ѡ��'
                },
                {
                    type      : 'custom',
                    tip       : '�Ƶ�Ԥ��ʱ�䲻�ܳ���28�죬������ѡ��',
                    validateFn: function (arg, that) {
                        return Common.getDateInterval(that.fields[config.HotelDepDate].node.val(), this.node.val()) <= 28
                    }
                }
            ]
        };
        fields[config.HotelSearchKeywords] = {
            widgets: {
                'Placeholder': {
                    node: config.HotelSearchKeywords
                }
            }
        };
        var hotelSearch = new Tsearch({
            'form'            : config.form,
            'fields'          : fields,
            /**
             * ��У��˳��
             */
            'validation_order': [config.HotelToCity, config.HotelDepDate, config.HotelEndDate]
        });
        //�Ƶ���radioʱ�����л�
        var endDateField = hotelSearch.fields[config.HotelEndDate];
        if (endDateField.Calendar) {//hack for calendar
            endDateField.Calendar.currentNode = endDateField.node;
            endDateField.Calendar._setDateInfo(endDateField.node.get('value'));
        }
        if (!config.radio) {
            return hotelSearch;
        }
        var bindRadioSwitch = function () {
            var Tradio = hotelSearch.fields[config.radio].Tradio;
            var field = hotelSearch.get('fields')[config.HotelToCity],
                Autocomplete = field.TripAutocomplete;
            Tradio.on('afterValueChange', function (e) {
                field.node.val('');
                if (e.newVal === '0') {//����
                    Autocomplete.set('source', DESTINATION_SOURCE.cn);
                    Autocomplete.set('hotSource', DESTINATION_SOURCE.cnHot);
                } else {//����
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