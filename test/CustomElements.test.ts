import { AddFeedURLDialogElement, ensureElementDoesNotHaveAttribute, ensureElementDoesNotHaveClass, ensureElementHasAttribute, ensureElementHasClass, queryElementShadowRoot, UserInputDialogElement } from "../src/CustomElements";
import { MockComponentTemplates } from './__mocks__/componentTemplates';

describe('ensureElementHasClass', () => {
    it('adds a missing class to an element.', () => {
        const className: string = 'foobar';
        const element: Element = document.createElement('div');
        expect(element.classList.contains(className)).toEqual(false);
        ensureElementHasClass(element, className);
        expect(element.classList.contains(className)).toEqual(true);
    });
    it('does not add a class to an element that already has the class.', () => {
        const className: string = 'foobar';
        const element: Element = document.createElement('div');
        element.classList.add(className);
        expect(element.classList.contains(className)).toEqual(true);
        ensureElementHasClass(element, className);
        expect(element.getAttribute('class')).toEqual(className);
        expect(element.getAttribute('class')).not.toEqual(`${className} ${className}`);
    });
});

describe('ensureElementDoesNotHaveClass', () => {
    it('removes an existing class from an element.', () => {
        const className: string = 'foobar';
        const element: Element = document.createElement('div');
        element.classList.add(className);
        expect(element.classList.contains(className)).toEqual(true);
        expect(ensureElementDoesNotHaveClass(element, className).classList.contains(className)).not.toEqual(true);
    });
    it('does nothing to an element that does not have the class.', () => {
        const className: string = 'foobar';
        const element: Element = document.createElement('div');
        expect(element.classList.contains(className)).not.toEqual(true);
        expect(ensureElementDoesNotHaveClass(element, className).classList.contains(className)).not.toEqual(true);
    });
});

describe('queryElementShadowRoot', () => {
    class ElementWithShadowElement extends HTMLElement {
        constructor() {
            super();
            const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
            const div: Element = document.createElement('div');
            div.classList.add('foobar');
            this.shadowRoot?.appendChild(div);
        }
    }

    class ElementWithoutShadowElement extends HTMLElement {
        constructor() {
            super();
        }
    }

    beforeAll(() => {
        if (!window.customElements.get('element-with-shadow')) {
            window.customElements.define('element-with-shadow', ElementWithShadowElement);
        }
        if (!window.customElements.get('element-without-shadow')) {
            window.customElements.define('element-without-shadow', ElementWithoutShadowElement);
        }
        window.customElements.whenDefined('element-with-shadow').then(() => {
            const element: Element = document.createElement('element-with-shadow');
            document.body.appendChild(element);
        })
        window.customElements.whenDefined('element-without-shadow').then(() => {
            const element: Element = document.createElement('element-without-shadow');
            document.body.appendChild(element);
        });
    });
    afterAll(() => {
        const elementWithShadow: Element | null = document.querySelector('element-with-shadow');
        if (elementWithShadow) {
            document.body.removeChild(elementWithShadow);
        }
        const elementWithoutShadow: Element | null = document.querySelector('element-without-shadow');
        if (elementWithoutShadow) {
            document.body.removeChild(elementWithoutShadow);
        }
    });
    

    it('selects an existing element from a non-null shadowRoot.', () => {
        const element: Element | null = document.querySelector('element-with-shadow');
        expect(element).not.toBeNull();
        const div: Element | null = queryElementShadowRoot(element as Element, '.foobar');
        expect(div).not.toBeNull();
    });
    it('does not select a non-existing element from a non-null shadowRoot.', () => {
        const element: Element | null = document.querySelector('element-with-shadow');
        expect(element).not.toBeNull();
        const p: Element | null = queryElementShadowRoot(element as Element, 'p');
        expect(p).toBeNull();
    });
    it('returns null for a null shadowRoot.', () => {
        const element: Element | null = document.querySelector('element-without-shadow');
        expect(element).not.toBeNull();
        const div: Element | null = queryElementShadowRoot(element as Element, 'div');
        expect(div).toBeNull();
    });
});


describe('UserInputDialogElement', () => {
    
    beforeAll(() => {
        const template: HTMLTemplateElement = document.createElement('template');
        template.setAttribute('id', 'user-input-dialog-template');
        template.innerHTML = MockComponentTemplates['user-input-dialog-template']('.5s');
        document.body.appendChild(template);
        if (!window.customElements.get('user-input-dialog')) {
            window.customElements.define('user-input-dialog', UserInputDialogElement);
        }
    });
    afterAll(() => {
       const template: HTMLTemplateElement | null = document.querySelector('#user-input-dialog-template');
       if (template) {
        document.body.removeChild(template);
       }
    });

    it('defines a static read only string contstant that identifies a template element ID.', () => {
        expect(UserInputDialogElement.TEMPLATE_ID).toBeDefined();
        expect(typeof UserInputDialogElement.TEMPLATE_ID).toEqual('string');
        expect(UserInputDialogElement.TEMPLATE_ID).toEqual('user-input-dialog-template');
        expect(document.getElementById(UserInputDialogElement.TEMPLATE_ID)).not.toBeNull();
    });
    it('defines a custom element that extends HTMLElement', () => {
        expect(HTMLElement.prototype.isPrototypeOf(UserInputDialogElement.prototype)).toEqual(true);
    });
    it('appends a clone of the template content into its shadow root.', () => {
        const dialogElement: Element = document.createElement('user-input-dialog');
        document.body.appendChild(dialogElement);
        expect(dialogElement.shadowRoot).toBeDefined();
        expect(dialogElement.shadowRoot).toBeInstanceOf(ShadowRoot);
        expect(dialogElement.shadowRoot?.querySelector('dialog')).not.toBeNull();
    });
    it('shows the dialog.', () => {
        const customDialog: UserInputDialogElement = document.createElement('user-input-dialog') as UserInputDialogElement;
        const dialogElement: Element | null = queryElementShadowRoot(customDialog, 'dialog');
        expect(dialogElement).not.toBeNull();
        if (dialogElement) {
            expect(dialogElement.classList.contains('visible')).toEqual(false);
            customDialog.show();
            expect(dialogElement.classList.contains('visible'));
        }
    });
    it('hides the dialog with a transition.', () => {
        const customDialog: UserInputDialogElement = document.createElement('user-input-dialog') as UserInputDialogElement;
        const dialogElement: Element | null = queryElementShadowRoot(customDialog, 'dialog');
        expect(dialogElement).not.toBeNull();
        if (dialogElement) {
            ensureElementHasClass(dialogElement, 'visible');
            expect(dialogElement.classList.contains('visible')).toEqual(true);
            customDialog.hide();
            expect(dialogElement.classList.contains('visible')).toEqual(false);
        }
    });
    it('will not have a shadowRoot when the template is not present in the document.', () => {
        const templateElement: Element | null = document.getElementById('user-input-dialog-template');
        expect(templateElement).not.toBeNull();
        if (templateElement) {
            document.body.removeChild(templateElement);
            const element: UserInputDialogElement = document.createElement('user-input-dialog') as UserInputDialogElement;
            expect(element.shadowRoot).toBeNull();
            document.body.appendChild(templateElement);
        }
    });
});

