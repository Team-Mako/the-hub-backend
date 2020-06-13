import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import Admin from '../models/Admin';
import authConfig from '../../config/adminAuth';

class AdminSessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      email: yup.string().required(),
      password: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid or Missing Arguments' });
    }

    try {
      const checkAdmin = await Admin.login(req.body);

      if (!checkAdmin) {
        return res.status(401).json({ error: 'Email or Password Invalid' });
      }

      const { admin_id, admin_name, admin_email } = checkAdmin;

      const checkBlock = await Admin.verifyBlock(admin_id);

      if (!checkBlock) {
        return res.status(401).json({ error: 'This admin is blocked' });
      }

      return res.json({
        admin: {
          admin_id,
          admin_name,
          admin_email,
        },
        token: jwt.sign({ admin_id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new AdminSessionController();
