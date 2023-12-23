class IssueModal {
    constructor() {
        this.submitButton = 'button[type="submit"]';
        this.issueModal = '[data-testid="modal:issue-create"]';
        this.issueDetailModal = '[data-testid="modal:issue-details"]';
        this.title = 'input[name="title"]';
        this.issueType = '[data-testid="select:type"]';
        this.descriptionField = '.ql-editor';
        this.assignee = '[data-testid="select:userIds"]';
        this.backlogList = '[data-testid="board-list:backlog"]';
        this.issuesList = '[data-testid="list-issue"]';
        this.deleteButton = '[data-testid="icon:trash"]';
        this.deleteButtonName = "Delete issue";
        this.cancelDeletionButtonName = "Cancel";
        this.confirmationPopup = '[data-testid="modal:confirm"]';
        this.closeDetailModalButton = '[data-testid="icon:close"]';
    }

    getIssueModal() {
        return cy.get(this.issueModal);
    }

    getIssueDetailModal() {
        return cy.get(this.issueDetailModal);
    }

    selectIssueType(issueType) {
        cy.get(this.issueType).click('bottomRight');
        cy.get(`[data-testid="select-option:${issueType}"]`)
            .trigger('mouseover')
            .trigger('click');
    }

    selectAssignee(assigneeName) {
        cy.get(this.assignee).click('bottomRight');
        cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
    }

    editTitle(title) {
        cy.get(this.title).debounced('type', title);
    }

    editDescription(description) {
        cy.get(this.descriptionField).type(description);
    }

    createIssue(issueDetails) {
        this.getIssueModal().within(() => {
            this.selectIssueType(issueDetails.type);
            this.editDescription(issueDetails.description);
            this.editTitle(issueDetails.title);
            this.selectAssignee(issueDetails.assignee);
            cy.get(this.submitButton).click();
        });
    }

    ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
        cy.get(this.issueModal).should('not.exist');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');

        cy.get(this.backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(this.issuesList)
                .should('have.length', expectedAmountIssues)
                .first()
                .find('p')
                .contains(issueDetails.title);
            cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should('be.visible');
        });
    }

    ensureIssueIsVisibleOnBoard(issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('be.visible');
    }

    ensureIssueIsNotVisibleOnBoard(issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('not.exist');
    }

    validateIssueVisibilityState(issueTitle, isVisible = true) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.get(this.backlogList).should('be.visible');
        if (isVisible)
            cy.contains(issueTitle).should('be.visible');
        if (!isVisible)
            cy.contains(issueTitle).should('not.exist');
    }

    clickDeleteButton() {
        cy.get(this.deleteButton).click();
        cy.get(this.confirmationPopup).should('be.visible');
    }

    confirmDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.deleteButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
        cy.get(this.backlogList).should('be.visible');
    }

    cancelDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.cancelDeletionButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
        cy.get(this.issueDetailModal).should('be.visible');
    }

    closeDetailModal() {
        cy.get(this.issueDetailModal).get(this.closeDetailModalButton).first().click();
        cy.get(this.issueDetailModal).should('not.exist');
    }
}

class IssueComment {
    constructor () { 
        this.issueCommentModal = '[data-testid="modal:issue-details"]'
        this.commentParentClass = '.sc-lkqHmb'
        this.commentClass = '.sc-bMVAic'
        this.commentPlaceholder = '[placeholder="Add a comment..."]'
        this.issueCommentId = '[data-testid="issue-comment"]'
        this.saveButton = '[class="sc-bwzfXH dIxFno sc-esOvli keRYgb"]'
        this.cancelButton = '[class="sc-bxivhb rljZq"]'
        this.editButton = '[class="sc-daURTG bBZxGK"]'
        this.deleteButton = '[class="sc-bXGyLb dvzGmn"]'
        this.deleteConfirmationButton = '[class="sc-bwzfXH dIxFno sc-kGXeez bLOzZQ"]'
        this.cancelConfirmationButton = '[class="sc-bwzfXH ewzfNn sc-kGXeez bLOzZQ"]'
        this.testComment = 'This is TEST comment'
        this.editedComment = 'This is EDITED comment'
    };
    
    getIssueCommentModal() {
        return cy.get(this.issueCommentModal);
    }

    addComment() {
        cy.get(this.issueCommentModal)
        cy.get(this.commentClass).click()
        cy.get(this.commentPlaceholder).type(this.testComment)
        cy.get(this.saveButton).click()
        }

    ensureIssueTestCommentIsVisible(){
        cy.get(this.commentParentClass)
        cy.get(this.issueCommentId).should('have.length', '2')
        cy.get(this.commentParentClass).contains(this.testComment).should('be.visible')
        }

    editComment() {
        cy.get(this.editButton).first().click()
        cy.get(this.commentPlaceholder).click().clear().type(this.editedComment)
        cy.get(this.saveButton).click()
    }

    ensureIssueEditCommentIsVisible() {
        cy.get(this.commentParentClass)
        cy.get(this.issueCommentId).should('have.length', '2')
        cy.get(this.commentParentClass).contains(this.editedComment).should('be.visible')
        cy.get(this.saveButton).should('not.exist')
    }   

    deleteComment() {
        cy.get(this.deleteButton).first().click()
        cy.get(this.deleteConfirmationButton).click()
    }
    ensureIssueCommentIsDeleted() {
        cy.get(this.commentParentClass)
        cy.get(this.issueCommentId).should('have.length', '1')
        cy.get(this.commentParentClass).contains(this.editedComment).should('not.exist')
    }

    }


//export default new IssueModal();
export default new IssueComment();

