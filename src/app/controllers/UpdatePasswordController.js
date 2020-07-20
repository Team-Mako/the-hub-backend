import * as yup from 'yup';
import User from '../models/User';

class UpdatePasswordController {
  async update(req, res) {
    const { userId } = req;

    if (!userId) return res.status(401).json({ error: 'Id not provided' });

    const schema = yup.object().shape({
      oldPassword: yup.string().required().min(8),
      password: yup.string().required().min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.id = userId;

    const check = await User.checkPassword(req.body);

    if (!check[0]) {
      return res.status(401).json({ error: 'The password provided doesn\'t match' });
    }

    try {
      const result = await User.updatePassword(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UpdatePasswordController();
