/* eslint-disable @typescript-eslint/no-unused-vars */
import {server} from './lib/server';
server.listen(1883, () => {
  console.log("server created");
});