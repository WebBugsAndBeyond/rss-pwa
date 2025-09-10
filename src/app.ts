import { RSSFeedChannel, loadRSSFeedChannelData, parseRSSFeedResponseText, initializeRSSFeedChannel } from "./rss";
import { filterDifferentObjectProperties } from "./utils";

/**
 * RSSFeedSubscription objects are stored in local storage to persist
 * the RSS feeds that the user has aggregated. The lastBuildDate,
 * and nextBuildDate are used to calculate when the next time that an
 * update can be expected to be available.
 */
export type RSSFeedSubscription = {
    feedUrl: string;
    lastBuildDate?: Date;
    nextBuildDate?: Date;
}

/**
 * Structure of the RSSFeedSubscription that is serialized,
 * and de-serialized into / from local storage.
 */
export type SerializedRSSFeedSubscription = {
    feedUrl: string;
    lastBuildDate?: string;
    nextBuildDate?: string;
}

/**
 * This string is used as they item key for storing/retrieving the user's
 * subscriptions to / from local storage.
 */
export const RSSSubscriptionsLocalStorageKey: string = 'RSSSubscriptionsLocalStorageKey';

/**
 * Application state source of truth. Evolves via a dispatch / reduce procedure.
 * @see {applicationStateReducer}
 */
export type ApplicationState = {
    subscriptionsLocalStorageKey: string;
    subscriptions: RSSFeedSubscription[];
    channels: RSSFeedChannel[];
}

export type StateChangeAction = {
    type: string;
    payload?: unknown;
}

/**
 * Rerturns a new ApplicationState object with default values with optional overrides.
 * @param overrides 
 * @returns 
 */
export function initializeApplicationState(overrides?: Partial<ApplicationState>): ApplicationState {
    const state: ApplicationState = {
        subscriptionsLocalStorageKey: RSSSubscriptionsLocalStorageKey,
        subscriptions: [],
        channels: [],
    };
    if (overrides) {
        return {
            ...state,
            ...overrides,
        };
    }
    return state;
}

/**
 * Returns the latest serialized subscriptions state from local storage.
 * @param subscriptionsItemKey 
 * @returns 
 */
export function loadSubscriptionsFromLocalStorage(subscriptionsItemKey: string): RSSFeedSubscription[] {
    
    const serializedData: string | null = window.localStorage.getItem(subscriptionsItemKey);
    if (serializedData) {
        const parsedData: SerializedRSSFeedSubscription[] = JSON.parse(serializedData) as SerializedRSSFeedSubscription[];
        const parsedSubscriptions: RSSFeedSubscription[] = parsedData.map((parsedSubscription: SerializedRSSFeedSubscription) => {
            let lastBuildDate: Date | undefined = undefined;
            if (typeof parsedSubscription.lastBuildDate === 'string' && parsedSubscription.lastBuildDate?.trim?.() !== '') {
                lastBuildDate = new Date(parsedSubscription.lastBuildDate);
                if (lastBuildDate.toString().toLowerCase() === 'invalid date' || isNaN(lastBuildDate.valueOf())) {
                    lastBuildDate = undefined;
                }
            }
            let nextBuildDate: Date | undefined = undefined;
            if (typeof parsedSubscription.nextBuildDate === 'string' && parsedSubscription.nextBuildDate?.trim?.() !== '') {
                nextBuildDate = new Date(parsedSubscription.nextBuildDate);
                if (nextBuildDate.toString().toLowerCase() === 'invalid date' || isNaN(nextBuildDate.valueOf())) {
                    nextBuildDate = undefined;
                }
            }
            return {
                feedUrl: parsedSubscription.feedUrl,
                lastBuildDate,
                nextBuildDate,
            };
        });
        return parsedSubscriptions;
    }
    return [];
}

/**
 * Defines the shape of the payload value for the REQUEST_RSS_FEED_CHANNEL_DATA action.
 * @property {string} feedUrl The URL of the RSS feed to request.
 * @property {AbortSignal} abortSignal Abort signal to provide to the fetch request to potentially interrupt the request.
 */
export type RequestRSSFeedChannelDataActionPayload = {
    feedUrl: string;
    abortSignal: AbortSignal;
}

/**
 * Defines the shape of the REQUEST_RSS_FEED_CHANNEL_DATA action.
 */
export type RequestRSSFeedChannelDataAction = StateChangeAction & {
    payload: RequestRSSFeedChannelDataActionPayload;
}

/**
 * Defines the shape of the payload value for the RSS_FEED_CHANNEL_LOADED action.
 * @property {RSSFeedChannel} channel The results of parsing the RSS XML document.
 */
export type RSSFeedChannelLoadedActionPayload = {
    channel: RSSFeedChannel;
}

/**
 * Defines the shape of the RSS_FEED_CHANNEL_LOADED action.
 */
export type RSSFeedChannelLoadedAction = StateChangeAction & {
    payload: RSSFeedChannelLoadedActionPayload;
}

