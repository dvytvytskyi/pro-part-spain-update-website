import{c as v,u as P,a as S,j as e,H as N}from"./index-Bt-nM8nf.js";import{r as n}from"./mapbox-gl-BQyo5stt.js";import{P as C}from"./PropertyGrid-BnOxDPFl.js";import{g as z}from"./client-DjafAzYx.js";/* empty css                          */import{C as L}from"./check-BpS2--3V.js";import{c as T}from"./vendor-CWHnZUEh.js";import"./chevron-left-B8F2JZZz.js";import"./chevron-right-DqiLAAY1.js";const F=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],I=v("share-2",F);function B(){const{t:i}=P(),[x]=T(),{favorites:c}=S(),[s,m]=n.useState([]),[h,d]=n.useState(!0),[o,k]=n.useState("all"),[f,b]=n.useState(!1),[g,u]=n.useState(!1),l=x.get("ids");n.useEffect(()=>{(async()=>{d(!0);const r=l?l.split(","):c;if(b(!!l),!r||r.length===0){m([]),d(!1);return}try{const p=(await z({ids:r.join(","),limit:9999})).data||[];m(p)}catch(a){console.error("Failed to load liked properties",a)}finally{d(!1)}})()},[l,c]);const w=n.useMemo(()=>o==="all"?s:s.filter(t=>{const r=(t.property_type||"").toLowerCase(),a=(t.type||"").toLowerCase();if(o==="new-building")return r.includes("new building")||r.includes("off-plan")||a.includes("off-plan");if(o==="rent")return r.includes("rent")||a.includes("rent");if(o==="secondary"){const p=r.includes("new building")||r.includes("off-plan")||a.includes("off-plan"),j=r.includes("rent")||a.includes("rent");return!p&&!j}return!0}),[s,o]),y=async()=>{const t=c.join(","),r=`${window.location.origin}/liked?ids=${t}`;try{await navigator.clipboard.writeText(r),u(!0),setTimeout(()=>u(!1),2e3)}catch(a){console.error("Failed to copy",a)}};return e.jsxs("div",{className:"liked-page",children:[e.jsx("style",{children:`
                .liked-page-container {
                    margin-top: 120px;
                    margin-bottom: 4rem;
                }
                .liked-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .liked-title {
                    font-size: 2rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .liked-tabs-container {
                    background: #f4f4f4;
                    padding: 6px;
                    border-radius: 12px;
                    display: inline-flex;
                    gap: 4px;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                }
                .liked-tab-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: #666;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: capitalize;
                    white-space: nowrap;
                }
                .liked-tab-btn.active {
                    background: #fff;
                    color: #000;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }

                @media (max-width: 768px) {
                    .liked-page-container {
                        margin-top: 90px;
                        margin-bottom: 2rem;
                    }
                    .liked-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    .liked-header > div {
                        width: 100%;
                    }
                    .share-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    .liked-title {
                        font-size: 1.75rem;
                    }
                    .liked-tabs-container {
                        width: 100%;
                        overflow-x: auto;
                        flex-wrap: nowrap;
                        display: flex;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none; /* Firefox */
                    }
                    .liked-tabs-container::-webkit-scrollbar {
                        display: none; /* Chrome/Safari */
                    }
                    .liked-tab-btn {
                        flex-shrink: 0;
                        font-size: 14px;
                    }
                }
            `}),e.jsxs("div",{className:"container liked-page-container",children:[e.jsxs("div",{className:"liked-header",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"liked-title",children:[e.jsx(N,{fill:"#d20c0c",color:"#d20c0c"}),i(f?"pages.liked.titleShared":"pages.liked.titleMy")]}),e.jsx("p",{style:{color:"#666",marginTop:"0.5rem"},children:i("pages.liked.savedCount").replace("{count}",s.length)})]}),!f&&s.length>0&&e.jsxs("button",{onClick:y,className:"share-btn",style:{display:"flex",alignItems:"center",gap:"8px",padding:"10px 20px",background:"#313131",color:"white",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"0.9rem",fontWeight:500,transition:"all 0.2s"},children:[g?e.jsx(L,{size:18}):e.jsx(I,{size:18}),i(g?"pages.liked.copied":"pages.liked.share")]})]}),s.length>0&&e.jsx("div",{className:"liked-tabs-container",children:["all","new-building","secondary","rent"].map(t=>e.jsx("button",{onClick:()=>k(t),className:`liked-tab-btn ${o===t?"active":""}`,children:i(t==="all"?"filters.all":t==="new-building"?"nav.newBuilding":t==="secondary"?"nav.secondary":"nav.rent")},t))}),e.jsx("div",{className:"liked-grid",children:e.jsx(C,{properties:w,loading:h,currentPage:1,totalPages:1})})]})]})}export{B as default};
