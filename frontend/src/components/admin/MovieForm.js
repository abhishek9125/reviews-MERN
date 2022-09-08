import React, { useState } from 'react'
import { commonInputClasses } from '../../utils/theme';
import LiveSearch from '../LiveSearch';
import TagsInput from '../TagsInput';
import Submit from '../form/Submit';
import { useNotification } from '../../hooks';
import ModalContainer from '../modals/ModalContainer';
import WritersModal from '../modals/WritersModal';
import CastForm from '../form/CastForm';
import CastModal from '../modals/CastModal';
import PosterSelector from '../PosterSelector';
import GenresSelector from '../GenresSelector';
import GenresModal from '../modals/GenresModal';
import Selector from '../Selector';
import { typeOptions, languageOptions, statusOptions } from '../../utils/options';

const results = [
    {
        id: 1,
        avatar: './logo.png',
        name: 'Snow'
    },
    {
        id: 2,
        avatar: './logo.png',
        name: 'Snow'
    },
    {
        id: 3,
        avatar: './logo.png',
        name: 'Snow'
    },
    {
        id: 4,
        avatar: './logo.png',
        name: 'Snow'
    },
    {
        id: 5,
        avatar: './logo.png',
        name: 'Snow'
    },
    {
        id: 6,
        avatar: './logo.png',
        name: 'Snow'
    },
]

const defaultMovieInfo = {
    title: "",
    storyLine: "",
    tags: [],
    cast: [],
    director: {},
    writers: [],
    releseDate: "",
    poster: null,
    genres: [],
    type: "",
    language: "",
    status: "",
};


