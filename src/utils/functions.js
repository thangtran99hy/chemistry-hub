export const getFileExtension = (filename) => {
    const parts = filename.split('.');
    if (parts.length > 1) {
        return parts.pop().toLowerCase();
    }
    return '';
}
