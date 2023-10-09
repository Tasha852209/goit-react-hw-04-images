import css from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ image, id, onImageClick, tags }) => {
  return (
    <li className={css.galleryItem} key={id} onClick={() => onImageClick(id)}>
      <img src={image} alt={tags} className={css.image} />
    </li>
  );
};

export default ImageGalleryItem;
