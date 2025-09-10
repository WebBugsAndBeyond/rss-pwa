import { isValidDate } from "../src/dates";
import { RSSFeedChannel, initializeRSSFeedChannel, RSSChannelUpdatePeriod, RSSFeedChannelItem, initializeRSSFeedChannelItem, loadRSSFeedChannelData, parseRSSFeedChannelItemElement, parseRSSFeedResponseText, getNodeValueByType, getElementArrayText, getElementText, getNamespacedElementText, getNamespacedElementArrayText, getAttributeText, getNamespacedElementAttributeText, XMLDocumentNodeName } from "../src/rss";
import { fake1, fake2, mockAtomLink, mockAuthor, mockCategory1, mockCategory2, mockChannelDescription, mockChannelTitle, mockContent, mockCreator, mockDescription, mockFrequency, mockGuid, mockLastBuildDate, mockLink, mockPeriod, mockPostId, mockPubDate, mockTitle, mockXMLDocument } from "./__mocks__/rssfeed";

describe('initializeRSSFeedChannel', () => {
    it('returns an object with empty values.', () => {
        const channel: RSSFeedChannel = initializeRSSFeedChannel();
        expect(channel.atomLink).toEqual('');
        expect(channel.title).toEqual('');
        expect(channel.description).toEqual('');
        expect(channel.lastBuildDate).toBeNull();
        expect(typeof channel.getNextUpdateDate).toEqual('function');
        expect(typeof channel.isNextUpdateReady).toEqual('function');
        expect(channel.updateFrequency).toEqual(1);
        expect(channel.updateBase).toBeNull();
        expect(Array.isArray(channel.items)).toEqual(true);
        expect(channel.items.length).toEqual(0);
        expect(channel.updatePeriod).toEqual('hourly');
        expect(channel.loading).toEqual(false);
    });
    it('returns an object with provided overrides.', () => {
        const buildDate: Date = new Date();
        const overrides: Partial<RSSFeedChannel> = {
            atomLink: 'https://foo/bar',
            title: 'title override',
            lastBuildDate: buildDate,
            loading: true,
        };
        const channel: RSSFeedChannel = initializeRSSFeedChannel(overrides);
        expect(channel.atomLink).toEqual(overrides.atomLink);
        expect(channel.title).toEqual(overrides.title);
        expect(channel.lastBuildDate).toBe(buildDate);
        expect(channel.loading).toEqual(overrides.loading);
    });
    test('the getNextUpdateDate method returns the correct date based on daily update frequency.', () => {
        const buildDate: Date = new Date(Date.UTC(2025, 7, 24));
        const updatePeriod: RSSChannelUpdatePeriod = 'daily';
        let updateFrequency: number = 1;
        let expectedNextBuildDate: Date = new Date(Date.UTC(2025, 7, 25));
        let channel: RSSFeedChannel = initializeRSSFeedChannel({
            lastBuildDate: buildDate,
            updatePeriod,
            updateFrequency,
        });
        let nextBuildDate: Date = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());

        updateFrequency = 2;
        expectedNextBuildDate = new Date(Date.UTC(2025, 7, 26));
        channel = initializeRSSFeedChannel({
            updateBase: buildDate,
            updatePeriod,
            updateFrequency,
        });
        nextBuildDate = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
    });
    test('the getNextUpdateDate method returns the correct date based on weekly update frequency.', () => {
        const buildDate: Date = new Date(Date.UTC(2025, 7, 14));
        const updatePeriod: RSSChannelUpdatePeriod = 'weekly';
        let updateFrequency: number = 2;
        let expectedNextBuildDate: Date = new Date(Date.UTC(2025, 7, 28));
        let channel: RSSFeedChannel = initializeRSSFeedChannel({
            lastBuildDate: buildDate,
            updatePeriod,
            updateFrequency,
        });
        let nextBuildDate: Date = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());

        updateFrequency = 2;
        expectedNextBuildDate = new Date(Date.UTC(2025, 7, 28));
        channel = initializeRSSFeedChannel({
            updateBase: buildDate,
            updateFrequency,
            updatePeriod,
        });
        nextBuildDate = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
    });
    test('the getNextUpdateDate method returns the correct date based on monthy update frequency.', () => {
        const buildDate: Date = new Date(Date.UTC(2025, 7, 1));
        const updatePeriod: RSSChannelUpdatePeriod = 'monthly';
        let updateFrequency: number = 1;
        let expectedNextBuildDate: Date = new Date(Date.UTC(2025, 8, 1));
        let channel: RSSFeedChannel = initializeRSSFeedChannel({
            lastBuildDate: buildDate,
            updatePeriod,
            updateFrequency,
        });
        let nextBuildDate: Date = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());

        updateFrequency = 2;
        expectedNextBuildDate = new Date(Date.UTC(2025, 9, 1));
        channel = initializeRSSFeedChannel({
            updateBase: buildDate,
            updateFrequency,
            updatePeriod,
        });
        nextBuildDate = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
    });
    test('the getNextUpdateDate method returns the correct date based on yearly update frequency.', () => {
        const buildDate: Date = new Date(Date.UTC(2025, 0, 1))
        const updatePeriod: RSSChannelUpdatePeriod = 'yearly';
        let updateFrequency: number = 1;
        let expectedNextBuildDate: Date = new Date(Date.UTC(2026, 0, 1));
        let channel: RSSFeedChannel = initializeRSSFeedChannel({
            lastBuildDate: buildDate,
            updatePeriod,
            updateFrequency,
        });
        let nextBuildDate: Date = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());

        updateFrequency = 2;
        expectedNextBuildDate = new Date(Date.UTC(2027, 0, 1));
        channel = initializeRSSFeedChannel({
            updateBase: buildDate,
            updateFrequency,
            updatePeriod,
        });
        nextBuildDate = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
    });
    test('the getNextUpdateDate method returns the correct date based on hourly update frequency.', () => {
        const buildDate: Date = new Date(Date.UTC(2021, 8, 11, 8, 46));
        const updatePeriod: RSSChannelUpdatePeriod = 'hourly';
        let updateFrequency: number = 7;
        let expectedNextBuildDate: Date = new Date(Date.UTC(2021, 8, 11, 8 + updateFrequency));
        let channel: RSSFeedChannel = initializeRSSFeedChannel({
            lastBuildDate: buildDate,
            updatePeriod,
            updateFrequency,
        });
        let nextBuildDate: Date = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
        expect(nextBuildDate.getUTCHours()).toEqual(expectedNextBuildDate.getUTCHours());
        
        updateFrequency = 24;
        expectedNextBuildDate = new Date(Date.UTC(2021, 8, 12, 8, 46));
        channel = initializeRSSFeedChannel({
            updateBase: buildDate,
            updateFrequency,
            updatePeriod,
        });
        nextBuildDate = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
        expect(nextBuildDate.getUTCHours()).toEqual(expectedNextBuildDate.getUTCHours());
    });
    test('the getNextUpdateDate method uses the updateBase date when lastBuildDate is not provided.', () => {
        const updateBase: Date = new Date(2021, 8, 1);
        const updatePeriod: RSSChannelUpdatePeriod = 'daily';
        const updateFrequency: number = 10;
        const expectedNextBuildDate: Date = new Date(2021, 8, 11);
        const channel: RSSFeedChannel = initializeRSSFeedChannel({
            updateBase,
            updatePeriod,
            updateFrequency,
        });
        const nextBuildDate: Date = channel.getNextUpdateDate();
        expect(nextBuildDate).toBeDefined();
        expect(nextBuildDate).toBeInstanceOf(Date);
        expect(nextBuildDate.toString().toLowerCase()).not.toEqual('invalid date');
        expect(isNaN(nextBuildDate.valueOf())).toEqual(false);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
    });
    test('the getNextUpdateDate method falls back on the current date when neither the updateBase nor the lastBuildDate are available.', () => {
        const updatePeriod: RSSChannelUpdatePeriod = 'daily';
        const updateFrequency: number = 1;
        const currentDate: Date = new Date();
        const expectedNextBuildDate: Date = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + 1);
        const channel: RSSFeedChannel = initializeRSSFeedChannel({
            updateFrequency,
            updatePeriod,
        });
        channel.updateBase = null;
        channel.lastBuildDate = null;
        const nextBuildDate: Date = channel.getNextUpdateDate();
        expect(isValidDate(nextBuildDate)).toEqual(true);
        expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
        expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
        expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
    });
    test('getNextUpdateDate evaluates dates for every month.', () => {
        for (let month = 0; month < 12; ++month) {
            const updatePeriod: RSSChannelUpdatePeriod = 'monthly';
            const updateFrequency: number = 1;
            const buildDate: Date = new Date(2025, month, 1);
            const expectedNextBuildDate: Date = new Date(2025, month + 1, 1);
            const channel: RSSFeedChannel = initializeRSSFeedChannel({
                lastBuildDate: buildDate,
                updateFrequency,
                updatePeriod,
            });
            const nextBuildDate: Date = channel.getNextUpdateDate();
            expect(nextBuildDate).toBeDefined();
            expect(nextBuildDate).toBeInstanceOf(Date);
            expect(nextBuildDate.getUTCFullYear()).toEqual(expectedNextBuildDate.getUTCFullYear());
            expect(nextBuildDate.getUTCMonth()).toEqual(expectedNextBuildDate.getUTCMonth());
            expect(nextBuildDate.getUTCDate()).toEqual(expectedNextBuildDate.getUTCDate());
        }
    });
    test('the isNextUpdateReady returns true when the current date is after the next update date.', () => {
        const lastBuildDate: Date = new Date(2021, 8, 11, 9);
        const updatePeriod: RSSChannelUpdatePeriod = 'hourly';
        const updateFrequency: number = 7;
        const channel: RSSFeedChannel = initializeRSSFeedChannel({
            lastBuildDate,
            updatePeriod,
            updateFrequency,
        });
        const isUpdateAvailable: boolean = channel.isNextUpdateReady();
        expect(isUpdateAvailable).toEqual(true);
    });
    test('the isNextUpdateReady method returns false when the current date is before the next update date.', () => {
        const lastBuildDate: Date = new Date(2021, 8, 11);
        const updatePeriod: RSSChannelUpdatePeriod = 'yearly';
        const updateFrequency: number = 100;
        const channel: RSSFeedChannel = initializeRSSFeedChannel({
            lastBuildDate,
            updatePeriod,
            updateFrequency,
        });
        const isUpdateAvailable: boolean = channel.isNextUpdateReady();
        expect(isUpdateAvailable).toEqual(false);
    });
});

