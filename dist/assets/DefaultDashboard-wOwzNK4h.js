import{h as T,y as N,q as d,o as n,c as _,w as t,a as e,b as a,e as w,$ as L,s as A,Z as O,z as D,u as b,v as z,F as E,d as u,a5 as v,ah as f,ai as M,aj as j,ak as U,al as G,p as y,r as J,l as V,t as k,J as B,aa as C,am as Y,an as P,ao as W,ap as R,V as $,f as c,B as F,aq as q,ar as K,K as X,as as Z,at as H}from"./index-CW6UmzU3.js";import{_ as Q}from"./_plugin-vue_export-helper-DlAUqK2U.js";const ee={class:"d-flex align-start mb-6"},te={class:"ml-auto z-1"},ae={class:"text-h1 font-weight-medium"},se={href:"#"},oe=T({__name:"TotalEarning",setup(g){const o=N([{title:"Import Card",icon:M},{title:"Copy Data",icon:j},{title:"Export",icon:U},{title:"Archive File",icon:G}]);return(h,r)=>{const x=d("FileBarcodeIcon"),l=d("DotsIcon"),m=d("CircleArrowUpRightIcon");return n(),_(f,{elevation:"0",class:"bg-secondary overflow-hidden bubble-shape bubble-secondary-shape"},{default:t(()=>[e(v,null,{default:t(()=>[a("div",ee,[e(w,{icon:"",rounded:"sm",color:"darksecondary",variant:"flat"},{default:t(()=>[e(x,{"stroke-width":"1.5",width:"20"})]),_:1}),a("div",te,[e(L,{"close-on-content-click":!1},{activator:t(({props:s})=>[e(w,A({icon:"",rounded:"sm",color:"secondary",variant:"flat",size:"small"},s),{default:t(()=>[e(l,{"stroke-width":"1.5",width:"20"})]),_:2},1040)]),default:t(()=>[e(O,{rounded:"md",width:"150",class:"elevation-10"},{default:t(()=>[e(D,{density:"compact"},{default:t(()=>[(n(!0),b(E,null,z(o.value,(s,p)=>(n(),_(y,{key:p,value:p},{prepend:t(()=>[(n(),_(J(s.icon),{"stroke-width":"1.5",size:"20"}))]),default:t(()=>[e(V,{class:"ml-2"},{default:t(()=>[u(k(s.title),1)]),_:2},1024)]),_:2},1032,["value"]))),128))]),_:1})]),_:1})]),_:1})])]),a("h2",ae,[r[0]||(r[0]=u(" 500 ")),a("a",se,[e(m,{"stroke-width":"1.5",width:"28",class:"text-white"})])]),r[1]||(r[1]=a("span",{class:"text-subtitle-1 text-medium-emphasis text-white"},"New Entries",-1))]),_:1})]),_:1})}}}),le={class:"d-flex align-start mb-3"},ne={class:"ml-auto z-1"},ie={class:"text-h1 font-weight-medium"},re={href:"#"},de={class:"text-h1 font-weight-medium"},ce={href:"#"},ue=T({__name:"TotalOrder",setup(g){const o=B("1"),h=C(()=>({chart:{type:"bar",height:90,fontFamily:"inherit",foreColor:"#a1aab2",sparkline:{enabled:!0}},dataLabels:{enabled:!1},colors:["#fff"],fill:{type:"solid",opacity:1},stroke:{curve:"smooth",width:3},yaxis:{min:0,max:100},tooltip:{theme:"dark",fixed:{enabled:!1},x:{show:!1},y:{title:{formatter:()=>"Total Order"}},marker:{show:!1}}})),r={series:[{name:"series1",data:[45,66,41,89,25,44,9,54]}]},x=C(()=>({chart:{type:"bar",height:90,fontFamily:"inherit",foreColor:"#a1aab2",sparkline:{enabled:!0}},dataLabels:{enabled:!1},colors:["#fff"],fill:{type:"solid",opacity:1},stroke:{curve:"smooth",width:3},yaxis:{min:0,max:100},tooltip:{theme:"dark",fixed:{enabled:!1},x:{show:!1},y:{title:{formatter:()=>"Total Order"}},marker:{show:!1}}})),l={series:[{name:"series1",data:[35,44,9,54,45,66,41,69]}]};return(m,s)=>{const p=d("FileBarcodeIcon"),I=d("apexchart");return n(),_(f,{elevation:"0",class:"bg-primary overflow-hidden bubble-shape bubble-primary-shape"},{default:t(()=>[e(v,null,{default:t(()=>[a("div",le,[e(w,{icon:"",rounded:"sm",color:"darkprimary",variant:"flat"},{default:t(()=>[e(p,{"stroke-width":"1.5",width:"20"})]),_:1}),a("div",ne,[e(Y,{modelValue:o.value,"onUpdate:modelValue":s[0]||(s[0]=i=>o.value=i),class:"theme-tab",density:"compact","align-tabs":"end"},{default:t(()=>[e(P,{value:"1","hide-slider":"",color:"transparent"},{default:t(()=>s[2]||(s[2]=[u("Month")])),_:1}),e(P,{value:"2","hide-slider":"",color:"transparent"},{default:t(()=>s[3]||(s[3]=[u("Year")])),_:1})]),_:1},8,["modelValue"])])]),e(W,{modelValue:o.value,"onUpdate:modelValue":s[1]||(s[1]=i=>o.value=i),class:"z-1"},{default:t(()=>[e(R,{value:"1"},{default:t(()=>[e($,null,{default:t(()=>[e(c,{cols:"6"},{default:t(()=>[a("h2",ie,[s[4]||(s[4]=u(" 108 ")),a("a",re,[e(F(q),{"stroke-width":"1.5",width:"28",class:"text-white"})])]),s[5]||(s[5]=a("span",{class:"text-subtitle-1 text-medium-emphasis text-white"},"Total Records",-1))]),_:1}),e(c,{cols:"6"},{default:t(()=>[e(I,{type:"line",height:"90",options:h.value,series:r.series},null,8,["options","series"])]),_:1})]),_:1})]),_:1}),e(R,{value:"2"},{default:t(()=>[e($,null,{default:t(()=>[e(c,{cols:"6"},{default:t(()=>[a("h2",de,[s[6]||(s[6]=u(" 961 ")),a("a",ce,[e(F(K),{"stroke-width":"1.5",width:"28",class:"text-white"})])]),s[7]||(s[7]=a("span",{class:"text-subtitle-1 text-medium-emphasis text-white"},"Total Records",-1))]),_:1}),e(c,{cols:"6"},{default:t(()=>[e(I,{type:"line",height:"90",options:x.value,series:l.series},null,8,["options","series"])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})}}}),he={},me={class:"d-flex align-center ga-4"},fe={class:"d-flex align-center ga-4"};function pe(g,o){const h=d("TableIcon"),r=d("BuildingStoreIcon");return n(),b(E,null,[e(f,{elevation:"0",class:"bg-primary overflow-hidden bubble-shape-sm bubble-primary mb-6"},{default:t(()=>[e(v,{class:"pa-5"},{default:t(()=>[a("div",me,[e(w,{color:"darkprimary",icon:"",rounded:"sm",variant:"flat"},{default:t(()=>[e(h,{"stroke-width":"1.5",width:"25"})]),_:1}),o[0]||(o[0]=a("div",null,[a("h4",{class:"text-h4 font-weight-medium"},"203k"),a("span",{class:"text-subtitle-2 text-medium-emphasis text-white"},"Total Regions")],-1))])]),_:1})]),_:1}),e(f,{elevation:"0",class:"bubble-shape-sm overflow-hidden bubble-warning"},{default:t(()=>[e(v,{class:"pa-5"},{default:t(()=>[a("div",fe,[e(w,{color:"lightwarning",icon:"",rounded:"sm",variant:"flat"},{default:t(()=>[e(r,{"stroke-width":"1.5",width:"25",class:"text-warning"})]),_:1}),o[1]||(o[1]=a("div",null,[a("h4",{class:"text-h4 font-weight-medium"},"203k"),a("span",{class:"text-subtitle-2 text-disabled font-weight-medium"},"Total Panchayath")],-1))])]),_:1})]),_:1})],64)}const _e=Q(he,[["render",pe]]),be={class:"mt-4"},we=T({__name:"TotalGrowth",setup(g){const o=B({state:"Today",abbr:"FL"}),h=[{state:"Today",abbr:"FL"},{state:"This Month",abbr:"GA"},{state:"This Year",abbr:"NE"}],r=C(()=>({chart:{type:"bar",height:480,fontFamily:"inherit",foreColor:"#a1aab2",stacked:!0},colors:["#eef2f6","#1e88e5","#5e35b1","#ede7f6"],responsive:[{breakpoint:480,options:{legend:{position:"bottom",offsetX:-10,offsetY:0}}}],plotOptions:{bar:{horizontal:!1,columnWidth:"50%"}},xaxis:{type:"category",categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},legend:{show:!0,fontFamily:"'Roboto', sans-serif",position:"bottom",offsetX:20,labels:{useSeriesColors:!1},markers:{width:16,height:16,radius:5},itemMargin:{horizontal:15,vertical:8}},fill:{type:"solid"},dataLabels:{enabled:!1},grid:{show:!0},tooltip:{theme:"dark"}})),x={series:[{name:"Total Population",data:[500,550,600,650,700,600,800,850,900,950,800,1050]},{name:"New Entries",data:[50,60,550,95,70,50,80,450,60,75,50,65]},{name:"Removed Records",data:[100,5,15,100,800,120,9,6,14,7,10,80]}]};return(l,m)=>{const s=d("apexchart");return n(),_(f,{elevation:"0"},{default:t(()=>[e(f,{variant:"outlined"},{default:t(()=>[e(v,null,{default:t(()=>[e($,null,{default:t(()=>[e(c,{cols:"12",sm:"9"},{default:t(()=>m[1]||(m[1]=[a("span",{class:"text-subtitle-2 text-disabled font-weight-bold"}," Population Growth Over Time",-1),a("h3",{class:"text-h3 mt-1"},"2,324",-1)])),_:1}),e(c,{cols:"12",sm:"3"},{default:t(()=>[e(X,{color:"primary",variant:"outlined","hide-details":"",modelValue:o.value,"onUpdate:modelValue":m[0]||(m[0]=p=>o.value=p),items:h,"item-title":"state","item-value":"abbr",label:"Select","persistent-hint":"","return-object":"","single-line":""},null,8,["modelValue"])]),_:1})]),_:1}),a("div",be,[e(s,{type:"bar",height:"480",options:r.value,series:x.series},null,8,["options","series"])])]),_:1})]),_:1})]),_:1})}}}),xe={class:"d-flex align-center"},ve={class:"ml-auto"},ge={class:"mt-4"},ye={key:0,class:"bg-lightsuccess rounded-sm d-flex align-center justify-center ml-3",style:{width:"20px",height:"20px"}},ke={key:1,class:"bg-lighterror rounded-sm d-flex align-center justify-center ml-3",style:{width:"20px",height:"20px"}},Te={class:"d-inline-flex align-center justify-space-between w-100"},Ie={class:"text-subtitle-1 text-medium-emphasis font-weight-bold"},Ve={key:0,class:"text-success text-subtitle-2"},Ce={key:1,class:"text-error text-subtitle-2"},$e={class:"ml-auto text-subtitle-1 text-medium-emphasis font-weight-bold"},Fe={class:"text-center mt-3"},De=T({__name:"PopularStocks",setup(g){const o=C(()=>({chart:{type:"area",height:95,fontFamily:"inherit",foreColor:"#a1aab2",sparkline:{enabled:!0}},colors:["#5e35b1"],dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1},tooltip:{theme:"dark",fixed:{enabled:!1},x:{show:!1},y:{title:{formatter:()=>"Record "}},marker:{show:!1}}})),h={series:[{data:[0,15,10,50,30,40,25]}]},r=B([{area:"Nedumkandam",totalPeople:1500,newEntries:120},{area:"Pampadumpara",totalPeople:2200,newEntries:200},{area:"Kalkoonthal",totalPeople:1800,newEntries:150},{area:"Thannimoodu",totalPeople:2100,newEntries:180}]);return(x,l)=>{const m=d("DotsIcon"),s=d("apexchart"),p=d("perfect-scrollbar"),I=d("ChevronRightIcon");return n(),_(f,{elevation:"0"},{default:t(()=>[e(f,{variant:"outlined"},{default:t(()=>[e(v,null,{default:t(()=>[a("div",xe,[l[3]||(l[3]=a("h4",{class:"text-h4 mt-1"},"Gender-Based Trends",-1)),a("div",ve,[e(L,{transition:"slide-y-transition"},{activator:t(({props:i})=>[e(w,A({color:"primary",size:"small",icon:"",rounded:"sm",variant:"text"},i),{default:t(()=>[e(m,{"stroke-width":"1.5",width:"25"})]),_:2},1040)]),default:t(()=>[e(O,{rounded:"md",width:"150",class:"elevation-10"},{default:t(()=>[e(D,null,{default:t(()=>[e(y,{value:"1"},{default:t(()=>[e(V,null,{default:t(()=>l[0]||(l[0]=[u("Today")])),_:1})]),_:1}),e(y,{value:"2"},{default:t(()=>[e(V,null,{default:t(()=>l[1]||(l[1]=[u("This Month")])),_:1})]),_:1}),e(y,{value:"3"},{default:t(()=>[e(V,null,{default:t(()=>l[2]||(l[2]=[u("This Year")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1})])]),e(f,{class:"bg-lightsecondary mt-5"},{default:t(()=>[l[4]||(l[4]=a("div",{class:"pa-5"},[a("div",{class:"d-flex align-start justify-space-between"},[a("div",null,[a("h6",{class:"text-secondary text-h5"},"Pampadumpara"),a("span",{class:"text-subtitle-2 text-medium-emphasis font-weight-bold"},"10%")]),a("h4",{class:"text-h4"},"1839")])],-1)),e(s,{type:"area",height:"95",options:o.value,series:h.series},null,8,["options","series"])]),_:1}),a("div",ge,[e(p,{style:{height:"270px"}},{default:t(()=>[e(D,{lines:"two",class:"py-0"},{default:t(()=>[(n(!0),b(E,null,z(r.value,(i,S)=>(n(),_(y,{key:S,value:i,color:"secondary",rounded:"sm"},{append:t(()=>[i.newEntries>145?(n(),b("div",ye,[e(F(Z),{"stroke-width":"1.5",width:"20",class:"text-success"})])):(n(),b("div",ke,[e(F(H),{"stroke-width":"1.5",width:"20",class:"text-error"})]))]),default:t(()=>[a("div",Te,[a("div",null,[a("h6",Ie,k(i.area),1),i.newEntries>145?(n(),b("span",Ve,k(i.totalPeople)+"% ",1)):(n(),b("span",Ce,k(i.totalPeople)+"%",1))]),a("div",$e,k(i.newEntries),1)])]),_:2},1032,["value"]))),128))]),_:1})]),_:1}),a("div",Fe,[e(w,{color:"primary",variant:"text"},{append:t(()=>[e(I,{"stroke-width":"1.5",width:"20"})]),default:t(()=>[l[5]||(l[5]=u("View All "))]),_:1})])])]),_:1})]),_:1})]),_:1})}}}),Pe=T({__name:"DefaultDashboard",setup(g){return(o,h)=>(n(),_($,null,{default:t(()=>[e(c,{cols:"12",md:"4"},{default:t(()=>[e(oe)]),_:1}),e(c,{cols:"12",md:"4"},{default:t(()=>[e(ue)]),_:1}),e(c,{cols:"12",md:"4"},{default:t(()=>[e(_e)]),_:1}),e(c,{cols:"12",lg:"8"},{default:t(()=>[e(we)]),_:1}),e(c,{cols:"12",lg:"4"},{default:t(()=>[e(De)]),_:1})]),_:1}))}});export{Pe as default};
