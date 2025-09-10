import fetchMock from 'jest-fetch-mock';

import {
    Application,
    ApplicationState,
    ApplicationStateKey,
    applicationStateReducer,
    initializeApplicationState,
    loadSubscriptionsFromLocalStorage,
    performRSSFeedChannelDataRequestResponseCycle,
    RequestRSSFeedChannelDataAborted,
    RequestRSSFeedChannelDataActionPayload,
    RSSFeedChannelLoadedAction,
    RSSFeedSubscription,
    RSSSubscriptionsLocalStorageKey,
    SerializedRSSFeedSubscription,
    StateChangeAction,
    StateChangeListenerMap,
} from "../src/app";
import { initializeRSSFeedChannel, RSSChannelUpdatePeriod, RSSFeedChannel } from '../src/rss';

describe('initializeApplicationState', () => {
    it('returns an object with empty values.', () => {
        const state: ApplicationState = initializeApplicationState();
        expect(state.subscriptionsLocalStorageKey).toBeDefined();
        expect(typeof state.subscriptionsLocalStorageKey).toEqual('string');
        expect(state.subscriptionsLocalStorageKey).toEqual(RSSSubscriptionsLocalStorageKey);
        expect(state.channels).toBeDefined();
        expect(Array.isArray(state.channels)).toEqual(true);
        expect(state.channels.length).toEqual(0);
        expect(state.subscriptions).toBeDefined();
        expect(Array.isArray(state.subscriptions)).toEqual(true);
        expect(state.subscriptions.length).toEqual(0);
    });
    it('returns an object with provided overrides.', () => {
        const channelOverride: RSSFeedChannel = initializeRSSFeedChannel();
        const overrides: Partial<ApplicationState> = {
            channels: [channelOverride],
        };
        const state: ApplicationState = initializeApplicationState(overrides);
        expect(state.channels).toBeDefined();
        expect(Array.isArray(state.channels)).toEqual(true);
        expect(state.channels.length).toEqual(1);
        expect(state.channels[0]).toBe(channelOverride);
    });
});


