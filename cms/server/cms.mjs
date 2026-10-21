import {getStore} from '@netlify/blobs';
import {getUser,admin} from '@netlify/identity';
import seed from '../cms-seed.json' with {type:'json'};
import {createHandler,resolveOwnerSession} from '../cms-core.mjs';
export default async req=>createHandler({store:getStore({name:'portfolio-cms',consistency:'strong'}),getUser:()=>resolveOwnerSession(getUser,id=>admin.getUser(id)),seed})(req);
export const config={path:['/api/*','/content','/media/*']};
