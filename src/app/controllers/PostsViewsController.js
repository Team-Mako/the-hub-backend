import Post from '../models/Post';

class PostsViewsController {
  async show(req, res) {
    const { userId } = req;
    req.body.userId = userId;
    // SELECT COUNT(user_id) AS Total, post_view_date FROM posts_views WHERE user_id = 1 AND post_view_date BETWEEN '2020-07-14' AND '2020-07-21' GROUP BY post_view_date
    try {
      const result = await Post.checkFavourite(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new PostsViewsController();
