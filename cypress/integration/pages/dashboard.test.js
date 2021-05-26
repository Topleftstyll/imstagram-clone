describe('Dashboard', () => {
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

        cy.get('form').within(() => {
            cy.get('input:first').should('have.attr', 'placeholder', 'Email Address').type('joshua.brackett@hotmail.ca');
            cy.get('input:last').should('have.attr', 'placeholder', 'Password').type('test123');
            cy.get('button').should('contain.text', 'Login').click();
        });

        cy.get('div')
            .find('img')
            .should('be.visible')
            .should('have.attr', 'alt')
            .should('contain', 'Instagram');
    });

    

    it('logs the user in and shows the dashboard and does basic checks around the UI', () => {
        cy.get('body').within(() => {
            cy.get('div').should('contain.text', 'josh');
            cy.get('div').should('contain.text', 'joshua brackett');
            cy.get('div').should('contain.text', 'Suggestions for you');
        });
    });

    it('logs the user in and adds a comment to a photo', () => {
        cy.get('[data-testid="add-comment-H8u7xNq9mwjxM1LWTzFy"]').should('have.attr', 'placeholder', 'Add a comment ...').type('Amazing photo!');
        cy.get('[data-testid="add-comment-submit-H8u7xNq9mwjxM1LWTzFy"]').submit();
    });

    it('logs the user in and likes a photo', () => {
        cy.get('[data-testid="like-photo-H8u7xNq9mwjxM1LWTzFy"]').click();
    });

    it('logs the user in and signs out', () => {
        cy.get('[data-testid="sign-out"]').click();
        cy.wait(1000);
        cy.get('div').should('contain.text', "Don't have an account? Sign up");
    });
});