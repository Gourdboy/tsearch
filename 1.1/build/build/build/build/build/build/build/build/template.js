/*
combined files : 

gallery/tsearch/1.1/build/template

*/
/*
combined files : 

gallery/tsearch/1.1/build/template

*/
/*
combined files : 

gallery/tsearch/1.1/build/template

*/
/*
combined files : 

gallery/tsearch/1.1/build/template

*/
/*
combined files : 

gallery/tsearch/1.1/build/template

*/
/*
combined files : 

gallery/tsearch/1.1/build/template

*/
/*
combined files : 

gallery/tsearch/1.1/build/template

*/
KISSY.add('gallery/tsearch/1.1/build/template',function (S){
    return {
        searchTemplate : '<div class="mod-search" id="J_Pi_Search_SearchModule"><div class="search-hd"><div class="search-nav"><ul class="J_Pi_Search_SearchTabNav"><li class="swing-slice-indicator J_Pi_Search_NavItemFlight selected"><s class="search-nav-flight"></s><a href="http://trip.taobao.com/jipiao" hidefocus="true">国内机票</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemIFlight"><s class="search-nav-iflight"></s><a href="http://trip.taobao.com/ijipiao" hidefocus="true">国际 &#8226 港澳台</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemHotel"><s class="search-nav-hotel"></s><a href="http://trip.taobao.com/jiudian" hidefocus="true">酒店</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemLodge"><s class="search-nav-lodge"></s><a href="http://trip.taobao.com/kezhan" hidefocus="true">客栈</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemTicket"><s class="search-nav-ticket"></s><a href="http://trip.taobao.com/menpiao" hidefocus="true">景点门票</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemTravel"><s class="search-nav-travel"></s><a href="http://trip.taobao.com/dujia" hidefocus="true">旅游度假</a></li><li class="swing-slice-indicator J_Pi_Search_NavItemCar"><s class="search-nav-car"></s><a href="http://trip.taobao.com/zuche" hidefocus="true">租车</a></li></ul></div></div><div class="search-bd"><div class="search-item swing-slice J_Pi_Search_TabPannel"><form method="get" target="_blank" action="http://s.jipiao.trip.taobao.com/flight_search_result.htm"class="search-form search-jipiao" id="J_Pi_Search_jipiao_form"><a href="javascript:void(0)" target="_self" class="search-trade" id="J_Pi_Search_FlightSwap">互换出发到达城市</a><fieldset><input type="hidden" name="spm" value="181.1113091.a1z0v.1"/><div class="search-field"><label class="search-item-intro search-tit">出发城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="depCityName" id="J_Pi_Search_jipiao_depCity" placeholder="城市名" value=""/><input name="depCity" type="hidden" id="J_Pi_Search_jipiao_depCity_code" data-trade="J_Pi_Search_jipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">到达城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="arrCityName"id="J_Pi_Search_jipiao_arrCity" placeholder="城市名" value="" data-description="到达城市"/><input name="arrCity" type="hidden" id="J_Pi_Search_jipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">航程类型：</label><div class="search-inputarea"><div class="search-radio" id="J_Pi_Search_FlightRadio"><label for="J_Pi_Search_jipiao_FlightTypeRadio_1" class="flight-type-radio first-label"><input type="radio" name="tripType" id="J_Pi_Search_jipiao_FlightTypeRadio_1" class="J_Pi_Search_type_radio" value="0" checked="checked"/>单程</label><label for="J_Pi_Search_jipiao_FlightTypeRadio_2" class="flight-type-radio last-label"><input type="radio" name="tripType" id="J_Pi_Search_jipiao_FlightTypeRadio_2" class="J_Pi_Search_type_radio" value="1"/>往返</label></div></div></div><div class="search-field"><label class="search-item-intro search-tit">出发日期：</label><div class="search-inputarea"><input type="text" class="search-input required dateformat J_Pi_Search_DateInput J_Pi_Search_depDate" name="depDate" id="J_Pi_Search_FlightDepDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-field disabled" id="J_Pi_Search_FlightBackField"><label class="search-item-intro search-tit">返程日期：</label><div class="search-inputarea"><input type="text" class="search-input J_Pi_Search_DateInput J_Pi_Search_endDate" name="arrDate" maxlength="10" id="J_Pi_Search_FlightArrDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" action="http://s.ijipiao.trip.taobao.com/ie/flight_search.htm"class="search-form search-jipiao" id="J_Pi_Search_ijipiao_form"><input type="hidden" name="spm" value="181.1113091.a1z0v.2"/><a href="javascript:void(0)" target="_self" class="search-trade" id="J_Pi_Search_IFlightSwap">互换出发到达城市</a><fieldset><div class="search-field"><label class="search-item-intro search-tit">出发城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="_fmie.ie._0.st"id="J_Pi_Search_ijipiao_depCity" placeholder="城市名" value=""data-trade="J_Pi_Search_ijipiao_arrCity" data-autotab="J_Pi_Search_ijipiao_arrCity"data-description="出发城市"/><input name="_fmie.ie._0.s" type="hidden" id="J_Pi_Search_ijipiao_depCity_code"data-trade="J_Pi_Search_ijipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">到达城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="_fmie.ie._0.en"id="J_Pi_Search_ijipiao_arrCity" placeholder="城市名" value="" data-description="到达城市"/><input name="_fmie.ie._0.e" type="hidden" id="J_Pi_Search_ijipiao_arrCity_code"/></div></div><div class="search-field"><label class="search-item-intro search-tit">航程类型：</label><div class="search-inputarea"><div class="search-radio" id="J_Pi_Search_IFlightRadio"><label for="J_Pi_Search_ijipiao_FlightTypeRadio_1" class="flight-type-radio first-label"><input type="radio" name="_fmie.ie._0.t" id="J_Pi_Search_ijipiao_FlightTypeRadio_1" class="J_Pi_Search_type_radio" value="0"/>单程</label><label for="J_Pi_Search_ijipiao_FlightTypeRadio_2" class="flight-type-radio last-label"><input type="radio" name="_fmie.ie._0.t" id="J_Pi_Search_ijipiao_FlightTypeRadio_2" class="J_Pi_Search_type_radio" value="1" checked="checked"/>往返</label></div></div></div><div class="search-field"><label class="search-item-intro search-tit">出发日期：</label><div class="search-inputarea"><input type="text" class="search-input required dateformat J_Pi_Search_DateInput J_Pi_Search_depDate" name="_fmie.ie._0.sta" id="J_Pi_Search_IFlightDepDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-field" id="J_Pi_Search_IFlightBackField"><label class="search-item-intro search-tit">返程日期：</label><div class="search-inputarea"><input type="text" class="search-input J_Pi_Search_DateInput J_Pi_Search_endDate J_Pi_Search_ieEndDate required" name="_fmie.ie._0.end" id="J_Pi_Search_IFlightArrDate" placeholder="yyyy-mm-dd" value="" autocomplete="off" /></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" id="J_Pi_Search_HotelForm" action="http://kezhan.trip.taobao.com/hotel_list2.htm" class="search-form search-jiudian"><input type="hidden" name="spm" value="181.1113091.a1z0v.3"/><input type="hidden" id="J_Pi_Search_HotelSearchAction" name="action" value="hotel_list_action2"/><input type="hidden" id="J_Pi_Search_HotelSearchDoSearch" name="event_submit_do_search" value="submit"/><fieldset><div class="search-field"><div class="search-radio" id="J_Pi_Search_HotelLocationRadio"><label for="J_Pi_Search_HotelLocal" class="first-label"><input id="J_Pi_Search_HotelLocal" type="radio" value="0" name="_fmd.h._0.r" checked="checked" class="flight-type-radio">国内/港澳台</label><label for="J_Pi_Search_HotelInternational" class="last-label"><input id="J_Pi_Search_HotelInternational" type="radio" value="1" name="_fmd.h._0.r" class="flight-type-radio">海外</label></div></div><div class="search-field"><label class="search-item-intro search-tit J_Pi_Search_HotelToPlaceIndicator">目的城市：</label><div class="search-inputarea"><input type="text" class="search-input required" id="J_Pi_Search_HotelToCity"placeholder="城市名" name="city" value="" data-description="目的城市"/><input name="c" type="hidden" id="J_Pi_Search_OmniCode" value=""/></div></div><div class="search-field"><label class="search-item-intro search-tit">入住日期：</label><div class="search-inputarea"><div id="J_Pi_Search_jiudian_depDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_depDate"name="_fmd.h._0.ch" id="J_Pi_Search_HotelDepDate" placeholder="yyyy-mm-dd"value="" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">离店日期：</label><div class="search-inputarea"><div id="J_Pi_Search_jiudian_endDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_endDate"name="_fmd.h._0.che" id="J_Pi_Search_HotelEndDate" placeholder="yyyy-mm-dd"value="" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">　关键字：</label><div class="search-inputarea"><input type="text" class="search-input" name="_fmd.h._0.n" id="J_Pi_Search_HotelSearchKeywords" placeholder="输入酒店名、商圈、地标等" value=""/></div></div><div class="search-submitarea"><button type="submit" class="J_Pi_Search_HotelListSearch search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" id="J_Pi_Search_LodgeForm" action="http://kezhan.trip.taobao.com/hotel_list2.htm" class="search-form search-jiudian"><input type="hidden" name="spm" value="181.1113091.a1z0v.4"/><input type="hidden" id="J_Pi_Search_LodgeSearchAction" name="action" value="hotel_list_action2"/><input type="hidden" id="J_Pi_Search_LodgeSearchDoSearch" name="event_submit_do_search" value="submit"/><input type="hidden" name="from" value="kezhan"/><input type="hidden" name="searchBy" value="trip-kezhan"/><input type="hidden" name="_fmd.h._0.l" value="0"/><fieldset><div class="search-field"><label class="search-item-intro search-tit J_Pi_Search_HotelToPlaceIndicator">目的城市：</label><div class="search-inputarea"><input type="text" class="search-input required" id="J_Pi_Search_LodgeToCity"placeholder="城市名" name="city" value="" data-description="目的城市"/><input name="c" type="hidden" id="J_Pi_Search_LodgeOmniCode" value=""/><input type="text" class="search-input required hidden" id="J_Pi_Search_LodgeToOversea"placeholder="城市名" value="" data-description="目的城市"/></div></div><div class="search-field"><label class="search-item-intro search-tit">入住日期：</label><div class="search-inputarea"><div id="J_Pi_Search_LodgeDepDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_depDate"name="_fmd.h._0.ch" id="J_Pi_Search_LodgeDepDate" placeholder="yyyy-mm-dd"value="" data-autotab="J_Pi_Search_LodgeEndDate" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">离店日期：</label><div class="search-inputarea"><div id="J_Pi_Search_LodgeEndDateBox" class="cal-input"><input type="text" class="search-input required dateformat J_Pi_Search_endDate"name="_fmd.h._0.che" id="J_Pi_Search_LodgeEndDate" placeholder="yyyy-mm-dd"value="" autocomplete="off"/></div></div></div><div class="search-field"><label class="search-item-intro search-tit">　关键字：</label><div class="search-inputarea"><input type="text" class="search-input" name="_fmd.h._0.n" id="J_Pi_Search_LodgeSearchKeywords" placeholder="输入酒店名、商圈、地标等" value=""/></div></div><div class="search-submitarea"><button type="submit" class="J_Pi_Search_HotelListSearch search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" action="http://s.taobao.com/search?commend=all&tab=coefp&cd=false&ssid=s5-e&fs=1&bcoffset=2&cat=50037979&from=compass&navlog=compass-1-c-50037979" class="search-form search-menpiao" target="_blank" id="J_Pi_Search_menpiao_form"><fieldset><input type="hidden" name="cat" value="50037979"/><input type="hidden" name="spm" value="181.1113091.a1z0v.5"/><div class="search-field"><label class="search-tit">搜索门票：</label><div class="search-inputarea"><input type="text" class="search-input required" name="q" id="J_Pi_Search_menpiao_arrCity" placeholder="景点名或城市名" value=""/></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" target="_blank" id="J_Pi_Search_dujia_form" action="http://dujia.trip.taobao.com/search.htm"class="search-form search-dujia"><fieldset><input type="hidden" name="spm" value="181.1113091.a1z0v.6"/><div class="search-field"><label class="search-item-intro search-tit">出发城市：</label><div class="search-inputarea"><input type="text" class="search-input required" name="cq" id="J_Pi_Search_dujia_depCity"placeholder="城市名" value=""/></div></div><div class="search-field"><label class="search-item-intro search-tit">　目的地：</label><div class="search-inputarea"><input type="text" class="search-input required" name="mq" id="J_Pi_Search_dujia_arrCity"placeholder="景点名或城市名" value=""/></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div><div class="search-item swing-slice J_Pi_Search_TabPannel hidden"><form method="get" action="http://s.taobao.com/search?commend=all&tab=coefp&cd=false&ssid=s5-e&fs=1&bcoffset=1&bcoffset=2&cat=50036351&from=compass&navlog=compass-7-c-50036351" class="search-form search-zuche" target="_blank" id="J_Pi_Search_zuche_form"><fieldset><input type="hidden" name="cat" value="50036351"/><input type="hidden" name="spm" value="181.1113091.a1z0v.7"/><div class="search-field"><div class="search-inputarea"><label class="search-item-intro search-tit" for="J_Pi_Search_zuche_arrCity">租车城市：</label><input type="text" class="search-input required" name="q" id="J_Pi_Search_zuche_arrCity"placeholder="城市名" value=""/></div></div><div class="search-submitarea"><button type="submit" class="search-submit-btn">搜索</button></div></fieldset></form></div></div></div>'
    }
})






