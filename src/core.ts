

namespace core {
    export const responseCommand = {
        main: {
            ddos: 'DDoS',
            ddosId: 'DDoSid',
            csrf: 'csrf',
        },
        secure: {
            generateUserId: 'generateUserId',
            go: 'go',
            testOk: 'testOk',
            noMahakala: 'noMahakala',
            wrongMahakala: 'wrongMahakala',
        },
        user: {
            set: 'userSet',
            ok: 'userOk',
            no: 'noUser',
            noId: 'noId',
            qr: 'qr',
        }
    }

    export let serverMainPrefix: CoreT["serverMainPrefix"] = '/api/';
    export let serverPrefix: CoreT["serverPrefix"] = '/rol04/api/';
    export let app: CoreT["app"] = null;
    export let server: CoreT["server"] = null;
}

type CoreT = {
    serverMainPrefix: string,
    serverPrefix: string,
    app: Application | null,
    server: Server | null,
    responseCommand: typeof core.responseCommand
}