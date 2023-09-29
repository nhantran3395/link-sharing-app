import { createServer } from './server';
import { CONFIGS } from './configs';

const server = createServer();
const port = CONFIGS.PORT;

server.listen(port, () => {
	console.log(`server listening on ${port}`);
});
