// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    css: ['~/assets/css/main.css'],
    icon: {
        customCollections: [
            {
                prefix: 'custom',
                dir: './app/assets/icons',
            },
        ],
        clientBundle: {
            includeCustomCollections: true,
            sizeLimitKb: 256,
        },
    },
    ui: {
        colorMode: false,
        theme: {
            colors: ['primary', 'secondary', 'success', 'error'],
        },
    },
    fonts: {
        families: [
            {
                name: 'DB Heavent',
                provider: 'local',
                weights: ['400', '500', '700', '900'],
                styles: ['normal'],
            },
        ],
    },
    modules: [
        '@nuxt/eslint',
        '@nuxt/hints',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/ui',
        '@nuxt/icon',
        '@nuxt/fonts',
        'nuxt-auth-utils',
        'nuxt-easy-lightbox',
    ],
    nitro: {
        // @ts-ignore
        trustProxy: true,
    },
    runtimeConfig: {
        wpAppPassword: process.env.NUXT_WP_APP_PASSWORD,
        wpAppUsername: process.env.NUXT_WP_APP_USERNAME,
        wooConsumerKey: process.env.NUXT_WOO_CONSUMER_KEY,
        wooConsumerSecret: process.env.NUXT_WOO_CONSUMER_SECRET,
        session: {
            password: process.env.NUXT_SESSION_PASSWORD as string,
            name: 'auth_SoundDD',
            cookie: {
                sameSite: 'lax',
                secure: true,
                maxAge: 60 * 60 * 24 * 7,
            },
        },
        oauth: {
            google: {
                clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
                clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
                redirectURL: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URL,
            },
            facebook: {
                clientId: process.env.NUXT_OAUTH_FACEBOOK_CLIENT_ID,
                clientSecret: process.env.NUXT_OAUTH_FACEBOOK_CLIENT_SECRET,
                redirectURL: process.env.NUXT_OAUTH_FACEBOOK_REDIRECT_URL,
            },
        },
        public: {
            wpUrl: process.env.NUXT_PUBLIC_WP_URL,
        },
    },
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
    devtools: {
        enabled: true,
        timeline: {
            enabled: true,
        },
    },
    sourcemap: {
        client: false,
        server: false,
    },
})
