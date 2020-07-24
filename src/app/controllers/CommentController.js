import * as Yup from 'yup';
import Post from '../models/Post';

class CommentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      comment: Yup.string().required(),
      userId: Yup.number().required(),
      postId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid data' });
    }

    req.body.giveId = req.userId;

    try {
      const result = await Post.insertComment(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async index(req, res) {
    const { postId } = req.query;

    try {
      const result = await Post.getComments(postId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { userId } = req;

    try {
      const result = await Post.totalComents(userId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new CommentController();
