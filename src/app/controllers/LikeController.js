import Post from '../models/Post';

class LikeController {
  async store(req, res) {
    req.body.userId = req.userId;
    req.body.postId = req.params.postId;

    try {
      const result = await Post.insertLike(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    req.body.userId = req.userId;
    req.body.postId = req.params.postId;

    try {
      const result = await Post.checkLike(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    req.body.userId = req.userId;
    req.body.postId = req.params.postId;

    try {
      const result = await Post.removeLike(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new LikeController();
