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
      return res.status(500).json(err);
    }
  }

  async index(req, res) {
    let { pg, limit } = req.query;

    if (!pg) {
      pg = 1;
    }

    if (!limit) {
      limit = 20;
    }

    try {
      const result = await User.list(pg, limit);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const result = await User.findById(id);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async update(req, res) {
    const { userId } = req;

    if (!userId) return res.status(401).json({ error: 'Id not provided' });

    const schema = yup.object().shape({
      name: yup.string().required(),
      lastName: yup.string().required(),
      bio: yup.string().notRequired(),
      password: yup.string().min(8).notRequired(),
      avatar: yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.id = userId;

    try {
      const result = await User.update(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    const { userId } = req.body;

    try {
      const result = await User.delete(userId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UserController();