describe('initializeRSSFeedChannelItem', () => {
    it('returns an object with empty values.', () => {
        const item: RSSFeedChannelItem = initializeRSSFeedChannelItem();
        expect(item.title).toEqual('');
        expect(item.author).toEqual('');
        expect(Array.isArray(item.category)).toEqual(true);
        expect(item.category.length).toEqual(0);
        expect(item.creator).toEqual('');
        expect(item.description).toEqual('');
        expect(item.guid).toEqual('');
        expect(item.link).toEqual('');
        expect(item.postId).toEqual('');
        expect(item.pubDate).toBeNull();
    });
    it('returns an object with provided overrides.', () => {
        const overrides: Partial<RSSFeedChannelItem> = {
            title: 'overridden title',
            author: 'Lao Tzu',
            creator: 'Beethoven, yo',
        };
        const item: RSSFeedChannelItem = initializeRSSFeedChannelItem(overrides);
        expect(item.title).toEqual(overrides.title);
        expect(item.author).toEqual(overrides.author);
        expect(item.creator).toEqual(overrides.creator);
    });
});

describe('getNodeValueByType', () => {
    const mockTitle: string = 'Fake title';
    const mockLink: string = 'https://foo/bar';
    const mockDescription: string = `<p>Marijuana users have “superior performance across multiple cognitive domains,&#8221; according to a new large-scale study funded by the U.S. federal government, with the effects of cannabis on cognition &#8220;presented concurrently across a range of brain systems.” The research, published this month as a preprint by Nature Portfolio, analyzed brain imaging and cognitive data from 37,929 participants [&#8230;]</p>
<p>The post <a href="https://www.marijuanamoment.net/marijuana-users-have-enhanced-cognitive-abilities-large-federally-funded-study-shows/">Marijuana Users Have ‘Enhanced Cognitive Abilities,’ Large Federally Funded Study Shows</a> appeared first on <a href="https://www.marijuanamoment.net">Marijuana Moment</a>.</p>
`;

    const mockXMLDocument: string = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
>

    <channel>
        <title>Marijuana Moment</title>
        <link>${mockLink}</link>
        <item>
            <title>${mockTitle}</title>
            <description><![CDATA[${mockDescription}]]></description>
            


            <post-id xmlns="com-wordpress:feed-additions:1">126303</post-id>
            <empty/>
        </item>
    </channel>
    </rss>
    `;
    it('returns an empty string for a falsey node.', () => {
        const node: Node | null = null;
        const value: string = getNodeValueByType(node, '#text');
        expect(value).toEqual('');
    });
    it('returns an empty string for a type of node not found.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'text/html');
        const channel: Element | null = xmlDocument.querySelector('channel');
        expect(channel).not.toBeNull();
        if (channel !== null) {
            const missingValue: string = getNodeValueByType(channel, '#fake' as XMLDocumentNodeName);
            expect(missingValue).toEqual('');
        }
    });
    it('returns the string value of a #text node type.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'text/xml');
        const titleElement: Element | null = xmlDocument.querySelector('channel > link');
        expect(titleElement).not.toBeNull();
        const textValue: string = getNodeValueByType(titleElement, '#text');
        expect(textValue).toEqual(mockLink);
    });
    it('returns the string value of a #cdata-section node type.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'text/xml');
        const descriptionElement: Element | null = xmlDocument.querySelector('channel > item > description');
        expect(descriptionElement).not.toBeNull();
        const cdataValue: string = getNodeValueByType(descriptionElement, '#cdata-section');
        expect(cdataValue).toEqual(mockDescription);
    });
});

describe('loadRSSFeedChannelData', () => {
    const mockRssFeedUrl: string = 'http://fakehost:8080/feed';
    const mockXMLDocument: string = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Marijuana Moment</title><link>https://fakefeed/fake}</link><item><title>fake title</title><description><![CDATA[fake description cdata.]]></description></item></channel></rss>`;
    beforeEach(() => {
        fetchMock.mockIf(mockRssFeedUrl, async (_request) => {
            return {
                status: 200,
                body: mockXMLDocument,
                headers: {
                    'Content-Type': 'application/xml',
                },
            };
        });
    });

    it('returns a promise resolved with the text of an RSS feed xml document.', async () => {
        const abortController: AbortController = new AbortController();
        const signal: AbortSignal = abortController.signal;
        const responseText: string = await loadRSSFeedChannelData(
            mockRssFeedUrl,
            signal,
        );
        expect(responseText).toBeDefined();
        expect(typeof responseText).toEqual('string');
        expect(responseText.length).toBeGreaterThan(0);
        expect(responseText).toEqual(mockXMLDocument);
    });
    it('returns a promise that is rejected when the request is aborted.', () => {
        const abortController: AbortController = new AbortController();
        const abortSignal: AbortSignal = abortController.signal;
        loadRSSFeedChannelData(mockRssFeedUrl, abortSignal)
            .catch(error => expect(error).toBeDefined());
        abortController.abort();
    });
});

