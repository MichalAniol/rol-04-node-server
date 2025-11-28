// const oof = require('./operationsOnFiles');
namespace app {
    export const init = () => {
        dotenv.config()

        core.app = express()

        // Middleware
        core.app.use(helmet())
        core.app.use(cors({
            origin: 'https://192.168.1.109:3032', // true,
            credentials: true
        }))
        core.app.use(express.json({ limit: '10kb' }))
        core.app.use(express.urlencoded({ extended: true }))
        core.app.use(xss())
        core.app.use(cookieParser())

        const csrfProtection = csurf({
            cookie: {
                // UWAGA: nazwę cookie, którą przeglądarka ma „widzieć” ustawiamy jako XSRF-TOKEN
                // ale csurf sam może trzymać wewnętrzny sekret w innym cookie — dlatego lepiej
                // jawnie wysyłać token do klienta przez res.cookie(req.csrfToken()).
                key: '_csrf',          // (opcjonalnie) wewnętrzna nazwa/sektret; można zostawić domyślną
                httpOnly: true,        // sekret cookie powinien być httpOnly (bez dostępu z JS)
                secure: true,
                sameSite: 'none'
            },
            value: (req: RequestT) => {
                // sprawdzamy kilka miejsc — header ma priorytet (axios wrzuca tu X-XSRF-TOKEN)
                return (req.headers['x-xsrf-token'] as string)
                    || (req.cookies && req.cookies['XSRF-TOKEN'])
                    || (req.body && req.body._csrf)
                    || '';
            }
        });
        core.app.use(csrfProtection);

        // CSRF error handler
        const csrfErrorHandler = (err: any, req: RequestT, res: ResponseT, next: NextFunctionT) => {
            const cookieHeader = req.headers.cookie
            const cookies = cookie.parse(cookieHeader)
            console.log('>>>>> cookies:', 'background: #ffcc00; color: #003300', cookies)


            if (err.code === 'EBADCSRFTOKEN') {
                res.status(403).json({
                    message: 'CSRF token jest błędny.',
                    command: core.responseCommand.main.csrf
                })
            } else {
                next(err)
            }
        }
        core.app.use(csrfErrorHandler)

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 60 * 60 * 1000, // 1 godzina
            max: 20 * 60, // max 1000 próby na IP - średnio 20 zapytań na minutę - 1 co 3 sekundy
            message: {
                message: 'Czyżby DDoS?',
                command: core.responseCommand.main.ddos,
            },
            standardHeaders: true,
            legacyHeaders: false
        })
        core.app.use(limiter)

        // Endpointy
        test.init()

        secure.init()
        user.init()
        data.init()
    }

    export const startServer = () => {
        const PORT = 3331 // 3306

        const key = fs.readFileSync('./prod/192.168.0.109-key.pem')
        const cert = fs.readFileSync('./prod/192.168.0.109.pem')

        // core.server = core.app.listen(PORT, () => {
        //     console.log(`Serwer działa na porcie ${PORT}`)
        // })

        https.createServer({ key, cert }, core.app).listen(PORT, () => {
            console.log(`HTTPS server działa na https://localhost:${PORT}`)
        })

        swagger(PORT)
    }

    export const stopServer = () => {
        core.server.close(() => {
            console.log('Serwer został zatrzymany')
        })
    }
}

module.exports = { app }