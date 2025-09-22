import serverless from "serverless-http";

import app from "./server.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = serverless(app);

export { handler };

export default handler;
