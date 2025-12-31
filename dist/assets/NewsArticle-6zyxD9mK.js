import{c as u,u as f,j as e}from"./index-BN0U1Jbm.js";import{r as n}from"./mapbox-gl-Baw0grWs.js";import{d as b}from"./client-DjafAzYx.js";/* empty css                          */import{d as w,L as s}from"./vendor-B3DjV561.js";import{C as l}from"./chevron-right-Co77G4Ek.js";const j=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],y=u("calendar",j);function P(){const{t:a,language:r}=f(),{id:o}=w(),[t,m]=n.useState(null),[d,c]=n.useState(!0);if(n.useEffect(()=>{(async()=>{c(!0);const x=await b(o);m(x),c(!1)})()},[o]),d)return e.jsx("div",{className:"container",style:{marginTop:"140px",minHeight:"60vh",display:"flex",justifyContent:"center",alignItems:"center"},children:e.jsx("div",{className:"skeleton-pulse",style:{width:"100%",maxWidth:"800px",height:"400px",borderRadius:"16px"}})});if(!t)return e.jsxs("div",{className:"container",style:{marginTop:"140px",textAlign:"center"},children:[e.jsx("h2",{children:a("pages.newsPage.notFound")}),e.jsx(s,{to:"/news",className:"back-link",children:a("pages.newsPage.backToNews")})]});const i=t["title_"+r]||t.title_en||t.title,p=t["content_"+r]||t.content_en||t.content||t.description_en||"",h=new Date(t.created_at).toLocaleDateString(r==="es"?"es-ES":r==="ru"?"ru-RU":"en-GB",{day:"numeric",month:"long",year:"numeric"}),g=t.featured_image_url||t.image_url||"/placeholder.jpg";return e.jsxs("div",{className:"news-article-page",children:[e.jsx("style",{children:`
                .news-article-page {
                    padding-top: 120px;
                    padding-bottom: 4rem;
                }
                .article-container {
                    max-width: 900px; /* Readability width */
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                .breadcrumbs {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #888;
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                }
                .breadcrumbs a {
                    color: #888;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .breadcrumbs a:hover {
                    color: #313131;
                }
                .breadcrumb-current {
                    color: #313131;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .article-image {
                    width: 100%;
                    height: auto;
                    max-height: 600px;
                    object-fit: cover;
                    border-radius: 16px;
                    margin-bottom: 3rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .article-header {
                    margin-bottom: 2rem;
                }
                .article-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1a1a1a; /* Standard dark color */
                    line-height: 1.2;
                    margin-bottom: 1rem;
                    font-family: 'Poppins', sans-serif;
                }
                .article-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #888;
                    font-size: 0.95rem;
                }
                .article-content {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #444;
                    font-family: 'Poppins', sans-serif;
                }
                .article-content h2, .article-content h3 {
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #1a1a1a; /* Standard dark color */
                    font-family: 'Poppins', sans-serif;
                }
                .article-content p {
                    margin-bottom: 1.5rem;
                }
                .article-content ul {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
                .article-content img {
                    max-width: 100%;
                    border-radius: 12px;
                    margin: 2rem 0;
                }
                @media (max-width: 768px) {
                    .news-article-page {
                        padding-top: 90px;
                    }
                    .article-title {
                        font-size: 2rem;
                    }
                }
            `}),e.jsxs("div",{className:"article-container",children:[e.jsxs("div",{className:"breadcrumbs",children:[e.jsx(s,{to:"/",children:a("nav.home")}),e.jsx(l,{size:14}),e.jsx(s,{to:"/news",children:a("nav.news")}),e.jsx(l,{size:14}),e.jsx("span",{className:"breadcrumb-current",children:i})]}),e.jsxs("div",{className:"article-header",children:[e.jsx("img",{src:g,alt:i,className:"article-image"}),e.jsx("h1",{className:"article-title",children:i}),e.jsxs("div",{className:"article-meta",children:[e.jsx(y,{size:16}),e.jsx("span",{children:h})]})]}),e.jsx("div",{className:"article-content",dangerouslySetInnerHTML:{__html:p}})]})]})}export{P as default};
