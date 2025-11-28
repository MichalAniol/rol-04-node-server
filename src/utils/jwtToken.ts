namespace utils {
    export const jwtToken = (function () {
        // JWT
        const MAHAKALA_SECRET = process.env.MAHAKALA_SECRET || 'default_jwt_secret'

        const generate = (payload: object) => jwt.sign(payload, MAHAKALA_SECRET, { expiresIn: '1h' })

        const verifyMahakalaToken = (req: RequestT, res: ResponseT) => {
            const cookieHeader = req.headers.cookie
            const cookies = cookie.parse(cookieHeader)

            const mahakalaToken = cookies['mahakala-token']
            console.log('%c mahakalaKey:', 'background: #ffcc00; color: #003300', mahakalaToken)

            if (!mahakalaToken) {
                res.status(401).json({
                    message: 'Brak mahakala token',
                    command: core.responseCommand.secure.noMahakala,
                })
                return false
            }

            try {
                jwt.verify(mahakalaToken, MAHAKALA_SECRET)
                return true
            } catch (error) {
                res.status(401).json({
                    message: 'Wadliwy mahakala token',
                    command: core.responseCommand.secure.wrongMahakala,
                })
                return false
            }
        }

        return {
            generate,
            verify: verifyMahakalaToken,
        }
    }())
}