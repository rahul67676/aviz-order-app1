const { hashPassword, validateToken } = require('../utils/cryptoHelper');
const { logActivity } = require('../utils/logger');

class UserService {
  constructor(db) {
    this.db = db;
  }

  async registerUser(email, password, role = 'customer') {
    const hashed = await hashPassword(password);
    const user = await this.db.users.create({ email, password: hashed, role });
    logActivity('USER_REGISTERED', { email, role });
    return user;
  }

  async loginUser(email, password) {
    const user = await this.db.users.findByEmail(email);
    if (!user) throw new Error('User not found');
    const valid = await this.validateCredentials(user, password);
    if (!valid) throw new Error('Invalid credentials');
    logActivity('USER_LOGIN', { email });
    return this.generateSession(user);
  }

  async validateCredentials(user, password) {
    const hashed = await hashPassword(password);
    return hashed === user.password;
  }

  async generateSession(user) {
    return { token: `session_${user.id}_${Date.now()}`, userId: user.id, role: user.role };
  }

  async getUserById(userId) {
    return this.db.users.findById(userId);
  }

  async updateUserRole(userId, newRole) {
    const user = await this.getUserById(userId);
    user.role = newRole;
    await this.db.users.update(user);
    logActivity('ROLE_UPDATED', { userId, newRole });
    return user;
  }
}

module.exports = { UserService };
