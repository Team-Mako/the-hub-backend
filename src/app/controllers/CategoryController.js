import * as yup from 'yup';
import URLSlugify from 'url-slugify';
import Category from '../models/Category';

const urlSlugify = new URLSlugify();

class CategoryController {
  async store(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      subtitle: yup.string().required(),
      cover: yup.string().required(),
      coverSmall: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.slug = urlSlugify.slugify(req.body.title);

    try {
      const result = await Category.create(req.body);
      result.message = 'Category Created';
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
      const result = await Category.list(pg, limit);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { slug } = req.params;

    if (!slug) return res.status(401).json({ error: 'Id not provided' });

    try {
      const result = await Category.findBySlug(slug);
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
      cover: yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.id = id;

    try {
      const result = await Category.update(req.body);
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
      const result = await Category.delete(id);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new CategoryController();
