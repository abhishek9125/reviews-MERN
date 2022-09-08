import React from 'react';
import { ImSpinner3 } from 'react-icons/im';

function Submit({ value, busy = false, type, onClick }) {
    return (
        <button 
            onClick={onClick}
            type={type || 'submit'}
            className='w-full rounded dark:bg-white bg-secondary hover:bg-opacity-90 transition font-semibold text-lg dark:text-secondary text-white vursor-pointer h-10
            flex items-center justify-center'
        >
            {busy ? <ImSpinner3 className='animate-spin' /> : value}
        </button>
    )
}

export default Submit;