import * as yup from 'yup';
import URLSlugify from 'url-slugify';
import Post from '../models/Post';

const urlSlugify = new URLSlugify();

class PostController {
  async store(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      desc: yup.string().required(),
      difficult: yup.string().required(),
      duration: yup.string().required(),
      categoryId: yup.number().required(),
      cover: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json(req.body);
    }

    req.body.userId = req.userId;
    req.body.url = urlSlugify.slugify(req.body.title);

    try {
      const postId = await Post.create(req.body);

      if (Array.isArray(req.body.stepDescription)) {
        req.body.stepDescription.map(async (step, index) => {
          const { stepDescription, stepVideo, stepCover } = req.body;
          await Post.addStep(stepDescription[index], stepCover[index], stepVideo[index], postId.insertId);
        });
      } else {
        const { stepDescription, stepVideo, stepCover } = req.body;
        await Post.addStep(stepDescription, stepCover, stepVideo, postId.insertId);
      }

      req.body.material.map(async (step, index) => {
        const { meas, material, userId } = req.body;
        await Post.addMaterial(meas[index], postId.insertId, material[index], userId);
      });

      postId.message = 'Post Created!';

      return res.json(postId);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { slug } = req.params;

    try {
      const result = await Post.findBySlug(slug);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async index(req, res) {
    let { pg, limit, user } = req.query;

    if (!pg) {
      pg = 1;
    }

    if (!limit) {
      limit = 20;
    }

    if (!user) {
      user = null;
    }

    try {
      const result = await Post.list(pg, limit, user);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async update(req, res) {
    const schema = yup.object().shape({
      id: yup.number().required(),
      title: yup.string().required(),
      desc: yup.string().required(),
      difficult: yup.string().required(),
      visible: yup.boolean().required(),
      categoryId: yup.number().required(),
      typeId: yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.url = urlSlugify.slugify(req.body.title);

    try {
      const result = await Post.update(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    const schema = yup.object().shape({
      id: yup.number().required(),
      confirm: yup.string().matches(/(true)/).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await Post.delete(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new PostController();
