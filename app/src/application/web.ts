import { swaggerSpec } from '../config/swagger';
import { errorMiddleware } from '../middleware/error-middleware';
import { securityHeaderMiddleware } from '../middleware/security-header-middleware';
import { privateRouter } from '../route/private-api';
import { publicRouter } from '../route/public-api';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

export const web = express();

web.disable('x-powered-by');
web.set('trust proxy', 1);
web.use(securityHeaderMiddleware);
web.use(cors());
web.use(express.json()); // Memproses JSON
web.use(express.urlencoded({ extended: false })); // Memproses URL-encoded data
web.use(publicRouter);
web.use(privateRouter);

// Swagger hanya boleh aktif di non-production dan jika flag
// SWAGGER_ENABLED=true. Dua lapis agar dokumentasi tidak pernah bocor ke
// environment production meskipun flag sempat menyala di file env.
if (
  process.env.NODE_ENV !== 'production' &&
  process.env.SWAGGER_ENABLED === 'true'
) {
  web.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'PreciFood API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );

  // Serve raw OpenAPI JSON spec
  web.get('/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

web.use(errorMiddleware);
