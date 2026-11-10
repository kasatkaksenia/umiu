// JSX runtime that translates interface text while it renders (see src/lib/i18n.ts).
// Only text going into real DOM elements is touched: string children and a few text attributes.
import * as R from "react/jsx-runtime";
import { fixProps } from "../lib/i18n";

export type { JSX } from "react/jsx-runtime";
export const Fragment = R.Fragment;
export const jsx = (type: any, props: any, key?: any) => R.jsx(type, typeof type == "string" || type === R.Fragment ? fixProps(String(type), props) : props, key);
export const jsxs = (type: any, props: any, key?: any) => R.jsxs(type, typeof type == "string" || type === R.Fragment ? fixProps(String(type), props) : props, key);
