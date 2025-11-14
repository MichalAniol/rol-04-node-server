const checkUser = () => {
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
    core.app.post(`${core.serverPrefix}check-user`, (req: RequestT, res: ResponseT) => {
        const verification = jwtToken.verify(req, res)

        if (verification) {
            const userId = getUserId(req, res)

            if (userId) {
                const exist = fm.checkUserFolderExist(userId)

                if (exist) {
                    res.json({
                        message: 'User istnieje',
                        type: 'userOk',
                    })
                } else {
                    res.json({
                        message: 'Nie ma takiego usera.',
                        type: 'noUser'
                    }) 
                }
            } else {
                res.json({
                    message: 'Brak user id.',
                    type: 'noId'
                })
            }
        }


        res.json({ message: '__' })
    })
}
