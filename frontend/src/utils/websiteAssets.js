export const getWebsiteHostname = (url) => {
    try {
        return new URL(url).hostname;
    } catch {
        return "";
    }
};

export const getFaviconUrl = (url) => {
    const hostname = getWebsiteHostname(url);

    if (!hostname) {
        return "";
    }

    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
};