describe('getElementText', () => {
    it('returns the element text.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channel: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getElementText(channel as Element, 'title', '#text');
        expect(text).toEqual(mockChannelTitle);
    });
    it('returns an empty string for non-existent element.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channel: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getElementText(channel as Element, 'non-existent', '#text');
        expect(text).toEqual('');
    });
});

describe('getNamespacedElementText', () => {
    
    it('returns the text of a namespaced element.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channel: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getNamespacedElementText(channel as Element, 'http://purl.org/rss/1.0/modules/syndication/', 'updatePeriod', '#text');
        expect(text.trim()).toEqual(mockPeriod);
    });
    it('returns an empty string for a non-existent namespaced element.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channel: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getNamespacedElementText(
            channel as Element,
            'http://purl.org/rss/1.0/modules/syndication/',
            'non-existent',
            '#text',
        );
        expect(text).toEqual('');
    });
});

describe('getElementArrayText', () => {
    it('returns a string array from a collection of elements.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const item: Element | null = xmlDocument.querySelector('rss > channel > item');
        const text: string[] = getElementArrayText(
            item as Element,
            'category',
            '#cdata-section',
        );
        expect(text.length).toEqual(2);
        expect(text).toEqual(expect.arrayContaining([mockCategory1, mockCategory2]));
    });
    it('returns an empty array from a non-existent collection of elements.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channel: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string[] = getElementArrayText(channel as Element, 'non-existent', '#text');
        expect(text.length).toEqual(0);
        expect(text).toEqual(expect.arrayContaining([]));
    });
});