describe('loadSubscriptionsFromLocalStorage', () => {
    
    const mockSubscriptions: RSSFeedSubscription[] = [
        {
            feedUrl: 'https://foo/bar',
            lastBuildDate: new Date(),
            nextBuildDate: new Date(),
        },
    ];
    const mockSubscriptionsWithoutDates: RSSFeedSubscription[] = [
        {
            feedUrl: 'https://foo/bar',
        },
    ];
    const mockSubscriptionsWithInvalidDates: SerializedRSSFeedSubscription[] = [
        {
            feedUrl: 'https://foo/bar',
            lastBuildDate: 'bungouoeb uybuyni $&&',
            nextBuildDate: 'ounboun &^^^%^%(Oin ',
        },
    ];
    const mockKeyWithoutDates: string = 'mock-key-without-dates';
    const mockKeyWithInvalidDates: string = 'mock-key-with-invalid-dates';

    beforeAll(() => {
        const serializedData: string = JSON.stringify(mockSubscriptions);
        window.localStorage.setItem(RSSSubscriptionsLocalStorageKey, serializedData);
        window.localStorage.setItem(mockKeyWithoutDates, JSON.stringify(mockSubscriptionsWithoutDates));
        window.localStorage.setItem(mockKeyWithInvalidDates, JSON.stringify(mockSubscriptionsWithInvalidDates));
    });
    afterAll(() => {
        window.localStorage.removeItem(mockKeyWithoutDates);
        window.localStorage.removeItem(RSSSubscriptionsLocalStorageKey);
        window.localStorage.removeItem(mockKeyWithInvalidDates);
    });
    it('returns an empty array for a non-existent storage item.', () => {
        const nonExistentKey: string = 'does-not-exist';
        const subscriptions: RSSFeedSubscription[] = loadSubscriptionsFromLocalStorage(nonExistentKey);
        expect(Array.isArray(subscriptions)).toEqual(true);
        expect(subscriptions.length).toEqual(0);
    });
    it('returns an array of subscriptions for an existing storage record.', () => {
        const existingKey: string = RSSSubscriptionsLocalStorageKey;
        const subscriptions: RSSFeedSubscription[] = loadSubscriptionsFromLocalStorage(existingKey);
        expect(Array.isArray(subscriptions)).toEqual(true);
        expect(subscriptions.length).toEqual(mockSubscriptions.length);
        expect(subscriptions[0].feedUrl).toEqual(mockSubscriptions[0].feedUrl);
        expect(subscriptions[0].lastBuildDate?.getFullYear()).toEqual(mockSubscriptions[0].lastBuildDate?.getFullYear());
        expect(subscriptions[0].lastBuildDate?.getDate()).toEqual(mockSubscriptions[0].lastBuildDate?.getDate());
        expect(subscriptions[0].lastBuildDate?.getMonth()).toEqual(mockSubscriptions[0].lastBuildDate?.getMonth());
        expect(subscriptions[0].nextBuildDate?.getFullYear()).toEqual(mockSubscriptions[0].nextBuildDate?.getFullYear());
        expect(subscriptions[0].nextBuildDate?.getDate()).toEqual(mockSubscriptions[0].nextBuildDate?.getDate());
        expect(subscriptions[0].nextBuildDate?.getMonth()).toEqual(mockSubscriptions[0].nextBuildDate?.getMonth());
    });

    it('correctly parses subscriptions with empty dates.', () => {
        const subscriptions: RSSFeedSubscription[] = loadSubscriptionsFromLocalStorage(mockKeyWithoutDates);
        expect(mockKeyWithoutDates).toEqual('mock-key-without-dates');
        expect(Array.isArray(subscriptions)).toEqual(true);
        expect(subscriptions.length).toEqual(1);
        expect(subscriptions[0].feedUrl).toEqual(mockSubscriptionsWithoutDates[0].feedUrl);
        expect(subscriptions[0].lastBuildDate).not.toBeDefined();
        expect(subscriptions[0].nextBuildDate).not.toBeDefined();
    });
    it('correctly omits invalid dates from the serialized data.', () => {
        const subscriptions: RSSFeedSubscription[] = loadSubscriptionsFromLocalStorage(
            mockKeyWithInvalidDates,
        );
        expect(subscriptions).toBeDefined();
        expect(Array.isArray(subscriptions)).toEqual(true);
        expect(subscriptions.length).toEqual(1);
        expect(subscriptions[0].lastBuildDate).not.toBeDefined();
        expect(subscriptions[0].lastBuildDate).toBeFalsy();
        expect(subscriptions[0].nextBuildDate).not.toBeDefined();
        expect(subscriptions[0].nextBuildDate).toBeFalsy();
    });
});


