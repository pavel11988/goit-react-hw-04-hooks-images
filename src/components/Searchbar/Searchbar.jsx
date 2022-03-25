import PropTypes from 'prop-types';
import { useState } from 'react';

import {
  SearchbarContainer,
  SearchForm,
  SearchButton,
  ButtonLabel,
  SearchInput,
} from './Searchbar.styled';

export default function Searchbar({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryChange = event => {
    setSearchQuery(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (searchQuery.trim() === '') {
      alert('Search is empty...');
      return;
    }

    onSubmit(searchQuery);
    setSearchQuery('');
  };

  return (
    <SearchbarContainer className="searchbar">
      <SearchForm className="form" onSubmit={handleSubmit}>
        <SearchInput
          className="input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={handleQueryChange}
        />

        <SearchButton type="submit" className="button">
          <ButtonLabel className="button-label">Search</ButtonLabel>
        </SearchButton>
      </SearchForm>
    </SearchbarContainer>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
