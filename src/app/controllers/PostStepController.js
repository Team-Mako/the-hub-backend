import Post from '../models/Post';

class PostStepController {
  async index(req, res) {
    const { postId } = req.params;
    try {
      const result = await Post.postSteps(postId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new PostStepController();
