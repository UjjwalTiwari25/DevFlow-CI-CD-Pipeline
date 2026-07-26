import { test as base } from '@playwright/test';

async function applyExperiments(context, experiments) {
  if (!Array.isArray(experiments) || experiments.length === 0) return;
  await context.addInitScript((exps) => {
    exps.forEach(({ name, value }) => {
      window.localStorage.setItem(name, JSON.stringify({ chosen: value }));
    });
  }, experiments);
}

export const test = base.extend({
  setExperiments: async ({ context }, use) => {
    await use((experiments) => applyExperiments(context, experiments));
  },
  applyProjectExperiments: [
    async ({ context }, use, testInfo) => {
      await applyExperiments(context, testInfo.project.metadata?.experiments);
      await use();
    },
    { auto: true },
  ],
  getAssignedExperimentValue: async ({ page }, use) => {
    await use(async (expName) => {
      await page
        .waitForFunction(
          () => !!window.store?.getState()?.experiments?.chosen,
          {
            timeout: 15000,
          }
        )
        .catch(() => {});
      return page.evaluate(
        (expKey) =>
          window.store?.getState()?.experiments?.chosen?.[expKey] ?? null,
        expName
      );
    });
  },
});
export { expect } from '@playwright/test';
