import{_ as kt}from"./LogoDark.vue_vue_type_script_setup_true_lang-Bv-j_eTJ.js";import{G as Mt}from"./social-google-DrU3ibd8.js";import{h as Ge,aY as et,r as xt,aZ as Dt,J as I,au as Le,aa as T,a_ as g,B as H,a$ as z,aC as Ut,b0 as tt,aB as rt,b1 as nt,b2 as zt,b3 as $t,y as Lt,o as qe,u as at,a as S,w as F,b as $,e as Oe,f as je,G as Ue,d as Ve,V as Ae,H as it,aF as qt,b4 as Gt,t as Ht,n as Wt,F as Yt,Q as Kt,c as Jt,ac as Qt,ah as lt,a5 as Zt}from"./index-CW6UmzU3.js";/**
  * vee-validate v4.15.0
  * (c) 2024 Abdelrahman Awad
  * @license MIT
  */function D(e){return typeof e=="function"}function yt(e){return e==null}const ne=e=>e!==null&&!!e&&typeof e=="object"&&!Array.isArray(e);function He(e){return Number(e)>=0}function Xt(e){return typeof e=="object"&&e!==null}function er(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}function ot(e){if(!Xt(e)||er(e)!=="[object Object]")return!1;if(Object.getPrototypeOf(e)===null)return!0;let t=e;for(;Object.getPrototypeOf(t)!==null;)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function se(e,t){return Object.keys(t).forEach(r=>{if(ot(t[r])&&ot(e[r])){e[r]||(e[r]={}),se(e[r],t[r]);return}e[r]=t[r]}),e}function _e(e){const t=e.split(".");if(!t.length)return"";let r=String(t[0]);for(let i=1;i<t.length;i++){if(He(t[i])){r+=`[${t[i]}]`;continue}r+=`.${t[i]}`}return r}const tr={};function rr(e){return tr[e]}function ut(e,t,r){typeof r.value=="object"&&(r.value=O(r.value)),!r.enumerable||r.get||r.set||!r.configurable||!r.writable||t==="__proto__"?Object.defineProperty(e,t,r):e[t]=r.value}function O(e){if(typeof e!="object")return e;var t=0,r,i,l,u=Object.prototype.toString.call(e);if(u==="[object Object]"?l=Object.create(e.__proto__||null):u==="[object Array]"?l=Array(e.length):u==="[object Set]"?(l=new Set,e.forEach(function(m){l.add(O(m))})):u==="[object Map]"?(l=new Map,e.forEach(function(m,h){l.set(O(h),O(m))})):u==="[object Date]"?l=new Date(+e):u==="[object RegExp]"?l=new RegExp(e.source,e.flags):u==="[object DataView]"?l=new e.constructor(O(e.buffer)):u==="[object ArrayBuffer]"?l=e.slice(0):u.slice(-6)==="Array]"&&(l=new e.constructor(e)),l){for(i=Object.getOwnPropertySymbols(e);t<i.length;t++)ut(l,i[t],Object.getOwnPropertyDescriptor(e,i[t]));for(t=0,i=Object.getOwnPropertyNames(e);t<i.length;t++)Object.hasOwnProperty.call(l,r=i[t])&&l[r]===e[r]||ut(l,r,Object.getOwnPropertyDescriptor(e,r))}return l||e}const nr=Symbol("vee-validate-form"),ar=Symbol("vee-validate-form-context"),ir=typeof window<"u";function lr(e){return D(e)&&!!e.__locatorRef}function J(e){return!!e&&D(e.parse)&&e.__type==="VVTypedSchema"}function gt(e){return!!e&&D(e.validate)}function or(e){return e==="checkbox"||e==="radio"}function ur(e){return ne(e)||Array.isArray(e)}function sr(e){return Array.isArray(e)?e.length===0:ne(e)&&Object.keys(e).length===0}function we(e){return/^\[.+\]$/i.test(e)}function cr(e){return pt(e)&&e.multiple}function pt(e){return e.tagName==="SELECT"}function bt(e){return We(e)&&e.target&&"submit"in e.target}function We(e){return e?!!(typeof Event<"u"&&D(Event)&&e instanceof Event||e&&e.srcElement):!1}function ue(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var r,i,l;if(Array.isArray(e)){if(r=e.length,r!=t.length)return!1;for(i=r;i--!==0;)if(!ue(e[i],t[i]))return!1;return!0}if(e instanceof Map&&t instanceof Map){if(e.size!==t.size)return!1;for(i of e.entries())if(!t.has(i[0]))return!1;for(i of e.entries())if(!ue(i[1],t.get(i[0])))return!1;return!0}if(ct(e)&&ct(t))return!(e.size!==t.size||e.name!==t.name||e.lastModified!==t.lastModified||e.type!==t.type);if(e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(i of e.entries())if(!t.has(i[0]))return!1;return!0}if(ArrayBuffer.isView(e)&&ArrayBuffer.isView(t)){if(r=e.length,r!=t.length)return!1;for(i=r;i--!==0;)if(e[i]!==t[i])return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();if(l=Object.keys(e),r=l.length-st(e,l),r!==Object.keys(t).length-st(t,Object.keys(t)))return!1;for(i=r;i--!==0;)if(!Object.prototype.hasOwnProperty.call(t,l[i]))return!1;for(i=r;i--!==0;){var u=l[i];if(!ue(e[u],t[u]))return!1}return!0}return e!==e&&t!==t}function st(e,t){let r=0;for(let l=t.length;l--!==0;){var i=t[l];e[i]===void 0&&r++}return r}function ct(e){return ir?e instanceof File:!1}function Ye(e){return we(e)?e.replace(/\[|\]/gi,""):e}function G(e,t,r){return e?we(t)?e[Ye(t)]:(t||"").split(/\.|\[(\d+)\]/).filter(Boolean).reduce((l,u)=>ur(l)&&u in l?l[u]:r,e):r}function q(e,t,r){if(we(t)){e[Ye(t)]=r;return}const i=t.split(/\.|\[(\d+)\]/).filter(Boolean);let l=e;for(let u=0;u<i.length;u++){if(u===i.length-1){l[i[u]]=r;return}(!(i[u]in l)||yt(l[i[u]]))&&(l[i[u]]=He(i[u+1])?[]:{}),l=l[i[u]]}}function ze(e,t){if(Array.isArray(e)&&He(t)){e.splice(Number(t),1);return}ne(e)&&delete e[t]}function dt(e,t){if(we(t)){delete e[Ye(t)];return}const r=t.split(/\.|\[(\d+)\]/).filter(Boolean);let i=e;for(let u=0;u<r.length;u++){if(u===r.length-1){ze(i,r[u]);break}if(!(r[u]in i)||yt(i[r[u]]))break;i=i[r[u]]}const l=r.map((u,m)=>G(e,r.slice(0,m).join(".")));for(let u=l.length-1;u>=0;u--)if(sr(l[u])){if(u===0){ze(e,r[0]);continue}ze(l[u-1],r[u-1])}}function x(e){return Object.keys(e)}function ft(e,t=0){let r=null,i=[];return function(...l){return r&&clearTimeout(r),r=setTimeout(()=>{const u=e(...l);i.forEach(m=>m(u)),i=[]},t),new Promise(u=>i.push(u))}}function dr(e,t){let r;return async function(...l){const u=e(...l);r=u;const m=await u;return u!==r?m:(r=void 0,t(m,l))}}function vt(e){return Array.isArray(e)?e:e?[e]:[]}function Se(e,t){const r={};for(const i in e)t.includes(i)||(r[i]=e[i]);return r}function fr(e){let t=null,r=[];return function(...i){const l=z(()=>{if(t!==l)return;const u=e(...i);r.forEach(m=>m(u)),r=[],t=null});return t=l,new Promise(u=>r.push(u))}}function vr(e,t,r){return t.slots.default?typeof e=="string"||!e?t.slots.default(r()):{default:()=>{var i,l;return(l=(i=t.slots).default)===null||l===void 0?void 0:l.call(i,r())}}:t.slots.default}function $e(e){if(Ot(e))return e._value}function Ot(e){return"_value"in e}function mr(e){return e.type==="number"||e.type==="range"?Number.isNaN(e.valueAsNumber)?e.value:e.valueAsNumber:e.value}function mt(e){if(!We(e))return e;const t=e.target;if(or(t.type)&&Ot(t))return $e(t);if(t.type==="file"&&t.files){const r=Array.from(t.files);return t.multiple?r:r[0]}if(cr(t))return Array.from(t.options).filter(r=>r.selected&&!r.disabled).map($e);if(pt(t)){const r=Array.from(t.options).find(i=>i.selected);return r?$e(r):t.value}return mr(t)}function hr(e){const t={};return Object.defineProperty(t,"_$$isNormalized",{value:!0,writable:!1,enumerable:!1,configurable:!1}),e?ne(e)&&e._$$isNormalized?e:ne(e)?Object.keys(e).reduce((r,i)=>{const l=yr(e[i]);return e[i]!==!1&&(r[i]=ht(l)),r},t):typeof e!="string"?t:e.split("|").reduce((r,i)=>{const l=gr(i);return l.name&&(r[l.name]=ht(l.params)),r},t):t}function yr(e){return e===!0?[]:Array.isArray(e)||ne(e)?e:[e]}function ht(e){const t=r=>typeof r=="string"&&r[0]==="@"?pr(r.slice(1)):r;return Array.isArray(e)?e.map(t):e instanceof RegExp?[e]:Object.keys(e).reduce((r,i)=>(r[i]=t(e[i]),r),{})}const gr=e=>{let t=[];const r=e.split(":")[0];return e.includes(":")&&(t=e.split(":").slice(1).join(":").split(",")),{name:r,params:t}};function pr(e){const t=r=>{var i;return(i=G(r,e))!==null&&i!==void 0?i:r[e]};return t.__locatorRef=e,t}const br={generateMessage:({field:e})=>`${e} is not valid.`,bails:!0,validateOnBlur:!0,validateOnChange:!0,validateOnInput:!1,validateOnModelUpdate:!0};let Or=Object.assign({},br);const oe=()=>Or;async function Vr(e,t,r={}){const i=r==null?void 0:r.bails,l={name:(r==null?void 0:r.name)||"{field}",rules:t,label:r==null?void 0:r.label,bails:i??!0,formData:(r==null?void 0:r.values)||{}},u=await _r(l,e);return Object.assign(Object.assign({},u),{valid:!u.errors.length})}async function _r(e,t){const r=e.rules;if(J(r)||gt(r))return Er(t,Object.assign(Object.assign({},e),{rules:r}));if(D(r)||Array.isArray(r)){const h={field:e.label||e.name,name:e.name,label:e.label,form:e.formData,value:t},p=Array.isArray(r)?r:[r],d=p.length,c=[];for(let E=0;E<d;E++){const A=p[E],b=await A(t,h);if(!(typeof b!="string"&&!Array.isArray(b)&&b)){if(Array.isArray(b))c.push(...b);else{const U=typeof b=="string"?b:_t(h);c.push(U)}if(e.bails)return{errors:c}}}return{errors:c}}const i=Object.assign(Object.assign({},e),{rules:hr(r)}),l=[],u=Object.keys(i.rules),m=u.length;for(let h=0;h<m;h++){const p=u[h],d=await jr(i,t,{name:p,params:i.rules[p]});if(d.error&&(l.push(d.error),e.bails))return{errors:l}}return{errors:l}}function Sr(e){return!!e&&e.name==="ValidationError"}function Vt(e){return{__type:"VVTypedSchema",async parse(r,i){var l;try{return{output:await e.validate(r,{abortEarly:!1,context:(i==null?void 0:i.formData)||{}}),errors:[]}}catch(u){if(!Sr(u))throw u;if(!(!((l=u.inner)===null||l===void 0)&&l.length)&&u.errors.length)return{errors:[{path:u.path,errors:u.errors}]};const m=u.inner.reduce((h,p)=>{const d=p.path||"";return h[d]||(h[d]={errors:[],path:d}),h[d].errors.push(...p.errors),h},{});return{errors:Object.values(m)}}}}}async function Er(e,t){const i=await(J(t.rules)?t.rules:Vt(t.rules)).parse(e,{formData:t.formData}),l=[];for(const u of i.errors)u.errors.length&&l.push(...u.errors);return{value:i.value,errors:l}}async function jr(e,t,r){const i=rr(r.name);if(!i)throw new Error(`No such validator '${r.name}' exists.`);const l=Ar(r.params,e.formData),u={field:e.label||e.name,name:e.name,label:e.label,value:t,form:e.formData,rule:Object.assign(Object.assign({},r),{params:l})},m=await i(t,l,u);return typeof m=="string"?{error:m}:{error:m?void 0:_t(u)}}function _t(e){const t=oe().generateMessage;return t?t(e):"Field is invalid"}function Ar(e,t){const r=i=>lr(i)?i(t):i;return Array.isArray(e)?e.map(r):Object.keys(e).reduce((i,l)=>(i[l]=r(e[l]),i),{})}async function wr(e,t){const i=await(J(e)?e:Vt(e)).parse(O(t),{formData:O(t)}),l={},u={};for(const m of i.errors){const h=m.errors,p=(m.path||"").replace(/\["(\d+)"\]/g,(d,c)=>`[${c}]`);l[p]={valid:!h.length,errors:h},h.length&&(u[p]=h[0])}return{valid:!i.errors.length,results:l,errors:u,values:i.value,source:"schema"}}async function Fr(e,t,r){const l=x(e).map(async d=>{var c,E,A;const b=(c=r==null?void 0:r.names)===null||c===void 0?void 0:c[d],B=await Vr(G(t,d),e[d],{name:(b==null?void 0:b.name)||d,label:b==null?void 0:b.label,values:t,bails:(A=(E=r==null?void 0:r.bailsMap)===null||E===void 0?void 0:E[d])!==null&&A!==void 0?A:!0});return Object.assign(Object.assign({},B),{path:d})});let u=!0;const m=await Promise.all(l),h={},p={};for(const d of m)h[d.path]={valid:d.valid,errors:d.errors},d.valid||(u=!1,p[d.path]=d.errors[0]);return{valid:u,results:h,errors:p,source:"schema"}}let Pr=0;const Ee=["bails","fieldsCount","id","multiple","type","validate"];function St(e){const t=(e==null?void 0:e.initialValues)||{},r=Object.assign({},g(t)),i=H(e==null?void 0:e.validationSchema);return i&&J(i)&&D(i.cast)?O(i.cast(r)||{}):O(r)}function Cr(e){var t;const r=Pr++,i=(e==null?void 0:e.name)||"Form";let l=0;const u=I(!1),m=I(!1),h=I(0),p=[],d=Le(St(e)),c=I([]),E=I({}),A=I({}),b=fr(()=>{A.value=c.value.reduce((a,n)=>(a[_e(g(n.path))]=n,a),{})});function B(a,n){const o=V(a);if(!o){typeof a=="string"&&(E.value[_e(a)]=vt(n));return}if(typeof a=="string"){const s=_e(a);E.value[s]&&delete E.value[s]}o.errors=vt(n),o.valid=!o.errors.length}function U(a){x(a).forEach(n=>{B(n,a[n])})}e!=null&&e.initialErrors&&U(e.initialErrors);const Q=T(()=>{const a=c.value.reduce((n,o)=>(o.errors.length&&(n[g(o.path)]=o.errors),n),{});return Object.assign(Object.assign({},E.value),a)}),ee=T(()=>x(Q.value).reduce((a,n)=>{const o=Q.value[n];return o!=null&&o.length&&(a[n]=o[0]),a},{})),ce=T(()=>c.value.reduce((a,n)=>(a[g(n.path)]={name:g(n.path)||"",label:n.label||""},a),{})),de=T(()=>c.value.reduce((a,n)=>{var o;return a[g(n.path)]=(o=n.bails)!==null&&o!==void 0?o:!0,a},{})),ae=Object.assign({},(e==null?void 0:e.initialErrors)||{}),fe=(t=e==null?void 0:e.keepValuesOnUnmount)!==null&&t!==void 0?t:!1,{initialValues:W,originalInitialValues:Y,setInitialValues:ve}=Ir(c,d,e),Fe=Tr(c,d,Y,ee),me=T(()=>c.value.reduce((a,n)=>{const o=G(d,g(n.path));return q(a,g(n.path),o),a},{})),k=e==null?void 0:e.validationSchema;function Z(a,n){var o,s;const v=T(()=>G(W.value,g(a))),y=A.value[g(a)],f=(n==null?void 0:n.type)==="checkbox"||(n==null?void 0:n.type)==="radio";if(y&&f){y.multiple=!0;const M=l++;return Array.isArray(y.id)?y.id.push(M):y.id=[y.id,M],y.fieldsCount++,y.__flags.pendingUnmount[M]=!1,y}const j=T(()=>G(d,g(a))),w=g(a),P=te.findIndex(M=>M===w);P!==-1&&te.splice(P,1);const _=T(()=>{var M,le,ke,Me;const xe=g(k);if(J(xe))return(le=(M=xe.describe)===null||M===void 0?void 0:M.call(xe,g(a)).required)!==null&&le!==void 0?le:!1;const De=g(n==null?void 0:n.schema);return J(De)&&(Me=(ke=De.describe)===null||ke===void 0?void 0:ke.call(De).required)!==null&&Me!==void 0?Me:!1}),C=l++,N=Le({id:C,path:a,touched:!1,pending:!1,valid:!0,validated:!!(!((o=ae[w])===null||o===void 0)&&o.length),required:_,initialValue:v,errors:Lt([]),bails:(s=n==null?void 0:n.bails)!==null&&s!==void 0?s:!1,label:n==null?void 0:n.label,type:(n==null?void 0:n.type)||"default",value:j,multiple:!1,__flags:{pendingUnmount:{[C]:!1},pendingReset:!1},fieldsCount:1,validate:n==null?void 0:n.validate,dirty:T(()=>!ue(H(j),H(v)))});return c.value.push(N),A.value[w]=N,b(),ee.value[w]&&!ae[w]&&z(()=>{X(w,{mode:"silent"})}),tt(a)&&rt(a,M=>{b();const le=O(j.value);A.value[M]=N,z(()=>{q(d,M,le)})}),N}const he=ft(Ze,5),ye=ft(Ze,5),ge=dr(async a=>await(a==="silent"?he():ye()),(a,[n])=>{const o=x(L.errorBag.value),v=[...new Set([...x(a.results),...c.value.map(y=>y.path),...o])].sort().reduce((y,f)=>{var j;const w=f,P=V(w)||ie(w),_=((j=a.results[w])===null||j===void 0?void 0:j.errors)||[],C=g(P==null?void 0:P.path)||w,N=Br({errors:_,valid:!_.length},y.results[C]);return y.results[C]=N,N.valid||(y.errors[C]=N.errors[0]),P&&E.value[C]&&delete E.value[C],P?(P.valid=N.valid,n==="silent"||n==="validated-only"&&!P.validated||B(P,N.errors),y):(B(C,_),y)},{valid:a.valid,results:{},errors:{},source:a.source});return a.values&&(v.values=a.values,v.source=a.source),x(v.results).forEach(y=>{var f;const j=V(y);j&&n!=="silent"&&(n==="validated-only"&&!j.validated||B(j,(f=v.results[y])===null||f===void 0?void 0:f.errors))}),v});function R(a){c.value.forEach(a)}function V(a){const n=typeof a=="string"?_e(a):a;return typeof n=="string"?A.value[n]:n}function ie(a){return c.value.filter(o=>a.startsWith(g(o.path))).reduce((o,s)=>o?s.path.length>o.path.length?s:o:s,void 0)}let te=[],pe;function Et(a){return te.push(a),pe||(pe=z(()=>{[...te].sort().reverse().forEach(o=>{dt(d,o)}),te=[],pe=null})),pe}function Ke(a){return function(o,s){return function(y){return y instanceof Event&&(y.preventDefault(),y.stopPropagation()),R(f=>f.touched=!0),u.value=!0,h.value++,re().then(f=>{const j=O(d);if(f.valid&&typeof o=="function"){const w=O(me.value);let P=a?w:j;return f.values&&(P=f.source==="schema"?f.values:Object.assign({},P,f.values)),o(P,{evt:y,controlledValues:w,setErrors:U,setFieldError:B,setTouched:Ie,setFieldTouched:be,setValues:Ce,setFieldValue:K,resetForm:Be,resetField:Je})}!f.valid&&typeof s=="function"&&s({values:j,evt:y,errors:f.errors,results:f.results})}).then(f=>(u.value=!1,f),f=>{throw u.value=!1,f})}}}const Pe=Ke(!1);Pe.withControlled=Ke(!0);function jt(a,n){const o=c.value.findIndex(v=>v.path===a&&(Array.isArray(v.id)?v.id.includes(n):v.id===n)),s=c.value[o];if(!(o===-1||!s)){if(z(()=>{X(a,{mode:"silent",warn:!1})}),s.multiple&&s.fieldsCount&&s.fieldsCount--,Array.isArray(s.id)){const v=s.id.indexOf(n);v>=0&&s.id.splice(v,1),delete s.__flags.pendingUnmount[n]}(!s.multiple||s.fieldsCount<=0)&&(c.value.splice(o,1),Qe(a),b(),delete A.value[a])}}function At(a){x(A.value).forEach(n=>{n.startsWith(a)&&delete A.value[n]}),c.value=c.value.filter(n=>!n.path.startsWith(a)),z(()=>{b()})}const L={name:i,formId:r,values:d,controlledValues:me,errorBag:Q,errors:ee,schema:k,submitCount:h,meta:Fe,isSubmitting:u,isValidating:m,fieldArrays:p,keepValuesOnUnmount:fe,validateSchema:H(k)?ge:void 0,validate:re,setFieldError:B,validateField:X,setFieldValue:K,setValues:Ce,setErrors:U,setFieldTouched:be,setTouched:Ie,resetForm:Be,resetField:Je,handleSubmit:Pe,useFieldModel:Bt,defineInputBinds:Rt,defineComponentBinds:Nt,defineField:Ne,stageInitialValue:Tt,unsetInitialValue:Qe,setFieldInitialValue:Re,createPathState:Z,getPathState:V,unsetPathValue:Et,removePathState:jt,initialValues:W,getAllPathStates:()=>c.value,destroyPath:At,isFieldTouched:Ft,isFieldDirty:Pt,isFieldValid:Ct};function K(a,n,o=!0){const s=O(n),v=typeof a=="string"?a:a.path;V(v)||Z(v),q(d,v,s),o&&X(v)}function wt(a,n=!0){x(d).forEach(o=>{delete d[o]}),x(a).forEach(o=>{K(o,a[o],!1)}),n&&re()}function Ce(a,n=!0){se(d,a),p.forEach(o=>o&&o.reset()),n&&re()}function Te(a,n){const o=V(g(a))||Z(a);return T({get(){return o.value},set(s){var v;const y=g(a);K(y,s,(v=g(n))!==null&&v!==void 0?v:!1)}})}function be(a,n){const o=V(a);o&&(o.touched=n)}function Ft(a){const n=V(a);return n?n.touched:c.value.filter(o=>o.path.startsWith(a)).some(o=>o.touched)}function Pt(a){const n=V(a);return n?n.dirty:c.value.filter(o=>o.path.startsWith(a)).some(o=>o.dirty)}function Ct(a){const n=V(a);return n?n.valid:c.value.filter(o=>o.path.startsWith(a)).every(o=>o.valid)}function Ie(a){if(typeof a=="boolean"){R(n=>{n.touched=a});return}x(a).forEach(n=>{be(n,!!a[n])})}function Je(a,n){var o;const s=n&&"value"in n?n.value:G(W.value,a),v=V(a);v&&(v.__flags.pendingReset=!0),Re(a,O(s),!0),K(a,s,!1),be(a,(o=n==null?void 0:n.touched)!==null&&o!==void 0?o:!1),B(a,(n==null?void 0:n.errors)||[]),z(()=>{v&&(v.__flags.pendingReset=!1)})}function Be(a,n){let o=O(a!=null&&a.values?a.values:Y.value);o=n!=null&&n.force?o:se(Y.value,o),o=J(k)&&D(k.cast)?k.cast(o):o,ve(o,{force:n==null?void 0:n.force}),R(s=>{var v;s.__flags.pendingReset=!0,s.validated=!1,s.touched=((v=a==null?void 0:a.touched)===null||v===void 0?void 0:v[g(s.path)])||!1,K(g(s.path),G(o,g(s.path)),!1),B(g(s.path),void 0)}),n!=null&&n.force?wt(o,!1):Ce(o,!1),U((a==null?void 0:a.errors)||{}),h.value=(a==null?void 0:a.submitCount)||0,z(()=>{re({mode:"silent"}),R(s=>{s.__flags.pendingReset=!1})})}async function re(a){const n=(a==null?void 0:a.mode)||"force";if(n==="force"&&R(f=>f.validated=!0),L.validateSchema)return L.validateSchema(n);m.value=!0;const o=await Promise.all(c.value.map(f=>f.validate?f.validate(a).then(j=>({key:g(f.path),valid:j.valid,errors:j.errors,value:j.value})):Promise.resolve({key:g(f.path),valid:!0,errors:[],value:void 0})));m.value=!1;const s={},v={},y={};for(const f of o)s[f.key]={valid:f.valid,errors:f.errors},f.value&&q(y,f.key,f.value),f.errors.length&&(v[f.key]=f.errors[0]);return{valid:o.every(f=>f.valid),results:s,errors:v,values:y,source:"fields"}}async function X(a,n){var o;const s=V(a);if(s&&(n==null?void 0:n.mode)!=="silent"&&(s.validated=!0),k){const{results:v}=await ge((n==null?void 0:n.mode)||"validated-only");return v[a]||{errors:[],valid:!0}}return s!=null&&s.validate?s.validate(n):(!s&&(o=n==null?void 0:n.warn),Promise.resolve({errors:[],valid:!0}))}function Qe(a){dt(W.value,a)}function Tt(a,n,o=!1){Re(a,n),q(d,a,n),o&&!(e!=null&&e.initialValues)&&q(Y.value,a,O(n))}function Re(a,n,o=!1){q(W.value,a,O(n)),o&&q(Y.value,a,O(n))}async function Ze(){const a=H(k);if(!a)return{valid:!0,results:{},errors:{},source:"none"};m.value=!0;const n=gt(a)||J(a)?await wr(a,d):await Fr(a,d,{names:ce.value,bailsMap:de.value});return m.value=!1,n}const It=Pe((a,{evt:n})=>{bt(n)&&n.target.submit()});Ut(()=>{if(e!=null&&e.initialErrors&&U(e.initialErrors),e!=null&&e.initialTouched&&Ie(e.initialTouched),e!=null&&e.validateOnMount){re();return}L.validateSchema&&L.validateSchema("silent")}),tt(k)&&rt(k,()=>{var a;(a=L.validateSchema)===null||a===void 0||a.call(L,"validated-only")}),nt(nr,L);function Ne(a,n){const o=D(n)||n==null?void 0:n.label,s=V(g(a))||Z(a,{label:o}),v=()=>D(n)?n(Se(s,Ee)):n||{};function y(){var _;s.touched=!0,((_=v().validateOnBlur)!==null&&_!==void 0?_:oe().validateOnBlur)&&X(g(s.path))}function f(){var _;((_=v().validateOnInput)!==null&&_!==void 0?_:oe().validateOnInput)&&z(()=>{X(g(s.path))})}function j(){var _;((_=v().validateOnChange)!==null&&_!==void 0?_:oe().validateOnChange)&&z(()=>{X(g(s.path))})}const w=T(()=>{const _={onChange:j,onInput:f,onBlur:y};return D(n)?Object.assign(Object.assign({},_),n(Se(s,Ee)).props||{}):n!=null&&n.props?Object.assign(Object.assign({},_),n.props(Se(s,Ee))):_});return[Te(a,()=>{var _,C,N;return(N=(_=v().validateOnModelUpdate)!==null&&_!==void 0?_:(C=oe())===null||C===void 0?void 0:C.validateOnModelUpdate)!==null&&N!==void 0?N:!0}),w]}function Bt(a){return Array.isArray(a)?a.map(n=>Te(n,!0)):Te(a)}function Rt(a,n){const[o,s]=Ne(a,n);function v(){s.value.onBlur()}function y(j){const w=mt(j);K(g(a),w,!1),s.value.onInput()}function f(j){const w=mt(j);K(g(a),w,!1),s.value.onChange()}return T(()=>Object.assign(Object.assign({},s.value),{onBlur:v,onInput:y,onChange:f,value:o.value}))}function Nt(a,n){const[o,s]=Ne(a,n),v=V(g(a));function y(f){o.value=f}return T(()=>{const f=D(n)?n(Se(v,Ee)):n||{};return Object.assign({[f.model||"modelValue"]:o.value,[`onUpdate:${f.model||"modelValue"}`]:y},s.value)})}const Xe=Object.assign(Object.assign({},L),{values:zt(d),handleReset:()=>Be(),submitForm:It});return nt(ar,Xe),Xe}function Tr(e,t,r,i){const l={touched:"some",pending:"some",valid:"every"},u=T(()=>!ue(t,H(r)));function m(){const p=e.value;return x(l).reduce((d,c)=>{const E=l[c];return d[c]=p[E](A=>A[c]),d},{})}const h=Le(m());return $t(()=>{const p=m();h.touched=p.touched,h.valid=p.valid,h.pending=p.pending}),T(()=>Object.assign(Object.assign({initialValues:H(r)},h),{valid:h.valid&&!x(i.value).length,dirty:u.value}))}function Ir(e,t,r){const i=St(r),l=I(i),u=I(O(i));function m(h,p){p!=null&&p.force?(l.value=O(h),u.value=O(h)):(l.value=se(O(l.value)||{},O(h)),u.value=se(O(u.value)||{},O(h))),p!=null&&p.updateFields&&e.value.forEach(d=>{if(d.touched)return;const E=G(l.value,g(d.path));q(t,g(d.path),O(E))})}return{initialValues:l,originalInitialValues:u,setInitialValues:m}}function Br(e,t){return t?{valid:e.valid&&t.valid,errors:[...e.errors,...t.errors]}:e}const Rr=Ge({name:"Form",inheritAttrs:!1,props:{as:{type:null,default:"form"},validationSchema:{type:Object,default:void 0},initialValues:{type:Object,default:void 0},initialErrors:{type:Object,default:void 0},initialTouched:{type:Object,default:void 0},validateOnMount:{type:Boolean,default:!1},onSubmit:{type:Function,default:void 0},onInvalidSubmit:{type:Function,default:void 0},keepValues:{type:Boolean,default:!1},name:{type:String,default:"Form"}},setup(e,t){const r=et(e,"validationSchema"),i=et(e,"keepValues"),{errors:l,errorBag:u,values:m,meta:h,isSubmitting:p,isValidating:d,submitCount:c,controlledValues:E,validate:A,validateField:b,handleReset:B,resetForm:U,handleSubmit:Q,setErrors:ee,setFieldError:ce,setFieldValue:de,setValues:ae,setFieldTouched:fe,setTouched:W,resetField:Y}=Cr({validationSchema:r.value?r:void 0,initialValues:e.initialValues,initialErrors:e.initialErrors,initialTouched:e.initialTouched,validateOnMount:e.validateOnMount,keepValuesOnUnmount:i,name:e.name}),ve=Q((R,{evt:V})=>{bt(V)&&V.target.submit()},e.onInvalidSubmit),Fe=e.onSubmit?Q(e.onSubmit,e.onInvalidSubmit):ve;function me(R){We(R)&&R.preventDefault(),B(),typeof t.attrs.onReset=="function"&&t.attrs.onReset()}function k(R,V){return Q(typeof R=="function"&&!V?R:V,e.onInvalidSubmit)(R)}function Z(){return O(m)}function he(){return O(h.value)}function ye(){return O(l.value)}function ge(){return{meta:h.value,errors:l.value,errorBag:u.value,values:m,isSubmitting:p.value,isValidating:d.value,submitCount:c.value,controlledValues:E.value,validate:A,validateField:b,handleSubmit:k,handleReset:B,submitForm:ve,setErrors:ee,setFieldError:ce,setFieldValue:de,setValues:ae,setFieldTouched:fe,setTouched:W,resetForm:U,resetField:Y,getValues:Z,getMeta:he,getErrors:ye}}return t.expose({setFieldError:ce,setErrors:ee,setFieldValue:de,setValues:ae,setFieldTouched:fe,setTouched:W,resetForm:U,validate:A,validateField:b,resetField:Y,getValues:Z,getMeta:he,getErrors:ye,values:m,meta:h,errors:l}),function(){const V=e.as==="form"?e.as:e.as?xt(e.as):null,ie=vr(V,t,ge);return V?Dt(V,Object.assign(Object.assign(Object.assign({},V==="form"?{novalidate:!0}:{}),t.attrs),{onSubmit:Fe,onReset:me}),ie):ie}}}),Nr=Rr,kr=["src"],Mr={class:"d-sm-flex align-center mt-2 mb-7 mb-sm-0"},xr={key:0,class:"mt-2"},Dr={class:"mt-5 text-right"},Ur=Ge({__name:"AuthLogin",setup(e){const t=I(!1),r=I(!1),i=I(!1),l=I(""),u=I(""),m=I([d=>!!d||"Password is required"]),h=I([d=>!!d||"E-mail is required",d=>/.+@.+\..+/.test(d)||"E-mail must be valid"]);function p(d,{setErrors:c}){return Kt().login(u.value,l.value).catch(A=>{c({apiError:A.response.data.message})})}return(d,c)=>(qe(),at(Yt,null,[S(Oe,{block:"",color:"primary",variant:"outlined",class:"text-lightText googleBtn"},{default:F(()=>[$("img",{src:H(Mt),alt:"google"},null,8,kr),c[4]||(c[4]=$("span",{class:"ml-2"},"Sign in with Google",-1))]),_:1}),S(Ae,null,{default:F(()=>[S(je,{class:"d-flex align-center"},{default:F(()=>[S(Ue,{class:"custom-devider"}),S(Oe,{variant:"outlined",class:"orbtn",rounded:"md",size:"small"},{default:F(()=>c[5]||(c[5]=[Ve("OR")])),_:1}),S(Ue,{class:"custom-devider"})]),_:1})]),_:1}),c[9]||(c[9]=$("h5",{class:"text-h5 text-center my-4 mb-8"},"Sign in with Email address",-1)),S(H(Nr),{onSubmit:p,class:"mt-7 loginForm"},{default:F(({errors:E,isSubmitting:A})=>[S(it,{modelValue:u.value,"onUpdate:modelValue":c[0]||(c[0]=b=>u.value=b),rules:h.value,label:"Email Address / Username",class:"mt-4 mb-8",required:"",density:"comfortable","hide-details":"auto",variant:"outlined",color:"primary"},null,8,["modelValue","rules"]),S(it,{modelValue:l.value,"onUpdate:modelValue":c[1]||(c[1]=b=>l.value=b),rules:m.value,label:"Password",required:"",density:"comfortable",variant:"outlined",color:"primary","hide-details":"auto","append-icon":i.value?"$eye":"$eyeOff",type:i.value?"text":"password","onClick:append":c[2]||(c[2]=b=>i.value=!i.value),class:"pwdInput"},null,8,["modelValue","rules","append-icon","type"]),$("div",Mr,[S(qt,{modelValue:t.value,"onUpdate:modelValue":c[3]||(c[3]=b=>t.value=b),rules:[b=>!!b||"You must agree to continue!"],label:"Remember me?",required:"",color:"primary",class:"ms-n2","hide-details":""},null,8,["modelValue","rules"]),c[6]||(c[6]=$("div",{class:"ml-auto"},[$("a",{href:"javascript:void(0)",class:"text-primary text-decoration-none"},"Forgot password?")],-1))]),S(Oe,{color:"secondary",loading:A,block:"",class:"mt-2",variant:"flat",size:"large",disabled:r.value,type:"submit"},{default:F(()=>c[7]||(c[7]=[Ve(" Sign In")])),_:2},1032,["loading","disabled"]),E.apiError?(qe(),at("div",xr,[S(Gt,{color:"error"},{default:F(()=>[Ve(Ht(E.apiError),1)]),_:2},1024)])):Wt("",!0)]),_:1}),$("div",Dr,[S(Ue),S(Oe,{variant:"plain",to:"/auth/register",class:"mt-2 text-capitalize mr-n2"},{default:F(()=>c[8]||(c[8]=[Ve("Don't Have an account?")])),_:1})])],64))}}),zr={class:"pa-7 pa-sm-12"},Hr=Ge({__name:"LoginPage",setup(e){return(t,r)=>(qe(),Jt(Ae,{class:"h-screen","no-gutters":""},{default:F(()=>[S(je,{cols:"12",class:"d-flex align-center bg-lightprimary"},{default:F(()=>[S(Qt,null,{default:F(()=>[$("div",zr,[S(Ae,{justify:"center"},{default:F(()=>[S(je,{cols:"12",lg:"10",xl:"6",md:"7"},{default:F(()=>[S(lt,{elevation:"0",class:"loginBox"},{default:F(()=>[S(lt,{variant:"outlined"},{default:F(()=>[S(Zt,{class:"pa-9"},{default:F(()=>[S(Ae,null,{default:F(()=>[S(je,{cols:"12",class:"text-center"},{default:F(()=>[S(kt),r[0]||(r[0]=$("h2",{class:"text-secondary text-h2 mt-8"},"Hi, Welcome Back",-1)),r[1]||(r[1]=$("h4",{class:"text-disabled text-h4 mt-3"},"Enter your credentials to continue",-1))]),_:1})]),_:1}),S(Ur)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})])]),_:1})]),_:1})]),_:1}))}});export{Hr as default};
