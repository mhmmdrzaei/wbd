import {aboutPageType} from './aboutPage';
import {eventType} from './event';
import {homePageType} from './homePage';
import {pageType} from './page';
import {seoType} from './objects/seo';
import {shippingRateType} from './objects/shippingRate';
import {siteMenuItemType} from './objects/siteMenuItem';
import {videoEmbedType} from './objects/videoEmbed';
import {projectType} from './project';
import {shippingSettingsType} from './shippingSettings';
import {shopPageType} from './shopPage';
import {shopProductType} from './shopProduct';
import {siteSettingsType} from './siteSettings';

export const schemaTypes = [
  seoType,
  shippingRateType,
  siteMenuItemType,
  videoEmbedType,
  homePageType,
  siteSettingsType,
  projectType,
  eventType,
  pageType,
  shopPageType,
  shippingSettingsType,
  shopProductType,
  aboutPageType
];
