import{g as se,D as ae,A as le,C as M,h as _,o as n,c,w as t,d as p,t as b,i as oe,r as U,j as ie,a as e,k as y,l as C,m as H,n as N,p as g,q as w,s as j,u as x,F as k,v as A,x as re,y as Z,b as a,z as L,B as r,E as q,G as v,e as h,H as X,S as Y,I as ne,X as de,J as V,K as ue,L as S,M as ce,N as me,O as pe,P as fe,Q as _e,R as P,T as Q,U as ve,W as he,Y as T,Z as D,_ as xe,$ as F,a0 as be,a1 as G,a2 as ge,V as K,f as R,a3 as ye,a4 as we,a5 as ke,a6 as O,a7 as E,a8 as Se,a9 as Ve,aa as ze,ab as Ce,ac as J,ad as Ie,ae as De,af as $e,ag as Te}from"./index-DEmWJLyg.js";import{_ as Re}from"./LogoDark.vue_vue_type_script_setup_true_lang-meCIbnPO.js";import{_ as Ne}from"./_plugin-vue_export-helper-DlAUqK2U.js";const z={Sidebar_drawer:!0,Customizer_drawer:!1,mini_sidebar:!1,fontTheme:"Roboto",inputBg:!1},B=se("customizer",{state:()=>({Sidebar_drawer:z.Sidebar_drawer,Customizer_drawer:z.Customizer_drawer,mini_sidebar:z.mini_sidebar,fontTheme:z.fontTheme,inputBg:z.inputBg}),getters:{},actions:{SET_SIDEBAR_DRAWER(){this.Sidebar_drawer=!this.Sidebar_drawer},SET_MINI_SIDEBAR(i){this.mini_sidebar=i},SET_CUSTOMIZER_DRAWER(i){this.Customizer_drawer=i},SET_FONT(i){this.fontTheme=i}}}),Ae=[{header:"Dashboard"},{title:"Home",icon:ae,to:"/dashboard/default"},{divider:!0},{header:"Directory"},{title:"Records",icon:le,to:"/create/record",children:[{title:"All Records",icon:M,to:"/list/record"},{title:"Create Record",icon:M,to:"/create/record"}]}],Be=_({__name:"NavGroupDD",props:{item:Object},setup(i){const o=i;return(d,m)=>(n(),c(oe,{color:"darkText",class:"smallCap"},{default:t(()=>{var s;return[p(b((s=o.item)==null?void 0:s.header),1)]}),_:1}))}}),ee=_({__name:"IconSet",props:{item:Object,level:{type:Number,default:0}},setup(i){const o=i;return(d,m)=>o.level>0?(n(),c(U(o.item),{key:0,size:"5",fill:"currentColor","stroke-width":"1.5",class:"iconClass"})):(n(),c(U(o.item),{key:1,size:"20","stroke-width":"1.5",class:"iconClass"}))}}),te=_({__name:"NavItemDD",props:{item:{type:Object,default:()=>({})},level:Number},setup(i){const o=i;return(d,m)=>(n(),c(g,{to:i.item.type==="external"?"":i.item.to,href:i.item.type==="external"?i.item.to:"",rounded:"",class:"mb-1",color:"secondary",disabled:i.item.disabled,target:i.item.type==="external"?"_blank":""},ie({prepend:t(()=>{var s;return[e(ee,{item:(s=o.item)==null?void 0:s.icon,level:o.level},null,8,["item","level"])]}),default:t(()=>[e(C,null,{default:t(()=>[p(b(i.item.title),1)]),_:1}),i.item.subCaption?(n(),c(H,{key:0,class:"text-caption mt-n1 hide-menu"},{default:t(()=>[p(b(i.item.subCaption),1)]),_:1})):N("",!0)]),_:2},[i.item.chip?{name:"append",fn:t(()=>[e(y,{color:i.item.chipColor,class:"sidebarchip hide-menu",size:i.item.chipIcon?"small":"default",variant:i.item.chipVariant,"prepend-icon":i.item.chipIcon},{default:t(()=>[p(b(i.item.chip),1)]),_:1},8,["color","size","variant","prepend-icon"])]),key:"0"}:void 0]),1032,["to","href","disabled","target"]))}}),Ee=_({__name:"NavCollapseDD",props:{item:{type:Object,default:()=>({})},level:Number},setup(i){const o=i;return(d,m)=>{const s=w("NavCollapse");return n(),c(re,{"no-action":""},{activator:t(({props:l})=>[e(g,j(l,{value:i.item.title,rounded:"",class:"mb-1",color:"secondary"}),{prepend:t(()=>[e(ee,{item:i.item.icon,level:i.level},null,8,["item","level"])]),default:t(()=>[e(C,{class:"mr-auto"},{default:t(()=>[p(b(i.item.title),1)]),_:1}),i.item.subCaption?(n(),c(H,{key:0,class:"text-caption mt-n1 hide-menu"},{default:t(()=>[p(b(i.item.subCaption),1)]),_:1})):N("",!0)]),_:2},1040,["value"])]),default:t(()=>[(n(!0),x(k,null,A(i.item.children,(l,u)=>(n(),x(k,{key:u},[l.children?(n(),c(s,{key:0,item:l,level:(o.level??0)+1},null,8,["item","level"])):(n(),c(te,{key:1,item:l,level:(o.level??0)+1},null,8,["item","level"]))],64))),128))]),_:1})}}}),je=_({__name:"LogoMain",setup(i){return(o,d)=>(n(),c(Re))}}),Le={class:"pa-5"},Me={class:"pa-4 text-center"},Ue=_({__name:"VerticalSidebar",setup(i){const o=B(),d=Z(Ae);return(m,s)=>{const l=w("perfect-scrollbar");return n(),c(q,{left:"",modelValue:r(o).Sidebar_drawer,"onUpdate:modelValue":s[0]||(s[0]=u=>r(o).Sidebar_drawer=u),elevation:"0","rail-width":"75","mobile-breakpoint":"lg",app:"",class:"leftSidebar",rail:r(o).mini_sidebar,"expand-on-hover":""},{default:t(()=>[a("div",Le,[e(je)]),e(l,{class:"scrollnavbar"},{default:t(()=>[e(L,{class:"pa-4"},{default:t(()=>[(n(!0),x(k,null,A(d.value,(u,f)=>(n(),x(k,{key:f},[u.header?(n(),c(Be,{item:u,key:u.title},null,8,["item"])):u.divider?(n(),c(v,{key:1,class:"my-3"})):u.children?(n(),c(Ee,{key:2,class:"leftPadding",item:u,level:0},null,8,["item"])):(n(),c(te,{key:3,item:u,class:"leftPadding"},null,8,["item"]))],64))),128))]),_:1}),s[2]||(s[2]=a("div",{class:"pa-4"},null,-1)),a("div",Me,[e(y,{color:"inputBorder",size:"small"},{default:t(()=>s[1]||(s[1]=[p(" v1.2.0 ")])),_:1})])]),_:1})]),_:1},8,["modelValue","rail"])}}}),$="/posta-cloud-web-application/assets/user-round-QwaXuEgi.svg",W=_({__name:"SearchBarDD",props:{closesearch:{type:Function,required:!1}},setup(i){const o=i;return(d,m)=>(n(),c(X,{"persistent-placeholder":"",placeholder:"Search",color:"primary",variant:"outlined","hide-details":""},{"prepend-inner":t(()=>[e(r(Y),{"stroke-width":"1.5",size:"17",class:"text-lightText SearchIcon"})]),"append-inner":t(()=>[e(h,{color:"lightsecondary",icon:"",rounded:"sm",variant:"flat",size:"small",class:"text-secondary SearchSetting"},{default:t(()=>[e(r(ne),{"stroke-width":"1.5",size:"20"})]),_:1}),e(h,{color:"lighterror",icon:"",rounded:"sm",variant:"flat",size:"small",class:"text-error SearchSetting ml-3 d-block d-lg-none",onClick:o.closesearch},{default:t(()=>[e(r(de),{"stroke-width":"1.5",size:"20"})]),_:1},8,["onClick"])]),_:1}))}}),Pe={class:"pa-4"},Fe={class:"d-flex align-center justify-space-between mb-3"},Ge={class:"text-subtitle-1"},Oe={class:"mt-3"},Je={class:"mt-3"},We={class:"mt-3"},He={class:"mt-3 bg-lightsecondary rounded pa-5 d-flex align-center"},Ze={class:"pa-2 text-center"},qe=_({__name:"NotificationDD",setup(i){const o=V(["All Notifications","New","Unread","Other"]),d=V("All Notifications");return(m,s)=>{const l=w("perfect-scrollbar");return n(),x(k,null,[a("div",Pe,[a("div",Fe,[a("h6",Ge,[s[2]||(s[2]=p(" All Notifications ")),e(y,{color:"warning",variant:"flat",size:"small",class:"ml-2 text-white"},{default:t(()=>s[1]||(s[1]=[p("01")])),_:1})]),s[3]||(s[3]=a("a",{href:"#",class:"text-decoration-underline text-primary text-subtitle-2"},"Mark as all read",-1))]),e(ue,{items:o.value,modelValue:d.value,"onUpdate:modelValue":s[0]||(s[0]=u=>d.value=u),color:"primary",variant:"outlined",density:"default","hide-details":""},null,8,["items","modelValue"])]),e(v),e(l,{style:{height:"calc(100vh - 300px)","max-height":"650px"}},{default:t(()=>[e(L,{class:"py-0",lines:"three"},{default:t(()=>[e(g,{value:"",color:"secondary",class:"no-spacer"},{prepend:t(()=>[e(S,{size:"40",class:"mr-3 py-2"},{default:t(()=>s[4]||(s[4]=[a("img",{src:$,width:"40",alt:"Julia"},null,-1)])),_:1})]),default:t(()=>[s[5]||(s[5]=a("div",{class:"d-inline-flex align-center justify-space-between w-100"},[a("h6",{class:"text-subtitle-1 font-weight-regular"},"John Deo"),a("span",{class:"text-subtitle-2 text-medium-emphasis"},"2 mins ago")],-1)),s[6]||(s[6]=a("p",{class:"text-subtitle-2 text-medium-emphasis mt-1"},"It is a long established fact that a reader will be distracted",-1)),a("div",Oe,[e(y,{size:"small",text:"Unread",color:"error",variant:"tonal",class:"mr-2"}),e(y,{size:"small",text:"New",color:"warning",variant:"tonal"})])]),_:1}),e(v),e(g,{value:"",color:"secondary",class:"no-spacer"},{prepend:t(()=>[e(S,{size:"40",variant:"flat",color:"lightsuccess",class:"mr-3 py-2 text-success"},{default:t(()=>[e(r(ce),{size:"20"})]),_:1})]),default:t(()=>[s[7]||(s[7]=a("div",{class:"d-inline-flex align-center justify-space-between w-100"},[a("h6",{class:"text-subtitle-1"},"Store Verification Done"),a("span",{class:"text-subtitle-2 text-medium-emphasis"},"2 mins ago")],-1)),s[8]||(s[8]=a("p",{class:"text-subtitle-2 text-medium-emphasis mt-1"},"We have successfully received your request.",-1)),a("div",Je,[e(y,{size:"small",color:"error",text:"Unread",variant:"tonal"})])]),_:1}),e(v),e(g,{value:"",color:"secondary",class:"no-spacer"},{prepend:t(()=>[e(S,{size:"40",variant:"flat",color:"lightprimary",class:"mr-3 py-2 text-primary"},{default:t(()=>[e(r(me),{size:"20"})]),_:1})]),default:t(()=>[s[10]||(s[10]=a("div",{class:"d-inline-flex align-center justify-space-between w-100"},[a("h6",{class:"text-subtitle-1"},"Check your Mail."),a("span",{class:"text-subtitle-2 text-medium-emphasis"},"2 mins ago")],-1)),s[11]||(s[11]=a("p",{class:"text-subtitle-2 text-medium-emphasis mt-1"},"All done! Now check your inbox as you're in for a sweet treat!",-1)),a("div",We,[e(h,{color:"primary",variant:"flat"},{append:t(()=>[e(r(pe),{size:"20"})]),default:t(()=>[s[9]||(s[9]=p(" Mail "))]),_:1})])]),_:1}),e(v),e(g,{value:"",color:"secondary",class:"no-spacer"},{prepend:t(()=>[e(S,{size:"40",class:"mr-3 py-2"},{default:t(()=>s[12]||(s[12]=[a("img",{src:$,width:"40",alt:"Julia"},null,-1)])),_:1})]),default:t(()=>[s[14]||(s[14]=a("div",{class:"d-inline-flex align-center justify-space-between w-100"},[a("h6",{class:"text-subtitle-1"},"John Deo"),a("span",{class:"text-subtitle-2 text-medium-emphasis"},"2 mins ago")],-1)),s[15]||(s[15]=a("p",{class:"text-subtitle-2 mt-1"},[a("span",{class:"text-medium-emphasis"},"Uploaded two file on "),a("span",{class:"font-weight-medium"},"21 Jan 2020")],-1)),a("div",He,[e(r(fe),{size:"20","stroke-width":"1.5"}),s[13]||(s[13]=a("span",{class:"ml-2 text-subtitle-1"},"demo.jpg",-1))])]),_:1}),e(v),e(g,{value:"",color:"secondary",class:"no-spacer"},{prepend:t(()=>[e(S,{size:"40",class:"mr-3 py-2"},{default:t(()=>s[16]||(s[16]=[a("img",{src:$,width:"40",alt:"Julia"},null,-1)])),_:1})]),default:t(()=>[s[17]||(s[17]=a("div",{class:"d-inline-flex align-center justify-space-between w-100"},[a("h6",{class:"text-subtitle-1"},"John Deo"),a("span",{class:"text-subtitle-2 text-medium-emphasis"},"2 mins ago")],-1)),s[18]||(s[18]=a("p",{class:"text-subtitle-2 mt-1 text-medium-emphasis mb-3"},"It is a long established fact that a reader will be distracted",-1)),e(y,{size:"small",color:"success",text:"Confirmation of Account."})]),_:1})]),_:1})]),_:1}),e(v),a("div",Ze,[e(h,{color:"primary",variant:"text"},{default:t(()=>s[19]||(s[19]=[p("View All")])),_:1})])],64)}}}),Xe={class:"pa-4"},Ye={class:"mb-n1"},Qe={key:0},Ke={key:1},et={key:2},tt={class:"font-weight-regular"},st={class:"text-subtitle-2 text-medium-emphasis"},at={class:"bg-lightwarning rounded-md pa-5 my-3 circle sm-circle lg-circle"},lt={class:"bg-lightprimary rounded-md px-5 py-3 my-3"},ot={class:"d-flex align-center justify-space-between"},it={class:"d-flex align-center justify-space-between"},rt=_({__name:"ProfileDD",setup(i){const o=V(!0),d=V(!1),m=_e();return(s,l)=>{const u=w("SearchIcon"),f=w("perfect-scrollbar");return n(),x("div",Xe,[a("h4",Ye,[new Date().getHours()<12?(n(),x("span",Qe,"Good Morning")):new Date().getHours()<18?(n(),x("span",Ke,"Good Afternoon")):(n(),x("span",et,"Good Evening")),l[3]||(l[3]=p(", ")),a("span",tt,b(r(m).user.firstName)+" "+b(r(m).user.lastName),1)]),a("span",st,b(r(m).user.username),1),e(X,{"persistent-placeholder":"",placeholder:"Search",class:"my-3",color:"primary",variant:"outlined","hide-details":""},{"prepend-inner":t(()=>[e(u,{"stroke-width":"1.5",size:"20",class:"text-lightText SearchIcon"})]),_:1}),e(v),e(f,{style:{height:"calc(100vh - 300px)","max-height":"515px"}},{default:t(()=>[a("div",at,[l[5]||(l[5]=a("h4",null,"Upgrade your plan",-1)),l[6]||(l[6]=a("h6",{class:"text-subtitle-2 text-medium-emphasis mr-11 pr-11 mb-3 mt-2"},"70% discount for 1 years subscriptions. ",-1)),e(h,{color:"warning",variant:"flat",target:"_",href:"https://codedthemes.com/item/berry-vue-admin-dashboard/"},{default:t(()=>l[4]||(l[4]=[p(" Go Premium ")])),_:1})]),e(v),a("div",lt,[a("div",ot,[l[7]||(l[7]=a("h5",{class:"text-h5"},"Start DND Mode",-1)),a("div",null,[e(P,{modelValue:o.value,"onUpdate:modelValue":l[0]||(l[0]=I=>o.value=I),color:"primary","hide-details":""},null,8,["modelValue"])])]),a("div",it,[l[8]||(l[8]=a("h5",{class:"text-h5"},"Allow Notifications",-1)),a("div",null,[e(P,{modelValue:d.value,"onUpdate:modelValue":l[1]||(l[1]=I=>d.value=I),color:"primary","hide-details":""},null,8,["modelValue"])])])]),e(v),e(L,{class:"mt-3"},{default:t(()=>[e(g,{color:"secondary",rounded:"md"},{prepend:t(()=>[e(r(Q),{size:"20",class:"mr-2"})]),default:t(()=>[e(C,{class:"text-subtitle-2"},{default:t(()=>l[9]||(l[9]=[p(" Account Settings")])),_:1})]),_:1}),e(g,{color:"secondary",rounded:"md"},{prepend:t(()=>[e(r(ve),{size:"20",class:"mr-2"})]),append:t(()=>[e(y,{color:"warning",class:"text-white",text:"02",variant:"flat",size:"small"})]),default:t(()=>[e(C,{class:"text-subtitle-2"},{default:t(()=>l[10]||(l[10]=[p(" Social Profile")])),_:1})]),_:1}),e(g,{onClick:l[2]||(l[2]=I=>r(m).logout()),color:"secondary",rounded:"md"},{prepend:t(()=>[e(r(he),{size:"20",class:"mr-2"})]),default:t(()=>[e(C,{class:"text-subtitle-2"},{default:t(()=>l[11]||(l[11]=[p(" Logout")])),_:1})]),_:1})]),_:1})]),_:1})])}}}),nt=_({__name:"VerticalHeader",setup(i){const o=B(),d=V(!1);function m(){d.value=!d.value}return(s,l)=>(n(),c(be,{elevation:"0",height:"80"},{default:t(()=>[e(h,{class:"hidden-md-and-down text-secondary",color:"lightsecondary",icon:"",rounded:"sm",variant:"flat",onClick:l[0]||(l[0]=T(u=>r(o).SET_MINI_SIDEBAR(!r(o).mini_sidebar),["stop"])),size:"small"},{default:t(()=>[e(r(G),{size:"20","stroke-width":"1.5"})]),_:1}),e(h,{class:"hidden-lg-and-up text-secondary ms-3",color:"lightsecondary",icon:"",rounded:"sm",variant:"flat",onClick:T(r(o).SET_SIDEBAR_DRAWER,["stop"]),size:"small"},{default:t(()=>[e(r(G),{size:"20","stroke-width":"1.5"})]),_:1},8,["onClick"]),e(h,{class:"hidden-lg-and-up text-secondary ml-3",color:"lightsecondary",icon:"",rounded:"sm",variant:"flat",size:"small",onClick:m},{default:t(()=>[e(r(Y),{size:"17","stroke-width":"1.5"})]),_:1}),d.value?(n(),c(D,{key:0,class:"search-sheet v-col-12"},{default:t(()=>[e(W,{closesearch:m})]),_:1})):N("",!0),e(D,{class:"mx-3 v-col-3 v-col-xl-2 v-col-lg-4 d-none d-lg-block"},{default:t(()=>[e(W)]),_:1}),e(xe),e(F,{"close-on-content-click":!1},{activator:t(({props:u})=>[e(h,j({icon:"",class:"text-secondary mx-3",color:"lightsecondary",rounded:"sm",size:"small",variant:"flat"},u),{default:t(()=>[e(r(ge),{"stroke-width":"1.5",size:"22"})]),_:2},1040)]),default:t(()=>[e(D,{rounded:"md",width:"330",elevation:"12"},{default:t(()=>[e(qe)]),_:1})]),_:1}),e(F,{"close-on-content-click":!1},{activator:t(({props:u})=>[e(h,j({class:"profileBtn text-primary",color:"lightprimary",variant:"flat",rounded:"pill"},u),{default:t(()=>[e(S,{size:"30",class:"mr-2 py-2"},{default:t(()=>l[1]||(l[1]=[a("img",{src:$,alt:"Julia"},null,-1)])),_:1}),e(r(Q),{"stroke-width":"1.5"})]),_:2},1040)]),default:t(()=>[e(D,{rounded:"md",width:"330",elevation:"12"},{default:t(()=>[e(rt)]),_:1})]),_:1})]),_:1}))}}),dt={class:"pa-5 d-flex justify-space-between align-center"},ut={class:"d-flex justify-space-between align-center pa-5"},ct=_({__name:"CustomizerPanel",setup(i){const o=B(),d=V(["Roboto","Poppins","Inter"]);function m(){o.inputBg=!1,o.fontTheme="Roboto"}return(s,l)=>{const u=w("perfect-scrollbar");return n(),c(q,{app:"",temporary:"",elevation:"10",location:"right",modelValue:r(o).Customizer_drawer,"onUpdate:modelValue":l[3]||(l[3]=f=>r(o).Customizer_drawer=f),width:"350"},{default:t(()=>[e(u,{style:{height:"100%"}},{default:t(()=>[a("div",null,[e(K,{class:"ma-0"},{default:t(()=>[e(R,{cols:"12",class:"pa-0"},{default:t(()=>[a("div",dt,[l[5]||(l[5]=a("div",{class:"text-subtitle-1 font-weight-medium"},"Theme customizer",-1)),a("div",null,[e(h,{color:"error",variant:"outlined",size:"small",class:"mr-2",onClick:m},{default:t(()=>l[4]||(l[4]=[p(" Reset ")])),_:1}),e(h,{variant:"text",color:"lightText",icon:"$close",density:"compact",onClick:l[0]||(l[0]=T(f=>r(o).SET_CUSTOMIZER_DRAWER(!r(o).Customizer_drawer),["stop"]))})])]),e(v)]),_:1}),e(R,{cols:"12",class:"pa-0"},{default:t(()=>[e(ye,{class:"py-5"},{default:t(()=>[e(we,{class:"text-subtitle-1 font-weight-medium mb-4"},{default:t(()=>l[6]||(l[6]=[p("Font Style")])),_:1}),e(ke,{class:"pa-0"},{default:t(()=>[e(O,{modelValue:r(o).fontTheme,"onUpdate:modelValue":l[1]||(l[1]=f=>r(o).fontTheme=f),"hide-details":"",class:"custom-font"},{default:t(()=>[(n(!0),x(k,null,A(d.value,f=>(n(),c(E,{key:f,label:f,value:f,color:"primary",class:"mb-5"},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(v),a("div",ut,[l[7]||(l[7]=a("div",{class:"text-subtitle-1 font-weight-medium"},"Input Background",-1)),a("div",null,[e(O,{class:"custom-radio input-radio ma-n2",modelValue:r(o).inputBg,"onUpdate:modelValue":l[2]||(l[2]=f=>r(o).inputBg=f),"hide-details":""},{default:t(()=>[e(E,{value:!0,color:"primary",class:"ma-2 input-bg"}),e(E,{value:!1,color:"primary",class:"ma-2"})]),_:1},8,["modelValue"])])]),e(v)]),_:1})]),_:1})])]),_:1})]),_:1},8,["modelValue"])}}}),mt={class:"text-body-1 mb-0 text-sm-left text-center"},pt={id:"current-year"},ft=["href"],_t=_({__name:"FooterPanel",setup(i){const o=Z([{title:"Home",url:"/dashboard/default"}]),d=new Date().getFullYear();return(m,s)=>(n(),c(Se,{class:"px-0 footer mt-2"},{default:t(()=>[e(K,{justify:"center",align:"center","no-gutters":""},{default:t(()=>[e(R,{cols:"12",sm:"6"},{default:t(()=>[a("p",mt,[s[0]||(s[0]=p(" © ")),a("span",pt,b(r(d)),1),s[1]||(s[1]=p()),s[2]||(s[2]=a("a",{href:"https://alshoja.github.io/",class:"text-darkText text-decoration-none",target:"_blank"},"Alshoja",-1))])]),_:1}),e(R,{class:"text-sm-right text-center",cols:"12",sm:"6"},{default:t(()=>[(n(!0),x(k,null,A(o.value,(l,u)=>(n(),x("a",{key:u,class:"mx-2 text-body-1 text-darkText text-decoration-none",target:"_blank",href:l.url},b(l.title),9,ft))),128))]),_:1})]),_:1})]),_:1}))}}),vt={key:0,class:"loading-overlay"},ht=_({__name:"GlobalLoader",setup(i){const o=Ve(),d=ze(()=>o.isLoading);return(m,s)=>d.value?(n(),x("div",vt,s[0]||(s[0]=[a("div",{class:"spinner"},null,-1)]))):N("",!0)}}),xt=Ne(ht,[["__scopeId","data-v-5fc88182"]]),wt=_({__name:"FullLayout",setup(i){const o=B();return(d,m)=>{const s=w("SettingsIcon");return n(),c($e,null,{default:t(()=>[e(De,{theme:"PurpleTheme",class:Ie([r(o).fontTheme,r(o).mini_sidebar?"mini-sidebar":"",r(o).inputBg?"inputWithbg":""])},{default:t(()=>[e(ct),e(Ue),e(nt),e(Ce,null,{default:t(()=>[e(J,{fluid:"",class:"page-wrapper"},{default:t(()=>[e(xt),a("div",null,[e(r(Te)),e(h,{class:"customizer-btn",size:"large",icon:"",variant:"flat",color:"secondary",onClick:m[0]||(m[0]=T(l=>r(o).SET_CUSTOMIZER_DRAWER(!r(o).Customizer_drawer),["stop"]))},{default:t(()=>[e(s,{class:"icon"})]),_:1})])]),_:1}),e(J,{fluid:"",class:"pt-0"},{default:t(()=>[a("div",null,[e(_t)])]),_:1})]),_:1})]),_:1},8,["class"])]),_:1})}}});export{wt as default};
