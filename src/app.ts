// const oof = require('./operationsOnFiles');

const init = () => {
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
                command: responseCommand.secure.csrf
            })
        } else {
            next(err)
        }
    }
    core.app.use(csrfErrorHandler)

    // core.app.use((req, res, next) => {
    //     try {
    //         // const token = req.csrfToken() // generuje nowy token powiązany z sekretem z _csrf
    //         // res.cookie('XSRF-TOKEN', token, {
    //         //     httpOnly: false,           // klient (np. axios) musi mieć dostęp
    //         //     sameSite: 'none',
    //         //     secure: true
    //         // })
    //         next()
    //     } catch (err) {
    //         // niektóre żądania (np. OPTIONS) nie mają jeszcze sesji — pomijamy
    //         next()
    //     }
    // })

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 godzina
        max: 20 * 60, // max 1000 próby na IP - średnio 20 zapytań na minutę - 1 co 3 sekundy
        message: {
            message: 'Czyżby DDoS?',
            command: responseCommand.secure.ddos,
        },
        standardHeaders: true,
        legacyHeaders: false
    })
    core.app.use(limiter)

    // Endpointy

    // zabezpieczenia
    secure()
    secureTest()

    // basic

    // user
    setUser()
    checkUser()

    // app.post('/register', [
    //     body('email').isEmail().normalizeEmail(),
    //     body('password').isLength({ min: 8 }).trim().escape()
    // ], (req: RequestT, res: ResponseT) => {
    //     const errors = validationResult(req)
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array() })
    //     }

    //     const { email } = req.body
    //     const token = generateToken({ email })
    //     res.json({ message: 'Zarejestrowano', token })
    // })
}

const startServer = () => {
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

const stopServer = () => {
    core.server.close(() => {
        console.log('Serwer został zatrzymany')
    })
}

module.exports = { init, startServer, stopServer }