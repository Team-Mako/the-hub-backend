import * as yup from 'yup';
import Material from '../models/Material';

class MaterialController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      category: yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    const check = await Material.checkIfExists(req.body);
    if (check > 0) {
      return res.status(400).json({ error: 'There is already a Material with this name' });
    }

    try {
      const result = await Material.create(req.body);
      result.message = 'Material Created';
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async index(req, res) {
    let { pg, limit, category } = req.query;

    if (!pg) {
      pg = 1;
    }

    if (!limit) {
      limit = 20;
    }

    if (!category) {
      category = '';
    }

    try {
      const result = await Material.list(pg, limit, category);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const result = await Material.findById(id);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) return res.status(401).json({ error: 'Id not provided' });

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.id = id;

    try {
      const result = await Material.update(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    const { pid, mid } = req.query;

    try {
      const result = await Material.delete(pid, mid);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new MaterialController();
