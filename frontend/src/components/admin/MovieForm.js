import React, { useState } from 'react'
import { commonInputClasses } from '../../utils/theme';
import TagsInput from '../TagsInput';
import Submit from '../form/Submit';
import { useNotification } from '../../hooks';
import WritersModal from '../modals/WritersModal';
import CastForm from '../form/CastForm';
import CastModal from '../modals/CastModal';
import PosterSelector from '../PosterSelector';
import GenresSelector from '../GenresSelector';
import GenresModal from '../modals/GenresModal';
import Selector from '../Selector';
import { typeOptions, languageOptions, statusOptions } from '../../utils/options';
import Label from '../Label';
import DirectorSelector from '../DirectorSelector';
import WriterSelector from '../WriterSelector';
import ViewAllButton from '../ViewAllButton';
import LabelWithBadge from '../LabelWithBadge';
import { validateMovie } from '../../utils/validator';

const defaultMovieInfo = {
    title: "",
    storyLine: "",
    tags: [],
    cast: [],
    director: {},
    writers: [],
    releaseDate: "",
    poster: null,
    genres: [],
    type: "",
    language: "",
    status: "",
};

function MovieForm({ onSubmit, busy }) {

    const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
    const [showWritersModal, setShowWritersModal] = useState(false);
    const [showCastModal, setShowCastModal] = useState(false);
    const [showGenresModal, setShowGenresModal] = useState(false);
    const [selectedPosterForUI, setSelectedPosterForUI] = useState('');

    const { updateNotification } = useNotification();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { error } = validateMovie(movieInfo);

        if (error) {
            updateNotification('error', error);
        }

        const { tags, genres, cast, writers, director, poster } = movieInfo;

        const formData = new FormData();
        const finalMovieInfo = {
            ...movieInfo
        };

        finalMovieInfo.tags = JSON.stringify(tags);
        finalMovieInfo.genres = JSON.stringify(genres);

        const finalCast = cast.map((c) => ({
            actor: c.profile.id,
            roleAs: c.roleAs,
            leadActor: c.leadActor,
        }));

        finalMovieInfo.cast = JSON.stringify(finalCast);

        if (writers.length) {
            const finalWriters = writers.map((w) => w.id);
            finalMovieInfo.writers = JSON.stringify(finalWriters);
        }

        if (director.id) finalMovieInfo.director = director.id;
        if (poster) finalMovieInfo.poster = poster;

        for (let key in finalMovieInfo) {
            formData.append(key, finalMovieInfo[key]);
        }

        onSubmit(formData);
    }

    const { title, storyLine, writers, cast, tags, genres, type, language, status } = movieInfo;

    const handleChange = ({ target }) => {
        const { value, name, files } = target;

        if (name === 'poster') {
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

                    <DirectorSelector onSelect={updateDirector} />

                    <div>
                        <div className='flex justify-between'>
                            <LabelWithBadge badge={writers.length} htmlFor="writers">Writers</LabelWithBadge>
                            <ViewAllButton visible={writers.length} onClick={displayWritersModal}>View All</ViewAllButton>
                        </div>
                        <WriterSelector onSelect={updateWriters} />
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

                    <Submit busy={busy} value="Upload" onClick={handleSubmit} />
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

export default MovieForm;