// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        interface Platform {
            env: Env;
            ctx: ExecutionContext;
            caches: CacheStorage;
            cf?: IncomingRequestCfProperties;
        }

        // interface Error {}
        interface Locals {
            pb: import('./lib/pocketbase/pb_types').TypedPocketBase;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}

        type TypedPocketBase = import('./lib/pocketbase/pb_types').TypedPocketBase;
    }
}

export {};