describe('ensureElementHasAttribute', () => {
    it('sets the attribute to an element that does not already have it.', () => {
        const element: Element = document.createElement('div');
        const attributeName: string = 'foo';
        const attributeValue: string = 'bar';
        expect(element.hasAttribute(attributeName)).toEqual(false);
        expect(ensureElementHasAttribute(element, attributeName, attributeValue)).toBe(element);
        expect(element.getAttribute(attributeName)).toEqual(attributeValue);
    });
    it('does not change the value of an attribute on an element that already has it.', () => {
        const element: Element = document.createElement('div');
        const attributeName: string = 'foo';
        const attributeValue: string = 'bar';
        element.setAttribute(attributeName, attributeValue);
        expect(ensureElementHasAttribute(element, attributeName, attributeValue)).toBe(element);
        expect(element.getAttribute(attributeName)).toEqual(attributeValue);
    });
});

describe('ensureElementDoesNotHaveAttribute', () => {
    it('removes the attribute from an element that already has it set.', () => {
        const element: Element = document.createElement('div');
        const attributeName: string = 'foo';
        const attributeValue: string = 'bar';
        element.setAttribute(attributeName, attributeValue);
        expect(ensureElementDoesNotHaveAttribute(element, attributeName)).toBe(element);
        expect(element.hasAttribute(attributeName)).toEqual(false);
    });
    it('leaves an element unaffected from an element that does not have it.', () => {
        const element: Element = document.createElement('div');
        const attributeName: string = 'foo';
        expect(element.hasAttribute(attributeName)).toEqual(false);
        expect(ensureElementDoesNotHaveAttribute(element, attributeName)).toBe(element);
        expect(element.hasAttribute(attributeName)).toEqual(false);
    });
});

describe('AddFeedURLDialogElement', () => {
    beforeAll(() => {
        const template: HTMLTemplateElement = document.createElement('template');
        template.setAttribute('id', 'add-feed-url-dialog-template');
        template.innerHTML = MockComponentTemplates['add-feed-url-dialog-template'];
        document.body.appendChild(template);
        if (!window.customElements.get('add-feed-url-dialog')) {
            window.customElements.define('add-feed-url-dialog', AddFeedURLDialogElement);
        }
    });
    afterAll(() => {
       const template: HTMLTemplateElement | null = document.querySelector('#add-feed-url-dialog-template');
       if (template) {
        document.body.removeChild(template);
       }
    });
    it('defines a static read only string contstant that identifies a template element ID.', () => {
        expect(AddFeedURLDialogElement.TEMPLATE_ID).toBeDefined();
        expect(typeof AddFeedURLDialogElement.TEMPLATE_ID).toEqual('string');
        expect(AddFeedURLDialogElement.TEMPLATE_ID.length).toBeGreaterThan(0);
    });
    it('defines a custom element that extends HTMLElement', () => {
        expect(HTMLElement.prototype.isPrototypeOf(AddFeedURLDialogElement.prototype)).toEqual(true);
    });
    it('appends a clone of the template content into its shadow root.', () => {
        const dialogElement: Element = document.createElement('add-feed-url-dialog');
        document.body.appendChild(dialogElement);
        const templateElement: Element | null = document.getElementById(AddFeedURLDialogElement.TEMPLATE_ID);
        expect(templateElement).not.toBeNull();
        expect(dialogElement.shadowRoot).toBeDefined();
        expect(dialogElement.shadowRoot).toBeInstanceOf(ShadowRoot);
        expect(dialogElement.shadowRoot?.querySelector('user-input-dialog')).not.toBeNull();
    });
    it('shows the dialog.', () => {
        const customDialog: AddFeedURLDialogElement = document.createElement('add-feed-url-dialog') as AddFeedURLDialogElement;
        expect(customDialog.isShown).toEqual(false);
        customDialog.show();
        expect(customDialog.isShown).toEqual(true);
    });
    it('hides the dialog.', () => {
        const customDialog: AddFeedURLDialogElement = document.createElement('add-feed-url-dialog') as AddFeedURLDialogElement;
        customDialog.show();
        expect(customDialog.isShown).toEqual(true);
        customDialog.hide();
        expect(customDialog.isShown).toEqual(false);
    });
});
