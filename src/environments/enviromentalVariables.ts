export const environmentVariables = {
    themeType: 1,
    envApi: {
        staging: {
            apiEndPoint: 'https://mobilatyapi-staging.el-dokan.com/api',
            checkoutUrl: "https://mobilaty-staging.el-dokan.com",
        },
        prod: {
            apiEndPoint: 'https://mobilatyapi.el-dokan.com/api',
            checkoutUrl: "https://www.mobilaty.com",
        },
        prod2: {
            apiEndPoint: 'https://mobilatyapi-prod.el-dokan.com/api',
            checkoutUrl: "https://www.mobilaty.com",
        },
        env: {
            apiEndPoint: 'https://mobilatyapi-staging.el-dokan.com/api',
            checkoutUrl: 'https://mobilaty.el-dokan.com',
        },
    },
    brandRelatedVariables: {
        brand: 'Mobilaty',
        brandArabic: 'موبيلاتي',
        branchType: 'mobilaty',
        email: 'online@mobilaty.com',
        hotline: '19853',
        loginApi: 'http://mobilaty-staging.el-dokan.com/session/signin?disabled_guard=true&token'
    },
};