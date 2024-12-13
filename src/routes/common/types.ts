import { Response, Request } from 'express';


// **** Express **** //
type TObj = Record<string, unknown>;
export type IReq<B = TObj, P = TObj, Q = TObj> = Request<P, void, B, Q>;
export type IRes = Response<unknown, TObj>;
