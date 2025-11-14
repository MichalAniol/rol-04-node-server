const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'EduRol server API',
        version: '1.0.0',
        description: 'Dokumentacja API',
    },
    tags: [
        {
            name: 'basic',
            description: 'Podstawowe',
        },
        {
            name: 'user',
            description: 'Tworzenie, weryfikowanie i odtwarzanie postępów uzytkownika',
        },
        {
            name: 'statistics',
            description: 'statystyki rozwiązywania testów',
        },
    ],
    withCredentials: true,
};
