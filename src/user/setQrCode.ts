namespace user {
    export const setQrCode = () => {
        /**
         * @swagger
         * /rol04/api/set-user-by-qr-code:
         *   post:
         *     tags:
         *       - user
         *     summary: Test połączenia chronionego z serverem
         *     description: Endpoint przyjmuje obrazek PNG z QR i odczytuje jego zawartość
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               file:
         *                 type: string
         *                 format: binary
         *                 description: Plik PNG z QR
         *     responses:
         *       200:
         *         description: QR odczytany poprawnie
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                 decoded:
         *                   type: string
         */

        const upload = multer()

        core.app.post(url.user.setQr, upload.single('file'), async (req: RequestT, res: ResponseT) => {
            const multerReq = req as unknown as MulterRequestT
            console.log('multerReq.file:', multerReq.file)

            if (!multerReq.file) {
                res.status(400).json({ error: 'Brak pliku' })
                return
            }

            try {
                const image = await Jimp.read(multerReq.file.buffer)
                console.log('image loaded:', image.bitmap.width, image.bitmap.height)

                const qr = new qrCodeReader()
                qr.callback = (err: any, value: any) => {
                    console.log('%c value:', 'background: #ffcc00; color: #003300', value)

                    if (err) {
                        console.error(err)
                        res.status(400).json({ error: 'Nie udało się odczytać QR', detail: err })
                        return
                    }

                    console.log('decoded QR:', value.result)
                    res.json({
                        message: 'QR odczytany poprawnie!',
                        decoded: value.result
                    })
                }

                qr.decode(image.bitmap)
            } catch (e) {
                console.error('Jimp read error:', e)
                res.status(500).json({ error: 'Błąd serwera', detail: e })
            }
        })



        return {
            verify: (req: RequestT, res: ResponseT) => utils.jwtToken.verify(req, res)
        }
    }
}