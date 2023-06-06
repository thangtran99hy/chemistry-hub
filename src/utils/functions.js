export const getFileExtension = (filename) => {
    const parts = filename.split(".");
    if (parts.length > 1) {
        return parts.pop().toLowerCase();
    }
    return "";
};

export const handleDownload = async (url, fileName) => {
    const response = await fetch(url);
    const data = await response.blob();

    const blob = new Blob([data]);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

export const extractVideoId = (url) => {
    if (!url) return null;
    var match = url.match(
        /(?:youtube.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu.be\/|ytcroxxCATY(?=\/))([\w-]{11})/
    );
    return (match && match[1]) || null;
};

export const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
