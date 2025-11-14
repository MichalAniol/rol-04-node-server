const swagger = (port: number) => {
    const files = [
        './src/*.ts',
        './src/basic/*.ts',
        './src/user/*.ts',
    ] as const;

    const swaggerOptions = {
        definition: swaggerDefinition,
        apis: files,
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    // Dark mode CSS
    core.app.use('/swagger-dark.css', express.static('swagger-dark.css'));

    console.log(`SWAGGER: http://localhost:${port}${core.serverPrefix}/api-docs`)

    // Swagger UI z interceptor i dark mode
    core.app.use(`${core.serverPrefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
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
