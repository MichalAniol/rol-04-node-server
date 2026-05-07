namespace data {
    export const getQuestion = () => {
        /**
 * @swagger
 * /rol04/api/get-questions:
 *   get:
 *     tags:
 *       - data
 *     summary: Zwraca all-questions
 *     description: Zwraca all-questions
 *     responses:
 *       200:
 *         description: Wysłano
 */


        core.app.get(url.data.questions, core.csrfProtection, async (req: RequestT, res: ResponseT) => {
            const verification = utils.jwtToken.verify(req, res)

            if (verification) {
                const config = await fm.loadData('all-questions')

                res.json(config)
            }
        })
    }
}