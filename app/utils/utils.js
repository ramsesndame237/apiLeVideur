const fs = require('fs')

/**
 * Genere une cle aleatoire
 * 
 * @param {Integer} size 
 * @return {String}
 */
exports.generateKey = (size) => {
    size = parseInt(size || 6)

    let code = '',
        char = ('0123456789').split(''),
        taille = char.length
    for (let i = 0; i < size; i++) {
        code += char[Math.floor(Math.random() * taille)]
    }

    return code
}

/**
 * Sauvegarde un OTP dans le fichier temporaire
 * 
 * @param {Object} data 
 * @param {String|Function} file 
 * @param {Function} callback 
 */
exports.saveOTP = (data, file, callback) => {
    if (!callback && typeof file != 'string') {
        callback = file
        file = 'otp'
    }
    exports.getOTP(file, (err, otp) => {
        otp.push({
            tel: data.tel,
            email: data.email,
            code: data.code
        })
        exports.setOTP(otp, file, callback)
    })
}

/**
 * Modifie les OTP
 * 
 * @param {Object} data 
 * @param {String|Function} file 
 * @param {Function} callback
 */
exports.setOTP = (data, file, callback) => {
    if (!callback && typeof file != 'string') {
        callback = file
        file = 'otp'
    }
    fs.writeFile(fileOTP(file), JSON.stringify(data), (err) => {
        if (typeof callback === 'function') {
            return callback(err)
        }
    })
}

/**
 * Recupere les otp enregistres
 * 
 * @param {String|Function|true} file 
 * @param {Function|true} callback 
 */
exports.getOTP = (file, callback) => {
    if (!callback && typeof file != 'string') {
        callback = file
        file = 'otp'
    }
    if (true === callback) {
        return parseOTP(fs.readFileSync(fileOTP(file)))
    }

    fs.readFile(fileOTP(file), (err, buffer) => {
        if (typeof callback === 'function') {
            return callback(err, parseOTP(buffer))
        }
    })
}


/**
 * @param {Buffer} buffer 
 * @returns {Object}
 */
const parseOTP = (buffer) => {
    let otp = buffer.toString()

    if (!otp) {
        otp = []
    }
    return JSON.parse(otp)
}

/**
 * Chemin absolue vers un fichier d'OTP 
 * 
 * @param {String} name 
 * @return {String}
 */
const fileOTP = (name) => {
    return __dirname + '/../temp/' + name + '.json'
}