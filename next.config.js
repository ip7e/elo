const { withPlausibleProxy } = require("next-plausible")

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy({})

console.log(nextConfig)
module.exports = nextConfig
