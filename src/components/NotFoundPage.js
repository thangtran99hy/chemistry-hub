import React from "react";

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center bg-gray-200 h-full">
            <div className="bg-white p-8 rounded shadow">
                <h1 className="text-3xl font-bold mb-4">Không tìm thấy trang</h1>
                <p className="text-gray-600">
                    Trang bạn đang tìm kiếm không tồn tại.
                    Hãy kiểm tra URL hoặc điều hướng trở lại trang chủ.
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
