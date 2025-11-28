type ActiveDataTabsT = {
    azSmall: string[],
    azBig: string[],
    numbers: string[],
    // specials: string[],
}

type NumberActiveTabsT = {
    azSmall: number,
    azBig: number,
    numbers: number,
    // specials: number,
}

type CollectTabsT = {
    tabs: ActiveDataTabsT,
    num: NumberActiveTabsT,
}

type GenerateT = {
    getUserId: () => string,
    getTimeFromId: (id: string) => Date,
}

namespace utils {
    export const idGenerator = (function () {
        const data = {
            azSmall: 'qwertyuiopasdfghjklzxcvbnm',
            azBig: 'QWERTYUIOPASDFGHJKLZXCVBNM',
            numbers: '1234567890',
        }
        const NUMBER_NORMAL_ACTIVE = Object.keys(data).length
        const ALPHABET = data.numbers + data.azSmall + data.azBig
        const WHOLE_LENGTH = ALPHABET.length

        const encode = (timestamp: number) => {
            if (timestamp === 0) return ALPHABET[0]
            let encoded = ''

            while (timestamp > 0) {
                const remainder = timestamp % WHOLE_LENGTH
                encoded = ALPHABET[remainder] + encoded
                timestamp = Math.floor(timestamp / WHOLE_LENGTH)
            }

            return encoded
        }

        // Dekodowanie base62 na timestamp
        const decode = (encoded: string) => {
            let decoded = 0
            for (let i = 0; i < encoded.length; i++) {
                const index = ALPHABET.indexOf(encoded[i])
                if (index === -1) {
                    throw new Error(`Invalid character '${encoded[i]}' in encoded string.`)
                }
                decoded = decoded * WHOLE_LENGTH + index
            }

            return decoded
        }

        const TIME_SUFFIX_LENGTH = encode(new Date().getTime()).length
        const ID_LENGTH = 21 - TIME_SUFFIX_LENGTH // daje około 6.64×10^24 kombinacji

        const getTimeSuffix = () => {
            const time = new Date().getTime()
            return encode(time)
        }


        const getSume = (result: NumberActiveTabsT) => result.azSmall + result.azBig + result.numbers
        const getBiggestKey = (result: NumberActiveTabsT) => {
            let maxKey = null
            let maxValue = -Infinity

            for (const key in result) {
                if (result[key as keyof typeof result] > maxValue) {
                    maxValue = result[key as keyof typeof result]
                    maxKey = key
                }
            }

            return maxKey
        }

        const getNumberActiveTabs = () => {
            let normalLength = Math.ceil(ID_LENGTH / NUMBER_NORMAL_ACTIVE)

            const result: NumberActiveTabsT = {
                azSmall: normalLength,
                azBig: normalLength,
                numbers: normalLength,
            }

            let sume = getSume(result)
            while (sume > ID_LENGTH) {
                const key = getBiggestKey(result)
                result[key as keyof typeof result]--
                sume = getSume(result)
            }

            return result
        }

        const collectTabs = () => {
            const numberActiveTabs = getNumberActiveTabs()

            const getChars = (arr: string) => {
                const res = []
                for (let i = 0; i < arr.length; ++i) {
                    res[i] = arr[i]
                }
                return res
            }

            const result: CollectTabsT = {
                tabs: {
                    azSmall: getChars(data.azSmall),
                    azBig: getChars(data.azBig),
                    numbers: getChars(data.numbers),
                },
                num: numberActiveTabs,
            }

            return result
        }

        const getRandomElements = (tab: string[], length: number) => {
            let result = [];
            let availableElements = [...tab];

            while (result.length < length) {
                if (availableElements.length === 0) {
                    // Jeśli skończyły się dostępne elementy, ponownie wypełnij dostępne elementy
                    availableElements = [...tab]
                }

                // Losowanie indeksu z dostępnych elementów
                const randomIndex = Math.floor(Math.random() * availableElements.length)
                const element = availableElements[randomIndex]

                // Dodanie wylosowanego elementu do wynikowej tablicy
                result.push(element);

                // Usunięcie wylosowanego elementu z dostępnych elementów
                availableElements.splice(randomIndex, 1)
            }

            return result;
        }

        const getUserId = () => {
            const data = collectTabs()

            const azSmall = getRandomElements(data.tabs.azSmall, data.num.azSmall)
            const azBig = getRandomElements(data.tabs.azBig, data.num.azBig)
            const numbers = getRandomElements(data.tabs.numbers, data.num.numbers)

            const all = azSmall.concat(azBig).concat(numbers)

            const id = getRandomElements(getRandomElements(getRandomElements(all, ID_LENGTH), ID_LENGTH), ID_LENGTH)

            const timeSuffix = getTimeSuffix()

            return [...id, timeSuffix].join('')
        }

        const getTimeFromId = (id: string) => {
            const suffix = id.slice(-7)
            return new Date(decode(suffix))
        }

        const result: GenerateT = {
            getUserId,
            getTimeFromId,
        }

        return result
    }())
}