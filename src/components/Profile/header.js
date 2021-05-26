import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import useUser from '../../hooks/use-user';
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';
import Skeleton from 'react-loading-skeleton';
import UserContext from '../../context/user';

const Header = ({ 
    photosCount, 
    followerCount, 
    setFollowerCount,
    profile: { 
        docId: profileDocId, 
        userId: profileUserId, 
        fullName, 
        followers, 
        following, 
        username: 
        profileUsername }}) => {

    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);
    const activeBtnFollow = user?.username && user?.username !== profileUsername;

    const handleToggleFollow = async () => {
        setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
        setFollowerCount({
            followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
        });
        await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
    };

    useEffect(() => {
        const isLoggedInUserFollowingProfile = async () => {
            const isFollowing = await isUserFollowingProfile(user.username, profileUserId);
            setIsFollowingProfile(!!isFollowing);
        }

        if(user?.username && profileUserId) {
            isLoggedInUserFollowingProfile();
        }
    }, [user?.username, profileUserId]);

    return (
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
            <div className="container flex justify-center items-center pl-1 lg:pl-0">
                {profileUsername ? (
                    <img className="rounded-full h-30 w-30 md:h-40 md:w-40 flex" alt={`${profileUsername} profile picture`} src={`/images/avatars/${profileUsername}.jpg`} />
                ) : (
                    <img className="rounded-full h-30 w-30 md:h-40 md:w-40 flex" alt={`Josh Brackett's profile picture`} src={`/images/avatars/karl.jpg`} />
                )}
            </div>

            <div className="flex items-center justify-center flex-col col-span-2">
                <div className="container flex items-center">
                    <p className="text-2xl mr-4">{profileUsername}</p>
                    {activeBtnFollow && (
                        <button className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8" 
                        type="button" 
                        onClick={handleToggleFollow}
                        onKeyDown={(event) => {
                            if(event.key === 'Enter') {
                                handleToggleFollow();
                            }
                        }}>
                            {isFollowingProfile ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>

                <div className="container flex mt-4 flex-row"> {/* flex col to phone and lg flex-row*/}
                    {!followers || !following ? (
                        <Skeleton count={1} width={677} height={24} />
                    ) : (
                        <>
                            <p className="mr-5 lg:mr-10 text-center">
                                <span className="font-bold">{photosCount}</span> photos
                            </p>
                            <p className="mr-5 lg:mr-10 text-center">
                                <span className="font-bold">{followerCount}</span>{` `}{followerCount === 1 ? 'follower' : 'followers'}
                            </p>
                            <p className="mr-5 lg:mr-10 text-center">
                                <span className="font-bold">{following.length}</span> following
                            </p>
                        </>
                    )}
                </div>
                <div className="container mt-4">
                    <p className="font-medium">{!fullName ? <Skeleton count={1} height={24} /> : fullName}</p>
                </div>
            </div>
        </div>
    )
    
}

export default Header;

Header.propTypes = {
    photosCount: PropTypes.number.isRequired,
    followerCount: PropTypes.number.isRequired,
    setFollowerCount: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        docId: PropTypes.string,
        userId: PropTypes.string,
        fullName: PropTypes.string,
        followers: PropTypes.array,
        following: PropTypes.array,
        username: PropTypes.string,
    }).isRequired,
};