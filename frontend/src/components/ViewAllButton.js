import React from 'react'

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
export default ViewAllButton