import React from "react";

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="bg-white p-8 rounded shadow">
                <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                <p className="text-gray-600">
                    The page you are looking for does not exist. Please check
                    the URL or navigate back to the home page.
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
