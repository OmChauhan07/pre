let PrismaClient;
try {
  // Prefer the generated client inside "generated/prisma" as configured in prisma/schema.prisma
  // This avoids initialization issues when @prisma/client isn't wired to the custom output.
  PrismaClient = require('../../generated/prisma').PrismaClient;
} catch (e) {
  // Fallback to the package installed under node_modules
  PrismaClient = require('@prisma/client').PrismaClient;
}
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

module.exports = { registerUser };