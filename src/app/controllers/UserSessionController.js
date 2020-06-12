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
      return res.status(401).json({ error: 'Invalid or Missing Arguments' });
    }

    try {
      const checkUser = await User.login(req.body);

      if (!checkUser) {
        return res.status(401).json({ error: 'Email or Password Invalid' });
      }

      const { id, name, email } = checkUser;

      const checkBlock = await User.verifyBlock(id);

      if (!checkBlock) {
        return res.status(401).json({ error: 'This user is blocked' });
      }

      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(401).json({ error: err });
    }
  }
}

export default new UserSessionController();
