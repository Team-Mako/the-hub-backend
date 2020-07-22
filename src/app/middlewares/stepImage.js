import Jimp from 'jimp';
import URLSlugify from 'url-slugify';
import { resolve, extname } from 'path';

const urlSlugify = new URLSlugify();

export default async (req, res, next) => {
  const pictureName = urlSlugify.slugify(req.body.title);

  if (req.files.stepCover) {
    req.body.stepCover = [];

    if (Array.isArray(req.body.stepDescription)) {
      req.body.stepDescription.map(async (item, index) => {
        if (req.files.stepCover[index]) {
          const stepCover = resolve(__dirname, '..', '..', '..', 'tmp', req.files.stepCover[index].filename);
          const itemExtension = extname(req.files.stepCover[index].originalname);

          try {
            const jimpRead = await Jimp.read(stepCover);
            await jimpRead.scaleToFit(830, 830);
            await jimpRead.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-post-cover-step-${index}-${pictureName}${itemExtension}`));
            req.body.stepCover[index] = `the-hub-post-cover-step-${index}-${pictureName}${itemExtension}`;
          } catch (err) {
            console.log(err);
          }
        } else {
          req.body.stepCover[index] = '';
        }
      });
    } else {
      const stepCover = resolve(__dirname, '..', '..', '..', 'tmp', req.files.stepCover[0].filename);
      const itemExtension = extname(req.files.stepCover[0].originalname);

      try {
        const jimpRead = await Jimp.read(stepCover);
        await jimpRead.scaleToFit(830, 830);
        await jimpRead.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-post-cover-step-${0}-${pictureName}${itemExtension}`));
        req.body.stepCover = `the-hub-post-cover-step-${0}-${pictureName}${itemExtension}`;
      } catch (err) {
        console.log(err);
      }
    }
    next();
  } else {
    req.body.stepCover = [];
    next();
  }
};
