/// <reference types="node" />

export const Environment = {
  BASE_API: import.meta.env.VITE_BASE_API as string | undefined,
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined,
  FACEBOOK_SECRET_KEY: import.meta.env.VITE_FACEBOOK_SECRET_KEY as
    | string
    | undefined,
};
