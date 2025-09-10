import { RSSChannelUpdatePeriod } from "../../src/rss";

export const mockChannelTitle: string = 'Mock channel title';
export const mockAtomLink: string = 'https://mock/feed';
export const mockChannelDescription: string = 'Tracking the policy and politics of cannabis';
export const mockLastBuildDate: string = 'Mon, 11 Aug 2025 18:56:29 +0000';
export const mockPeriod: RSSChannelUpdatePeriod = 'hourly';
export const mockFrequency: number = 1;
export const mockTitle: string = 'Mock Title';
export const mockLink: string = 'https://mock/feed';
export const mockDescription: string = 'Mock description';
export const mockCreator: string = 'Creator Name';
export const mockAuthor: string = 'Author name';
export const mockPubDate: string = 'Mon, 11 Aug 2025 18:56:29 +0000';
export const mockCategory1: string = 'Mock category 1';
export const mockCategory2: string = 'Mock category 2';
export const mockGuid: string = 'https://www.marijuanamoment.net/marijuana-users-have-enhanced-cognitive-abilities-large-federally-funded-study-shows/';
export const mockContent: string = 'Mock content';
export const mockPostId: string = '126303';
export const fake1: string = 'fake1';
export const fake2: string = 'fake2';
export const mockXMLDocument: string = `<?xml version="1.0" encoding="UTF-8"?>
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
        <atom:fake>${fake1}</atom:fake>
        <atom:fake>${fake2}</atom:fake>
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