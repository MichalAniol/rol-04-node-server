const responseCommand = {
    secure: {
        ddos: 'DDoS',
        csrf: 'csrf',
        generateUserId: 'generateUserId',
        go: 'go',
        testOk: 'testOk'
    },
    user: {
        set: 'userSet',
    }
}

type CoreT = {
    serverPrefix: string,
    app: Application | null,
    server: Server | null,
}

const core = (function(){
    const result: CoreT = {
        serverPrefix: '/rol04/api/',
        app: null,
        server: null,
    }


    return result
}())

module.exports = { core }