// Development twin of jsx-runtime.ts.
import * as R from "react/jsx-dev-runtime";
import { fixProps } from "../lib/i18n";

export type { JSX } from "react/jsx-dev-runtime";
export const Fragment = (R as any).Fragment;
export const jsxDEV = (type: any, props: any, key: any, isStatic: boolean, source?: any, self?: any) =>
  (R as any).jsxDEV(type, typeof type == "string" || type === (R as any).Fragment ? fixProps(String(type), props) : props, key, isStatic, source, self);
