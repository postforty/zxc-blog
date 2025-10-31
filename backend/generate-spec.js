
import fs from 'fs';
import path from 'path';
import swaggerSpec from './swagger.config.js';

const dir = './dist';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.writeFileSync(path.join(dir, 'openapi.json'), JSON.stringify(swaggerSpec, null, 2));
