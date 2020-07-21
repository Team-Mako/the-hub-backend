import Post from '../models/Post';

class FavouriteController {
  async show(req, res) {
    const { userId } = req;
    req.body.userId = userId;

    try {
      const result = await Post.checkFavourite(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new FavouriteController();
