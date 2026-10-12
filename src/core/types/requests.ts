import { IdType } from './id';
import { Request } from 'express';

export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParams<P> = Request<P>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithParamsAndBodyAndUserId<P, B> = Request<P, {}, B> & {
  user: IdType;
};
export type RequestWithParamsAndUserID<P> = Request<P> & {
  user: IdType;
};

export type RequestWithBodyAndUserId<B, U extends IdType> = Request<
  {},
  {},
  B,
  {},
  U
>;
export type RequestWithUserId<U extends IdType> = Request<{}, {}, {}, {}, U>;
