namespace test {
    /**
     * @swagger
     * /api/wrong-mahakala:
     *   get:
     *     tags:
     *       - test
     *     summary: Testowy endpoint
     *     description: Zwraca testowy ddos
     *     responses:
     *       200:
     *         description: Zwróciło
     */
    export const wrongMahakala = () => {

        core.app.get(url.test.wrongMahakala, (req: RequestT, res: ResponseT) => {
            res.status(401).json({
                message: 'Brak mahakala token',
                command: core.responseCommand.secure.wrongMahakala,
            })
        })
    }
}