export const OWNER='nguyenthanhtruongthong@gmail.com';
export const SITE='https://truongthongportfolio.netlify.app';
export const CMS='https://truongthong-cms.netlify.app';
const categories=new Set(['branding','web','app','campaigns','print','illustration']);
export function validate(doc){
 const bad=m=>{throw Object.assign(new Error(m),{status:400});};
 if(!doc||doc.version!==2||!Array.isArray(doc.projects)||doc.projects.length>200)bad('Cấu trúc nội dung không hợp lệ.');
 if(JSON.stringify(doc).length>1500000)bad('Nội dung quá lớn. Hãy upload ảnh thay vì dán ảnh vào nội dung.');
 const str=(v,n=12000)=>typeof v==='string'&&v.length<=n;
 const url=v=>{if(!str(v,500))return false;try{let u=new URL(v);return [SITE,CMS].includes(u.origin)&&!u.username&&!u.password&&u.protocol==='https:';}catch{return false;}};
 if(!str(doc.contactEmail,200)||!/^\S+@\S+\.\S+$/.test(doc.contactEmail))bad('Email liên hệ không hợp lệ.');
 if(!doc.text||!doc.images||typeof doc.text!=='object'||typeof doc.images!=='object'||Array.isArray(doc.text)||Array.isArray(doc.images))bad('Nội dung trang không hợp lệ.');
 for(const [k,v] of Object.entries(doc.text))if(!/^(index|about|contact)-\d+$/.test(k)||!str(v))bad('Trường nội dung không hợp lệ.');
 for(const [k,v] of Object.entries(doc.images))if(!/^[a-z-]{1,40}$/.test(k)||(v!==''&&!url(v)))bad('Ảnh phải được upload vào thư viện.');
 const slugs=new Set();
 for(const p of doc.projects){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||p.slug.length>100||slugs.has(p.slug))bad('Đường dẫn dự án bị trùng hoặc không hợp lệ.');slugs.add(p.slug);
 for(const k of ['title','client','role','scope','year','summary','note'])if(!str(p[k]))bad('Thông tin dự án không hợp lệ.');
 if(!p.title.trim()||!p.client.trim()||!categories.has(p.category)||typeof p.visible!=='boolean'||(p.thumbnail&&!url(p.thumbnail)))bad('Kiểm tra tên, khách hàng, thể loại và thumbnail.');
 if(!Array.isArray(p.sections)||p.sections.length>40)bad('Quá nhiều phần trong dự án.');
 for(const s of p.sections){if(!str(s.title)||!str(s.copy)||!Array.isArray(s.images)||s.images.length>100)bad('Gallery không hợp lệ.');for(const i of s.images)if(!url(i.src)||!str(i.alt)||!str(i.caption)||!Number.isFinite(i.width)||!Number.isFinite(i.height)||i.width<1||i.height<1||i.width>30000||i.height>30000||typeof i.wide!=='boolean')bad('Ảnh gallery không hợp lệ.');}
 }return doc;
}
export function referenced(doc,url){return Object.values(doc.images||{}).includes(url)||doc.projects.some(p=>p.visible&&(p.thumbnail===url||p.sections.some(s=>s.images.some(i=>i.src===url))));}
export function createHandler({store,getUser,seed,uuid=()=>crypto.randomUUID(),now=()=>new Date().toISOString()}){
 const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'}});
 const current=async key=>await store.getWithMetadata(key,{type:'json'});
 const published=async()=> (await current('published'))?.data||seed;
 return async req=>{try{
 const u=new URL(req.url),path=u.pathname,method=req.method;
 if(path==='/content'&&method==='GET')return json(await published());
 if(path.startsWith('/media/')&&method==='GET'){
 const id=path.slice(7);if(!/^[\w-]+$/.test(id)||!referenced(await published(),CMS+'/media/'+id))return json({error:'Không tìm thấy ảnh.'},404);
 const blob=await store.getWithMetadata('media/'+id,{type:'blob'});if(!blob)return json({error:'Không tìm thấy ảnh.'},404);
 return new Response(blob.data,{headers:{'Content-Type':blob.metadata.type,'Cache-Control':'public,max-age=60','X-Content-Type-Options':'nosniff'}});
 }
 const user=await getUser();if(!user)return json({error:'Vui lòng đăng nhập.'},401);
 if(user.email?.toLowerCase()!==OWNER||!user.confirmedAt)return json({error:'Chỉ chủ website đã xác minh email mới có quyền quản trị.'},403);
 if(!['GET','HEAD'].includes(method)&&req.headers.get('origin')!==CMS)return json({error:'Nguồn yêu cầu không hợp lệ.'},403);
 if(path==='/api/state'&&method==='GET'){
 const [draft,pub]=await Promise.all([current('draft'),current('published')]);
 return json({draft:draft?.data||seed,etag:draft?.etag||null,publishedAt:pub?.data.publishedAt||null,publishedRevision:pub?.data.revision||seed.revision,publishedEtag:pub?.etag||null,user:{email:user.email}});
 }
 if(path==='/api/draft'&&method==='PUT'){
 const body=await req.json(),doc=validate(body.doc);const saved={...doc,fields:seed.fields,revision:uuid(),updatedAt:now()};
 const result=await store.setJSON('draft',saved,body.etag?{onlyIfMatch:body.etag}:{onlyIfNew:true});
 if(!result.modified)return json({error:'Có bản nháp mới hơn trên máy khác. Hãy tải bản sao nội dung hiện tại trước khi tải lại CMS.'},409);
 return json({doc:saved,etag:result.etag});
 }
 if(path==='/api/publish'&&method==='POST'){
 const body=await req.json(),draft=await current('draft');if(!draft||draft.etag!==body.etag)return json({error:'Hãy lưu nháp mới nhất trước khi xuất bản.'},409);
 const doc={...validate(draft.data),publishedAt:now()};
 const result=await store.setJSON('published',doc,body.publishedEtag?{onlyIfMatch:body.publishedEtag}:{onlyIfNew:true});
 if(!result.modified)return json({error:'Bản công khai đã thay đổi. Tải lại CMS để kiểm tra trước khi xuất bản.'},409);
 return json({publishedAt:doc.publishedAt,revision:doc.revision,publishedEtag:result.etag});
 }
 if(path==='/api/media'&&method==='POST'){
 const form=await req.formData(),file=form.get('file');if(!file||typeof file.arrayBuffer!=='function'||file.size>4000000||file.size<12)return json({error:'Chọn ảnh PNG, JPEG hoặc WebP nhỏ hơn 4 MB.'},400);
 const bytes=new Uint8Array(await file.arrayBuffer());let type;
 if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10)type='image/png';
 else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)type='image/jpeg';
 else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')type='image/webp';
 if(!type)return json({error:'Định dạng ảnh không được hỗ trợ.'},400);
 const id=uuid(),metadata={type,name:String(file.name||'Image').slice(0,150),createdAt:now()};await store.set('media/'+id,bytes,{metadata});return json({id,src:CMS+'/media/'+id,...metadata},201);
 }
 if(path==='/api/media'&&method==='GET'){
 const listing=await store.list({prefix:'media/'});const media=await Promise.all(listing.blobs.map(async b=>({id:b.key.slice(6),src:CMS+'/'+b.key,...(await store.getMetadata(b.key)).metadata})));return json({media});
 }
 if(path.startsWith('/api/media/')&&method==='GET'){
 const id=path.slice(11);if(!/^[\w-]+$/.test(id))return json({error:'Không tìm thấy ảnh.'},404);const blob=await store.getWithMetadata('media/'+id,{type:'blob'});if(!blob)return json({error:'Không tìm thấy ảnh.'},404);return new Response(blob.data,{headers:{'Content-Type':blob.metadata.type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }
 return json({error:'Không tìm thấy chức năng.'},404);
 }catch(error){if(!error.status)console.error('CMS request failed',error);return json({error:error.status?error.message:'Không thể hoàn tất yêu cầu. Nội dung công khai vẫn được giữ nguyên.'},error.status||500);}};
}
