namespace url {
    export const test = {
        csrf: `${core.serverMainPrefix}csrf`,
        ddos: `${core.serverMainPrefix}ddos`,
        ddosId: `${core.serverMainPrefix}ddos-id`,
        noMahakala: `${core.serverMainPrefix}no-mahakala`,
        wrongMahakala: `${core.serverMainPrefix}wrong-mahakala`,
    }

    export const secure = {
        get: `${core.serverMainPrefix}secure`,
        test: `${core.serverMainPrefix}secure-test`,
    }

    export const user = {
        set: `${core.serverPrefix}set-user`,
        check: `${core.serverPrefix}check-user`,
        getQr: `${core.serverPrefix}get-user-qr-code`,
        setQr: `${core.serverPrefix}set-user-by-qr-code`,
    }
}