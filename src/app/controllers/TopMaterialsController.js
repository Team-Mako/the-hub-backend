import Post from '../models/Post';

class TopMaterialsController {
  async index(req, res) {
    const { userId } = req;

    try {
      const result = await Post.topMaterials(userId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new TopMaterialsController();
