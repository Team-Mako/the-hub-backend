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
      cover: yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid data' });
    }

    req.body.userId = req.userId;
    req.body.url = urlSlugify.slugify(req.body.title);

    try {
      const postId = await Post.create(req.body);

      if (Array.isArray(req.body.stepDescription)) {
        req.body.stepDescription.map(async (step, index) => {
          const { stepDescription, stepCover } = req.body;
          await Post.addStep(stepDescription[index], stepCover[index], postId.insertId);
        });
      } else {
        const { stepDescription, stepCover } = req.body;
        let stepCoverOne;

        if (stepCover) {
          stepCoverOne = stepCover;
        } else {
          stepCoverOne = false;
        }

        await Post.addStep(stepDescription, stepCoverOne, postId.insertId);
      }

      req.body.material.map(async (step, index) => {
        const { meas, material, userId } = req.body;
        await Post.addMaterial(meas[index], postId.insertId, material[index], userId);
      });

      postId.message = 'Project Created!';

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
      visible: yup.string().notRequired(),
      categoryId: yup.number().required(),
    });

    console.log(req.body);

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    if (!req.body.cover) {
      req.body.cover = '';
    }

    if (!req.body.visible) {
      req.body.visible = 1;
    } else {
      req.body.visible = 0;
    }

    try {
      const result = await Post.update(req.body);
      result.message = 'Project updated!';
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
