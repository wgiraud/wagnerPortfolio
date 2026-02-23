import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function startApp(): Promise<void> {
  try {
    await bootstrapApplication(AppComponent, appConfig);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('needs to be compiled using the JIT compiler')) {
      await import('@angular/compiler');
      await bootstrapApplication(AppComponent, appConfig);
      return;
    }

    throw error;
  }
}

startApp().catch((err) => console.error(err));
