namespace data {
    export const getVersion = () => {
        /**
         * @swagger
         * /rol04/api/get-version:
         *   post:
         *     tags:
         *       - data
         *     summary: Sprawdzanie wersji
         *     description: Sprawdza czy nie pojawiła się nowa wersji i czy nie trzeba pobrać ponownie config
         *     requestBody:
         *       required: true
         *       content:
         *         application/x-www-form-urlencoded:
         *           schema:
         *             type: object
         *             required:
         *               - version
         *             properties:
         *               version:
         *                 type: string
         *                 example: "1.0.0"
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

        core.app.post(url.data.version, core.csrfProtection, async (req: RequestT, res: ResponseT) => {
            const reqVersion = req.body.version

            const verification = utils.jwtToken.verify(req, res)

            if (verification) {
                if (reqVersion) {
                    const dbVersion = await fm.loadData('version')

                    if (dbVersion.version === reqVersion) {
                        res.json({
                            message: 'Masz aktualną wersję danych.',
                            command: core.responseCommand.data.upToDateVersion,
                            version: dbVersion.version
                        })
                    } else {
                        res.json({
                            message: 'Masz starą wersję. Pobierz config aby sprawdzić co się zmieniło.',
                            command: core.responseCommand.data.oldVersion,
                            version: dbVersion.version
                        })
                    }
                }
            }
        })
    }
}