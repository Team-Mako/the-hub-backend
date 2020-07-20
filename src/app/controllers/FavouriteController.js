import Post from '../models/Post';

class FavouriteController {
  async store(req, res) {
    const { postId } = req.params;
    const { userId } = req;

    req.body.postId = postId;
    req.body.userId = userId;

    try {
      const result = await Post.setFavourite(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async show(req, res) {
    const { postId } = req.params;
    const { userId } = req;

    req.body.postId = postId;
    req.body.userId = userId;

    try {
      const result = await Post.checkFavourite(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    const { postId } = req.params;
    const { userId } = req;

    req.body.postId = postId;
    req.body.userId = userId;

    try {
      const result = await Post.removeFavourite(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async index(req, res) {
    const { userId } = req;

    try {
      const result = await Post.favList(userId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new FavouriteController();
