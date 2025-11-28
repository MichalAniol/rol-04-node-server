namespace utils {
    export const generate = (userId: string, callback: (pngBuffer: Buffer) => void) => {
        qrcode.generate(userId, (result: string) => {
            console.log('%c result:', 'background: #ffcc00; color: #003300', result)

            const splittedBySpace = result.split(' ')
            const splittedByEnter: string[] = []
            splittedBySpace.forEach((e: string) => {
                const splitted = e.split('\n')
                splitted.forEach((s: string) => {
                    if (s === '') return
                    splittedByEnter.push(s)
                })
            })

            let qrCodeString = ''
            const qrcodeData: number[][] = [[]]
            let index = 0
            splittedByEnter.forEach((e: string) => {
                switch (e) {
                    case "\u001b[0m\u001b[40m": {
                        qrCodeString += ' .'
                        qrcodeData[index].push(0)
                    }
                        break
                    case "\u001b[0m\u001b[47m": {
                        qrCodeString += '#.'
                        qrcodeData[index].push(1)
                    }
                        break
                    case "\u001b[47m": {
                        qrCodeString += '#.'
                        qrcodeData[index].push(1)
                    }
                        break
                    case "\u001b[0m": {
                        qrCodeString += '\n'
                        qrcodeData.push([])
                        index++
                    }
                        break
                }
            })
            // console.log('%c qrcode:', 'background: #ffcc00; color: #003300')
            // console.log(qrcode)

            const SIZE = 30
            const OFFSET = SIZE / 3
            const LINE = OFFSET / 2

            const headHeight = (SIZE * 2) + (OFFSET * 3)

            const qrWidth = qrcodeData[0].length * SIZE
            const qrHeight = ((qrcodeData.length - 1) * SIZE) + headHeight

            // tworzenie canvas (Node)
            const canvasImg = canvas.createCanvas(qrWidth, qrHeight)
            const ctx = canvasImg.getContext('2d')

            // tło
            ctx.fillStyle = '#000'
            ctx.fillRect(0, 0, qrWidth, qrHeight)

            // tekst na górze
            ctx.fillStyle = '#fff'
            ctx.font = `bold ${SIZE}px Consolas`
            ctx.textAlign = 'center'

            // dwie linie tekstu
            ctx.fillText('id użytkownika Rol.04', qrWidth / 2, SIZE + LINE)
            ctx.fillText(userId, qrWidth / 2, (SIZE * 2) + OFFSET + LINE)

            // teraz rysujemy QR Code poniżej tekstu
            ctx.fillStyle = '#fff'
            for (let y = 0; y < qrcodeData.length - 1; ++y) {
                for (let x = 0; x < qrcodeData[0].length; ++x) {
                    if (qrcodeData[y][x] === 1) {
                        ctx.fillRect(x * SIZE, (y * SIZE) + headHeight, SIZE, SIZE)
                    }
                }
            }

            // bitmapa PNG jako Buffer
            const pngBuffer = canvasImg.toBuffer('image/png')

            // odpowiedź binarna
            callback(pngBuffer)
        })
    }

    export const decode = async (buffer: Buffer, pixelSize = 10) => {
        // wczytanie PNG jako obraz
        const img = await canvas.loadImage(buffer)

        // tworzymy canvas w rozmiarze obrazu
        const canvasElem = canvas.createCanvas(img.width, img.height)
        const ctx = canvasElem.getContext('2d')

        ctx.drawImage(img, 0, 0, img.width, img.height)

        // odczyt pikseli
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const data = imageData.data

        const rows = Math.floor(img.height / pixelSize)
        const cols = Math.floor(img.width / pixelSize)

        const qrcodeData: number[][] = []

        for (let y = 0; y < rows; y++) {
            const row: number[] = []
            for (let x = 0; x < cols; x++) {
                // pobieramy środek "kwadratu"
                const px = x * pixelSize + Math.floor(pixelSize / 2)
                const py = y * pixelSize + Math.floor(pixelSize / 2)
                const idx = (py * img.width + px) * 4

                const r = data[idx]
                const g = data[idx + 1]
                const b = data[idx + 2]

                // jeśli piksel ciemny → 1, jeśli jasny → 0
                const brightness = (r + g + b) / 3
                row.push(brightness < 128 ? 1 : 0)
            }
            qrcodeData.push(row)
        }

        return qrcodeData
    }
}