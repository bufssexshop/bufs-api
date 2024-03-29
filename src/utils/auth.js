const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      throw new Error('Su sesión expiró')
    }

    const [_, token] = authorization.split(' ')
    if (!token) {
      console.log(_)
      throw new Error('Su sesión expiró')
    }

    const { userId } = jwt.verify(token, process.env.SECRET)
    // if(userType !== 'root') {
    //   throw new Error('Usuario inválido para realizar esta petición.')
    // }

    req.user = {
      userId
    }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Su sesión expiró', error })
  }
}
