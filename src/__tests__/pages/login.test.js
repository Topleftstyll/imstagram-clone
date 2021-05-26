import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Login from '../../pages/login';
import FirebaseContext from '../../context/firebase';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

jest.mock('../../services/firebase');

describe('<Login />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('renders the login page with a form submission and logs the user in', async () => {
        const succeedToLogin = jest.fn(() => Promise.resolve("I am signed in"));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: succeedToLogin
            }))
        };
        const { getByTestId, getByPlaceholderText, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <Login />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async() => {
            expect(document.title).toEqual('Login - Instagram');

            await fireEvent.change(getByPlaceholderText('Email Address'), {
                target: { value: "joshua.brackett@hotmail.ca" }
            });
            await fireEvent.change(getByPlaceholderText('Password'), {
                target: { value: "password" }
            });
            fireEvent.submit(getByTestId('login'));

            expect(succeedToLogin).toHaveBeenCalled();
            expect(succeedToLogin).toHaveBeenCalledWith('joshua.brackett@hotmail.ca', 'password');

            await waitFor(() => {
                expect(getByPlaceholderText('Email Address').value).toBe('joshua.brackett@hotmail.ca');
                expect(getByPlaceholderText('Password').value).toBe('password');
                expect(queryByTestId('error')).toBeFalsy();
            });
        });
    });

    it('renders the login page with a form submission and fails to log in the user', async () => {
        const failToLogin = jest.fn(() => Promise.reject(new Error('Cannot sign in')));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: failToLogin
            }))
        };
        const { getByTestId, getByPlaceholderText, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <Login />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async() => {
            expect(document.title).toEqual('Login - Instagram');

            await fireEvent.change(getByPlaceholderText('Email Address'), {
                target: { value: "joshua.@hotmail.ca" }
            });
            await fireEvent.change(getByPlaceholderText('Password'), {
                target: { value: "password" }
            });
            fireEvent.submit(getByTestId('login'));

            expect(failToLogin).toHaveBeenCalled();
            expect(failToLogin).toHaveBeenCalledWith('joshua.@hotmail.ca', 'password');

            await waitFor(() => {
                expect(getByPlaceholderText('Email Address').value).toBe('');
                expect(getByPlaceholderText('Password').value).toBe('');
                expect(queryByTestId('error')).toBeTruthy();
            });
        });
    });
});
