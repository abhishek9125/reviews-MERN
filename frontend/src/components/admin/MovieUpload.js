import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { uploadMovie, uploadTrailer } from '../../api/movie';
import { useNotification } from '../../hooks';
import ModalContainer from '../modals/ModalContainer';
import MovieForm from './MovieForm';

function MovieUpload({ visible, onClose }) {

    const [videoSelected, setVideoSelected] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoUploaded, setVideoUploaded] = useState(0);
    const [videoInfo, setVideoInfo] = useState({});
    const [busy, setBusy] = useState(false);

    const { updateNotification } = useNotification();

    const handleTypeError = (error) => {
        updateNotification('error', error)
    }

    const resetState = () => {
        setVideoSelected(false);
        setVideoUploaded(false);
        setUploadProgress(0);
        setVideoInfo({});
    };

    const handleUploadTrailer = async (data) => {
        const { error, url, public_id } = await uploadTrailer(data, setUploadProgress);
        if (error) {
            return updateNotification('error', error);
        }
        setVideoUploaded(true);
        setVideoInfo({ url, public_id });
    }

    const handleChange = (file) => {
        const formData = new FormData();
        formData.append('video', file);
        setVideoSelected(true);

        handleUploadTrailer(formData);
    }

    const getUploadProgressValue = () => {
        if (!videoUploaded && uploadProgress >= 100) {
            return 'Processing the Movie';
        }

        if (videoUploaded) {
            return 'Movie Uploaded Successfully'
        }

        return `Upload Progress -- ${uploadProgress}%`;
    }

    const handleSubmit = async (data) => {

        if (!videoInfo.url || !videoInfo.public_id) {
            return updateNotification('error', 'Trailer is Missing');
        }

        setBusy(true);
        data.append("trailer", JSON.stringify(videoInfo));
        const { error, movie } = await uploadMovie(data);
        setBusy(false);
        if (error) return updateNotification("error", error);

        updateNotification("success", "Movie uploaded successfully.");
        resetState();
        onClose();
    }

    return (
        <ModalContainer visible={visible}>
            <div className='mb-5'>

                <UploadProgress
                    visible={videoSelected && !videoUploaded}
                    width={uploadProgress}
                    message={getUploadProgressValue()}
                />
            </div>
            {
                !videoSelected ?
                    <TrailerSelector
                        visible={!videoSelected}
                        handleChange={handleChange}
                        onTypeError={handleTypeError}
                    />
                    :
                    <MovieForm busy={busy} onSubmit={!busy ? handleSubmit : null} btnTitle="Upload" />
            }
        </ModalContainer>
    )

}

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {

    if (!visible) {
        return null;
    }

    return (
        <div className='h-full flex items-center justify-center'>
            <FileUploader handleChange={handleChange} onTypeError={onTypeError} types={['mp4', 'avi']}>
                <label
                    className='w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex items-center justify-center 
                    flex-col dark:text-dark-subtle text-secondary cursor-pointer'
                >
                    <AiOutlineCloudUpload size={80} />
                    <p>Drop You File Here!</p>
                </label>
            </FileUploader>
        </div>

    )
}

const UploadProgress = ({ width, message, visible }) => {

    if (!visible) {
        return null;
    }

    return (
        <div className='dark:bg-secondary bg-white drop-shadow-lg rounded p-3'>
            <div className='relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden'>
                <div style={{ width: width + '%' }} className='h-full absolute left-0 dark:bg-white bg-secondary' />
            </div>
            <p className='font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-2'>{message}</p>
        </div>
    )
}

export default MovieUpload;