const secureTest = () => {
    /**
     * @swagger
     * /rol04/api/secure-test:
     *   post:
     *     tags:
     *       - basic
     *     summary:
     *     description: Test połączenia chronionego z serverem
     *     responses:
     *       200:
     *         description: Działa
     */
    core.app.post(`${core.serverPrefix}secure-test`, (req: RequestT, res: ResponseT) => {
        const positiveVerification = jwtToken.verify(req, res)

        if (positiveVerification) {
            res.json({
                message: 'jest ok!',
                command: responseCommand.secure.testOk
            })
        }
    })

    return {
        verify: (req: RequestT, res: ResponseT) => jwtToken.verify(req, res)
    }
}