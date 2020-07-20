import * as yup from 'yup';
import User from '../models/User';

class UpdateAvatarController {
  async update(req, res) {
    const { userId } = req;

    if (!userId) return res.status(401).json({ error: 'Id not provided' });

    const schema = yup.object().shape({
      name: yup.string().required(),
      avatar: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    req.body.id = userId;

    try {
      const result = await User.updateAvatar(req.body);
      result.message = 'Avatar updated!';
      result.avatar = req.body.avatar;
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UpdateAvatarController();
