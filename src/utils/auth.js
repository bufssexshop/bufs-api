import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      const error = new Error('No token provided')
      error.statusCode = 401
      throw error
    }

    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token)
      throw new Error('Invalid authorization format')

    const payload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: payload.id,
      role: payload.role
    }

    next()
  } catch (error) {
    next(error)
  }
}

export default auth