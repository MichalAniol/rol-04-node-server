namespace data {
    export const getConfig = () => {
        /**
         * @swagger
         * /rol04/api/get-config:
         *   get:
         *     tags:
         *       - data
         *     summary: Zwraca congig
         *     description: Zwraca congig z wersjami pytań i obrazków
         *     responses:
         *       200:
         *         description: Wysłano
         */


        core.app.get(url.data.config, core.csrfProtection, async (req: RequestT, res: ResponseT) => {
            const verification = utils.jwtToken.verify(req, res)

            if (verification) {
                const config = await fm.loadData('config')

                res.json(config)
            }
        })
    }
}