describe('getNamespacedElementArrayText', () => {
    it('returns an array of text from a collection of namespaced elements.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channel: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string[] = getNamespacedElementArrayText(
            channel as Element, 
            'http://www.w3.org/2005/Atom',
            'fake',
            '#text',
        );
        expect(text.length).toEqual(2);
        expect(text).toEqual(expect.arrayContaining([fake1, fake2]));
    });
    it('returns an empty string array from a non-existent collection of namespaced elements.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channel: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string[] = getNamespacedElementArrayText(
            channel as Element,
            'http://www.w3.org/2005/Atom',
            'non-existent',
            '#text',
        );
        expect(text.length).toEqual(0);
    });
});

describe('getAttributeText', () => {
    it('returns the attribute text.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const itemElement: Element | null = xmlDocument.querySelector('rss > channel > item');
        const attributeText: string = getAttributeText(itemElement as Element, 'post-id', 'xmlns');
        expect(attributeText).toEqual('com-wordpress:feed-additions:1');
    });
    it('returns an empty string for a non-existent element.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channelElement: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getAttributeText(channelElement as Element, 'non-existent', 'xmlns');
        expect(text).toEqual('');
    });
    it('returns an empty string for a non-existent attribute.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channelElement: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getAttributeText(channelElement as Element, 'title', 'fake-attribute');
        expect(text).toEqual('');
    });
});

