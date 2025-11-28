namespace test {
    /**
     * @swagger
     * /api/ddos:
     *   get:
     *     tags:
     *       - test
     *     summary: Testowy endpoint
     *     description: Zwraca testowy ddos
     *     responses:
     *       200:
     *         description: Zwróciło
     */
    export const ddos = () => {

        core.app.get(url.test.ddos, (req: RequestT, res: ResponseT) => {
            res.status(429).json({
                message: 'Czyżby DDoS?',
                command: core.responseCommand.main.ddos,
            })
        })
    }
}