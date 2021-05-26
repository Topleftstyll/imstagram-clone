describe('Login', () => {
    beforeEach(() => {
        cy.visit(`${Cypress.config().baseUrl}/login`);
        cy.get('body').within(() => {
            cy.get('div').should('contain.text', "Don't have an account? Sign up");
        });
        cy.get('div')
            .find('img')
            .should('be.visible')
            .should('have.attr', 'alt')
            .should('contain', 'iPhone with Instagram app');
    });

    

    it('inputs the email address and password and submites the form', () => {
        cy.get('form').within(() => {
            cy.get('input:first').should('have.attr', 'placeholder', 'Email Address').type('joshua.brackett@hotmail.ca');
            cy.get('input:last').should('have.attr', 'placeholder', 'Password').type('test123');
            cy.get('button').should('contain.text', 'Login').click();
        });

        cy.wait(5000);
    });

    it('inputs the email address and password and submites the form with the wrong info', () => {
        cy.get('form').within(() => {
            cy.get('button').should('be.disabled');
            cy.get('input:first').should('have.attr', 'placeholder', 'Email Address').type('joshua.brackett@hotmail.ca');
            cy.get('input:last').should('have.attr', 'placeholder', 'Password').type('badpassword');
            cy.get('button').should('not.be.disabled');
            cy.get('button').should('contain.text', 'Login').click();
        });

        cy.get('body').within(() => {
            cy.get('div').should('contain.text', 'The password is invalid or the user does not have a password.');
        });
    });

    it('navigates to the sign up page and back again', () => {
        cy.get('[data-testid="sign-up"]').click();
        cy.get('body').within(() => {
            cy.get('div').should('contain.text', 'Have an account? Login');
        });

        cy.get('[data-testid="login"]').click();
        cy.get('body').within(() => {
            cy.get('div').should('contain.text', "Don't have an account? Sign up");
        });
    });
});