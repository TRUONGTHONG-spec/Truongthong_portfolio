import {getStore} from '@netlify/blobs';
import {getUser} from '@netlify/identity';
import seed from '../cms-seed.json' with {type:'json'};
import {createHandler} from '../cms-core.mjs';
export default async req=>createHandler({store:getStore({name:'portfolio-cms',consistency:'strong'}),getUser,seed})(req);
export const config={path:['/api/*','/content','/media/*']};