/**
 * Defines the shape of the payload value for the REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED action.
 * @property {string} feedUrl The URL of the RSS feed whose request has been aborted.
 */
export type RequestRSSFeedChannelDataAbortedPayload = {
    feedUrl: string;
}

/**
 * Defines the shape of the REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED action.
 */
export type RequestRSSFeedChannelDataAborted = StateChangeAction & {
    payload: RequestRSSFeedChannelDataAbortedPayload;
}


/**
 * Perform an abortable network request for the RSS XML data.
 * The data is parsed into a resulting RSSFeedChannel object.
 * If this process succeeds then the follow up RSS_FEED_CHANNEL_DATA_LOADED
 * action is dispatched, and the returned Promise is resolved with the
 * channel data (useful for testing). If this process fails, or is aborted
 * then the REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED action is dispatched,
 * and the returned Promise is resolved with null.
 * @param payload Feed URL, and request abort signal values.
 * @param dispatch Function to dispatch the resulting actions.
 * @returns Promise resolved with the parsed channel data on success, or null on failure / abort.
 */
export async function performRSSFeedChannelDataRequestResponseCycle(
    payload: RequestRSSFeedChannelDataActionPayload,
    dispatch: (action: RSSFeedChannelLoadedAction | RequestRSSFeedChannelDataAborted) => void,
): Promise<RSSFeedChannel | null> {
    try {
        const xmlText = await loadRSSFeedChannelData(
            payload.feedUrl,
            payload.abortSignal
        );
        const channel: RSSFeedChannel | null = parseRSSFeedResponseText(xmlText);
        if (channel !== null) {
            dispatch({
                type: 'RSS_FEED_CHANNEL_DATA_LOADED',
                payload: {
                    channel,
                },
            });
            return channel;
        } else {
            dispatch({
                type: 'RSS_FEED_CHANNEL_DATA_PARSE_FAIL',
                payload: {
                    feedUrl: payload.feedUrl,
                },
            });
        }
    } catch (error) {
        dispatch({
            type: 'REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED',
            payload: {
                feedUrl: payload.feedUrl,
            },
        });
    }
    return null;
}

/**
 * Application state reducer. Single function where the application state is modified in response
 * to dispatched state change actions.
 * @param state 
 * @param action 
 * @returns 
 */
export function applicationStateReducer(state: ApplicationState, action: StateChangeAction): ApplicationState {
    switch (action.type) {
        case 'INITIALIZE_DEFAULT_STATE':
            return initializeApplicationState(state);
        case 'LOAD_SUBSCRIPTIONS_FROM_LOCAL_STORAGE':
            return initializeApplicationState({
                subscriptions: loadSubscriptionsFromLocalStorage(state.subscriptionsLocalStorageKey),
            });
        case 'REQUEST_RSS_FEED_CHANNEL_DATA':
            // performRSSFeedChannelDataRequestResponseCycle(
            //     (action as RequestRSSFeedChannelDataAction).payload,
            //     Application.getInstance().dispatch,
            // );

            if (state.channels?.length > 0) {
                const { payload : { feedUrl } } = (action as RequestRSSFeedChannelDataAction);
                const existingChannel: RSSFeedChannel | undefined = state.channels.find(
                    channel => channel.atomLink === feedUrl,
                );
                if (existingChannel) {
                    const filteredChannels: RSSFeedChannel[] = state.channels.filter(channel => channel !== existingChannel);
                    return initializeApplicationState({
                        channels: [...filteredChannels, initializeRSSFeedChannel({ ...existingChannel, loading: true })],
                    });
                } else {
                    const newChannelBeingRequested: RSSFeedChannel = initializeRSSFeedChannel({
                        atomLink: feedUrl,
                        loading: true,
                    });
                    return initializeApplicationState({
                        ...state,
                        channels: [ ...state.channels, newChannelBeingRequested ],
                    });
                }
            }
            return initializeApplicationState({
                ...state,
                channels: [
                    initializeRSSFeedChannel({
                        atomLink: (action as RequestRSSFeedChannelDataAction).payload.feedUrl,
                        loading: true,
                    }),
                ],
            });
        case 'REQUEST_RSS_FEED_CHANNEL_DATA_ABORTED':
            if (state.channels?.length) {
                const payload: RequestRSSFeedChannelDataAbortedPayload = (action as RequestRSSFeedChannelDataAborted).payload;
                const existingChannel: RSSFeedChannel | undefined = state.channels.find(channel => channel.atomLink === payload.feedUrl);
                const filteredChannels: RSSFeedChannel[] = state.channels.filter(channel => channel !== existingChannel);
                const updatedChannels: RSSFeedChannel[] = [
                    ...filteredChannels,
                    initializeRSSFeedChannel({ atomLink: existingChannel?.atomLink, loading: false }),
                ];
                return initializeApplicationState({ channels: updatedChannels });
            }
            return state;

        case 'RSS_FEED_CHANNEL_DATA_LOADED':
            if (state.channels?.length > 0) {
                const payload: RSSFeedChannelLoadedActionPayload = (action as RSSFeedChannelLoadedAction).payload;
                const filteredChannels: RSSFeedChannel[] = state.channels.filter(channel => channel.atomLink !== action.payload);
                const updatedChannels: RSSFeedChannel[] = [
                    ...filteredChannels,
                    payload.channel,
                ];
                return initializeApplicationState({ channels: updatedChannels });
            } else {
                const payload: RSSFeedChannelLoadedActionPayload = (action as RSSFeedChannelLoadedAction).payload;
                return initializeApplicationState({ channels: [payload.channel] });
            }
        default:
            return state;
    }
}

