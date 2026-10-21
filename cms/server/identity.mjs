import {OWNER} from '../cms-core.mjs';
export default {userValidate(event){if(event.user.email?.toLowerCase()!==OWNER)return event.deny();}};
