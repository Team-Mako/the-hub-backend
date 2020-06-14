import * as yup from 'yup';
import Admin from '../models/Admin';

class AdminController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(8),
      master: yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await Admin.create(req.body);
      result.message = 'Admin Created';
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
      const result = await Admin.list(pg, limit);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) return res.status(401).json({ error: 'Id not provided' });

    try {
      const result = await Admin.findById(id);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async update(req, res) {
    const { adminId } = req;

    if (!adminId) return res.status(401).json({ error: 'Id not provided' });

    const schema = yup.object().shape({
      name: yup.string().required(),
      lastName: yup.string().required(),
      allowed: yup.boolean().required(),
      master: yup.boolean().required(),
      password: yup.string().min(8).notRequired(),
      avatar: yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.id = adminId;

    try {
      const result = await Admin.update(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    const schema = yup.object().shape({
      id: yup.number().required(),
      confirm: yup.string().matches(/(true)/),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    const { id } = req.body;

    try {
      const result = await Admin.delete(id);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new AdminController();
