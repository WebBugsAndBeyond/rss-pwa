import fetchMock from 'jest-fetch-mock';
import { addHoursToDate, addDaysToDate, addWeeksToDate, addMonthsToDate, addYearsToDate } from "./dates";

/**
 * Syndication update periods.
 * @see {https://web.resource.org/rss/1.0/modules/syndication/}
 */
export type RSSChannelUpdatePeriod = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * RSS channel item structure per the RSS specification.
 * Values are from the RSS, Syndication, and Dublic Core Meta Data specification.
 * Normalization of semantically duplicate properties is performed when
 * optional values are not present. For example author, and dc:creator may or may
 * not both be present, one or the other may or may not be present. If one is, and
 * one is not then they will both contain the same value. Optional values 
 * may also may be omitted entirely.
 * @see {https://www.rssboard.org/rss-specification}
 * @see {https://web.resource.org/rss/1.0/modules/syndication/}
 * @see {https://www.dublincore.org/specifications/dublin-core/dcmi-terms/}
 */
export type RSSFeedChannelItem = {
    title: string;
    link: string;
    author: string;
    creator: string;
    pubDate: Date | null;
    category: string[];
    guid: string;
    description: string;
    content: string;
    postId: string;
}

/**
 * RSS channel structure. Values are from the RSS, and Syndication specifications.
 * @see {https://web.resource.org/rss/1.0/modules/syndication/}
 * @see {https://www.rssboard.org/rss-specification}
 */
export type RSSFeedChannel = {
    atomLink: string;
    title: string;
    description: string;
    lastBuildDate: Date | null;
    updateBase: Date | null;
    updateFrequency: number;
    updatePeriod: RSSChannelUpdatePeriod;
    getNextUpdateDate(): Date;
    isNextUpdateReady(): boolean;
    items: RSSFeedChannelItem[];
    loading?: boolean;
}


/**
 * Returns a new RSSFeedChannel object with default values and optional overrides.
 * @param overrides 
 * @returns 
 */
export function initializeRSSFeedChannel(overrides?: Partial<RSSFeedChannel>): RSSFeedChannel {
    const channel: RSSFeedChannel = {
        atomLink: '',
        title: '',
        description: '',
        lastBuildDate: null,
        getNextUpdateDate(): Date {

            let buildDate: Date, newDate: Date;
            if (this.lastBuildDate instanceof Date) {
                buildDate = this.lastBuildDate;
            } else if (this.updateBase instanceof Date) {
                buildDate = this.updateBase;
            } else {
                buildDate = new Date();
            }

            if (this.updatePeriod === 'hourly') {
                newDate = addHoursToDate(buildDate, this.updateFrequency);
            } else if (this.updatePeriod === 'daily') {
                newDate = addDaysToDate(buildDate, this.updateFrequency);
            } else if (this.updatePeriod === 'weekly') {
                newDate = addWeeksToDate(buildDate, this.updateFrequency);
            } else if (this.updatePeriod === 'monthly') {
                newDate = addMonthsToDate(buildDate, this.updateFrequency);
            } else {
                newDate = addYearsToDate(buildDate, this.updateFrequency);
            }
            return newDate;
        },
        isNextUpdateReady(): boolean {
            const updateDate = this.getNextUpdateDate();
            const currentDate = Date.now();
            const differenceInMilliseconds = currentDate - updateDate.getTime();
            const updateIsInThePastOrNow = differenceInMilliseconds >= 0;
            return updateIsInThePastOrNow;
        },
        updateFrequency: 1,
        updateBase: null,
        items: [],
        updatePeriod: 'hourly',
        loading: false,
    };
    if (overrides) {
        return {
            ...channel,
            ...overrides,
        };
    }
    return channel;
}


/**
 * Returns a new RSSFeedChannel object with default values and optional overrides.
 * @param overrides 
 * @returns 
 */
export function initializeRSSFeedChannelItem(overrides?: Partial<RSSFeedChannelItem>): RSSFeedChannelItem {
    const item: RSSFeedChannelItem = {
        title: '',
        author: '',
        category: [],
        content: '',
        creator: '',
        description: '',
        guid: '',
        link: '',
        postId: '',
        pubDate: null,
    };
    if (overrides) {
        return {
            ...item,
            ...overrides,
        };
    }
    return item;
}


/**
 * Names of XML node types used by findDocumentNode.
 * @see {findDocumentNode}
 */
export type XMLDocumentNodeName = '#cdata-section' | '#text';

export function getNodeValueByType(node: Node | null, nodeTypeName: XMLDocumentNodeName): string { 
    if (!node) {
        return '';
    }
    const childNodes: Array<ChildNode> = Array.from(node.childNodes);
    const desiredNode: ChildNode | undefined = childNodes.find((child: ChildNode) => child.nodeName === nodeTypeName);
    return desiredNode?.nodeValue ?? '';
}

export function getAttributeText(parentElement: Element, selector: string, attributeName: string): string {
    const element: Element | null = parentElement?.querySelector(selector);
    if (element !== null) {
        const attributeValue: string | null = element.getAttribute(attributeName);
        if (attributeValue !== null) {
            return attributeValue;
        }
    }
    return '';
}

export function getNamespacedElementAttributeText(
    parentElement: Element,
    namespaceUri: string,
    localName: string,
    attributeName: string,
): string {
    const elements: HTMLCollection = parentElement.getElementsByTagNameNS(namespaceUri, localName);
    if (elements.length > 0) {
        const attributeValue: string | null | undefined = elements.item(0)?.getAttribute(attributeName);
        if (attributeValue) {
            return attributeValue;
        }
    }
    return '';
}

export function getElementText(
    parentElement: Element,
    selector: string,
    nodeType: XMLDocumentNodeName,
): string {
    return getNodeValueByType(parentElement.querySelector(selector), nodeType);
}

export function getNamespacedElementText(
    parentElement: Element,
    namespaceUri: string,
    localName: string,
    nodeType: XMLDocumentNodeName,
): string {
    const elements: HTMLCollection = parentElement.getElementsByTagNameNS(namespaceUri, localName);
    const text: string = getNodeValueByType(elements.item(0), nodeType);
    return text;
}

export function getElementArrayText(parentElement: Element, selector: string, nodeType: XMLDocumentNodeName): string[] {
    const selectedElements: Element[] = Array.from(parentElement.querySelectorAll(selector));
    const text: string[] = selectedElements.map(element => getNodeValueByType(element, nodeType));
    return text;
}

export function getNamespacedElementArrayText(
    parentElement: Element,
    namespaceUri: string,
    localName: string,
    nodeType: XMLDocumentNodeName,
): string[] {
    const elements: Element[] = Array.from(parentElement.getElementsByTagNameNS(namespaceUri, localName));
    return elements.map(element => getNodeValueByType(element, nodeType));
}

/**
 * Fetches an RSS feed XML document, and resolves the returned promise with the XML document text.
 * @param feedUrl 
 * @param abortSignal 
 * @returns 
 */
export async function loadRSSFeedChannelData(
    feedUrl: string,
    abortSignal: AbortSignal,
): Promise<string> {
    return fetch(feedUrl, {
        headers: {
            Accept: 'application/xml',
        },
        signal: abortSignal,
    }).then(response => response.text());
}

/**
 * Parses the values of a <item> element in a RSS feed XML document into an RSSFeedChannelItem object.
 * @param itemElement 
 * @returns 
 */
export function parseRSSFeedChannelItemElement(itemElement: Element): RSSFeedChannelItem {
    const title: string = getElementText(itemElement, 'title', '#text');
    //const itemTitleElement: Element | null = itemElement.querySelector('title');
    //const linkElement: Element | null = itemElement.querySelector('link');
    const link: string = getElementText(itemElement, 'link', '#text');
    //const descriptionElement: Element | null = itemElement.querySelector('description');
    const description: string = getElementText(itemElement, 'description', '#cdata-section');
    const creator: string = getNamespacedElementText(
        itemElement,
        'http://purl.org/dc/elements/1.1/',
        'creator',
        '#cdata-section',
    );
    // const creatorElements: HTMLCollection = itemElement.getElementsByTagNameNS(
    //     'http://purl.org/dc/elements/1.1/',
    //     'creator',
    // );
    //const authorElement: Element | null = itemElement.querySelector('author');
    const author: string = getElementText(itemElement, 'author', '#text');
    //const pubDateElement: Element | null = itemElement.querySelector('pubDate');
    const pubDate: string = getElementText(itemElement, 'pubDate', '#text');
    //const categoryElements: NodeListOf<Element> = itemElement.querySelectorAll('category');
    const category: string[] = getElementArrayText(itemElement, 'category', '#cdata-section');
    //const guidElement: Element | null = itemElement.querySelector('guid');
    const guid: string = getElementText(itemElement, 'guid', '#text');
    const content: string = getNamespacedElementText(
        itemElement,
        'http://purl.org/rss/1.0/modules/content/',
        'encoded',
        '#cdata-section',
    );
    // const contentElements: HTMLCollection = itemElement.getElementsByTagNameNS(
    //     'http://purl.org/rss/1.0/modules/content/',
    //     'encoded',
    // );
    //const postIdElement: Element | null = itemElement.querySelector('post-id');
    const postId: string = getElementText(itemElement, 'post-id', '#text');

    // const title: string = getNodeValueByType(itemTitleElement, '#text');
    // const link: string = getNodeValueByType(linkElement, '#text');
    // const description: string = getNodeValueByType(descriptionElement, '#cdata-section');
    // const creator: string = creatorElements.length > 0
    //     ? getNodeValueByType(creatorElements.item(0), '#cdata-section')
    //     : '';
    // const author: string = getNodeValueByType(authorElement, '#text');
    // const pubDate: string = getNodeValueByType(pubDateElement, '#text');
    // const category: string[] = Array.from(categoryElements).map((categoryElement: Element) => {
    //     const  cdata: string = getNodeValueByType(categoryElement, '#cdata-section');
    //     return cdata;
    // }).filter(cat => cat.trim() !== '');
    // const guid: string = getNodeValueByType(guidElement, '#text');
    // const content: string = contentElements.length > 0
    //     ? getNodeValueByType(contentElements.item(0), '#cdata-section')
    //     : '';
    // const postId: string = getNodeValueByType(postIdElement, '#text');
    const rssFeedChannelItem: Partial<RSSFeedChannelItem> = {
        title,
        link,
        description,
        creator,
        author,
        pubDate: new Date(pubDate),
        category,
        guid,
        content,
        postId,
    };
    const parsedItem: RSSFeedChannelItem = initializeRSSFeedChannelItem(rssFeedChannelItem);
    return parsedItem;
}

/**
 * Parses the text of an RSS feed XML document - including its <items> - into a RSSFeedChannel item.
 * @param xmlText 
 * @returns 
 */
export function parseRSSFeedResponseText(xmlText: string): RSSFeedChannel | null {
    const parser: DOMParser = new DOMParser();
    const document: XMLDocument = parser.parseFromString(xmlText, 'application/xml');
    const channelElement: Element | null = document.querySelector('rss > channel');
    if (channelElement) {
        const title: string = getElementText(channelElement, ':scope > title', '#text').trim();
        const description: string = getElementText(channelElement, ':scope > description', '#text').trim();
        const lastBuildDate: string = getElementText(channelElement, ':scope > lastBuildDate', '#text').trim();
        const updatePeriod: string = getNamespacedElementText(
            channelElement, 
            'http://purl.org/rss/1.0/modules/syndication/',
            'updatePeriod',
            '#text',
        ).trim();
        const updateFrequency: string = getNamespacedElementText(
            channelElement,
            'http://purl.org/rss/1.0/modules/syndication/',
            'updateFrequency',
            '#text',
        ).trim();
        const updateBase: string = getNamespacedElementText(
            channelElement,
            'http://purl.org/rss/1.0/modules/syndication/',
            'updateBase',
            '#text',
        ).trim();
        const atomLink: string = getNamespacedElementAttributeText(
            channelElement, 
            'http://www.w3.org/2005/Atom',
            'link',
            'href',
        );
        
        const itemElements: NodeListOf<Element> = channelElement.querySelectorAll('item');
        const items: RSSFeedChannelItem[] = Array.from(itemElements).map(parseRSSFeedChannelItemElement);
        const rssFeedChannel: Partial<RSSFeedChannel> = {
            atomLink,
            title,
            description,
            lastBuildDate: lastBuildDate ? new Date(lastBuildDate) : (updateBase ? new Date(updateBase) : null),
            updateBase: updateBase ? new Date(updateBase) : (lastBuildDate ? new Date(lastBuildDate) : null),
            updatePeriod: updatePeriod as RSSChannelUpdatePeriod,
            updateFrequency: parseInt(updateFrequency, 10),
            items,
        };
        return initializeRSSFeedChannel(rssFeedChannel);
    }
    return null;
}
