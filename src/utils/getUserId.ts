namespace utils {
    export const getUserId = (req: RequestT, res: ResponseT) => {
        const cookieHeader = req.headers.cookie

        if (cookieHeader && typeof cookieHeader === 'string') {

            const cookies = cookie.parse(cookieHeader)
            const userId = cookies['user-id']

            return userId
        }

        return null
    }
}