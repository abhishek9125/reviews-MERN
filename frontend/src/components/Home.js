import React from 'react';
import Container from './Container';
import NotVerified from './user/NotVerified';

function Home() {



    return (
        <>
            <NotVerified />
            <Container>
                Home Page
            </Container>
        </>
    )
}

export default Home;