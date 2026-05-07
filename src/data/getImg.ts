namespace data {
    export const getImg = () => {
        /**
         * @swagger
         * /rol04/api/get-images:
         *   post:
         *     tags:
         *       - data
         *     summary: Pobieranie img
         *     description: Pobieranie img o podanej bazwie
         *     requestBody:
         *       required: true
         *       content:
         *         application/x-www-form-urlencoded:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *             properties:
         *               name:
         *                 type: string
         *                 example: "001"
         *     responses:
         *       200:
         *         description: Zwraca obraz PNG
         *         content:
         *           image/png:
         *             schema:
         *               type: string
         *               format: binary
         *       401:
         *         description: Nie znaleziono obrazka
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

        core.app.post(url.data.images, core.csrfProtection, async (req: any, res: any) => {
            const name = `img-${req.body.name}`
            console.log('%c name:', 'background: #ffcc00; color: #003300', name)

            const verification = utils.jwtToken.verify(req, res)

            if (verification) {

                const exists = fm.imageExists(name)

                if (exists) {
                    const img = fm.loadImage(name)
                    res.setHeader("Content-Type", "image/png")
                    res.send(img)
                } else {

                    return res.status(401).json({
                        message: 'Nie znaleziono obrazka',
                        command: core.responseCommand.data.noImage,
                    })
                }
            }
        })
    }
}