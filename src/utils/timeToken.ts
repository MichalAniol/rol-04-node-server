namespace utils {
    export const timeToken = (function () {
        const TIME_SECRET = process.env.TIME_SECRET || 'default_jwt_secret'

        // const getNowTimestamp = () => Math.floor(Date.now() / (1000 * 60 * 1))
        const getNowTimestamp = () => Math.floor(Date.now() / (1000 * 15))

        const generateToken = (timeSlot: number) => {
            return cryptology.createHmac('sha256', TIME_SECRET)
                .update(String(timeSlot))
                .digest('hex')
        }

        const verify = (clientToken: string, secret: string) => {
            const now = getNowTimestamp()
            const validTokens = [
                generateToken(now),
                generateToken(now - 1) // tolerancja ±3 min
            ]
            return validTokens.includes(clientToken)
        }

        return {
            generate: () => generateToken(getNowTimestamp()),
            verify,
        }
    }())
}