(function(t){function e(e){for(var a,o,s=e[0],l=e[1],c=e[2],u=0,p=[];u<s.length;u++)o=s[u],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&p.push(r[o][0]),r[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);d&&d(e);while(p.length)p.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],a=!0,s=1;s<n.length;s++){var l=n[s];0!==r[l]&&(a=!1)}a&&(i.splice(e--,1),t=o(o.s=n[0]))}return t}var a={},r={app:0},i=[];function o(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=a,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)o.d(n,a,function(e){return t[e]}.bind(null,a));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/app-web-admin/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var c=0;c<s.length;c++)e(s[c]);var d=l;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var a=n("85ec"),r=n.n(a);r.a},"0bdd":function(t,e,n){},2469:function(t,e,n){"use strict";var a=n("24ee"),r=n.n(a);r.a},"24ee":function(t,e,n){},4287:function(t,e,n){"use strict";var a=n("a68c"),r=n.n(a);r.a},"56d7":function(t,e,n){"use strict";n.r(e);var a=n("2b0e"),r=n("5f5b");n("ab8b"),n("2dd8");a["default"].use(r["a"]);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},o=[],s=(n("034f"),n("2877")),l={},c=Object(s["a"])(l,i,o,!1,null,null,null),d=c.exports,u=n("8c4f"),p=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home"},[a("img",{attrs:{alt:"Logo",src:n("cf05")}}),a("Config")],1)},f=[],h=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"config"},[n("h1",[t._v("Configuration Panel")]),n("b-card",[n("b-form",{on:{submit:function(e){return e.preventDefault(),t.getConfig(e)}}},[n("b-form-group",{attrs:{"label-for":"address",label:"Config leader address"}},[n("b-form-input",{attrs:{required:"",pattern:"https?://\\S+",type:"text",name:"address",id:"address",placeholder:"https://lead.platform.com"},on:{input:t.resetFailureIndicators},model:{value:t.address,callback:function(e){t.address=e},expression:"address"}})],1),n("b-form-group",{attrs:{"label-for":"adminKey",label:"Admin key"}},[n("b-form-input",{attrs:{required:"",type:"text",name:"adminKey",id:"adminKey",placeholder:"admin key"},on:{input:t.resetFailureIndicators},model:{value:t.adminKey,callback:function(e){t.adminKey=e},expression:"adminKey"}})],1),n("b-button",{attrs:{variant:"success",type:"submit"}},[t._v("Load")])],1)],1),t.loadFailed?n("b-card",[n("div",{staticClass:"failure-msg"},[n("p",[t._v("Unable to retrieve configuration from server.")]),n("p",[t._v("Verify provided information or try again later.")])])]):t._e(),t.updateInProgress||t.loadInProgress?n("loader",{attrs:{loading:t.updateInProgress}}):t._e(),t.updateFailed?n("b-card",[n("div",{staticClass:"failure-msg"},[n("p",[t._v("Unable to update configuration.")]),n("p",[t._v("Verify provided information or try again later.")])])]):t._e(),n("br"),n("b-card",{attrs:{"no-body":""}},[0!==Object.keys(t.config).length?n("b-tabs",{attrs:{pills:"",justified:"",card:""}},t._l(t.config,(function(t,e){return n("b-tab",{key:e,attrs:{"title-link-class":"tab-title",title:t.name}},[n("ConfigTable",{attrs:{initialConfigSection:e}})],1)})),1):t._e()],1),0!==Object.keys(t.config).length?n("b-card",[n("b-button",{attrs:{variant:"success"},on:{click:t.updateConfig}},[t._v("Update ")])],1):t._e(),n("transition",{attrs:{name:"modal"}},[t.showModal?n("UpdateReportModal",{attrs:{updateReport:t.updateConfigReport},on:{updateReportModalClosed:function(e){t.showModal=!1}}}):t._e()],1)],1)},b=[],m=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"config-table"},[n("b-table",{attrs:{striped:"",hover:"","sticky-header":"19em",responsive:"",fixed:"","head-variant":"light",items:t.displayConfig},scopedSlots:t._u([{key:"cell(property)",fn:function(e){return[n("div",{staticClass:"tab-cell"},[t._v(t._s(e.item.property))])]}},{key:"cell(value)",fn:function(e){return[n("b-form-input",{on:{blur:function(n){return t.onValueChanged(n,e.item.property)}},model:{value:e.item.value,callback:function(n){t.$set(e.item,"value",n)},expression:"row.item.value"}})]}},{key:"cell(description)",fn:function(e){return[n("div",{staticClass:"tab-cell"},[t._v(t._s(e.item.description))])]}}])})],1)},g=[],v=a["default"].observable({state:{config:{}}}),y={name:"ConfigTable",props:{initialConfigSection:String},data:function(){return{configSection:this.initialConfigSection}},computed:{config:function(){return v.state.config[this.configSection].settings},displayConfig:function(){return Object.keys(this.config).map(function(t){const e=this.config[t].description?this.config[t].description:null;let n=this.config[t];return Object.prototype.hasOwnProperty.call(n,"value")&&(n=n.value),n||"boolean"===typeof n?"object"===typeof n?n=JSON.stringify(n):"string"!==typeof n&&(n=String(n)):n="",{property:t,value:n,description:e}}.bind(this))}},methods:{onValueChanged:function(t,e){let n=this.displayConfig.find(t=>t.property===e).value;this.isJSON(n)&&(n=JSON.parse(n)),this.config[e].value=n},isJSON:function(t){try{JSON.parse(t)}catch(e){return!1}return!0}}},_=y,C=(n("e053"),Object(s["a"])(_,m,g,!1,null,"2577618c",null)),O=C.exports,j=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("Modal",{on:{close:function(e){return t.$emit("updateReportModalClosed")}}},[n("h3",{attrs:{slot:"header"},slot:"header"},[t._v("Update report")]),n("div",{attrs:{slot:"body"},slot:"body"},[Object.keys(t.updateReport.successes).length>0?n("div",[n("h4",[t._v("Successes")]),n("b-table",{attrs:{hover:"",fixed:"","head-variant":"light",items:t.successes}})],1):t._e(),Object.keys(t.updateReport.failures).length>0?n("div",[n("h4",[t._v("Failures")]),n("b-table",{attrs:{hover:"",fixed:"","head-variant":"light",items:t.failures}})],1):t._e()])])},w=[],k=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"modal-mask"},[n("div",{staticClass:"modal-wrapper"},[n("div",{staticClass:"modal-container"},[n("div",{staticClass:"modal-header"},[t._t("header",[t._v(t._s(t.header))])],2),n("div",{staticClass:"modal-body"},[t._t("body",[t._v(t._s(t.body))])],2),n("div",{staticClass:"modal-footer"},[n("b-button",{on:{click:function(e){return t.$emit("close")}}},[t._v("OK")]),n("br")],1)])])])},x=[],S={name:"Modal",props:{header:String,body:String}},P=S,R=(n("4287"),Object(s["a"])(P,k,x,!1,null,"f4c87580",null)),$=R.exports,M={name:"UpdateReportModal",components:{Modal:$},props:{updateReport:{}},computed:{successes:function(){return Object.keys(this.updateReport.successes).map(function(t){return{url:this.updateReport.successes[t].url,role:this.updateReport.successes[t].role}}.bind(this))},function(){return Object.keys(this.updateReport.failures).map(function(t){return{url:this.updateReport.failures[t].url,role:this.updateReport.failures[t].role}}.bind(this))}}},F=M,I=(n("bfaf"),Object(s["a"])(F,j,w,!1,null,"33667266",null)),K=I.exports,E=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"loader-mask"},[n("div",{staticClass:"loader-wrapper"},[n("pulse-loader")],1)])},J=[],N=n("8a5d"),U={name:"Loader",components:{PulseLoader:N["a"]}},T=U,L=(n("7903"),Object(s["a"])(T,E,J,!1,null,"6c4ecc3b",null)),V=L.exports;const q=n("bc3a");var H={name:"Config",components:{ConfigTable:O,UpdateReportModal:K,Loader:V},data:()=>({address:"",adminKey:"",loadFailed:!1,updateFailed:!1,showModal:!1,updateConfigReport:{},updateInProgress:!1,loadInProgress:!1}),computed:{config:()=>v.state.config},methods:{isFormNotEmpty:function(){return!!this.address&&!!this.adminKey},getConfig:function(){this.isFormNotEmpty()&&(v.state.config={},this.loadInProgress=!0,q.get(`${this.address}/admin/settings?auth=${this.adminKey}`).then(t=>{if(!t.data||0===Object.keys(t.data).length)throw new Error;v.state.config=t.data}).catch(()=>{this.loadFailed=!0}).finally(()=>{this.loadInProgress=!1}))},updateConfig:function(){this.updateInProgress=!0,this.updateFailed=!1,q.put(`${this.address}/admin/settings?auth=${this.adminKey}`,v.state.config).then(()=>q.post(`${this.address}/admin/notify?auth=${this.adminKey}`)).then(t=>{if(!t.data||!Object.hasOwnProperty.call(t.data,"successes")||!Object.hasOwnProperty.call(t.data,"failures"))throw new Error;this.updateConfigReport=t.data,this.showModal=!0}).catch(()=>{this.updateFailed=!0}).finally(()=>{this.updateInProgress=!1})},resetFailureIndicators:function(){this.loadFailed=!1,this.updateFailed=!1}}},A=H,D=(n("9608"),Object(s["a"])(A,h,b,!1,null,"e6e9c0ee",null)),z=D.exports,B={name:"Home",components:{Config:z}},G=B,Q=(n("2469"),Object(s["a"])(G,p,f,!1,null,"e6e67724",null)),W=Q.exports;a["default"].use(u["a"]);const X=[{path:"/",name:"Home",component:W}],Y=new u["a"]({routes:X});var Z=Y;a["default"].config.productionTip=!1,new a["default"]({router:Z,render:t=>t(d)}).$mount("#app")},7903:function(t,e,n){"use strict";var a=n("0bdd"),r=n.n(a);r.a},"829d":function(t,e,n){},"82b6":function(t,e,n){},8507:function(t,e,n){},"85ec":function(t,e,n){},9608:function(t,e,n){"use strict";var a=n("8507"),r=n.n(a);r.a},a68c:function(t,e,n){},bfaf:function(t,e,n){"use strict";var a=n("82b6"),r=n.n(a);r.a},cf05:function(t,e,n){t.exports=n.p+"img/logo.54cacaa3.png"},e053:function(t,e,n){"use strict";var a=n("829d"),r=n.n(a);r.a}});
//# sourceMappingURL=app.39057d44.js.map