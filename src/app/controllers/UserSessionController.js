import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/userAuth';

class UserSessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      email: yup.string().required(),
      password: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid or Missing Arguments' });
    }

    try {
      const checkUser = await User.login(req.body);

      if (!checkUser) {
        return res.status(400).json({ error: 'Your email or password doesn\'t match' });
      }

      const { user_id, user_name, user_email } = checkUser;

      const checkBlock = await User.verifyBlock(user_id);

      if (!checkBlock) {
        return res.status(401).json({ error: 'This user is blocked' });
      }

      return res.json({
        user: {
          user_id,
          user_name,
          user_email,
        },
        token: jwt.sign({ user_id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UserSessionController();
