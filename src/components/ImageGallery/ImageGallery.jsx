import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

const ImageGallery = ({ images, onImageClick, selectedImage }) => {
  return (
    <ul className={css.gallery} key={images.id}>
      {images.map(image => {
        return (
          <ImageGalleryItem
            image={image.webformatURL}
            id={image.id}
            key={image.id}
            tags={image.tags}
            onImageClick={() => onImageClick(image)}
          />
        );
      })}
    </ul>
  );
};

export default ImageGallery;
