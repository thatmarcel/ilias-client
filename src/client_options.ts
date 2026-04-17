export type ClientOptions = {
    tls?: {
        /**
         * @remarks
         * Only works when using Bun as the JS runtime
         */
        ca?: string | undefined
    } | undefined
}
