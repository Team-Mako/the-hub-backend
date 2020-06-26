import * as yup from 'yup';
import Type from '../models/Type';

class TypeController {
  async store(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      categoryId: yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await Type.create(req.body);
      result.message = 'Type Created';
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
      const result = await Type.list(pg, limit);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const result = await Type.findById(id);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) return res.status(401).json({ error: 'Id not provided' });

    const schema = yup.object().shape({
      title: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.id = id;

    try {
      const result = await Type.update(req.body);
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
      const result = await Type.delete(id);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new TypeController();
