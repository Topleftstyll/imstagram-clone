import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getUserPhotosByUsername } from '../../services/firebase';
import Header from './header';
import Photos from './photos';

const Profile = ({ user }) => {
    const reducer = (state, newState) => ({ ...state, ...newState });
    const initialState = {
        profile: {},
        photosCollection: [],
        followerCount: 0,
    }
    const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(reducer, initialState);


    useEffect(() => {
        const getProfileInfoAndPhotos = async () => {
            const photos = await getUserPhotosByUsername(user.username);

            dispatch({ profile: user, photosCollection: photos, followerCount: !user.followers ? 0 : user.followers.length });
        }

        getProfileInfoAndPhotos();
    }, [user.username]);

    return (
        <>
            <Header photosCount={photosCollection ? photosCollection.length : 0} profile={profile} followerCount={followerCount} setFollowerCount={dispatch}/>
            <Photos photos={photosCollection} />
        </>
    );
}

export default Profile;

Profile.propTypes = {
    user: PropTypes.shape({
        dateCreated: PropTypes.number,
        emailAddress: PropTypes.string,
        followers: PropTypes.array,
        following: PropTypes.array,
        fullName: PropTypes.string,
        userId: PropTypes.string,
        username: PropTypes.string,
    })
}