describe('getNamespacedElementAttributeText', () => {
    it('returns the text of an attribute of a namespaced element.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channelElement: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getNamespacedElementAttributeText(
            channelElement as Element,
            'http://www.w3.org/2005/Atom',
            'link',
            'href',
        );
        expect(text).toEqual(mockAtomLink);
    });
    it('returns an empty string for a non-existent element.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channelElement: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getNamespacedElementAttributeText(
            channelElement as Element,
            'http://www.w3.org/2005/Atom',
            'non-existent',
            'non-existent-attr',
        );
        expect(text).toEqual('');
    });
    it('returns an empty string for a non-existent attribute on a namespaced element.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'application/xml');
        const channelElement: Element | null = xmlDocument.querySelector('rss > channel');
        const text: string = getNamespacedElementAttributeText(
            channelElement as Element,
            'http://www.w3.org/2005/Atom',
            'link',
            'non-existent-attr',
        );
        expect(text).toEqual('');
    });
});

describe('parseRSSFeedChannelItemElement', () => {
    it('correctly parses RSS channel items.', () => {
        const parser: DOMParser = new DOMParser();
        const xmlDocument: XMLDocument = parser.parseFromString(mockXMLDocument, 'text/xml');
        const itemElement: Element | null = xmlDocument.querySelector('rss > channel > item');
        expect(itemElement).not.toBeNull();
        const item: RSSFeedChannelItem = parseRSSFeedChannelItemElement(
            itemElement as Element,
        );
        expect(item).toBeDefined();
        expect(item).not.toBeNull();
        expect(item.author).toEqual(mockAuthor);
        expect(item.category.every(cat => [
            mockCategory1,
            mockCategory2,
        ].includes(cat))).toEqual(true);
        expect(item.content).toEqual(mockContent);
        expect(item.creator).toEqual(mockCreator);
        expect(item.description).toEqual(mockDescription);
        expect(item.guid).toEqual(mockGuid);
        expect(item.link).toEqual(mockLink);
        expect(item.postId).toEqual(mockPostId);
        expect(item.pubDate).toBeDefined();
        expect(item.pubDate).toBeInstanceOf(Date);
        expect(item.pubDate?.toString().toLocaleLowerCase()).not.toEqual('invalid date');
        expect(isNaN(item.pubDate?.valueOf?.() ?? 0)).toEqual(false);
        expect(item.pubDate?.getFullYear()).toEqual((new Date(mockPubDate)).getFullYear());
        expect(item.pubDate?.getMonth()).toEqual((new Date(mockPubDate)).getMonth());
        expect(item.pubDate?.getDate()).toEqual((new Date(mockPubDate)).getDate());
        expect(item.title).toEqual(mockTitle);
    });
});

