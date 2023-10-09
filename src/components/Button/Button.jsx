import css from './Button.module.css';

const Button = ({ text, clickHandle, isLoading }) => {
  return (
    <button
      type="button"
      onClick={clickHandle}
      className={isLoading ? css.visuallyHidden : css.buttonLoadMore}
    >
      {text}
    </button>
  );
};

export default Button;
