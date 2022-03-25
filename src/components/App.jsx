import { useState, useEffect } from 'react';

import ImageGallery from './ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import ImageError from 'components/ImageError/ImageError';

import PixabayApiService from 'services/axios-api';

import { ImageGalleryContainer } from './ImageGallery/ImageGallery.styled';
import { AppContainer, Idle } from './App.styled';

const imageApi = new PixabayApiService();

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [imagesArray, setImagesArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [largeImage, setlargeImage] = useState({
    largeUrl: '',
    alt: '',
  });

  const handleSearchQuerySubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setImagesArray([]);
    setPage(1);
  };

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    setStatus('pending');
    imageApi.setQuery(searchQuery);
    imageApi.setPage(page);
    imageApi
      .fetchOfQuery()
      .then(newImagesArray => {
        if (newImagesArray.length !== 0) {
          setImagesArray(prevArr => [...prevArr, ...newImagesArray]);
          setStatus('resolved');
        } else {
          return Promise.reject(
            new Error(`No images found for your query "${searchQuery.trim()}"`)
          );
        }
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      });
  }, [searchQuery, page]);

  const loadMore = e => {
    e.preventDefault();
    setStatus('pending');
    setPage(prevPage => prevPage + 1);
  };

  const toggleModal = (largeUrl, alt) => {
    if (!showModal) {
      setlargeImage({
        largeUrl: largeUrl,
        alt: alt,
      });
      setShowModal(true);
    }
    if (showModal) {
      setShowModal(false);
    }
  };

  const IDLE = status === 'idle';
  const PENDINGNextSearch = status === 'pending' && imagesArray.length === 0;
  const PENDINGLoadMore = status === 'pending' && imagesArray.length !== 0;
  const RESOLVED = status === 'resolved';
  const REJECTED = status === 'rejected';

  return (
    <AppContainer>
      {/* <Searchbar onSubmit={handleSearchQuerySubmit} /> */}
      <Searchbar onSubmit={handleSearchQuerySubmit} />
      {IDLE && <Idle>Please, enter your request.</Idle>}
      {PENDINGNextSearch && <Loader />}
      {PENDINGLoadMore && (
        <ImageGalleryContainer>
          <ImageGallery getUrlLarge={toggleModal} imagesArray={imagesArray} />
          <Loader />
        </ImageGalleryContainer>
      )}
      {RESOLVED && (
        <ImageGallery getUrlLarge={toggleModal} imagesArray={imagesArray} />
      )}
      {REJECTED && <ImageError message={error.message} />}

      {imageApi.notLastPage() && status === 'resolved' && (
        <Button loadMore={loadMore} />
      )}
      {showModal && (
        <Modal
          largeUrl={largeImage.largeUrl}
          alt={largeImage.alt}
          onClose={toggleModal}
          showModal={showModal}
        />
      )}
    </AppContainer>
  );
}
