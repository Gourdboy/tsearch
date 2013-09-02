/*
combined files : 

gallery/tsearch/1.1/build/common-min

*/
/*
combined files : 

gallery/tsearch/1.1/build/common-min

*/
/*
combined files : 

gallery/tsearch/1.1/build/common-min

*/
/*! tsearch - v1.1 - 2013-08-19 11:04:50 AM
* Copyright (c) 2013 舒克; Licensed  */
KISSY.add('gallery/tsearch/1.1/build/common-min',function(){var a={subString:function(a,b){var c=/[^\x00-\xff]/g;if(!a)return"";if(a.replace(c,"mm").length<=b)return a;for(var d=Math.floor(b/2),e=d;e<a.length;e++)if(a.substr(0,e).replace(c,"mm").length>=b)return a.substr(0,e);return a},stringLen:function(a){return a?a.replace(/[^\x00-\xff]/g,"rr").length:""},cutStr:function(b,c,d){return d=d||"...",a.stringLen(b)>c?a.subString(b,c-4)+d:b},buildObjCutAttr:function(b,c,d){b[c+"_sub"]=a.cutStr(b[c],d)},singleDateToDouble:function(a){return a.toString().length>1?a.toString():"0"+a.toString()},strToDate:function(a){var b=a.split("-");return new Date(b[0],b[1]-1,b[2])},getDateInterval:function(b,c){return parseInt(Math.abs(a.strToDate(c)-a.strToDate(b))/1e3/60/60/24)},formatDate:function(b){var c=new Date(b),d=a.singleDateToDouble,e=c.getFullYear(),f=d(c.getMonth()+1),g=d(c.getDate()),h=d(c.getHours()),i=d(c.getMinutes());return{mmdd:f+"-"+g,yymmdd:e+"-"+f+"-"+g,hhMM:h+":"+i,yy:e,mm:f,dd:g,hh:h,MM:i}},setDate:function(a,b){return new Date(a.getTime()+864e5*b)},timeToDuration:function(a){a/=1e3;var b=Math.floor(a/3600),c=Math.floor((a-3600*b)/60),d=a%60;return{h:b,s:c,m:d}},html2text:function(a){var b=document.createElement("div");b.innerHTML=a;try{return"string"==typeof b.innerText?b.innerText:b.textContent}catch(c){return a}}};return a});


