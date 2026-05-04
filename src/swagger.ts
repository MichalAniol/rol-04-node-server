const swagger = (port: number) => {
    const files = [
        './src/*.ts',
        './src/test/*.ts',
        './src/secure/*.ts',
        './src/user/*.ts',
    ] as const;

    const swaggerOptions = {
        definition: swaggerDefinition,
        apis: files,
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    // Dark mode CSS
    core.app.use('/swagger-dark.css', express.static('swagger-dark.css'));

    console.log(`SWAGGER: https://192.168.1.109:${port}${core.serverPrefix}/api-docs`)

    const swaggerUrl = `${core.serverPrefix}/api-docs`

    // middleware ustawiające CSP tylko dla Swagger UI
    core.app.use(swaggerUrl, (req: any, res: any, next: any) => {
        // dopuszczamy blob: dla img-src tak, aby Swagger mógł renderować blob URLs
        res.setHeader('Content-Security-Policy',
            "default-src 'self'; " +
            "img-src 'self' data: blob:; " +       // <- kluczowe: dopuszczamy blob:
            "style-src 'self' 'unsafe-inline' https:; " +
            "script-src 'self' 'unsafe-inline' https:; " +
            "font-src 'self' https: data:; " +
            "object-src 'none'; " +
            "frame-ancestors 'self';"
        )
        next()
    })

    // Swagger UI z interceptor i dark mode
    core.app.use(swaggerUrl, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCssUrl: '/swagger-dark.css',
        swaggerOptions: {
            requestInterceptor: (req: any) => {
                req.headers['Cookie'] = document.cookie

                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1]

                if (token) {
                    req.headers['x-csrf-token'] = token
                }

                return req
            }
        }
    }))
}
