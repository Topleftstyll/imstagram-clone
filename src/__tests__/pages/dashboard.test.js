import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Dashboard from '../../pages/dashboard';
import UserContext from '../../context/user';
import FirebaseContexnt from '../../context/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import userFixture from '../../fixtures/logged-in-user';
import { getPhotos, getSuggestedProfiles } from '../../services/firebase';
import photosFixture from '../../fixtures/timeline-photos';
import suggestedProfilesFixture from '../../fixtures/suggested-profiles';
import useUser from '../../hooks/use-user';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use-user');

describe('<Dashbaord />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the dashboard with a user profile and follows a user from the suggested profile', async () => {
        await act(async () => {
            getPhotos.mockImplementation(() => photosFixture);
            getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByText, getByTestId, getByTitle, getAllByText, getByAltText } = render(
                <Router>
                    <FirebaseContexnt.Provider value={{
                        firebase: {
                            firestore: jest.fn(() => ({
                                collection: jest.fn(() => ({
                                    doc: jest.fn(() => ({
                                        update: jest.fn(() => Promise.resolve('User added'))
                                    }))
                                }))
                            }))
                        },
                        FieldValue: {
                            arrayUnion: jest.fn(),
                            arrayRemove: jest.fn()
                        }
                    }}>
                        <UserContext.Provider value={{ user: { uid: 'omoNJQLQSoTQ5ZtcQeVQ2OsKqbj2', displayName: 'josh' }}}>
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Dashboard user={{ uid: 'omoNJQLQSoTQ5ZtcQeVQ2OsKqbj2', displayName: 'josh' }} />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContexnt.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual('Instagram');
                expect(getByTitle('Sign Out')).toBeTruthy();
                expect(getAllByText('raphael')).toBeTruthy();
                expect(getByAltText('Instagram')).toBeTruthy();
                expect(getByAltText('josh profile')).toBeTruthy();
                expect(getAllByText('Saint George and the Dragon')).toBeTruthy();
                expect(getByText('Suggestions for you')).toBeTruthy();

                fireEvent.click(getByText('Follow'));
                // regular click
                fireEvent.click(getByTestId('like-photo-494LKmaF03bUcYZ4xhNu'));
                fireEvent.keyDown(getByTestId('like-photo-494LKmaF03bUcYZ4xhNu'), {
                    key: 'Enter'
                }); // toggle like using keyboard
                fireEvent.click(getByTestId('focus-input-494LKmaF03bUcYZ4xhNu'));

                // add a comment to a photo on the dashboard
                fireEvent.change(getByTestId('add-comment-494LKmaF03bUcYZ4xhNu'), {
                    target: { value: "Amazing photo!" }
                });

                // test submit comment and if it was added
                fireEvent.submit(getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu'));
                expect(getAllByText('Amazing photo!')).toBeTruthy();

                // submit a comment or atleast attempt with an invalid string length
                fireEvent.change(getByTestId('add-comment-494LKmaF03bUcYZ4xhNu'), {
                    target: { value: "" }
                });
                fireEvent.submit(getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu'));

                // toggle focus
                fireEvent.keyDown(getByTestId('focus-input-494LKmaF03bUcYZ4xhNu'), {
                    key: 'Enter'
                });
                fireEvent.submit(getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu'));
            });
        });
    });

    it('renders the dashboard with a user profile of undefined', async () => {
        await act(async () => {
            getPhotos.mockImplementation(() => photosFixture);
            getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
            useUser.mockImplementation(() => ({ user: undefined }));

            const { getByText, queryByText } = render(
                <Router>
                    <FirebaseContexnt.Provider value={{
                        firebase: {
                            firestore: jest.fn(() => ({
                                collection: jest.fn(() => ({
                                    doc: jest.fn(() => ({
                                        update: jest.fn(() => Promise.resolve({}))
                                    }))
                                }))
                            }))
                        }
                    }}>
                        <UserContext.Provider value={{ user: { uid: 'omoNJQLQSoTQ5ZtcQeVQ2OsKqbj2', displayName: 'josh' }}}>
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <Dashboard user={{ uid: 'omoNJQLQSoTQ5ZtcQeVQ2OsKqbj2', displayName: 'josh' }} />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContexnt.Provider>
                </Router>
            );

            expect(getByText('Login')).toBeTruthy();
            expect(getByText('Sign Up')).toBeTruthy();
            expect(queryByText('Suggestions for you')).toBeFalsy();
        });
    });
});