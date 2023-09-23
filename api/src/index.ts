import { createServer } from './server.ts';
import { CONFIGS } from './configs.ts';

const server = createServer();
const port = CONFIGS.PORT;

server.listen(port, () => {
	console.log(`server listening on ${port}`);
});
