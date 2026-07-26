/* eslint-disable no-undef */
import Logger from './Logger';
import loadPostAffiliate from './scripts/postAffiliatePro';

function trackSignup({ action, campaignId, email, fname }) {
  if (typeof PostAffTracker === 'undefined') return;
  Logger.debug('Track signup PostAffiliatePro', {
    action,
    campaignId,
    email,
    fname,
  });
  let papAction = 'signup';
  let papCampaign = '11111111';
  if (campaignId) {
    papCampaign = campaignId;
  }
  if (action) {
    papAction = action;
  }
  const sale = PostAffTracker?.createAction(papAction);
  sale.setCampaignID(papCampaign);
  sale.setOrderID(email);
  sale.setProductID('signup');
  sale.setTotalCost('0');
  sale.setData1(email);
  sale.setData2(fname);
  PostAffTracker.register();
  Logger.debug('Tracked signup PostAffiliatePro', {
    papAction,
    papCampaign,
    email,
    fname,
  });
}

function trackTrialStart({ action, campaignId, email, fname }) {
  if (typeof PostAffTracker === 'undefined') return;
  Logger.debug('Track trial start PostAffiliatePro', {
    action,
    campaignId,
    email,
    fname,
  });
  let papAction = 'startTrial';
  let papCampaign = '11111111';
  if (campaignId) {
    papCampaign = campaignId;
  }
  if (action) {
    papAction = action;
  }
  const sale = PostAffTracker?.createAction(papAction);
  sale.setCampaignID(papCampaign);
  sale.setOrderID(email);
  sale.setProductID('startTrial');
  sale.setTotalCost('0');
  sale.setData1(email);
  sale.setData2(fname);
  PostAffTracker.register();
  Logger.debug('Tracked trial start PostAffiliatePro', {
    action,
    campaignId,
    email,
    fname,
  });
}

function init() {
  Logger.debug('Initializing PostAffiliatePro');
  loadPostAffiliate(() => {
    Logger.debug('Initialized PostAffiliatePro');
    PostAffTracker.setAccountId('default1');
    try {
      PostAffTracker.track();
    } catch (error) {
      Logger.error('Failed to fetch post tracker', { error });
    }
  });
}

const PostAffiliatePro = {
  init,
  trackSignup,
  trackTrialStart,
};

export default PostAffiliatePro;
