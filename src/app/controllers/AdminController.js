import * as yup from 'yup';
import Admin from '../models/Admin';

class AdminController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(8),
      canDelete: yup.boolean,
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await Admin.create(req.body);
      result.message = 'Admin Created';
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.code });
    }
  }
}

export default new AdminController();