describe('applicationStateReducer', () => {
    const mockSubscriptions: RSSFeedSubscription[] = [
        {
            feedUrl: 'https://foo/bar',
            lastBuildDate: new Date(),
            nextBuildDate: new Date(),
        },
    ];
    const mockSubscriptionsWithoutDates: RSSFeedSubscription[] = [
        {
            feedUrl: 'https://foo/bar',
        },
    ];
    const mockKeyWithoutDates: string = 'mock-key-without-dates';

    beforeAll(() => {
        const serializedData: string = JSON.stringify(mockSubscriptions);
        window.localStorage.setItem(RSSSubscriptionsLocalStorageKey, serializedData);
        window.localStorage.setItem(mockKeyWithoutDates, JSON.stringify(mockSubscriptionsWithoutDates));
    });
    afterAll(() => {
        window.localStorage.removeItem(mockKeyWithoutDates);
        window.localStorage.removeItem(RSSSubscriptionsLocalStorageKey);
    });
    it('reduces an empty initialized state.', () => {
        const initializeDefaultStateAction: StateChangeAction = {
            type: 'INITIALIZE_DEFAULT_STATE',
        };
        const emptyState: ApplicationState = initializeApplicationState();
        const initializedState: ApplicationState = applicationStateReducer(emptyState, initializeDefaultStateAction);
        expect(initializedState.channels).toBeDefined();
        expect(Array.isArray(initializedState.channels)).toEqual(true);
        expect(initializedState.channels.length).toEqual(0);
        expect(initializedState.subscriptions).toBeDefined();
        expect(Array.isArray(initializedState.subscriptions)).toEqual(true);
        expect(initializedState.subscriptions.length).toEqual(0);
        expect(initializedState.subscriptionsLocalStorageKey).toBeDefined();
        expect(typeof initializedState.subscriptionsLocalStorageKey).toEqual('string');
        expect(initializedState.subscriptionsLocalStorageKey).toEqual(RSSSubscriptionsLocalStorageKey);
    });
    it('reduces application state with unserialized subscripttions.', () => {
        const action: StateChangeAction = {
            type: 'LOAD_SUBSCRIPTIONS_FROM_LOCAL_STORAGE',
        };
        const emptyState: ApplicationState = initializeApplicationState();
        const reducedState: ApplicationState = applicationStateReducer(emptyState, action);
        expect(reducedState.subscriptions).toBeDefined();
        expect(Array.isArray(reducedState.subscriptions)).toEqual(true);
        expect(reducedState.subscriptions.length).toBeGreaterThan(0);
        expect(reducedState.subscriptions[0].feedUrl).toEqual(mockSubscriptions[0].feedUrl);
        expect(reducedState.subscriptions[0].lastBuildDate?.getFullYear()).toEqual(mockSubscriptions[0].lastBuildDate?.getFullYear());
        expect(reducedState.subscriptions[0].lastBuildDate?.getDate()).toEqual(mockSubscriptions[0].lastBuildDate?.getDate());
        expect(reducedState.subscriptions[0].lastBuildDate?.getMonth()).toEqual(mockSubscriptions[0].lastBuildDate?.getMonth());
        expect(reducedState.subscriptions[0].nextBuildDate?.getFullYear()).toEqual(mockSubscriptions[0].nextBuildDate?.getFullYear());
        expect(reducedState.subscriptions[0].nextBuildDate?.getDate()).toEqual(mockSubscriptions[0].nextBuildDate?.getDate());
        expect(reducedState.subscriptions[0].nextBuildDate?.getMonth()).toEqual(mockSubscriptions[0].nextBuildDate?.getMonth());
    });
    it('reduces application state new channel being requested.', () => {
        const mockRssFeedUrl: string = 'http://fakehost:8080/feed';
        
        const action: StateChangeAction = {
            type: 'REQUEST_RSS_FEED_CHANNEL_DATA',
            payload: {
                feedUrl: mockRssFeedUrl,
            },
        };

        const initialState: ApplicationState = initializeApplicationState({
            subscriptions: [{
                feedUrl: mockRssFeedUrl,
            }],
        });
        expect(initialState.channels.length).toEqual(0);
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState.channels.length).toEqual(1);
        expect(reducedState.channels[0].atomLink).toEqual(mockRssFeedUrl);
        expect(reducedState.channels[0].loading).toEqual(true);
    });
    it('reduces application state with the existing channel loading flag update.', async () => {
        const mockRssFeedUrl: string = 'http://fakehost:8080/feed';
        
        const action: StateChangeAction = {
            type: 'REQUEST_RSS_FEED_CHANNEL_DATA',
            payload: {
                feedUrl: mockRssFeedUrl,
            },
        };

        const initialState: ApplicationState = initializeApplicationState({
            subscriptions: [{
                feedUrl: mockRssFeedUrl,
            }],
            channels: [
                initializeRSSFeedChannel({
                    atomLink: mockRssFeedUrl,
                    loading: false,
                }),
            ],
        });
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState.channels.length).toEqual(1);
        expect(reducedState.channels[0].atomLink).toEqual(mockRssFeedUrl);
        expect(reducedState.channels[0].loading).toEqual(true);
    });
    it('redueces application state with a new channel added to an existing non-zero length array of channels when requesting channel data.', () => {
        const mockRssFeedUrl: string = 'http://fakehost:8080/feed';
        
        const action: StateChangeAction = {
            type: 'REQUEST_RSS_FEED_CHANNEL_DATA',
            payload: {
                feedUrl: mockRssFeedUrl,
            },
        };

        const initialState: ApplicationState = initializeApplicationState({
            subscriptions: [{
                feedUrl: mockRssFeedUrl,
            }],
            channels: [
                initializeRSSFeedChannel(),
            ],
        });
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState.channels.length).toEqual(2);
        expect(reducedState.channels[1].atomLink).toEqual(mockRssFeedUrl);
        expect(reducedState.channels[1].loading).toEqual(true);
    });
    it('reduces application state by resetting the loading flag to false for an aborted channel data request.', () => {
        const mockRssFeedUrl: string = 'http://fakehost:8080/feed';
        const action: RequestRSSFeedChannelDataAborted = {
            type: 'REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED',
            payload: {
                feedUrl: mockRssFeedUrl,
            },
        };
        const initialState: ApplicationState = initializeApplicationState({
            subscriptions: [{
                feedUrl: mockRssFeedUrl,
            }],
            channels: [
                initializeRSSFeedChannel({
                    atomLink: mockRssFeedUrl,
                    loading: true,
                }),
            ],
        });
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState.channels.length).toEqual(1);
        expect(reducedState.channels[0].atomLink).toEqual(mockRssFeedUrl);
        expect(reducedState.channels[0].loading).toEqual(false);
    });
    it('reduces application state unaffected in response to an aborted request when there are no channels.', () => {
        // THIS SHOULD NEVER ACTUALLY HAPPEN.
        // Is there another way to write the reducer case body
        // that can avoid the conditional check, or should it throw?

        const mockRssFeedUrl: string = 'http://fakehost:8080/feed';
        const action: RequestRSSFeedChannelDataAborted = {
            type: 'REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED',
            payload: {
                feedUrl: mockRssFeedUrl,
            },
        };
        const initialState: ApplicationState = initializeApplicationState({
            subscriptions: [{
                feedUrl: mockRssFeedUrl,
            }],
            channels: [],
        });
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState.channels.length).toEqual(0);
    });
    it('reduces application state with added channel data to an existing non empty array of channels after successful response.', () => {

    });
    it('reduces application state with added channel data to a non-empty channel array after successful response.', () => {
        const mockNewFeedUrl: string = 'https://mockrss/feed';
        const mockOldFeedUrl: string = 'https://mockoldrss/feed';
        const existingChannels: RSSFeedChannel = initializeRSSFeedChannel({
            atomLink: mockOldFeedUrl,
            title: 'Old RSS Feed Title',
        });
        const newChannel: RSSFeedChannel = initializeRSSFeedChannel({
            atomLink: mockNewFeedUrl,
            title: 'New RSS Feed Title',
        });
        const action: RSSFeedChannelLoadedAction = {
            type: 'RSS_FEED_CHANNEL_DATA_LOADED',
            payload: {
                channel: initializeRSSFeedChannel(
                    newChannel,
                ),
            },
        };
        const initialState: ApplicationState = initializeApplicationState({
            subscriptions: [{
                feedUrl: mockOldFeedUrl,
            }, {
                feedUrl: mockNewFeedUrl,
            }],
            channels: [
                existingChannels,
            ],
        });
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState.channels.length).toEqual(2);
        expect(reducedState.channels[0].atomLink).toEqual(mockOldFeedUrl);
        expect(reducedState.channels[0].title).toEqual(existingChannels.title);
        expect(reducedState.channels[0].loading).toEqual(false);
        expect(reducedState.channels[1].atomLink).toEqual(mockNewFeedUrl);
        expect(reducedState.channels[1].title).toEqual(newChannel.title);
        expect(reducedState.channels[1].loading).toEqual(false);
    });
    it('reduces application state with added channel data to an empty channels array after successful response.', () => {
        const mockNewFeedUrl: string = 'https://mockrss/feed';
        const newChannel: RSSFeedChannel = initializeRSSFeedChannel({
            atomLink: mockNewFeedUrl,
            title: 'New RSS Feed Title',
        });
        const action: RSSFeedChannelLoadedAction = {
            type: 'RSS_FEED_CHANNEL_DATA_LOADED',
            payload: {
                channel: initializeRSSFeedChannel(
                    newChannel,
                ),
            },
        };
        const initialState: ApplicationState = initializeApplicationState({
            subscriptions: [{
                feedUrl: mockNewFeedUrl,
            }],
            channels: [],
        });
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState.channels.length).toEqual(1);
        expect(reducedState.channels[0].atomLink).toEqual(mockNewFeedUrl);
        expect(reducedState.channels[0].title).toEqual(newChannel.title);
        expect(reducedState.channels[0].loading).toEqual(false);
    });
    it('reduces application unaffected with an unidentified action type.', () => {
        const action: StateChangeAction = {
            type: 'UNKNOWN',
        };
        const initialState: ApplicationState = initializeApplicationState();
        const reducedState: ApplicationState = applicationStateReducer(
            initialState,
            action,
        );
        expect(reducedState).toBe(initialState);
    });
});

