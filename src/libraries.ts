const express = require('express')
const rateLimit = require('express-rate-limit')
const { body, validationResult } = require('express-validator')
const helmet = require('helmet')
const xss = require('xss-clean')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const cookie = require('cookie')
const cryptology = require('crypto')
const https = require('https')
const qrcode = require('qrcode-terminal')
const canvas = require('canvas')
const multer = require('multer')
/** @type {import('multer').File} */
const { Jimp } = require("jimp")
const qrCodeReader = require('qrcode-reader')

const dotenv = require('dotenv')
const fs = require('fs')
const { mkdir } = require('fs/promises')

// Typy
/** @type {import('express').Request} */
type RequestT = import('express').Request
type ResponseT = import('express').Response
type NextFunctionT = import('express').NextFunction
type Application = import('express').Application
type Server = import('http').Server
interface MulterRequestT extends Request {
    file: Express.Multer.File
}