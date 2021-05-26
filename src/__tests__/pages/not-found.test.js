import React from 'react';
import { render, waitFor } from '@testing-library/react';
import FirebaseContext from '../../context/firebase';
import NotFound from '../../pages/not-found';
import UserContext from '../../context/user';
import { BrowserRouter as Router } from 'react-router-dom';
import { getUserByUserId } from '../../services/firebase';
import userFixture from '../../fixtures/logged-in-user';
import { act } from 'react-dom/test-utils';

jest.mock('../../services/firebase');

describe('<NotFound />', () => {
    it('renders the not found page with a logged in user', async () => {
        await act(async () => {
            await getUserByUserId.mockImplementation(() => [userFixture]);

            const { queryByText } = render(
                <Router>
                    <FirebaseContext.Provider value={{ }}>
                        <UserContext.Provider value={{ user: { uid: 1 }}}>
                            <NotFound />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(queryByText('Log In')).toBeFalsy();
                expect(queryByText('Not Found!')).toBeTruthy();
            });
        });
    });

    it('renders the not found page with a anon user', async () => {
        await act(async () => {
            await getUserByUserId.mockImplementation(() => []);

            const { queryByText } = render(
                <Router>
                    <FirebaseContext.Provider value={{ }}>
                        <UserContext.Provider value={{ user: { uid: {} }}}>
                            <NotFound />
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(queryByText('Login')).toBeTruthy();
                expect(queryByText('Not Found!')).toBeTruthy();
            });
        });
    });
});
