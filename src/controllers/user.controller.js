import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export async function authValidation (req, res) {
  res.status(200).json({ message: 'Authorized '})
}

export async function signup (req, res, next) {
  try {
    const userData = { ...req.body }

    if (!userData.role) userData.role = 'client'

    const user = await User.create(userData)

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.firstName,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function signin (req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' })

    if (!user.active)
      return res.status(403).json({ message: 'Your account is deactivated. Please contact support.' });

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid)
      return res.status(401).json({ message: 'Invalid email or password' })

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.firstName
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.firstName,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function getUser (req, res, next) {
  try {
    const { id } = req.user
    const user = await User.findById(id).select('-password').lean()

    if (!user)
      return res.status(404).json({ message: 'User not found'})

    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export async function getUsers (req, res, next) {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied: Insufficient permissions'})

    const users = await User.find().select('-password').lean()

    res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    next(error)
  }
}

export async function toggleUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.active = !user.active;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.active ? 'activated' : 'deactivated'} successfully`,
      active: user.active
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserDetails(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      success: true,
      message: 'User details updated',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
}

export async function acceptTerms(req, res, next) {
  try {
    const { id } = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { termsAndConditions: true },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Terms accepted successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOwnProfile(req, res, next) {
  try {
    const { id } = req.user;
    const updateData = { ...req.body };

    delete updateData.role;
    delete updateData.active;
    delete updateData.termsAndConditions;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
}