describe('Application', () => {
    it('is a singleton', () => {
        const instance: Application = Application.getInstance();
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(Application);
        expect(Application.getInstance()).toBe(instance);
    });
    it('dispatches actions to change application state.', () => {
        const instance: Application = Application.getInstance();
        const listener: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const listenerMock = jest.spyOn(listener, 'notifyListeners');
        instance.dispatch({
            type: 'INITIALIZE_DEFAULT_STATE',
        });
        
        expect(listenerMock).toHaveBeenCalled();
    });
});

describe('StateChangeListenerMap', () => {
    afterEach(() => {
        StateChangeListenerMap.getInstance().resetListeners();
    });
    it('is a singleton', () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        expect(instance).toBeDefined();
        expect(instance).not.toBeNull();
        expect(instance).toBeInstanceOf(StateChangeListenerMap);
        expect(StateChangeListenerMap.getInstance()).toBe(instance);
    });
    test('addListener adds a new listener increasing the count of listeners by one.', () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const propertyName: ApplicationStateKey = 'subscriptionsLocalStorageKey';
        const listener = jest.fn();
        const count: number = instance.addListener(propertyName, listener);
        expect(count).toEqual(1);
        const secondListener = jest.fn();
        expect(instance.addListener(propertyName, secondListener)).toEqual(2);
    });
    test('addListener avoids adding duplicate listeners.', () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const propertyName: ApplicationStateKey = 'subscriptionsLocalStorageKey';
        const listener = jest.fn();
        const count: number = instance.addListener(propertyName, listener);
        expect(count).toEqual(1);
        expect(instance.addListener(propertyName, listener)).toEqual(count);
    });
    test('resetListeners removes all listeners.', () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const propertyName: ApplicationStateKey = 'subscriptionsLocalStorageKey';
        const listener = jest.fn();
        const count: number = instance.addListener(propertyName, listener);
        expect(count).toEqual(1);
        expect(instance.resetListeners()).toEqual(0);
    });
    test('removeListener removes listeners.', () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const propertyName: ApplicationStateKey = 'subscriptions';
        const listener = jest.fn();
        const count: number = instance.addListener(propertyName, listener);
        expect(count).toEqual(1);
        expect(instance.removeListener(propertyName, listener)).toEqual(0);
    });
    test('removeListener does not removes non-existent listeners.', () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const propertyName: ApplicationStateKey = 'channels';
        const listener = jest.fn();
        expect(instance.removeListener(propertyName, listener)).toEqual(0);
        expect(instance.addListener(propertyName, listener)).toEqual(1);
        const otherListner = jest.fn();
        expect(instance.removeListener(propertyName, otherListner)).toEqual(1);
    });
    test('notifyListeners invokes registered listeners.', async () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const propertyName: ApplicationStateKey = 'subscriptionsLocalStorageKey';
        const listener = jest.fn();
        instance.addListener(propertyName, listener);
        const stateChanges: Partial<ApplicationState> = {
            subscriptionsLocalStorageKey: 'foobar',
        };
        await instance.notifyListeners(stateChanges);
        expect(listener).toHaveBeenCalled();
    });
    test('notifyListeners does not try to notify non-existent listeners.', async () => {
        const instance: StateChangeListenerMap = StateChangeListenerMap.getInstance();
        const stateChanges: Partial<ApplicationState> = {
            subscriptionsLocalStorageKey: 'foooooooboaaaar',
        };
        expect(() => instance.notifyListeners(stateChanges)).not.toThrow();
    });
});

