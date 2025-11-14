const secure = () => {
    /**
    * @swagger
    * /rol04/api/secure:
    *   get:
    *     tags:
    *       - basic
    *     summary:
    *     description: Zwraca token, aby w ogóle rozmawiać z API
    *     responses:
    *       200:
    *         description: Zwróciło
    */

    core.app.get(`${core.serverPrefix}secure`, (req: RequestT, res: ResponseT) => {
        const userId = getUserId(req, res)
        // console.log('%c userId:', 'background: #ffcc00; color: #003300', userId)

        let basicToken = null
        let mahakalaToken: string | null = null

        const tokenCsrf = req.csrfToken()
        res.cookie('XSRF-TOKEN', tokenCsrf, {
            httpOnly: false,
            sameSite: 'none',
            secure: true
        })

        if (userId && userId.length === 21) {
            mahakalaToken = jwtToken.generate({ userId })
            res.cookie('mahakala-token', mahakalaToken, {
                httpOnly: true,
                secure: true,           // wymagane przy HTTPS
                sameSite: 'none',       // jeśli klient i serwer na różnych domenach
                maxAge: 3600000 * 24 * 365 * 100       // 1 godzina * 100 lat
            })

            res.json({
                message: 'U can start aping',
                command: responseCommand.secure.go,
                mahakalaToken,
                // tokenCsrf
            })

        } else {
            basicToken = timeToken.generate()
            res.cookie('basic-token', basicToken, {
                httpOnly: true,
                secure: true,           // wymagane przy HTTPS
                sameSite: 'none',       // jeśli klient i serwer na różnych domenach
                maxAge: 1000 * 60 * 3       // 3 minuty
            })

            const setCookie = res.getHeader("Set-Cookie");
            console.log(">>> wysyłam cookies:", setCookie);

            res.json({
                message: 'first generate user id',
                command: responseCommand.secure.generateUserId,
                basicToken,
                // tokenCsrf
            })
        }
    })
}

/**
* /rol04/api/secure:
*   get:
*     tags:
*       - basic
*     summary:
*     description: Zwraca token, aby w ogóle rozmawiać z API
*     parameters:
*       - in: query
*         name: user-id
*         required: false
*         schema:
*           type: string
*           example: "x462rBV03ns1lIaFTe9QC"
*         description: Identyfikator użytkownika
*     responses:
*       200:
*         description: Zwróciło
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   example: "eyJhbGciOiJIUzI1NiIsInR..."
*/