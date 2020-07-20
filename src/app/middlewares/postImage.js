import Jimp from 'jimp';
import URLSlugify from 'url-slugify';
import { resolve, extname } from 'path';

const urlSlugify = new URLSlugify();

export default async (req, res, next) => {
  const pictureName = urlSlugify.slugify(req.body.title);

  if (req.files.cover) {
    const cover = resolve(__dirname, '..', '..', '..', 'tmp', req.files.cover[0].filename);
    const coverExtension = extname(req.files.cover[0].originalname);

    try {
      const jimpCover = await Jimp.read(cover);
      await jimpCover.scaleToFit(830, 830);
      await jimpCover.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-post-cover-${pictureName}${coverExtension}`));
      req.body.cover = `the-hub-post-cover-${pictureName}${coverExtension}`;
      next();
    } catch (err) {
      console.log(err);
    }
  } else {
    next();
  }
};
