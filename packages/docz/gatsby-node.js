exports.onCreateBabelConfig = ({ actions }) => {
    actions.setBabelPlugin({
        name:  `@babel/plugin-transform-typescript`,
        options: {
            allowDeclareFields: true,
        },
    })
}