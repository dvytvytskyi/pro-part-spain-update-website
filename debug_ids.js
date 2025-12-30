const { getFilterOptions } = require('./src/api/client'); // This won't work in node directly without polyfills usually, but let's try a direct fetch script.
// Actually, better to just use curl to get the options and parse with jq.
