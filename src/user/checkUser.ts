namespace user {
    export const checkUser = () => {
        /**
         * @swagger
         * /rol04/api/check-user:
         *   post:
         *     tags:
         *       - user
         *     summary: Nowy użytkownik
         *     description: Sprawdza użytkownika i plik przynależny do niego w ./users
         *     requestBody:
         *       required: true
         *       content:
         *         application/x-www-form-urlencoded:
         *           schema:
         *             type: object
         *             required:
         *               - userId
         *             properties:
         *               userId:
         *                 type: string
         *                 example: "0hnN7VOPE1i56rcoS5u6h"
         *     responses:
         *       200:
         *         description: Został utworzony
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                 command:
         *                   type: string
         */
        core.app.post(url.user.check, core.csrfProtection, async (req: RequestT, res: ResponseT) => {

            const userId = req.body.userId
            const basicToken = utils.timeToken.get(req, res)
            const verification = utils.timeToken.verify(basicToken)

            if (verification) {
                if (userId) {
                    const exist = await fm.checkUserFolderExist(userId)

                    if (exist) {
                        res.cookie('user-id', userId, {
                            httpOnly: true,
                            secure: true,           // wymagane przy HTTPS
                            sameSite: 'none',       // jeśli klient i serwer na różnych domenach
                            maxAge: 3600000 * 24 * 365 * 100       // 1 godzina * 100 lat
                        })

                        res.json({
                            message: 'User istnieje',
                            command: core.responseCommand.user.ok
                        })
                    } else {
                        res.json({
                            message: 'Nie ma takiego usera.',
                            command: core.responseCommand.user.no
                        })
                    }
                } else {
                    res.json({
                        message: 'Brak user id.',
                        command: core.responseCommand.user.noId
                    })
                }
            }

            // res.json({ message: '__' })
        })
    }
}