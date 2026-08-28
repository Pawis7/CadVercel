import { Controller } from '@nestjs/common';

/**
 * AppController vacío — no expone ningún endpoint en la raíz.
 * Los endpoints de la aplicación están bajo el prefijo /api (configurado en main.ts).
 */
@Controller()
export class AppController {}