function MovieForm() {

    const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
    const [showWritersModal, setShowWritersModal] = useState(false);
    const [showCastModal, setShowCastModal] = useState(false);
    const [showGenresModal, setShowGenresModal] = useState(false);
    const [selectedPosterForUI, setSelectedPosterForUI] = useState('');

    const { updateNotification } = useNotification();

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const renderItem = (result) => {
        return (
            <div key={result.id} className='flex space-x-2 rounded overflow-hidden'>
                <img src={result.avatar} alt={result.name} className="w-16 h-16 object-cover" />
                <p className='dark:text-white font-semibold'>{result.name}</p>
            </div>
        )
    }

    const { title, storyLine, director, writers, cast, tags, genres, type, language, status } = movieInfo;

    const handleChange = ({ target }) => {
        const { value, name, files } = target;

        if(name === 'poster') {
            const poster = files[0];
            updatePosterForUI(poster);
            return setMovieInfo({ ...movieInfo, poster });
        }

        setMovieInfo({ ...movieInfo, [name]: value });
    }

    const updatePosterForUI = (file) => {
        const url = URL.createObjectURL(file);
        setSelectedPosterForUI(url);
    }

    const updateTags = (tags) => {
        setMovieInfo({ ...movieInfo, tags });
    }

    const updateDirector = (profile) => {
        setMovieInfo({ ...movieInfo, director: profile });
    }

    const updateCast = (castInfo) => {
        const { cast } = movieInfo;
        setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
    }

    const updateGenres = (genres) => {
        setMovieInfo({ ...movieInfo, genres });
    }

    const updateWriters = (profile) => {

        const { writers } = movieInfo;

        for (let writer of writers) {
            if (writer.id === profile.id) {
                return updateNotification('warning', 'This profile is already selected.');
            }
        }

        setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
    }

    const hideWritersModal = () => {
        setShowWritersModal(false);
    }

    const displayWritersModal = () => {
        setShowWritersModal(true);
    }

    const hideCastModal = () => {
        setShowCastModal(false);
    }

    const displayCastModal = () => {
        setShowCastModal(true);
    }

    const hideGenresModal = () => {
        setShowGenresModal(false);
    }

    const displayGenresModal = () => {
        setShowGenresModal(true);
    }

    const handleWriterRemove = (profileId) => {
        const { writers } = movieInfo;
        const newWriters = writers.filter(({ id }) => id !== profileId);
        if (!newWriters.length) {
            hideWritersModal();
        }
        setMovieInfo({ ...movieInfo, writers: [...newWriters] });
    }

    const handleCastRemove = (profileId) => {
        const { cast } = movieInfo;
        const newCast = cast.filter(({ profile }) => profile.id !== profileId);
        if (!newCast.length) {
            hideCastModal();
        }
        setMovieInfo({ ...movieInfo, cast: [...newCast] });
    }

    return (
        <>
            <div className='flex space-x-3'>
                <div className='w-[70%] space-y-5'>
                    <div>
                        <Label htmlFor="title">
                            Title
                        </Label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            className={commonInputClasses + ' border-b-2 font-semibold text-xl'}
                            placeholder='Enter Movie Name'
                        />
                    </div>
                    <div>
                        <Label htmlFor="storyLine">
                            Story Line
                        </Label>
                        <textarea
                            id="storyLine"
                            name='storyLine'
                            value={storyLine}
                            onChange={handleChange}
                            className={commonInputClasses + ' border-b-2 resize-none h-24'}
                            placeholder='Movie Story Line...'
                        />
                    </div>
                    <div>
                        <Label htmlFor="tags">Tags</Label>
                        <TagsInput name="tags" onChange={updateTags} value={tags} />
                    </div>
                    <div>
                        <Label htmlFor="director">Director</Label>
                        <LiveSearch
                            name="director"
                            value={director.name}
                            results={results}
                            renderItem={renderItem}
                            onSelect={updateDirector}
                            placeholder="Search Profile"
                        />
                    </div>
                    <div>
                        <div className='flex justify-between'>
                            <LabelWithBadge badge={writers.length} htmlFor="writers">Writers</LabelWithBadge>
                            <ViewAllButton visible={writers.length} onClick={displayWritersModal}>View All</ViewAllButton>
                        </div>
                        <LiveSearch
                            name="writers"
                            results={results}
                            renderItem={renderItem}
                            onSelect={updateWriters}
                            placeholder="Search Profile"
                        />
                    </div>

                    <div>
                        <div className='flex justify-between'>
                            <LabelWithBadge badge={cast.length} htmlFor="cast">
                                Add Cast & Crew
                            </LabelWithBadge>
                            <ViewAllButton
                                visible={cast.length}
                                onClick={displayCastModal}
                            >
                                View All
                            </ViewAllButton>

                        </div>
                        <CastForm
                            onSubmit={updateCast}
                        />
                    </div>

                    <input 
                        type="date"
                        name='releaseDate'
                        onChange={handleChange}
                        className={commonInputClasses + " border-2 rounded p-1 w-auto"}
                    />

                    <Submit value="Upload" onClick={handleSubmit} />
                </div>
                <div className='w-[30%] space-y-5'>
                    <PosterSelector 
                        name="poster"
                        onChange={handleChange}
                        selectedPoster={selectedPosterForUI}
                        accept="image/jpg, image/jpeg, image/png"
                    />
                    <GenresSelector 
                        badge={genres.length}
                        onClick={displayGenresModal}
                    />
                    <Selector 
                        name="type"                       
                        label="Type" 
                        value={type}
                        options={typeOptions}
                        onChange={handleChange}
                    />
                    <Selector 
                        name="language"
                        label="Language"
                        value={language}
                        options={languageOptions}
                        onChange={handleChange}
                    />
                    <Selector 
                        name="status"
                        label="Status"
                        value={status}
                        options={statusOptions}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <WritersModal
                profiles={writers}
                visible={showWritersModal}
                onClose={hideWritersModal}
                onRemoveClick={handleWriterRemove}
            />
            <CastModal
                casts={cast}
                visible={showCastModal}
                onClose={hideCastModal}
                onRemoveClick={handleCastRemove}
            />
            <GenresModal 
                onSubmit={updateGenres}
                visible={showGenresModal}
                onClose={hideGenresModal}
                previousSelection={genres}
            />
        </>

    )
}

export default MovieForm

const Label = ({ children, htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className='dark:text-dark-subtle text-light-subtle font-semibold'>
            {children}
        </label>
    )
}

const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {

    const renderBadge = () => {
        return (
            <span className='dark:bg-dark-subtle bg-light-subtle translate-x-6 text-xs text-white absolute top-0 right-0 w-5 h-5 rounded-full flex justify-center items-center'>
                {badge <= 9 ? badge : '9+'}
            </span>
        )
    }

    return (
        <div className='relative'>
            <Label htmlFor={htmlFor}>
                {children}
            </Label>
            {renderBadge()}
        </div>
    )
}

const ViewAllButton = ({ visible, children, onClick }) => {
    return visible ?
        <button
            type='button'
            onClick={onClick}
            className='dark:text-white text-primary hover:underline transition'
        >
            {children}
        </button>
        :
        null
}