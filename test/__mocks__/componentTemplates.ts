export const MockComponentTemplates = {
    ['rss-item-accordion-template']: `<style>
                :host {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 16px;
                }
                article {
                    display: flex;
                    flex-flow: column nowrap;
                    width: 100%;
                    border-bottom: black solid 1px;
                }
                article > h1 {
                    font-size: 18px;
                    line-height: 24px;
                    height: 30px;
                    display: inline-flex;
                    justify-content: center;
                    margin: 0;
                }
                article > h1 > button {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 18px;
                    line-height: 24px;
                    border: none;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    background: transparent;
                    text-align: left;
                }
                article > div {
                    display: grid;
                    opacity: 0;
                    grid-template-rows: 0fr;
                    transition-property: all;
                    transition-duration: 0.5s;
                    transition-timing-function: ease;
                }
                article > div > div {
                    overflow: hidden;
                }
                article > div.expanded {
                    grid-template-rows: 1fr;
                    opacity: 1;
                    padding: 10px;
                }
                article > div > div {
                    display: block;
                }
                article > div > .creator {
                    font-size: 18px;
                }
                article > div > .pub-date {
                    font-size: 18px;
                }
                article > div > .category {
                    font-size: 16px;
                }
                article > div > .link {
                    font-size: 16px;
                }
                article > div .description {
                    font-size: 12px;
                }
            </style>
            <article>
                <h1 part="header"><button class="title"><slot name="title"></slot></button></h1>
                <div part="content">
                    <div>
                        <div class="creator"><slot name="creator"></slot></div>
                        <div class="pub-date"><slot name="pubDate"></slot></div>
                        <div class="category"><slot name="category"></slot></div>
                        <div class="link"><slot name="link"></slot></div>
                        <div class="description"><slot name="description"></slot></div>
                    </div>
                </div>
            </article>`,
    ['rss-channel-template']: `
        <style>
                :host {
                    font-family: 'Courier New', Courier, monospace;
                }
                h1 {
                    padding-left: 10px;
                    padding-right: 10px;
                    font-size: 16px;
                    font-weight: bold;
                }
                h2 {
                    padding-left: 10px;
                    padding-right: 10px;
                    font-size: 14px;
                    font-weight: normal;
                }
            </style>
            <section>
                <header>
                    <h1><slot name="title"></slot></h1>
                    <h2><slot name="description"></slot></h2>
                </header>
                <div><slot name="items"></slot></div>
            </section>
    `,
    ['user-input-dialog-template']: (timeout: string = '.5s') =>`
        <style>
            :host {
                width: 100vw;
                height: 100vh;
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }
            dialog {
                position: fixed;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                padding: 0;
                margin: 0;
                opacity: 0;
                z-index: 2;
                transition-property: opacity;
                transition-duration: ${timeout};
                transition-timing-function: ease-in;
                background-color: darkblue;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
                box-sizing: border-box;
            }
            dialog.visible {
                opacity: 1;
            }
            header {
                flex-basis: 10%;
                box-sizing: border-box;
                width: 100%;
                padding-left: 10px;
            }
            section.fields {
                flex-basis: 80%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                width: 100%;
            }
            section.controls {
                flex-basis: 10%;
                box-sizing: border-box;
                width: 100%;
                display: flex;
            }
        </style>
        <dialog>
            <header>
                <slot name="header"></slot>
            </header>
            <section class="fields">
                <slot name="input-fields"></slot>
            </section>
            <section class="controls">
                <slot name="controls"></slot>
            </section>
        </dialog>
    `,
    ['add-feed-url-dialog-template']: `
        <style>
            h1 {
                color: white;
                font-size: 36px;
            }
            .user-input-dialog__input-fields {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: start;
                padding: 10px;
                width: 100%;
                box-sizing: border-box;

            }
            .user-input-dialog__input-fields > label {
                width: 100%;
                font-size: 20px;
                color: white;
                box-sizing: border-box;
            }
            .user-input-dialog__input-fields > input {
                width: 100%;
                font-size: 24px;
                border-radius: 4px;
                box-sizing: border-box;
                height: 40px;
                border-style: solid;
                border-width: 1px;
                border-color: black;
            }
            .user-input-dialog__input-fields > input:focus {
                border-color: chartreuse;
            }
            div[slot="controls"] {
                display: flex;
                flex-direction: row;
                flex: 1;
            }
            button {
                flex-basis: 50%;
                font-weight: bold;
                font-family: inherit;
                margin: 0;
                border: 0;
                font-size: 24px;
                line-height: 36px;
                padding: 0;
            }
            .dialog-button__ok {
                background-color: yellow;
                color: red;
            }
            .dialog-button__ok:disabled {
                background-color:blanchedalmond;
                color:azure;
            }
            .dialog-button__cancel {
                background-color: brown;
                color: antiquewhite;
            }
        </style>
        <user-input-dialog>
            <h1 slot="header">Add Feed URL</h1>
            <div slot="input-fields" class="user-input-dialog__input-fields">
                <label for="">Feed URL</label>
                <input 
                    type="url"
                    required
                    id="feed-url-input-field"
                    name="feedUrlInputField"
                    maxlength="255"
                    placeholder="Enter feed URL"
                >
            </div>
            <div slot="controls">
                <button class="dialog-button dialog-button__ok" disabled>Add</button>
                <button class="dialog-button dialog-button__cancel">Cancel</button>
            </div>
        </user-input-dialog>
    `,
}
