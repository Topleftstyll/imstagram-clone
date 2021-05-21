import { FieldValue, firebase } from '../lib/firebase';

export const doesUsernameExist = async (username) => {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return result.docs.map((user) => user.data().length > 0);
}

export const getUserByUsername = async (username) => {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
    
}

export const getUserByUserId = async (userId) => {
    const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .get();

    const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));

    return user;
}

export const getSuggestedProfiles = async (userId, following) => {
    const result = await firebase
        .firestore()
        .collection('users')
        .limit(10)
        .get();

    return result.docs
        .map((user) => ({ ...user.data(), docId: user.id }))
        .filter((profile) => profile.userId !== userId && !following.includes(profile.userId));
}

export const updateLoggedInUserFollowing = async (loggedInUserDocId, profileId, isFollowingProfile) => {
    return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
        following: isFollowingProfile 
            ? FieldValue.arrayRemove(profileId)
            : FieldValue.arrayUnion(profileId)
    });
}

export const updateFollowedUserFollowers = async (profileDocId, loggedInUserDocId, isFollowingProfile) => {
    return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
        followers: isFollowingProfile 
            ? FieldValue.arrayRemove(loggedInUserDocId)
            : FieldValue.arrayUnion(loggedInUserDocId)
    });
}

export const getPhotos = async (userId, following) => {
    const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get();

    const userFollowedPhotos = result.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id
    }));

    const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async (photo) => {
            let userLikedPhoto = false;
            if(photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }
            const user = await getUserByUserId(photo.userId);
            const { username } = user[0];
            return { username, ...photo, userLikedPhoto };
        })
    );
    return photosWithUserDetails;
}

export const getUserPhotosByUsername = async (username) => {
    const [user] = await getUserByUsername(username);
    const result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', '==', user.userId)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}

export const isUserFollowingProfile = async (loggedInUserUsername, profileUserId) => {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', loggedInUserUsername)
        .where('following', 'array-contains', profileUserId)
        .get();

    const [response = {}] = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));

    return response.userId;
}

export const toggleFollow = async (isFollowingProfile, activeUserDocId, profileDocId, profileUserId, followingUserId) => {
    await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);
    await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}