import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { commonInputClasses } from '../utils/theme';

function LiveSearch({ value = "", onChange = null, name, placeholder = "", results = [], renderItem = null, resultContainerStyle, selectedResultStyle, onSelect = null, inputStyle }) {

    const [displaySearch, setDisplaySearch] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [defaultValue, setDefaultValue] = useState('');

    const handleOnFocus = () => {
        if (results.length) {
            setDisplaySearch(true);
        }
    }

    const closeSearch = () => {
        setDisplaySearch(false);
        setFocusedIndex(-1);
    }

    const handleOnBlur = () => {
        closeSearch();
    }

    const handleSelection = (selectedItem) => {
        if(selectedItem) {
            onSelect(selectedItem);
            closeSearch();
        }
    }

    const handleKeyDown = ({ key }) => {

        const keys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
        let nextCount;

        if (!keys.includes(key)) return;

        if (key === 'ArrowDown') {
            nextCount = (focusedIndex + 1) % results.length;
        }

        if (key === 'ArrowUp') {
            nextCount = (focusedIndex + results.length - 1) % results.length;
        }

        if (key === "Escape") {
            return closeSearch();
        }

        if (key === 'Enter') {
            return handleSelection(results[focusedIndex]);
        }

        setFocusedIndex(nextCount);
    }

    const getInputStyle = () => {
        return inputStyle ? inputStyle : commonInputClasses + ' border-2 rounded p-1 text-lg'
    }

    const handleChange = (e) => {
        setDefaultValue(e.target.value);
        onChange && onChange(e);
    }

    useEffect(() => {
        if(results.length) {
            return setDisplaySearch(true);
        } 
        setDisplaySearch(false);
    }, [results.length])

    useEffect(() => {
        setDefaultValue(value)
    }, [value])

    return (
        <div className='relative'>
            <input
                id={name}
                name={name}
                type="text"
                value={defaultValue}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={getInputStyle()}
            />
            <SearchResults 
                results={results}
                visible={displaySearch}
                renderItem={renderItem} 
                onSelect={handleSelection}
                focusedIndex={focusedIndex}
                selectedResultStyle={selectedResultStyle} 
                resultContainerStyle={resultContainerStyle}               
            />
        </div>
    )
}

export default LiveSearch;

const SearchResults = ({ visible, results = [], focusedIndex, onSelect, renderItem, resultContainerStyle, selectedResultStyle }) => {

    const resultContainer = useRef();

    useEffect(() => {
        resultContainer.current?.scrollIntoView({
            behaviour: 'smooth',
            block: 'center'
        });
    }, [focusedIndex])

    if (!visible) {
        return null;
    }

    return (
        <div className='absolute z-50 right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar'>
            {
                results.map((result, index) => {

                    const getSelectedClass = () => {
                        return selectedResultStyle ? selectedResultStyle : 'dark:bg-dark-subtle bg-light-subtle';
                    }

                    return (
                        <ResultCard
                            ref={index === focusedIndex ? resultContainer : null}
                            item={result}
                            key={index.toString()}
                            renderItem={renderItem}
                            onMouseDown={() => onSelect(result)}
                            resultContainerStyle={resultContainerStyle}
                            selectedResultStyle={index === focusedIndex ? getSelectedClass() : ""}
                        />
                    )
                })
            }
        </div>
    )
}

const ResultCard = forwardRef((props, ref) => {
    const { item, renderItem, resultContainerStyle, selectedResultStyle, onMouseDown } = props;
    const getClasses = () => {
        if (resultContainerStyle) {
            return resultContainerStyle + " " + selectedResultStyle;
        }

        return selectedResultStyle + ' cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition';
    }

    return (
        <div
            ref={ref}
            className={getClasses()}
            onMouseDown={onMouseDown}
        >
            {renderItem(item)}
        </div>
    )
})



