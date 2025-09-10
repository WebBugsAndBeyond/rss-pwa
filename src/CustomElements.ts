

// export class RSSFeedItemAccordionElement extends HTMLElement {
//     constructor() {
//         super();
//         const templateElement: HTMLTemplateElement | null = document.querySelector('#rss-item-accordion-template');
//         if (templateElement !== null) {
//             const shadowRoot = this.attachShadow({ mode: 'open' });
//             shadowRoot.appendChild(templateElement.content.cloneNode(true));
//             this.handleToggleClick = this.handleToggleClick.bind(this);
//         }
//     }

//     handleToggleClick(mouseEvent: MouseEvent) {
//         const articleDiv: HTMLElement | null = this.shadowRoot?.querySelector?.('article > div') ?? null;
//         if (articleDiv) {
//             articleDiv.classList.toggle('expanded');
//         }
//     }

//     connectedCallback() {
//         const height: number = this.shadowRoot?.querySelector?.('article > div')?.scrollHeight ?? 0;
//         if (height) {
//             const styleSheet: CSSStyleSheet | null = this.shadowRoot?.styleSheets?.item?.(0) ?? null;
//             if (styleSheet !== null) {
//                 let hostRule: CSSStyleRule | null = null;
//                 for (let i = 0; i < styleSheet.cssRules.length; ++i) {
//                     const rule: CSSRule | null = styleSheet.cssRules.item(0);
//                     if (rule) {
//                         if ((rule as CSSStyleRule).selectorText === ':host') {
//                             hostRule = rule as CSSStyleRule;
//                             break;
//                         }
//                     }
//                 }
//                 if (hostRule) {
//                     hostRule.style.setProperty('--expanded-height', `${height}px`);
//                 }
//             }
//         }
//         const toggleButton = this.shadowRoot?.querySelector?.('article button');
//         if (toggleButton) {
//             toggleButton.addEventListener(
//                 'click' as keyof ElementEventMap,
//                 this.handleToggleClick as EventListener
//             );
//         }
//     }

//     disconnectCallback() {
//         const toggleButton = this.shadowRoot?.querySelector?.('article button');
//         if (toggleButton) {
//             toggleButton.removeEventListener(
//                 'click' as keyof ElementEventMap,
//                 this.handleToggleClick as EventListener
//             );
//         }
//     }
// }

// export class RSSFeedChannelElement extends HTMLElement {
//     constructor() {
//         super();
//         const templateElement: HTMLElement | null = document.querySelector('#rss-channel-template');
//         const shadowRoot = this.attachShadow({ mode: 'open' });
//         if (templateElement) {
//             shadowRoot.appendChild(
//                 (templateElement as HTMLTemplateElement).content.cloneNode(true)
//             );
//         }
//     }

//     connectedCallback() {
//         const feedUrl = this.getAttribute('feed-url');
//         Application.getInstance().loadRSSFeed(feedUrl).then(channel => {
//             const renderedItems = channel.items.map(renderRSSAccordionItem);
//             const titleHeader = this.shadowRoot.querySelector('section > header > h1');
//             if (titleHeader) {
//                 titleHeader.textContent = channel.title;
//             }
//             const descriptionHeader = this.shadowRoot.querySelector('section > header > h2');
//             if (descriptionHeader) {
//                 descriptionHeader.textContent = channel.description;
//             }
//             this.append(...renderedItems);
//         }).catch(console.error);
//     }
// }

export function ensureElementHasClass(element: Element, className: string): Element {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
    }
    return element;
}

export function ensureElementDoesNotHaveClass(element: Element, className: string): Element {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
    return element;
}

export function ensureElementHasAttribute(element: Element, attributeName: string, attributeValue: string): Element {
    if (!element.hasAttribute(attributeName)) {
        element.setAttribute(attributeName, attributeValue);
    }
    return element;
}

export function ensureElementDoesNotHaveAttribute(element: Element, attributeName: string): Element {
    if (element.hasAttribute(attributeName)) {
        element.removeAttribute(attributeName);
    }
    return element;
}


export function queryElementShadowRoot(element: Element, selector: string): Element | null {
    if (element.shadowRoot !== null) {
        const selectedElement: Element | null = element.shadowRoot.querySelector(selector);
        return selectedElement;
    }
    return null;
}

export class UserInputDialogElement extends HTMLElement {

