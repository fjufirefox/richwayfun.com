!function(e){var t={};function a(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=0)}([function(e,t,a){e.exports=a(1)},function(e,t){const{registerPlugin:a}=wp.plugins,{PluginSidebar:r,PluginSidebarMoreMenuItem:n}=wp.editPost,{TextControl:s,PanelBody:l,PanelRow:o}=wp.components,{BlockControls:i,InspectorControls:c}=wp.editor,{Fragment:u}=wp.element,d=__("Disable auto insert for this post or page?","yet-another-stars-rating"),p=(__("Rich snippet options","yet-another-stars-rating"),__("Is this a review?","yet-another-stars-rating"),__("Select ItemType ","yet-another-stars-rating"),()=>React.createElement("div",null));class y extends React.Component{shouldComponentUpdate(e,t){return!1}constructor(e){super(e),this.yasrOverallRateThis=__("Rate this article / item","yet-another-stars-rating"),this.yasrOverallMoreInfo=__('This is the same value that you find the "Yasr: Overall Rating" block.',"yet-another-stars-rating")}printDivOverallRater(){return React.createElement("div",null,React.createElement("div",{id:"overall-rater-panel",ref:()=>raterJs({starSize:32,step:.1,showToolTip:!1,rating:wp.data.select("core/editor").getCurrentPost().meta.yasr_overall_rating,readOnly:!1,element:document.querySelector("#overall-rater-panel"),rateCallback:function(e,t){e=e.toFixed(1),e=parseFloat(e),wp.data.dispatch("core/editor").editPost({meta:{yasr_overall_rating:e}}),this.setRating(e),t()}})}),React.createElement("br",null),this.yasrOverallMoreInfo)}render(){return React.createElement("div",null,this.yasrOverallRateThis,React.createElement("div",null,this.printDivOverallRater()))}}class h extends React.Component{constructor(e){super(e);let t=!1;"yes"===wp.data.select("core/editor").getCurrentPost().meta.yasr_auto_insert_disabled&&(t=!0),this.state={postExcluded:t},this.yasrUpdatePostMetaAutoInsert=this.yasrUpdatePostMetaAutoInsert.bind(this)}yasrUpdatePostMetaAutoInsert(e){const t=e.target,a="checkbox"===t.type?t.checked:t.value;this.setState({postExcluded:a}),!0===a?wp.data.dispatch("core/editor").editPost({meta:{yasr_auto_insert_disabled:"yes"}}):wp.data.dispatch("core/editor").editPost({meta:{yasr_auto_insert_disabled:"no"}})}render(){return React.createElement("div",{className:"yasr-guten-block-panel-center"},React.createElement("hr",null),React.createElement("label",null,React.createElement("span",null,d)),React.createElement("div",{className:"yasr-onoffswitch-big yasr-onoffswitch-big-center",id:"yasr-switcher-disable-auto-insert"},React.createElement("input",{type:"checkbox",name:"yasr_auto_insert_disabled",className:"yasr-onoffswitch-checkbox",value:"yes",id:"yasr-auto-insert-disabled-switch",defaultChecked:this.state.postExcluded,onChange:this.yasrUpdatePostMetaAutoInsert}),React.createElement("label",{className:"yasr-onoffswitch-label",htmlFor:"yasr-auto-insert-disabled-switch"},React.createElement("span",{className:"yasr-onoffswitch-inner"}),React.createElement("span",{className:"yasr-onoffswitch-switch"}))))}}class m extends React.Component{constructor(e){super(e);let t=!1;"disabled"!==yasrConstantGutenberg.autoInsert&&(t=!0),this.state={yasrAutoInsertEnabled:t}}render(){return React.createElement(u,null,React.createElement(n,{name:"yasr-sidebar",type:"sidebar",target:"yasr-guten-sidebar"},__("YASR post settings","yet-another-stars-rating")),React.createElement(r,{name:"yasr-guten-sidebar",title:"YASR Settings"},React.createElement(l,null,React.createElement("div",{className:"yasr-guten-block-panel yasr-guten-block-panel-center"},React.createElement(y,null),this.state.yasrAutoInsertEnabled&&React.createElement(h,null),React.createElement(p,null)))))}}a("yasr-sidebar",{icon:"star-half",title:__("Yasr: Page Settings","yet-another-stars-rating"),render:m})}]);