import { init } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import * as models from "./models";

const immer = immerPlugin();

export const creatStore = (initialState) =>
  init({
    models: {
      ...models,
    },
    plugins: [immer],
    initialState: initialState,
    devtoolOptions: {
      disabled: process.env.NODE_ENV === "production",
    },
  });

const store = creatStore();

export default store;