    public static readonly TEMPLATE_ID: string = 'user-input-dialog-template';

    constructor() {
        super();
        const templateElement: HTMLTemplateElement | null = document.querySelector(`#${UserInputDialogElement.TEMPLATE_ID}`);
        if (templateElement !== null) {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(templateElement.content.cloneNode(true));
        }
    }

    show() {
        ensureElementHasClass(queryElementShadowRoot(this, 'dialog') as Element, 'visible');
        this.setAttribute('shown', '');
    }

    hide() {
        ensureElementDoesNotHaveClass(queryElementShadowRoot(this, 'dialog') as Element, 'visible');
        this.removeAttribute('shown');
    }
}

export class AddFeedURLDialogElement extends HTMLElement {

    public static readonly TEMPLATE_ID: string = 'add-feed-url-dialog-template';

    constructor() {
        super();
        const templateElement: HTMLTemplateElement | null = document.getElementById(AddFeedURLDialogElement.TEMPLATE_ID) as HTMLTemplateElement;
        if (templateElement !== null) {
            const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(templateElement.content.cloneNode(true));
        }
        this.onURLInputChange = this.onURLInputChange.bind(this);
        // const templateElement: HTMLTemplateElement | null = document.querySelector('#add-feed-url-dialog-template');
        // if (templateElement) {
        //     // const shadowRoot = this.attachShadow({ mode: 'open' });
        //     // shadowRoot.appendChild(templateElement.content.cloneNode(true));
        //     // this.onURLInputChange = this.onURLInputChange.bind(this);
        //     // this.onCancelButtonClick = this.onCancelButtonClick.bind(this);
        //     // this.onAddButtonClick = this.onAddButtonClick.bind(this);
        // }
    }

    connectedCallback() {
        const urlInputField: Element | null = queryElementShadowRoot(this, 'input[type="url"]');
        if (urlInputField !== null) {
            urlInputField.addEventListener('keyup', this.onURLInputChange, {
                passive: true,
            });
        }
        // const urlInputField = this.shadowRoot.querySelector('input[type="url"]');
        // const addButton = this.shadowRoot.querySelector('button.dialog-button__ok');
        // const cancelButton = this.shadowRoot.querySelector('button.dialog-button__cancel');
        // if (urlInputField) {
        //     urlInputField.addEventListener('keyup', this.onURLInputChange);
        // }
        // if (addButton) {
        //     addButton.addEventListener('click', this.onAddButtonClick);
        // }
        // if (cancelButton) {
        //     cancelButton.addEventListener('click', this.onCancelButtonClick);
        // }
    }

    disconnectCallback() {
        const urlInputField: Element | null = queryElementShadowRoot(this, 'input[type="url"]');
        if (urlInputField !== null) {
            urlInputField.removeEventListener('keyup', this.onURLInputChange);
        }
        // const addButton = this.shadowRoot.querySelector('button.dialog-button__ok');
        // const cancelButton = this.shadowRoot.querySelector('button.dialog-button__cancel');
        // if (urlInputField) {
        //     urlInputField.removeEventListener('keyup', this.onURLInputChange);
        // }
        // if (addButton) {
        //     addButton.removeEventListener('click', this.onAddButtonClick);
        // }
        // if (cancelButton) {
        //     cancelButton.removeEventListener('click', this.onCancelButtonClick);
        // }
    }

    get urlInputField(): HTMLInputElement {
        return queryElementShadowRoot(this, 'input[type="url"]') as HTMLInputElement;
    }

    get okButton(): HTMLButtonElement {
        return queryElementShadowRoot(this, 'button.dialog-button__ok') as HTMLButtonElement;
    }
    
    get hasValidURL(): boolean {
        return this.urlInputField.validity.valid;
    }

    onURLInputChange(e: Event): void {
        if (this.hasValidURL) {
            ensureElementDoesNotHaveAttribute(this.okButton, 'disabled');
        } else {
            ensureElementHasAttribute(this.okButton, 'disabled', '');
        }
        // // Toggle the Add button's disabled state based on input field validity.
        // const target: HTMLInputElement = e.target as HTMLInputElement;
        // const validity: ValidityState = target.validity;
        // const isValid = validity.valid;
        // const addButton: Element | null = queryElementShadowRoot(this, 'button.dialog-button__ok');
        // if (addButton) {
        //     if (isValid && addButton.hasAttribute('disabled')) {
        //         addButton.removeAttribute('disabled');
        //     } else if (!isValid && !addButton.hasAttribute('disabled')) {
        //         addButton.setAttribute('disabled', '');
        //     }
        // }
    }

