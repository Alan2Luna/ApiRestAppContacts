const bcrypt = require('bcrypt')

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

const comparePassword = async (receivedPassword, hash) => {
    return await bcrypt.compare(receivedPassword, hash);
}

module.exports = {
    encryptPassword,
    comparePassword
}