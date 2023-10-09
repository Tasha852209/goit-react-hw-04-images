import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { fetchImages } from '../services/api';

import Button from './Button/Button';
import { Loader } from './Loader/Loader';

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;

export const App = () => {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [totalHits, setTotalHits] = useState(null);

  // const loadImages = useCallback(async (searchItem, page) => {
  //   setIsLoading(true);
  //   try {
  //     const fetchedImages = await fetchImages(searchItem, page);
  //     const { hits, totalHits } = fetchedImages;
  //     setTotalHits(totalHits);
  //     setImages(prevImages => [...prevImages, ...hits]);
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (searchItem !== '' || page !== 1) {
  //     loadImages(searchItem, page);
  //   }
  // }, [searchItem, page, loadImages]);

  useEffect(() => {
    const loadImages = async (searchItem, page) => {
      setIsLoading(true);
      setShowModal(false);
      try {
        const fetchedImages = await fetchImages(searchItem, page);
        const { hits, totalHits } = fetchedImages;
        setTotalHits(totalHits);
        setImages(prevImages => [...prevImages, ...hits]);
        setTotalHits(totalHits);
        // setAllImagesLoaded(
        //   prevImages => prevImages.length + hits.length >= totalHits
        // );
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchItem !== '' || page !== 1) {
      loadImages(searchItem, page);
    }
  }, [searchItem, page]);

  useEffect(() => {
    if (images.length >= totalHits) {
      setAllImagesLoaded(true);
    } else {
      setAllImagesLoaded(false);
    }
  }, [images, totalHits]);

  //  async loadImages(searchItem, page) {
  //   this.setState({ isLoading: true, showModal: false });
  //   try {
  //     const images = await fetchImages(searchItem, page);
  //     const { totalHits } = images;
  //     this.setState(prevState => ({
  //       images: [...prevState.images, ...images.hits],
  //       totalHits,
  //       allImagesLoaded:
  //         prevState.images.length + images.hits.length >= totalHits,
  //     }));

  //     if (this.state.images === totalHits) {
  //       this.setState({ allImagesLoaded: true });
  //     }
  //   } catch (error) {
  //     this.setState({ error });
  //   } finally {
  //     this.setState({ isLoading: false });
  //   }
  // }

  // async componentDidUpdate(prevProps, prevState) {
  //   const { searchItem, page } = this.state;
  //   if (searchItem !== prevState.searchItem || page !== prevState.page) {
  //     this.loadImages(searchItem, page);
  //   }
  // }

  const handleSubmit = searchQuery => {
    setImages([]);
    setSearchItem('');
    setPage(1);
    setAllImagesLoaded(false);
    setSelectedImage(null);
    setTotalHits(0);
    // this.setState({
    //   searchItem: searchQuery,
    //   page: 1,
    //   images: [],
    //   allImagesLoaded: false,
    //   selectedImage: null,
    //   totalHits: null,
    // });
  };

  const showMoreImages = () => {
    if (!allImagesLoaded) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const handleBackdropClick = event => {
    if (event.target === event.currentTarget) {
      toggleModal();
    }
  };

  const showSelectedImage = selectedImage => {
    setSelectedImage(selectedImage);
    toggleModal();
  };

  return (
    <AppContainer>
      <Searchbar onSubmit={handleSubmit} />
      {error && <p>Whoops, something went wrong: {error.message}</p>}
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={showSelectedImage} />
      )}
      {isLoading && <Loader />}
      {!allImagesLoaded && images.length > 0 && (
        <Button
          text="Load more"
          clickHandle={showMoreImages}
          isLoading={isLoading}
        />
      )}
      {showModal && (
        <Modal toggleModal={toggleModal} onClick={handleBackdropClick}>
          {selectedImage && (
            <img src={selectedImage.largeImageURL} alt={selectedImage.tags} />
          )}
        </Modal>
      )}
    </AppContainer>
  );
};

export default App;
