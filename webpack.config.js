module.exports = {
    // other configuration options...

    module: {
        rules: [
            // other rules...

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
};