export type ApplicationStateKey = keyof ApplicationState;
export type ApplicationStateChangeListener = (stateKey: ApplicationStateKey, newValue: unknown) => Promise<void>;

/**
 * The StateChangeListenerMap maintains a mapping of ApplicationState property names to callback functions
 * that can be notified when ApplicationState property values change.
 * StateChangeListenerMap is implemented as a singleton.
 * 
 * @see {ApplicationState}
 * @see {Application}
 */
export class StateChangeListenerMap {

    /**
     * Singleton instance.
     */
    private static instance: StateChangeListenerMap;

    /**
     * Key / value pairs of property names -> callback functions to be notified.
     */
    private listenerMap: Partial<Record<ApplicationStateKey, ApplicationStateChangeListener[]>>;

    private constructor() {
        this.listenerMap = {};
    }

    /**
     * Create / return the singleton instance.
     * @returns Singleton instance
     */
    public static getInstance(): StateChangeListenerMap {
        if (!this.instance) {
            this.instance = new StateChangeListenerMap();
        }
        return this.instance;
    }

    /**
     * Register a new listener callback for a specified property.
     * If the specified listener is already present in the map then it is not added as a duplicate.
     * @param stateProperty 
     * @param listener 
     * @returns Returns the number of listeners registered for the state property indicated by stateProperty after the new addition.
     */
    public addListener(stateProperty: ApplicationStateKey, listener: ApplicationStateChangeListener): number {
        if (!Array.isArray(this.listenerMap[stateProperty])) {
            this.listenerMap[stateProperty] = [];
        } else {
            const existingListener: ApplicationStateChangeListener | undefined = this.listenerMap[stateProperty].find(l => l === listener);
            if (existingListener) {
                return this.listenerMap[stateProperty].length;
            }
        }
        this.listenerMap[stateProperty].push(listener);
        return this.listenerMap[stateProperty].length;
    }

    /**
     * Remove a listener callback function for the specified property.
     * @param stateProperty 
     * @param listener 
     * @returns Returns the number of listeners registered for the specified property after the removal.
     */
    public removeListener(stateProperty: ApplicationStateKey, listener: ApplicationStateChangeListener): number {
        if (Array.isArray(this.listenerMap[stateProperty])) {
            const listenerIndex: number = this.listenerMap[stateProperty].findIndex(mappedListener => listener === mappedListener);
            if (listenerIndex > -1) {
                this.listenerMap[stateProperty].splice(listenerIndex, 1);
            }
            return this.listenerMap[stateProperty].length;
        }
        return 0;
    }

    /**
     * Removes all registered listeners for all properties.
     * @returns Returns zero.
     */
    public resetListeners(): number {
        this.listenerMap = {};
        return Object.keys(this.listenerMap).length;
    }

    /**
     * Notify the property change listeners for the properties defined in the stateChanges argument.
     * Since stateChanges is a Partial of ApplicationState this function fires the listeners for
     * only the properties that are defined as having been changed, or all of them if every possible
     * property of ApplicationState is present in stateChange.
     * @param stateChanges 
     * @returns The returned Promise is resolved with void after having awaited for each registered listener.
     */
    public async notifyListeners(stateChanges: Partial<ApplicationState>): Promise<void> {
        const keys: ApplicationStateKey[] = Object.keys(stateChanges) as ApplicationStateKey[];
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const prop: unknown = stateChanges[key];
            const listeners: ApplicationStateChangeListener[] | undefined = this.listenerMap[key];
            if (listeners) {
                for (let j = 0; j < listeners.length; ++j) {
                    await listeners[j](keys[i], prop);
                }
            }
        }
    }
}

export class Application {

    private static instance: Application;

    private state: ApplicationState;

    private constructor() {
        this.state = initializeApplicationState();
    }

    public dispatch<ActionType extends StateChangeAction>(action: ActionType): void {
        const reducedState: ApplicationState = applicationStateReducer(
            this.state,
            action,
        );
        const changedFields: Partial<ApplicationState> = filterDifferentObjectProperties(
            this.state,
            reducedState,
        );
        StateChangeListenerMap.getInstance().notifyListeners(changedFields);
    }

    /**
     * Return the singleton instance.
     * @returns 
     */
    public static getInstance(): Application {
        if (!this.instance) {
            this.instance = new Application();
        }
        return this.instance;
    }
}
