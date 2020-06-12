import * as yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(8),
      avatar: yup.string(),
      bio: yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await User.create(req.body);
      result.message = 'User Created';
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.code });
    }
  }

  async index(req, res) {
    try {
      const result = await User.listAll();
      return res.json(result);
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.status(400).json(err);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const result = await User.findById(id);
      return res.json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async delete(req, res) {
    const { userId } = req.body;

    try {
      const result = await User.delete(userId);
      return res.json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  // TODO User Update
}

export default new UserController();
