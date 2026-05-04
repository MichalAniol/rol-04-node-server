namespace secure {
    export const secure = () => {
        /**
        * @swagger
        * /api/secure:
        *   get:
        *     tags:
        *       - secure
        *     summary:
        *     description: Zwraca token, aby w ogóle rozmawiać z API
        *     responses:
        *       200:
        *         description: Zwróciło
        */

        core.app.get(url.secure.get, (req: RequestT, res: ResponseT) => {
            const userId = utils.getUserId(req, res)
            // console.log('%c userId:', 'background: #ffcc00; color: #003300', userId)

            let basicToken = null
            let mahakalaToken: string | null = null

            const tokenCsrf = req.csrfToken()
            res.cookie('XSRF-TOKEN', tokenCsrf, {
                // httpOnly: false,
                sameSite: 'none',
                secure: true
            })

            if (userId && userId.length === 21) {
                mahakalaToken = utils.jwtToken.generate({ userId })
                res.cookie('mahakala-token', mahakalaToken, {
                    httpOnly: true,
                    secure: true,           // wymagane przy HTTPS
                    sameSite: 'none',       // jeśli klient i serwer na różnych domenach
                    maxAge: 3600000 * 24 * 365 * 100       // 1 godzina * 100 lat
                })

                res.json({
                    message: 'U can start aping',
                    command: core.responseCommand.secure.go,
                    // mahakalaToken,
                    // tokenCsrf
                })

            } else {
                basicToken = utils.timeToken.generate()
                res.cookie('basic-token', basicToken, {
                    httpOnly: true,
                    secure: true,           // wymagane przy HTTPS
                    sameSite: 'none',       // jeśli klient i serwer na różnych domenach
                    maxAge: 1000 * 60 * 3       // 3 minuty
                })

                // const setCookie = res.getHeader("Set-Cookie")
                // console.log(">>> wysyłam cookies:", setCookie)

                res.json({
                    message: 'first generate user id',
                    command: core.responseCommand.secure.generateUserId,
                    // basicToken,
                    // tokenCsrf
                })
            }
        })
    }
}