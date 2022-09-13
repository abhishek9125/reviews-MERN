import React from 'react'
import AuthProvider from './AuthProvider'
import MoviesProvider from './MovieProvider'
import NotificationProvider from './NotificationProvider'
import SearchProvider from './SearchProvider'
import ThemeProvider from './ThemeProvider'

function ContextProviders({ children }) {
    return (
        <NotificationProvider>
            <SearchProvider>
                <MoviesProvider>
                    <AuthProvider>
                        <ThemeProvider>
                            {children}
                        </ThemeProvider>
                    </AuthProvider>
                </MoviesProvider>
            </SearchProvider>
        </NotificationProvider>
    )
}

export default ContextProviders