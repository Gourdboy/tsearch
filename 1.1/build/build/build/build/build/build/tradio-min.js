/*
combined files : 

gallery/tsearch/1.1/tradio

*/
/*
combined files : 

gallery/tsearch/1.1/tradio

*/
/*
combined files : 

gallery/tsearch/1.1/tradio

*/
/*
combined files : 

gallery/tsearch/1.1/tradio

*/
/*
combined files : 

gallery/tsearch/1.1/tradio

*/
/*! tsearch - v1.1 - 2013-08-23 3:56:59 PM
* Copyright (c) 2013 舒克; Licensed  */
KISSY.add("gallery/tsearch/1.1/tradio",function(a){function b(){b.superclass.constructor.apply(this,arguments),this.initializer()}return a.extend(b,a.Base,{initializer:function(){var a=this.node=this.get("node"),b=this;this.items={},this.radios=a.all("input"),this.radios.each(function(a){var c={input:a};c.label=a.parent("label"),b.items[a.val()]=c}),this.bindUI(),this.set("value",this.val())},bindUI:function(){this.node.delegate("click","label",function(b){var c=a.one(b.currentTarget),d=c.one("input");d.prop("checked",!0),this.set("value",d.val())},this),this.on("afterValueChange",this._syncUI,this)},_syncUI:function(a){var b=this.items,c=b[a.newVal],d=b[a.prevVal],e=this.get("selectedClass");d&&d.label.removeClass(e),c&&c.label.addClass(e)},val:function(){return arguments.length<1?this._getValue():this._setValue.apply(this,arguments)},_getValue:function(){var a=this.node.one("input:checked");return a?a.val():void 0},_setValue:function(a){var b=this.items[a];b&&(b.input.attr("checked",!0),this.set("value",a))}},{ATTRS:{node:{value:"",setter:function(b){return b instanceof a.NodeList?b:a.one(b)}},name:{value:""},selectedClass:{value:"selected"},value:{value:null}}}),b},{requires:["node","event","base","sizzle"]});




