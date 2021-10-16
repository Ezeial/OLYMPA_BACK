import crypto from 'crypto'

const hash = password => crypto.pbkdf2Sync(password, process.env.SALT, 65536, 64, 'sha1').toString('hex')

const compareHash = (password, hashed) => hashed === hash(password)

export { hash, compareHash }
export default { hash, compareHash }