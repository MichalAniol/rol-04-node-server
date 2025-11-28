namespace user {
    export const checkUser = () => {
        /**
         * @swagger
         * /rol04/api/check-user:
         *   post:
         *     tags:
         *       - user
         *     summary: Nowy użytkownik
         *     description: Tworzy nowego użytkownika i plik przynależny do niego w ./users
         *     responses:
         *       200:
         *         description: Został utworzony
         */
        core.app.post(url.user.check, (req: RequestT, res: ResponseT) => {
            const verification = utils.jwtToken.verify(req, res)

            if (verification) {
                const userId = utils.getUserId(req, res)

                if (userId) {
                    const exist = fm.checkUserFolderExist(userId)

                    if (exist) {
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

            res.json({ message: '__' })
        })
    }
}