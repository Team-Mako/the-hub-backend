class TestController {
  async index(req, res) {
    return res.json({ message: __dirname });
  }
}

export default new TestController();
