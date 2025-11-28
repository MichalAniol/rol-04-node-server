namespace secure {
    export const secureTest = () => {
        /**
         * @swagger
         * /api/secure-test:
         *   post:
         *     tags:
         *       - secure
         *     summary:
         *     description: Test połączenia chronionego z serverem
         *     responses:
         *       200:
         *         description: Działa
         */
        core.app.post(url.secure.test, (req: RequestT, res: ResponseT) => {
            const positiveVerification = utils.jwtToken.verify(req, res)

            if (positiveVerification) {
                res.json({
                    message: 'jest ok!',
                    command: core.responseCommand.secure.testOk
                })
            }
        })

        return {
            verify: (req: RequestT, res: ResponseT) => utils.jwtToken.verify(req, res)
        }
    }
}