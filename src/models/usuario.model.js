const { model, models, Schema } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  secondName: {
    type: String
  },
  fistLastname: {
    type: String,
    required: true
  },
  secondLastname: {
    type: String,
    required: true
  },
  idCard: {
    type: Number,
    required: true,
    validate: {
      async validator (idCard) {
        try {
          const cc = await models.User.findOne({ idCard })
          return !cc
        } catch (error) {
          return false
        }
      },
      message: 'La cédula ya está registrada'
    }
  },
  age: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    validate: {
      async validator (phone) {
        try {
          const phoneNumber = await models.User.findOne({ phone })
          return !phoneNumber
        } catch (error) {
          return false
        }
      },
      message: 'La número de celular ya está registrado'
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      async validator (email) {
        try {
          const user = await models.User.findOne({ email })
          return !user
        } catch (error) {
          return false
        }
      },
      message: 'El correo ya está en uso'
    }
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  termsAndConditions: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function () {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
})

const User = model('User', userSchema)

module.exports = User
