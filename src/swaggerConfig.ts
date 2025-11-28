const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Rol.04 server API',
        version: '1.0.0',
        description: 'Dokumentacja API',
    },
    tags: [
        {
            name: 'test',
            description: 'Tylko do testowania',
        },
        {
            name: 'secure',
            description: 'Buduje dostęp do komunikacji klienta z serwerem',
        },
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
            description: 'Statystyki rozwiązywania testów',
        },
    ],
    withCredentials: true,
};
