import React, { useState } from 'react';
import LiveSearch from '../LiveSearch';
import { commonInputClasses } from '../../utils/theme';
import { useNotification } from '../../hooks';

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

const defaultCastInfo = {
    profile: {},
    roleAs: '',
    leadActor: false
}

function CastForm({ onSubmit }) {

    const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });

    const { leadActor, profile, roleAs } = castInfo;

    const { updateNotification } = useNotification();

    const handleOnChange = ({ target }) => {
        const { checked, name, value } = target;

        if(name === 'leadActor') {
            return setCastInfo({ ...castInfo, leadActor: checked });
        }

        setCastInfo({ ...castInfo, [name]: value });

    }

    const handleProfileSelect = (profile) => {
        setCastInfo({ ...castInfo, profile });
    }

    const handleSubmit = () => {
        const { profile, roleAs } = castInfo;

        if(!profile.name) {
            return updateNotification('error', 'Cast Profile is Missing..!!');
        }

        if(!roleAs) {
            return updateNotification('error', 'Cast Role is Missing..!!');
        }

        onSubmit(castInfo);
        setCastInfo({ ...defaultCastInfo });

    }

    const renderItem = (result) => {
        return (
            <div key={result.id} className='flex space-x-2 rounded overflow-hidden'>
                <img src={result.avatar} alt={result.name} className="w-16 h-16 object-cover" />
                <p className='dark:text-white font-semibold'>{result.name}</p>
            </div>
        )
    }


    return (
        <div className='flex items-center space-x-2'>
            <input 
                type="checkbox"
                name='leadActor'
                className='w-4 h-4'
                checked={leadActor}
                onChange={handleOnChange}
                title="Set as Lead Actor"
            />

            <LiveSearch 
                name="cast"
                value={profile.name}
                results={results}
                renderItem={renderItem}
                onSelect={handleProfileSelect}
                placeholder="Search Profile"
            />

            <span className='dark:text-dark-subtle text-light-subtle font-semibold'>
                as
            </span>

            <div className='flex-grow'>

                <input 
                    type="text"
                    name='roleAs'
                    value={roleAs}
                    placeholder="Role As"
                    onChange={handleOnChange}
                    className={commonInputClasses + ' rounded p-1 text-lg border-2'}
                />

            </div>

            <button 
                type='button'
                onClick={handleSubmit}
                className='bg-secondary dark:bg-white dark:text-primary text-white px-1 rounded'
            >
                Add
            </button>

        </div>
    )
}

export default CastForm