describe('parseRSSFeedResponseText', () => {
    it('returns a RSSFeedChannel object from a correctly parsed RSS XML document.', () => {
        const channel: RSSFeedChannel | null = parseRSSFeedResponseText(mockXMLDocument);
        expect(channel).not.toBeNull();
        expect(channel?.atomLink).toBeDefined();
        expect(typeof channel?.atomLink).toEqual('string');
        expect(channel?.atomLink).toEqual(mockAtomLink);
        expect(channel?.description).toBeDefined();
        expect(typeof channel?.description).toEqual('string');
        expect(channel?.description).toEqual(mockChannelDescription);
        expect(channel?.lastBuildDate).toBeDefined();
        expect(channel?.lastBuildDate).toBeInstanceOf(Date);
        expect(channel?.lastBuildDate?.toString?.().toLocaleLowerCase?.()).not.toEqual('invalid date');
        expect(isNaN(channel?.lastBuildDate?.valueOf?.() ?? 0)).toEqual(false);
        expect(channel?.lastBuildDate?.getFullYear?.()).toEqual((new Date(mockLastBuildDate)).getFullYear());
        expect(channel?.lastBuildDate?.getMonth?.()).toEqual((new Date(mockLastBuildDate)).getMonth());
        expect(channel?.lastBuildDate?.getDate?.()).toEqual((new Date(mockLastBuildDate)).getDate());
        expect(channel?.title).toBeDefined();
        expect(typeof channel?.title).toEqual('string');
        expect(channel?.title).toEqual(mockChannelTitle);
        expect(channel?.updateFrequency).toBeDefined();
        expect(typeof channel?.updateFrequency).toEqual('number');
        expect(channel?.updateFrequency).toEqual(mockFrequency);
        expect(channel?.updatePeriod).toBeDefined();
        expect(channel?.updatePeriod).toEqual(mockPeriod);
        expect(channel?.items).toBeDefined();
        expect(Array.isArray(channel?.items)).toEqual(true);
        expect(channel?.items?.length).toBeGreaterThan(0);
    });
    it('returns null for an invalid RSS XML document.', () => {
        const invalidXmlDocument: string = 'sdnfskhjdf';
        const channel: RSSFeedChannel | null = parseRSSFeedResponseText(invalidXmlDocument);
        expect(channel).toBeNull();
    });
    it('will use the updateBase as the lastBuildDate if it is not present.', () => {
        const xmlDocumentWithoutLastBuildDate: string = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
>

    <channel>
        <title>Marijuana Moment</title>
        <atom:link href="https://www.marijuanamoment.net/feed/" rel="self"
            type="application/rss+xml" />
        <link>https://www.marijuanamoment.net/</link>
        <description>Tracking the policy and politics of cannabis</description>
        <sy:updateBase>Mon, 11 Aug 2025 18:56:29 +0000</sy:updateBase>
        <language>en-US</language>
        <sy:updatePeriod>
            hourly </sy:updatePeriod>
        <sy:updateFrequency>
            1 </sy:updateFrequency>
        <generator>https://wordpress.org/?v=6.8.2</generator>
        <site xmlns="com-wordpress:feed-additions:1">136466034</site>
        </channel></rss>
        `;
        const channel: RSSFeedChannel | null = parseRSSFeedResponseText(xmlDocumentWithoutLastBuildDate);
        expect(channel).not.toBeNull();
        expect(isValidDate(channel?.lastBuildDate as Date)).toEqual(true);
        expect(channel?.lastBuildDate?.getUTCFullYear()).toEqual(channel?.updateBase?.getUTCFullYear());
        expect(channel?.lastBuildDate?.getUTCMonth()).toEqual(channel?.updateBase?.getUTCMonth());
        expect(channel?.lastBuildDate?.getUTCDate()).toEqual(channel?.updateBase?.getUTCDate());
    });
    it('will use the lastBuildDate as the updateBase if it is not present.', () => {
        const xmlDocumentWithoutUpdateBase: string = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
>

    <channel>
        <title>Marijuana Moment</title>
        <atom:link href="https://www.marijuanamoment.net/feed/" rel="self"
            type="application/rss+xml" />
        <link>https://www.marijuanamoment.net/</link>
        <description>Tracking the policy and politics of cannabis</description>
        <lastBuildDate>Mon, 11 Aug 2025 18:56:29 +0000</lastBuildDate>
        <language>en-US</language>
        <sy:updatePeriod>
            hourly </sy:updatePeriod>
        <sy:updateFrequency>
            1 </sy:updateFrequency>
        <generator>https://wordpress.org/?v=6.8.2</generator>
        <site xmlns="com-wordpress:feed-additions:1">136466034</site>
        </channel></rss>
        `;
        const channel: RSSFeedChannel | null = parseRSSFeedResponseText(xmlDocumentWithoutUpdateBase);
        expect(channel).not.toBeNull();
        expect(isValidDate(channel?.updateBase as Date)).toEqual(true);
        expect(channel?.updateBase?.getUTCFullYear()).toEqual(channel?.lastBuildDate?.getUTCFullYear());
        expect(channel?.updateBase?.getUTCMonth()).toEqual(channel?.lastBuildDate?.getUTCMonth());
        expect(channel?.updateBase?.getUTCDate()).toEqual(channel?.lastBuildDate?.getUTCDate());
    });
    it('will use null for both the lastBuildDate and the updateBase if neither are presnet.', () => {
        const xmlDocumentWithoutDates: string = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
>

    <channel>
        <title>Marijuana Moment</title>
        <atom:link href="https://www.marijuanamoment.net/feed/" rel="self"
            type="application/rss+xml" />
        <link>https://www.marijuanamoment.net/</link>
        <description>Tracking the policy and politics of cannabis</description>
        <language>en-US</language>
        <sy:updatePeriod>
            hourly </sy:updatePeriod>
        <sy:updateFrequency>
            1 </sy:updateFrequency>
        <generator>https://wordpress.org/?v=6.8.2</generator>
        <site xmlns="com-wordpress:feed-additions:1">136466034</site>
        </channel></rss>
        `;
        const channel: RSSFeedChannel | null = parseRSSFeedResponseText(xmlDocumentWithoutDates);
        expect(channel).not.toBeNull();
        expect(channel?.lastBuildDate).toBeNull();
        expect(channel?.updateBase).toBeNull();
    });
});
