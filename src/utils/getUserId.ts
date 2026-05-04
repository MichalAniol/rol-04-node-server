namespace utils {
    export const getUserId = (req: RequestT, res: ResponseT) => {
        const cookieHeader = req.headers.cookie
        // console.log('%c cookieHeader:', 'background: #ffcc00; color: #003300', cookieHeader)

        if (cookieHeader && typeof cookieHeader === 'string') {

            const cookies = cookie.parse(cookieHeader)
            console.log('%c cookieHeader:', 'background: #ffcc00; color: #003300', cookieHeader)
            console.log('--->>> dostaję cookies:', cookies)
            const userId = cookies['user-id']
            // console.log('%c userId:', 'background: #ffcc00; color: #003300', userId)

            return userId
        }

        return null
    }
}