    get isShown(): boolean {
        const userInputDialog: UserInputDialogElement = queryElementShadowRoot(this, 'user-input-dialog') as UserInputDialogElement;
        return userInputDialog.hasAttribute('shown');
    }

    show() {
        const userInputDialog: UserInputDialogElement = queryElementShadowRoot(this, 'user-input-dialog') as UserInputDialogElement;
        userInputDialog.show();
    }

    hide() {
        const userInputDialog: UserInputDialogElement = queryElementShadowRoot(this,' user-input-dialog') as UserInputDialogElement;
        userInputDialog.hide();
    }

    // onCancelButtonClick(e) {
    //     Application.getInstance().hideAddFeedURLDialog();
    // }

    // onAddButtonClick(e) {
    //     const urlInputField = this.shadowRoot.querySelector('input[type="url"]');
    //     const urlValue = urlInputField?.value ?? '';
    //     if (urlInputField.validity.valid && isValidUrl(urlValue)) {
    //         Application.getInstance()
    //             .addRSSFeedUrlSubscription(urlValue)
    //             .hideAddFeedURLDialog();
    //     }
    // }
}

// export class CustomElements implements IMessageRecipient {

//     public static readonly RSS_FEED_ITEM_ACCORDION_ELEMENT_NAME: string = 'rss-feed-item-accordion';
//     public static readonly RSS_FEED_ITEM_CHANNEL_ELEMENT_NAME: string = 'rss-feed-channel';
//     public static readonly USER_INPUT_DIALOG_ELEMENT_NAME: string = 'user-input-dialog';
//     public static readonly ADD_FEED_URL_DIALOG_ELEMENT_NAME: string = 'add-feed-url-dialog';

//     public static readonly ELEMENT_NAME_CLASS_MAP: Record<string, typeof HTMLElement> = {
//         [this.RSS_FEED_ITEM_ACCORDION_ELEMENT_NAME]: RSSFeedItemAccordionElement,
//         [this.RSS_FEED_ITEM_CHANNEL_ELEMENT_NAME]: RSSFeedChannelElement,
//         [this.USER_INPUT_DIALOG_ELEMENT_NAME]: UserInputDialogElement,
//         [this.ADD_FEED_URL_DIALOG_ELEMENT_NAME]: AddFeedURLDialogElement,
//     };

//     protected static instance: CustomElements;
    
//     protected constructor(protected readonly publishFunction: PublishMessageFunction) {

//     }

//     public static getInstance(publishFunction?: PublishMessageFunction): CustomElements {
//         if (!this.instance && publishFunction) {
//             this.instance = new CustomElements(publishFunction);
//         }
//         return this.instance;
//     }

    
//     registerCustomElements(elementClassMap: Record<string, typeof HTMLElement>): void {
//         Object.entries(elementClassMap).forEach(([k, v]: [string, typeof HTMLElement]) => {
//             window.customElements.define(k, v);
//         });
//     }

//     recieveMessage(message: MessageBusMessage): Promise<MessageBusMessageResponse> {
//         return new Promise((resolve, reject) => {
//             if (message.name === DEFINE_CUSTOM_ELEMENTS) {
//                 Promise.all([
//                     CustomElements.RSS_FEED_ITEM_ACCORDION_ELEMENT_NAME,
//                     CustomElements.RSS_FEED_ITEM_CHANNEL_ELEMENT_NAME,
//                     CustomElements.USER_INPUT_DIALOG_ELEMENT_NAME,
//                     CustomElements.ADD_FEED_URL_DIALOG_ELEMENT_NAME,
//                 ].map((name: string) => window.customElements.whenDefined(name))).then(() => {
//                     const response: MessageBusMessageResponse = {
//                         name: message.name,
//                         payload: message.payload,
//                         recipientDidIgnore: false,
//                         recipientDidSatisfy: true,
//                     };
//                     resolve(response);
//                     publishMessage(createMessageBusMessage(CUSTOM_ELEMENTS_DEFINED));
//                 });
//                 this.registerCustomElements(CustomElements.ELEMENT_NAME_CLASS_MAP);
//             }
//         });
//     }
// }
