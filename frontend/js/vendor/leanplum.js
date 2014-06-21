/*
 Leanplum Javascript SDK v1.1.5.
 Copyright 2014, Leanplum, Inc. All rights reserved.
*/
(function(){function r(a,b,d,q){if(a===b)return 0!==a||1/a==1/b;if(null==a||null==b)return a===b;a instanceof m&&(a=a.oa);b instanceof m&&(b=b.oa);var k=Object.prototype.toString.call(a);if(k!=Object.prototype.toString.call(b))return!1;switch(k){case "[object String]":return a==String(b);case "[object Number]":return a!=+a?b!=+b:0==a?1/a==1/b:a==+b;case "[object Date]":case "[object Boolean]":return+a==+b;case "[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&
a.ignoreCase==b.ignoreCase}if("object"!=typeof a||"object"!=typeof b)return!1;for(var g=d.length;g--;)if(d[g]==a)return q[g]==b;d.push(a);q.push(b);var g=0,e=!0;if("[object Array]"==k){if(g=a.length,e=g==b.length)for(;g--&&(e=r(a[g],b[g],d,q)););}else{var k=a.constructor,h=b.constructor;if(k!==h&&!(m.U(k)&&k instanceof k&&m.U(h)&&h instanceof h))return!1;for(var f in a)if(m.C(a,f)&&(g++,!(e=m.C(b,f)&&r(a[f],b[f],d,q))))break;if(e){for(f in b)if(m.C(b,f)&&!g--)break;e=!g}}d.pop();q.pop();return e}
function s(){this.B=this.A=!1}function n(){this.j="";this.Q={}}function m(){}var e={};this.Leanplum||(this.Leanplum=e);var t="https://www.leanplum.com/api",u="dev.leanplum.com",v=10,b={ba:!0,N:[],o:[],i:[],G:{},w:"",H:!0,r:5};e.setApiPath=function(a){t=a};e.setEmail=function(a){b.va=a};e.setUpdateCheckingEnabledInDevelopmentMode=function(a){b.ba=a};e.setNetworkTimeout=function(a){v=a};e.setAppIdForDevelopmentMode=function(a,c){b.q=a;b.u=c;b.k=!0};e.setAppIdForProductionMode=function(a,c){b.q=a;b.u=
c;b.k=!1};e.setSocketHost=function(a){u=a};e.setDeviceId=function(a){b.h=a};e.setAppVersion=function(a){b.na=a};e.setDeviceName=function(a){b.da=a};e.setDeviceModel=function(a){b.ca=a};e.setSystemName=function(a){b.la=a};e.setSystemVersion=function(a){b.ma=a};e.setVariables=function(a){b.P=a;if(b.k){var c={};c.vars=a;b.e("setVars",(new n).body(JSON.stringify(c)),{l:!0})}};e.setRequestBatching=function(a,c){b.H=a;b.r=c};e.getVariables=function(){return void 0!==b.M?b.M:b.P};e.getVariable=function(a){for(var b=
e.getVariables,d=0;d<arguments.length;d++)b=b[arguments[d]];return b};e.addStartResponseHandler=function(a){b.i.push(a);b.L&&a(b.n)};e.addVariablesChangedHandler=function(a){b.o.push(a);b.ga&&a()};e.removeStartResponseHandler=function(a){a=b.i.indexOf(a);0<=a&&b.i.splice(a,1)};e.removeVariablesChangedHandler=function(a){a=b.o.indexOf(a);0<=a&&b.o.splice(a,1)};e.start=function(a,c,d){"function"==typeof a?(d=a,c={},a=null):"object"==typeof a&&null!==a&&void 0!==a?(d=c,c=a,a=null):"function"==typeof c&&
(d=c,c={});b.f=a;d&&e.addStartResponseHandler(d);b.e("start",(new n).add("userAttributes",JSON.stringify(c)).add("country","(detect)").add("region","(detect)").add("city","(detect)").add("location","(detect)").add("systemName",b.la||p.Z).add("systemVersion",""+(b.ma||"")).add("browserName",p.S).add("browserVersion",""+p.version).add("locale","(detect)").add("deviceName",b.da||p.S+" "+p.version).add("deviceModel",b.ca||"Web Browser").add("includeDefaults",!1),{d:!0,l:!0,response:function(a){b.L=!0;
a=b.K(a);if(b.ha(a)){b.n=!0;if(b.k){var c=a.latestVersion;c&&console.log("A newer version of Leanplum, "+c+", is available. Go to leanplum.com to download it.");WebSocket?b.O():console.log("Your browser doesn't support WebSockets.")}b.D(a.vars,a.actionMetadata);b.w=a.token}else b.n=!1,b.V();for(a=0;a<b.i.length;a++)b.i[a](b.n)}})};e.startFromCache=function(a,c,d){"function"==typeof a?(d=a,a=null):"object"==typeof a&&null!==a&&void 0!==a?(d=c,a=null):"function"==typeof c&&(d=c);b.f=a;d&&e.addStartResponseHandler(d);
b.L=!0;b.n=!0;b.k&&(WebSocket?b.O():console.log("Your browser doesn't support WebSockets."));b.V();for(a=0;a<b.i.length;a++)b.i[a](b.n)};b.O=function(){var a=new s,c=!1;a.onopen=function(){if(!c){console.log("Leanplum: Connected to development server.");var d={};d.appId=b.q;d.deviceId=b.h;a.ra(d);c=!0}};a.onerror=function(a){console.log("Leanplum: Socket error",a)};a.onmessage=function(a,c){"updateVars"==a?b.e("getVars",(new n).add("includeDefaults",!1),{d:!1,l:!0,response:function(a){a=b.K(a).vars;
m.isEqual(a,b.J)||b.D(a)}}):"registerDevice"==a&&alert("Your device has been registered to "+c[0].email+".")};a.onclose=function(){console.log("Leanplum: Disconnected to development server.");c=!1};a.T();setInterval(function(){a.A||a.B||a.T()},5E3)};e.stop=function(){b.e("stop",void 0,{l:!0,d:!0})};e.pauseSession=function(){b.e("pauseSession",void 0,{l:!0,d:!0})};e.resumeSession=function(){b.e("resumeSession",void 0,{l:!0,d:!0})};e.pauseState=function(){b.e("pauseState",void 0,{d:!0})};e.resumeState=
function(){b.e("resumeState",void 0,{d:!0})};e.setUserAttributes=function(a,c){void 0===c&&(c=a,a=null);b.e("setUserAttributes",(new n).add("userAttributes",JSON.stringify(c)).add("newUserId",a),{d:!0});a&&(b.f=a,localStorage.__leanplum_user_id=b.f)};e.track=function(a,c,d,e){"object"==typeof c&&null!==c&&void 0!==c?(e=c,c=d=void 0):"string"==typeof c?(e=d,d=c,c=void 0):"object"==typeof d&&(null!==d&&void 0!==d)&&(e=d,d=void 0);b.e("track",(new n).add("event",a).add("value",c||0).add("info",d).add("params",
JSON.stringify(e)),{d:!0})};e.advanceTo=function(a,c,d){"object"==typeof c&&(null!==c&&void 0!==c)&&(d=c,c=void 0);b.e("advance",(new n).add("state",a).add("info",c).add("params",JSON.stringify(d)),{d:!0})};b.D=function(a,c){b.J=a;b.G=c;b.ga=!0;b.M=b.F(b.P,a);b.ua();for(var d=0;d<b.o.length;d++)b.o[d]()};b.F=function(a,c){function d(a){return function(b){if(a instanceof Array)for(var c=0;c<a.length;c++)b(a[c]);else for(c in a)b(c)}}if("number"==typeof c||"boolean"==typeof c||"string"==typeof c)return c;
if(null===c||void 0===c)return a;var e=d(a),k=d(c),g=!1;if(null==a&&!(c instanceof Array)){var g=null,l;for(l in c){null===g&&(g=!0);if("string"!=typeof l){g=!1;break}if(3>l.length||"["!=l.charAt(0)||"]"!=l.charAt(l.length-1)){g=!1;break}var h=l.substring(1,l.length-1);if(!(""+parseInt(h))==h){g=!1;break}}}if(a instanceof Array||g){var f=[];e(function(a){f.push(a)});k(function(a){var d=parseInt(a.substring(1,a.length-1));for(a=c[a];d>=f.length;)f.push(null);f[d]=b.F(f[d],a)});return f}f={};e(function(b){if(null===
c[b]||void 0===c[b])f[b]=a[b]});k(function(d){f[d]=b.F(null!=a?a[d]:null,c[d])});return f};b.V=function(){try{b.D(JSON.parse(localStorage.__leanplum_variables),JSON.parse(localStorage.__leanplum_action_metadata)),b.w=localStorage.__leanplum_token}catch(a){console.log("Leanplum: Invalid diffs: "+a)}};b.ua=function(){localStorage.__leanplum_variables=JSON.stringify(b.J||{});localStorage.__leanplum_action_metadata=JSON.stringify(b.G||{});localStorage.__leanplum_token=b.w};b.ka=function(a){var b=localStorage.__leanplum_unsynced||
0;localStorage["__leanplum_unsynced_"+b]=JSON.stringify(a);b++;localStorage.__leanplum_unsynced=b};b.ja=function(){var a=[],b=localStorage.__leanplum_unsynced||0;localStorage.removeItem("__leanplum_unsynced");for(var d=0;d<b;d++){var e="__leanplum_unsynced_"+d;try{var k=JSON.parse(localStorage[e]);a.push(k)}catch(g){}localStorage.removeItem(e)}return a};b.e=function(a,c,d){d=d||{};c=c||new n;b.h||(b.h=localStorage.__leanplum_device_id);if(!b.h){for(var e="",k=0;16>k;k++)e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62*
Math.random()));b.h=e;localStorage.__leanplum_device_id=e}b.f||(b.f=localStorage.__leanplum_user_id,b.f||(b.f=b.h));localStorage.__leanplum_user_id=b.f;a=c.R().add("sdkVersion","1.1.5").add("deviceId",b.h).add("userId",b.f).add("action",a).add("versionName",b.na).add("devMode",b.k).add("time",""+(new Date).getTime()/1E3);var g=d.ya||d.response,l=d.error||d.response;if(b.q&&b.u)if(c.body())b.p("POST",t+"?"+a.j,c.body(),g,l,d.d);else{c=b.k||d.l||!b.H;var h=function(){var a=b.ja();if(0<a.length){var a=
JSON.stringify({data:a}),c=(new n).R().add("sdkVersion","1.1.5").add("action","multi").add("time",""+(new Date).getTime()/1E3).j;b.p("POST",t+"?"+c,a,g,l,d.d)}};!c&&b.r&&(e=(new Date).getTime()/1E3,!b.s||e-b.s>=b.r?(c=!0,b.s=e):b.I||(b.I=setTimeout(function(){b.I=null;b.s=(new Date).getTime()/1E3;h()},1E3*(b.r-(e-b.s)))));b.ka(a.Q);c&&h()}else console.error("Leanplum App ID and client key are not set. Make sure you are calling setAppIdForDevelopmentMode or setAppIdForProductionMode before issuing API calls."),
l&&l("Leanplum App ID and client key are not set. Make sure you are calling setAppIdForDevelopmentMode or setAppIdForProductionMode before issuing API calls.")};b.ia=function(a){return a&&a.response?a.response.length:0};b.fa=function(a,b){return a&&a.response?a.response[b]:null};b.K=function(a){var c=b.ia(a);return 0<c?b.fa(a,c-1):null};b.ha=function(a){return a?a.success?!0:!1:!1};b.wa=function(a){return a?(a=a.error)?a.message:null:null};n.prototype.add=function(a,b){if("undefined"===typeof b)return this;
this.j&&(this.j+="&");this.j+=a+"="+encodeURIComponent(b);this.Q[a]=b;return this};n.prototype.body=function(a){return a?(this.aa=a,this):this.aa};n.prototype.R=function(){return this.add("appId",b.q).add("client","js").add("clientKey",b.u)};s.prototype.ra=function(a){this.g.send("5:::"+JSON.stringify({name:"auth",args:a}))};s.prototype.T=function(){var a=this;a.B=!0;b.p("POST","http://"+u+"/socket.io/1","",function(b){b=b.split(":");var d=1E3*(parseInt(b[1])/2);a.g=new WebSocket("ws://"+u+"/socket.io/1/websocket/"+
b[0]);var e=null;a.g.onopen=function(){a.A=!0;a.B=!1;if(a.onopen)a.onopen();e=setInterval(function(){a.g.send("2:::")},d)};a.g.onclose=function(){a.A=!1;clearInterval(e);if(a.onclose)a.onclose()};a.g.onmessage=function(b){var c=b.data.split(":"),d=parseInt(c[0]);if(2==d)a.g.send("2::");else if(5==d){if(d=c[1],c=JSON.parse(c.slice(3).join(":")),b=c.name,c=c.args,d&&a.g.send("6:::"+d),a.onmessage)a.onmessage(b,c)}else 7==d&&console.log("Socket error: "+b.data)};a.g.onerror=function(b){a.g.close();if(a.onerror)a.onerror(b)}},
null,!1,!0)};b.$=function(a,c,d,e,k,g,l){var h=new XDomainRequest;h.onload=function(){var a,c=!1;if(l)a=h.responseText;else try{a=JSON.parse(h.responseText)}catch(d){setTimeout(function(){k&&k(null,h)},0),c=!0}c||setTimeout(function(){e&&e(a,h)},0);g&&(b.t=!1,b.v())};h.onerror=h.ontimeout=function(){setTimeout(function(){k&&k(null,h)},0);g&&(b.t=!1,b.v())};h.onprogress=function(){};h.open(a,c);h.timeout=1E3*v;h.send(d)};b.ea=function(a){b.N.push(a)};b.v=function(){var a=b.N.shift();a&&b.p.apply(null,
a)};b.p=function(a,c,d,e,k,g,l){if(g){if(b.t)return b.ea(arguments);b.t=!0}if("undefined"!==typeof XDomainRequest)return"http:"===location.protocol&&0==c.indexOf("https:")&&(c="http:"+c.substring(6)),b.$.apply(null,arguments);var h=!1,f=new XMLHttpRequest;f.onreadystatechange=function(){if(4===f.readyState&&!h){h=!0;var a,c=!1;if(l)a=f.responseText;else try{a=JSON.parse(f.responseText)}catch(d){setTimeout(function(){k&&k(null,f)},0),c=!0}c||(200<=f.status&&300>f.status?setTimeout(function(){e&&e(a,
f)},0):setTimeout(function(){k&&k(a,f)},0));g&&(b.t=!1,b.v())}};f.open(a,c,!0);f.setRequestHeader("Content-Type","text/plain");f.send(d);setTimeout(function(){h||f.abort()},1E3*v)};m.xa=function(a){each(slice.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};m.U=function(a){return"function"===typeof a};m.C=function(a,b){return hasOwnProperty.call(a,b)};m.isEqual=function(a,b){return r(a,b,[],[])};var p={sa:function(){this.S=this.W(this.pa)||"An unknown browser";this.version=this.X(navigator.userAgent)||
this.X(navigator.appVersion)||"an unknown version";this.Z=this.W(this.qa)||"an unknown OS"},W:function(a){for(var b=0;b<a.length;b++){var d=a[b].b,e=a[b].ta;this.Y=a[b].m||a[b].a;if(d){if(-1!=d.indexOf(a[b].c))return a[b].a}else if(e)return a[b].a}},X:function(a){var b=a.indexOf(this.Y);if(-1!=b)return parseFloat(a.substring(b+this.Y.length+1))},pa:[{b:navigator.userAgent,c:"Chrome",a:"Chrome"},{b:navigator.userAgent,c:"OmniWeb",m:"OmniWeb/",a:"OmniWeb"},{b:navigator.vendor,c:"Apple",a:"Safari",m:"Version"},
{ta:window.opera,a:"Opera",m:"Version"},{b:navigator.vendor,c:"iCab",a:"iCab"},{b:navigator.vendor,c:"KDE",a:"Konqueror"},{b:navigator.userAgent,c:"Firefox",a:"Firefox"},{b:navigator.vendor,c:"Camino",a:"Camino"},{b:navigator.userAgent,c:"Netscape",a:"Netscape"},{b:navigator.userAgent,c:"MSIE",a:"Explorer",m:"MSIE"},{b:navigator.userAgent,c:"Gecko",a:"Mozilla",m:"rv"},{b:navigator.userAgent,c:"Mozilla",a:"Netscape",m:"Mozilla"}],qa:[{b:navigator.platform,c:"Win",a:"Windows"},{b:navigator.platform,
c:"Mac",a:"Mac OS"},{b:navigator.userAgent,c:"iPhone",a:"iPhone OS"},{b:navigator.platform,c:"Linux",a:"Linux"}]};p.sa()}).call(this);
