export const formatRelativeTime = (value) => {
    if (!value) {
        return "Not yet";
    }

    const date = new Date(value);
    const diffInSeconds = Math.round((Date.now() - date.getTime()) / 1000);
    const absoluteTime = new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);

    if (Number.isNaN(diffInSeconds)) {
        return "Not yet";
    }

    if (diffInSeconds < 10) {
        return "Just now";
    }

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.round(diffInSeconds / 60);

    if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.round(diffInMinutes / 60);

    if (diffInHours < 24) {
        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    const diffInDays = Math.round(diffInHours / 24);

    if (diffInDays === 1) {
        return "Yesterday";
    }

    if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    }

    return absoluteTime;
};
