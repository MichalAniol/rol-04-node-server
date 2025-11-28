namespace user {
    export const getQrCode = () => {
        /**
         * @swagger
         * /rol04/api/get-user-qr-code:
         *   post:
         *     tags:
         *       - user
         *     summary:
         *     description: Test połączenia chronionego z serverem
         *     responses:
         *       200:
         *         description: Działa
         */
        core.app.post(url.user.getQr, (req: RequestT, res: ResponseT) => {
            const positiveVerification = utils.jwtToken.verify(req, res)

            const userId = utils.getUserId(req, res)
            const exist = fm.checkUserFolderExist(userId)

            if (!exist) {
                res.json({
                    message: 'Nie ma takiego usera.',
                    command: core.responseCommand.user.no,
                })
            }

            if (positiveVerification && exist) {
                const callback = (pngBuffer: Buffer) => {
                    res.set({
                        'Content-Type': 'image/png',
                        'Content-Length': pngBuffer.length
                    })

                    res.send(pngBuffer)
                }

                utils.generate(userId, callback)
            }
        })

        return {
            verify: (req: RequestT, res: ResponseT) => utils.jwtToken.verify(req, res)
        }
    }
}