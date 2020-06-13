import * as yup from 'yup';
import Material from '../models/Material';

class MaterialController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await Material.create(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new MaterialController();
