export const getFileExtension = (filename) => {
    const parts = filename.split(".");
    if (parts.length > 1) {
        return parts.pop().toLowerCase();
    }
    return "";
};

export const handleDownload = (url, fileName) => {
    console.log("fileName", fileName);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const extractVideoId = (url) => {
    if (!url) return null;
    var match = url.match(/(?:youtube.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu.be\/|ytcroxxCATY(?=\/))([\w-]{11})/);
    return (match && match[1]) || null;
}