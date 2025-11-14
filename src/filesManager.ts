const fm = (function () { // filesManager
    let splitted = __dirname.split('\\');
    let projectPath = '';
    splitted.forEach((e, i) => i < splitted.length - 1 ? projectPath += e + '/' : null);


    // const path_out = projectPath + '/output'
    // const path_in = projectPath + '/input'

    const dataPath = projectPath + 'data'
    const imagePath = projectPath + 'img'
    const usersPath = projectPath + 'users'

    const load = (name: string, filePath: string) => {
        console.log('%c filePath:', 'background: #ffcc00; color: #003300', filePath)
        let data = null;

        try {
            if (fs.existsSync(filePath)) {
                data = fs.readFileSync(filePath);
            }
        } catch (err) {
            console.error(err)
        }

        // console.log(' loaded: ' + name);

        return data.toString();
    }

    const loadData = (name: string) => {
        const filePath = dataPath + '/' + name
        load(name, filePath)
    }

    const loadImage = (name: string) => {
        const filePath = imagePath + '/' + name
        load(name, filePath)
    }

    const loadByPat = (path: string) => {
        let data = null;

        try {
            if (fs.existsSync(path)) {
                data = fs.readFileSync(path);
            }
        } catch (err) {
            console.error(err)
        }

        // console.log(' loaded: ' + path);

        return data;
    }

    // const readAllFiles = (folder: string) => {
    //     const getDir = (path: string) => {
    //         const files = fs.readdirSync(path)
    //         let res = []

    //         for (let file of files) {
    //             const newPath = path + '/' + file
    //             const obj: { [key: string]: string | {}[] } = {}
    //             if (fs.lstatSync(newPath).isDirectory()) {
    //                 const dir = getDir(newPath);
    //                 obj[file] = dir
    //                 res.push(obj)
    //             } else {
    //                 obj[file] = loadByPat(newPath).toString()
    //                 res.push(obj)
    //             }
    //         }

    //         return res;
    //     }

    //     const filePath = path_in + '/' + folder;

    //     return getDir(filePath);
    // }

    const createFolder = async (name: string, filePath: string) => {
        const path = filePath + '/' + name
        console.log('%c path:', 'background: #ffcc00; color: #003300', path)
        await mkdir(path, { recursive: true })
    }

    const createUserFolder = async (id: string) => {
        await createFolder(id, usersPath)
    }

    const folderExists = async (path: string) => {
        try {
            return await fs.existsSync(path) && await fs.statSync(path).isDirectory()
        } catch {
            return false
        }
    }

    const checkUserFolderExist = async (id: string) => await folderExists(usersPath + '/' + id)

    const save = (name: string, filePath: string, data: any) => fs.writeFileSync(filePath, data)

    return {
        loadData,
        loadImage,
        createUserFolder,
        checkUserFolderExist,
    }
}())


