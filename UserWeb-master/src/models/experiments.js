import axios from 'axios';
import Auth from '@/services/Auth';
import Analytics from '../services/Analytics';
import LocalStorage from '../services/LocalStorage';
import Logger from '../services/Logger';
import { isOrganicUser } from './user';
import FirebaseDatabase from '../services/FirebaseDatabase';
import config from '../config';
import { notifyAPIError } from '../services/ErrorMonitoring';

async function getAllExperiments() {
  try {
    const value = await FirebaseDatabase.getValue('/experiments');
    if (value) {
      return value;
    }
  } catch (error) {
    Logger.error('Error fetching experiments', { error });
  }
  return null;
}

async function getActiveBackEndExperiments() {
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/experiments/list`,
      data: {
        activeOnly: true,
        targetOnboarding: true,
        limit: 0,
      },
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, {
      message: 'Failed to list active back-end experiments',
    });
  }
  return null;
}

function saveChosenExperimentsToAnalytics(chosenExp) {
  if (!chosenExp || !Object.keys(chosenExp).length) {
    return;
  }
  const mpObject = {};
  Object.keys(chosenExp).forEach((key) => {
    const localValue = LocalStorage.getItem(key);
    // Check if experiment was chosen previously
    if (localValue && localValue.chosen) {
      // Only save to Analytics if experiment was chosen for user
      mpObject[`Experiment: ${key}`] = chosenExp[key];
    }
  });
  Analytics.setSuperProperties(mpObject);
  Analytics.setPeopleProperties(mpObject);
}

function saveExperiments(chosenExp, id) {
  Logger.debug('Save chosen experiments', { chosenExp });
  if (!chosenExp || !Object.keys(chosenExp).length) {
    return;
  }
  if (id && !!Auth.getCurrentUser()) {
    FirebaseDatabase.updateValue(`users/${id}/experiments`, chosenExp).catch(
      (err) =>
        Logger.error('error updating user experiments', { code: err.code })
    );
  }
  const mpObject = {};
  Object.keys(chosenExp).forEach((key) => {
    mpObject[`Experiment: ${key}`] = chosenExp[key];
    LocalStorage.setItem(key, {
      chosen: chosenExp[key],
    });
  });
  Analytics.setSuperProperties(mpObject);
  Analytics.setPeopleProperties(mpObject);
}

function chooseExperimentValue(
  experiment,
  profile,
  attributionData,
  { appLocale }
) {
  let result = null;
  if (!experiment) return result;
  const {
    id: expName,
    targetPlatform,
    targetLocale,
    targetTrafficSource,
    active,
    preAssignedValue,
  } = experiment;
  const localValue = LocalStorage.getItem(expName);
  // if target platform does not match return
  if (targetPlatform && !targetPlatform.includes('web')) {
    return result;
  }
  // if target locale does not match return
  if (targetLocale) {
    if (!appLocale) {
      Logger.warn(
        `Locale not passed for locale specific experiment ${expName}`,
        { targetLocale, appLocale }
      );
      return result;
    }
    if (!targetLocale.split('|').includes(appLocale)) {
      return result;
    }
  }
  // if target traffic source does not match return
  if (targetTrafficSource) {
    if (!profile && !attributionData) {
      return result;
    }
    if (
      targetTrafficSource === 'organic' &&
      !isOrganicUser(profile || { attributionData })
    ) {
      return result;
    }
    if (
      targetTrafficSource === 'paid' &&
      isOrganicUser(profile || { attributionData })
    ) {
      return result;
    }
  }
  // if experiment active
  if (active && active.length > 1) {
    // if user already chosen, use that
    if (profile && profile.experiments && profile.experiments[expName]) {
      Logger.debug(
        `Experiment ${expName} already chosen in profile: ${profile.experiments[expName]}`
      );
      result = { result: profile.experiments[expName] };
    } else if (preAssignedValue) {
      Logger.debug(
        `Experiment ${expName} already chosen in UTM experiments: ${preAssignedValue}`
      );
      result = { result: preAssignedValue, chosen: preAssignedValue };
    } else if (localValue && localValue.chosen) {
      // if experiment already saved in local storage
      Logger.debug(
        `Experiment ${expName} already chosen in local storage: ${localValue.chosen}`
      );
      result = { chosen: localValue.chosen, result: localValue.chosen };
    } else {
      // if experiment not already chosen, choose a random one and save
      const choices = [];
      let i = 0;
      for (i = 0; i < active.length; i++) {
        choices.push(active.charAt(i));
      }
      const chosenValue = choices[Math.floor(Math.random() * choices.length)];
      result = { chosen: chosenValue, result: chosenValue };
      Logger.debug(`Experiment ${expName} assigned: `, result);
    }

    // if experiment ended
  } else {
    // Logger.debug(`Experiment ${expName} ended`);
    result = { result: active };
  }
  return result;
}

function chooseExperiments(
  experiments,
  expNames,
  profile,
  id,
  attributionData, // Used to assign targeted traffic experiments when profile is not available (onboarding experiments)
  { appLocale, preAssignedExperiments = {} } = {}
) {
  const results = {}; // Stores results for all the experiments
  const chosen = {}; // Stores experiments that were explicitly chosen for users and not experiments that have turned off or present previously in user profile
  if (
    experiments &&
    Object.keys(experiments).length &&
    expNames &&
    expNames.length
  ) {
    expNames.forEach((expName) => {
      const exp = experiments[expName];
      const preAssignedValue = preAssignedExperiments[expName];
      if (exp) {
        const value = chooseExperimentValue(
          { ...exp, id: expName, preAssignedValue },
          profile,
          attributionData,
          { appLocale }
        );
        if (!value) return;
        const { result, chosen: chosenValue } = value;
        results[expName] = result;
        if (chosenValue) {
          chosen[expName] = chosenValue;
        }
      }
    });
  }
  saveExperiments(chosen, id);
  return results;
}

function chooseExperimentsList(
  experiments,
  profile,
  id,
  attributionData, // Used to assign targeted traffic experiments when profile is not available (onboarding experiments)
  { appLocale } // used to assign locale specific experiments
) {
  const results = {}; // Stores results for all the experiments
  const chosen = {}; // Stores experiments that were explicitly chosen for users and not experiments that have turned off or present previously in user profile
  if (experiments && experiments.length) {
    experiments.forEach((experiment) => {
      if (experiment && experiment.id) {
        const { id: expName } = experiment;
        const value = chooseExperimentValue(
          experiment,
          profile,
          attributionData,
          { appLocale }
        );
        if (!value) return;
        const { result, chosen: chosenValue } = value;
        results[expName] = result;
        if (chosenValue) {
          chosen[expName] = chosenValue;
        }
      }
    });
  }
  saveExperiments(chosen, id);
  return results;
}

// Resolve the yearly-price variant for a user (PROD-2762), in priority order:
//   1. `webYearlyPriceVariant` — the per-user flag the web checkout persisted;
//      honor it so the price matches what the user saw on web.
//   2. `experiments.mobileYearlyPricing` — the per-user assignment the Aura
//      mobile app persisted to `users/{id}/experiments/mobileYearlyPricing`.
//   3. `globalActive` — the `active` value of the `/experiments/mobileYearlyPricing`
//      RTDB node, but ONLY when it is a single forced variant (e.g. "a"). This
//      covers experiment wind-down: when the winner is rolled out by setting
//      `active` to one letter, users who were never individually bucketed still
//      get that price. It mirrors what the native app's ExperimentHelper does
//      for an ended experiment (`results[exp] = exp.active`).
//
// The single-letter guard is deliberate: a live split ("abc") is NEVER read
// here, so the webview never self-assigns or diverges from the native paywall —
// during a live experiment it relies purely on the per-user values above. The
// live `experiments.webYearlyPricing` assignment is likewise never read (per
// Rohan via Farhan, Slack 2026-07-02/07: the live field disappears once the
// experiment ends, whereas the persisted flag stays; tried in PR #2243 and
// rejected).
function getWebYearlyPricingVariant(user, globalActive) {
  const forcedVariant =
    typeof globalActive === 'string' && globalActive.length === 1
      ? globalActive
      : null;
  return (
    user?.webYearlyPriceVariant ||
    user?.experiments?.mobileYearlyPricing ||
    forcedVariant
  );
}

// Pure reader for the auraPaywallCTAPosition experiment. Mirrors native's
// chooseExperimentValue semantics: when the global `active` is a single letter
// the experiment is "forced" to that winner and applies to everyone regardless
// of any per-user assignment (native's `else { result = active }` branch). When
// `active` has >1 char the experiment is live, so fall back to the per-user
// value the mobile app persisted to users/<id>/experiments. The webview never
// self-assigns. Variant 'a' relocates the CTA to the paywall bottom.
function getPaywallCTAPositionVariant(user, globalActive) {
  if (typeof globalActive === 'string' && globalActive.length === 1) {
    return globalActive;
  }
  return user?.experiments?.auraPaywallCTAPosition || null;
}

export {
  getActiveBackEndExperiments,
  getAllExperiments,
  chooseExperiments,
  chooseExperimentsList,
  saveExperiments,
  saveChosenExperimentsToAnalytics,
  getWebYearlyPricingVariant,
  getPaywallCTAPositionVariant,
};
