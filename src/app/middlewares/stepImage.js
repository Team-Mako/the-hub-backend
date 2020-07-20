import Jimp from 'jimp';
import URLSlugify from 'url-slugify';
import { resolve, extname } from 'path';

const urlSlugify = new URLSlugify();

export default async (req, res, next) => {
  const pictureName = urlSlugify.slugify(req.body.title);

  if (req.files.stepCover) {
    req.body.stepCover = [];
    req.files.stepCover.map(async (item, index) => {
      const stepCover = resolve(__dirname, '..', '..', '..', 'tmp', item.filename);
      const itemExtension = extname(item.originalname);

      try {
        const jimpRead = await Jimp.read(stepCover);
        await jimpRead.scaleToFit(830, 830);
        await jimpRead.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-post-cover-step-${index}-${pictureName}${itemExtension}`));
        req.body.stepCover[index] = `the-hub-post-cover-step-${index}-${pictureName}${itemExtension}`;
      } catch (err) {
        console.log(err);
      }
    });
    next();
  } else {
    next();
  }
};
