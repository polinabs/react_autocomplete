import React, { FC, useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { formatString } from '../servises/formatString';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
};

export const Autocomplete: FC<Props> = ({ people, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useMemo(() => {
    return debounce(setAppliedQuery, 300);
  }, []);

  useEffect(() => {
    return () => applyQuery.cancel();
  }, [applyQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      formatString(person.name).includes(appliedQuery),
    );
  }, [appliedQuery, people]);

  return (
    <>
      <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              setIsDropdownVisible(true);
              onSelect(null);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map((person, index) => (
              <div
                key={index}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => {
                  setIsDropdownVisible(false);
                  setQuery('');
                  onSelect(person);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && (
        <div
          className="
             notification
             is-danger
             is-light
             mt-3
             is-align-self-flex-start
           "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
