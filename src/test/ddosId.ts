namespace test {
    /**
     * @swagger
     * /api/ddos-is:
     *   get:
     *     tags:
     *       - test
     *     summary: Testowy endpoint
     *     description: Zwraca testowy ddos
     *     responses:
     *       200:
     *         description: Zwróciło
     */
    export const ddosId = () => {

        core.app.get(url.test.ddosId, (req: RequestT, res: ResponseT) => {
            res.status(429).json({
                message: 'Zbyt wiele zadań stworzenia użytkownika na dzień',
                command: core.responseCommand.main.ddosId,
            })
        })
    }
}