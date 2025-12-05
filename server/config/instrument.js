// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
// const Sentry = require("@sentry/node");
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://ee59ed05292faded6938319918ae1a35@o4510481076256768.ingest.de.sentry.io/4510481083334736",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

export default Sentry
