import Post from '../models/Post';

class GetIdController {
  async show(req, res) {
    const { slug } = req.query;

    try {
      const result = await Post.getId(slug);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
}

export default new GetIdController();
