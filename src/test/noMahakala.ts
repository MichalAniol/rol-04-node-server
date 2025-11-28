namespace test {
    /**
     * @swagger
     * /api/no-mahakala:
     *   get:
     *     tags:
     *       - test
     *     summary: Testowy endpoint
     *     description: Zwraca testowy ddos
     *     responses:
     *       200:
     *         description: Zwróciło
     */
    export const noMahakala = () => {

        core.app.get(url.test.noMahakala, (req: RequestT, res: ResponseT) => {
            res.status(401).json({
                message: 'Brak mahakala token',
                command: core.responseCommand.secure.noMahakala,
            })
        })
    }
}