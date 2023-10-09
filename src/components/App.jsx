import React, { Component } from 'react';
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

export class App extends Component {
  state = {
    images: [],
    showModal: false,
    isLoading: false,
    searchItem: '',
    error: null,
    page: 1,
    allImagesLoaded: false,
    selectedImage: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchItem, page } = this.state;
    if (searchItem !== prevState.searchItem || page !== prevState.page) {
      this.loadImages(searchItem, page);
    }
  }

  handleSubmit = searchQuery => {
    this.setState({
      searchItem: searchQuery,
      page: 1,
      images: [],
      allImagesLoaded: false,
      selectedImage: null,
      totalHits: null,
    });
  };

  async loadImages(searchItem, page) {
    this.setState({ isLoading: true, showModal: false });
    try {
      const images = await fetchImages(searchItem, page);
      const { totalHits } = images;

      this.setState(prevState => ({
        images: [...prevState.images, ...images.hits],
        totalHits,
        allImagesLoaded:
          prevState.images.length + images.hits.length >= totalHits,
      }));

      if (this.state.images === totalHits) {
        this.setState({ allImagesLoaded: true });
      }
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  showMoreImages = () => {
    if (!this.state.allImagesLoaded) {
      this.setState(prevState => ({
        page: prevState.page + 1,
      }));
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  };

  handleBackdropClick = event => {
    if (event.target === event.currentTarget) {
      this.toggleModal();
    }
  };

  showSelectedImage = selectedImage => {
    this.setState({ selectedImage });
    this.toggleModal();
  };

  render() {
    const {
      images,
      isLoading,
      error,
      allImagesLoaded,
      showModal,
      selectedImage,
    } = this.state;

    return (
      <AppContainer>
        <Searchbar onSubmit={this.handleSubmit} />
        {error && <p>Whoops, something went wrong: {error.message}</p>}
        {images.length > 0 && (
          <ImageGallery images={images} onImageClick={this.showSelectedImage} />
        )}
        {isLoading && <Loader />}
        {!allImagesLoaded && images.length > 0 && (
          <Button
            text="Load more"
            clickHandle={this.showMoreImages}
            isLoading={isLoading}
          />
        )}
        {showModal && (
          <Modal
            toggleModal={this.toggleModal}
            onClick={this.handleBackdropClick}
          >
            {selectedImage && (
              <img src={selectedImage.largeImageURL} alt={selectedImage.tags} />
            )}
          </Modal>
        )}
      </AppContainer>
    );
  }
}

export default App;
