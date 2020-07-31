import Post from '../models/Post';

class StepController {
  async store(req, res) {
    const { stepCover, stepDescription, id } = req.body;
    let stepCovers;

    if (stepCover) {
      stepCovers = stepCover;
    } else {
      stepCovers = false;
    }

    try {
      const result = await Post.addStep(stepDescription, stepCovers, id);
      result.message = 'Step Created!';
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    const { stepId } = req.params;

    try {
      const result = await Post.deleteStep(stepId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new StepController();
