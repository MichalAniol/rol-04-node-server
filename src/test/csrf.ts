namespace test {
    /**
     * @swagger
     * /api/csrf:
     *   get:
     *     tags:
     *       - test
     *     summary: Testowy endpoint
     *     description: Zwraca testowy ddos
     *     responses:
     *       200:
     *         description: Zwróciło
     */
    export const csrf = () => {
        core.app.get(url.test.csrf, (req: RequestT, res: ResponseT) => {
            res.status(403).json({
                message: 'CSRF token jest błędny.',
                command: core.responseCommand.main.csrf
            })
        })
    }
}