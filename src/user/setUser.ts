namespace user {
    export const setUser = () => {

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 60 * 60 * 1000 * 24, // 24 godziny
            max: 100, // max 100 próby na IP
            message: {
                message: 'Zbyt wiele rejestracji z tego IP. Spróbuj za 24 godziny.',
                command: core.responseCommand.main.ddosId,
            },
            standardHeaders: true,
            legacyHeaders: false
        })
        core.app.use(limiter)


        /**
        * @swagger
        * /rol04/api/set-user:
        *   post:
        *     tags:
        *       - user
        *     summary: Nowy użytkownik
        *     description: Tworzy nowego użytkownika i plik przynależny do niego w ./users
        *     responses:
        *       200:
        *         description: Został utworzony
        */
        core.app.post(url.user.set, limiter, (req: RequestT, res: ResponseT) => {
            const userId = utils.idGenerator.getUserId()

            fm.createUserFolder(userId)

            res.cookie('user-id', userId, {
                httpOnly: true,
                secure: true,           // wymagane przy HTTPS
                sameSite: 'none',       // jeśli klient i serwer na różnych domenach
                maxAge: 3600000 * 24 * 365 * 100       // 1 godzina * 100 lat
            })


            res.json({
                message: 'Stworzono uzytkownika',
                command: core.responseCommand.user.set,
            })
        })
    }


    /**
    * /example:
    *   post:
    *     tags:
    *       - statistics
    *     summary: Dodaje dane
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               value:
    *                 type: integer
    *     responses:
    *       201:
    *         description: Dane zapisane
    *       400:
    *         description: Błąd walidacji
    */
}