describe('performRSSFeedChannelDataRequestResponseCycle', () => {
    const mockChannelTitle: string = 'Mock channel title';
    const mockAtomLink: string = 'https://mock/feed';
    const mockChannelDescription: string = 'Tracking the policy and politics of cannabis';
    const mockLastBuildDate: string = 'Mon, 11 Aug 2025 18:56:29 +0000';
    const mockPeriod: RSSChannelUpdatePeriod = 'hourly';
    const mockFrequency: number = 1;
    const mockTitle: string = 'Mock Title';
    const mockLink: string = 'https://mock/feed';
    const mockDescription: string = 'Mock description';
    const mockCreator: string = 'Creator Name';
    const mockAuthor: string = 'Author name';
    const mockPubDate: string = 'Mon, 11 Aug 2025 18:56:29 +0000';
    const mockCategory1: string = 'Mock category 1';
    const mockCategory2: string = 'Mock category 2';
    const mockGuid: string = 'https://www.marijuanamoment.net/marijuana-users-have-enhanced-cognitive-abilities-large-federally-funded-study-shows/';
    const mockContent: string = 'Mock content';
    const mockPostId: string = '126303';
    const mockRssFeedUrl: string = 'http://fakehost:8080/feed';
    const mockInvalidRssFeedUrl: string = 'http://invalidfakehost:8080/invalidfeed';
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
        <title>${mockChannelTitle}</title>
        <atom:link href="${mockAtomLink}" rel="self"
            type="application/rss+xml" />
        <link>https://www.marijuanamoment.net/</link>
        <description>${mockChannelDescription}</description>
        <lastBuildDate>${mockLastBuildDate}</lastBuildDate>
        <sy:updatePeriod>
            ${mockPeriod} </sy:updatePeriod>
        <sy:updateFrequency>
            ${mockFrequency} </sy:updateFrequency>
        
        <item>
            <title>${mockTitle}</title>
            <link>${mockLink}</link>
            <dc:creator><![CDATA[${mockCreator}]]></dc:creator>
            <author>${mockAuthor}</author>
            <pubDate>${mockPubDate}</pubDate>
            <category><![CDATA[${mockCategory1}]]></category>
            <category><![CDATA[${mockCategory2}]]></category>
            <guid>${mockGuid}</guid>
            <content:encoded><![CDATA[${mockContent}]]></content:encoded>
            <description><![CDATA[${mockDescription}]]></description>
            <post-id xmlns="com-wordpress:feed-additions:1">${mockPostId}</post-id>
            <empty/>
        </item>
    </channel>
    </rss>
    `;

    it('dispatches the RSS_FEED_CHANNEL_DATA_LOADED action upon successful data retrieval and parsing.', async () => {
        fetchMock.mockIf(mockRssFeedUrl, async (_request) => {
            return {
                status: 200,
                body: mockXMLDocument,
                headers: {
                    'Content-Type': 'application/xml',
                },
            };
        });
        const abortController: AbortController = new AbortController();
        const payload: RequestRSSFeedChannelDataActionPayload = {
            feedUrl: mockRssFeedUrl,
            abortSignal: abortController.signal,
        };
        const mockDispatch = jest.fn();
        const channel: RSSFeedChannel | null = await performRSSFeedChannelDataRequestResponseCycle(
            payload,
            mockDispatch,
        );
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'RSS_FEED_CHANNEL_DATA_LOADED',
            payload: {
                channel,
            },
        }));
        expect(channel).not.toBeNull();
    });
    it('dispatches the RSS_FEED_CHANNEL_DATA_PARSE_FAIL upon failed response parsing.', async () => {
        fetchMock.mockIf(mockInvalidRssFeedUrl, async (_request) => {
            return {
                status: 200,
                body: 'foobar fake invalid XML...',
                headers: {
                    'Content-Type': 'application/xml',
                },
            };
        });
        const abortController: AbortController = new AbortController();
        const payload: RequestRSSFeedChannelDataActionPayload = {
            feedUrl: mockInvalidRssFeedUrl,
            abortSignal: abortController.signal,
        };
        const mockDispatch = jest.fn();
        const channel: RSSFeedChannel | null = await performRSSFeedChannelDataRequestResponseCycle(
            payload,
            mockDispatch,
        );
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'RSS_FEED_CHANNEL_DATA_PARSE_FAIL',
            payload: {
                feedUrl: mockInvalidRssFeedUrl,
            },
        }));
        expect(channel).toBeNull();
    });
    it('dispatches the REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED action upon an aborted request.', () => {
        fetchMock.mockIf(mockInvalidRssFeedUrl, async (_request) => {
            return {
                status: 200,
                body: 'foobar fake invalid XML...',
                headers: {
                    'Content-Type': 'application/xml',
                },
            };
        });
        const abortController: AbortController = new AbortController();
        const payload: RequestRSSFeedChannelDataActionPayload = {
            feedUrl: mockInvalidRssFeedUrl,
            abortSignal: abortController.signal,
        };
        const mockDispatch = jest.fn();
        performRSSFeedChannelDataRequestResponseCycle(
            payload,
            mockDispatch,
        ).then((channel: RSSFeedChannel | null) => {
            expect(mockDispatch).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED',
                payload: {
                    feedUrl: mockInvalidRssFeedUrl,
                },
            }));
            expect(channel).toBeNull();
        });
        abortController.abort();
    });
});
