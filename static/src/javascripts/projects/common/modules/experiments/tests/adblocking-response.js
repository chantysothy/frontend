define([
    'common/utils/$',
    'common/utils/config',
    'common/utils/detect',
    'common/utils/storage',
    'lodash/collections/contains',
    'common/modules/commercial/user-features',
    'common/modules/commercial/survey/survey-adblock',
    'common/utils/cookies'
], function (
    $,
    config,
    detect,
    storage,
    contains,
    userFeatures,
    SurveyAdBlock,
    cookies
) {
    return function () {
        this.id = 'AdBlockingResponse';
        this.start = '2016-08-17';
        this.expiry = '2016-10-18';
        this.author = 'Justin Pinner';
        this.description = 'Adblocking response ZERO PERCENT TEST WITH 30 MINUTES GRACE';
        this.audience = 0;
        this.audienceOffset = 0;
        this.successMeasure = 'Adblocking users white-list the Guardian domain';
        this.audienceCriteria = 'Chrome desktop users with active adblocking software';
        var variantDataLinkNames = [
            ['adblock whitelist no-close'],
            ['adblock supporter no-close'],
            ['adblock subscriber no-close'],
            ['adblock whitelist immediate-close'],
            ['adblock supporter immediate-close'],
            ['adblock subscriber immediate-close'],
            ['adblock whitelist delayed-close'],
            ['adblock supporter delayed-close'],
            ['adblock subscriber delayed-close'],
            ['survey adblock delayed-dismissed'],
            ['survey adblock immediate-dismissed']
        ].map(function(_) {
            return _[0];
        }).join(', ');
        this.dataLinkNames = 'adblock response overlay: '+variantDataLinkNames+', subscriber number page: user help email';
        this.idealOutcome = 'After whitelisting our ads, former ad-blocking users will not re-block them';

        this.canRun = function () {
            return contains('chrome', detect.getUserAgent.browser.toLowerCase())
                && contains(['desktop', 'leftCol', 'wide'], detect.getBreakpoint())
                && config.page.edition === 'UK'
                && !cookies.get('gu_abm_x');
        };

        var isQualified = function () {
            return !config.page.isFront &&
                !config.page.shouldHideAdverts &&
                !userFeatures.isPayingMember() &&
                config.page.webTitle !== 'Subscriber number form' &&
                config.page.webTitle !== 'How to disable your adblocker for theguardian.com' &&
                storage.local.isStorageAvailable() &&
                !storage.local.get('gu.subscriber') &&
                storage.local.get('gu.alreadyVisited') > 5;
        };

        this.variants = [{
            id: 'control',
            test: function(){}
        }, {
            id: 'no-close',
            test: function () {
                detect.adblockInUse.then(function (adblockUsed) {
                    if (adblockUsed && isQualified()) {
                        var surveyOverlay = new SurveyAdBlock({
                            surveyHeader: 'Advertising helps fund our journalism',
                            surveyText: 'We know that advertising on the Internet can be frustrating. But we\'re continually working to make sure our ads are well behaved because we want to get it right and we depend on advertising revenue.',
                            surveyTextSecond: 'Please allow us to show you adverts.',
                            surveyTextThird: '<hr /><p class="survey-text__info">How to allow ads on the Guardian with AdBlock or AdBlock Plus (<a class="text-link" href="/info/2016/mar/21/how-to-disable-your-adblocker-for-theguardiancom?INTCMP=ADB_RESP_no-close">detailed instructions</a>)</p><div class="image-link-container"><img src="' + config.images.commercial['abp-whitelist-instruction-chrome'] + '"/></div><p class="survey-text__info"><strong>Ad Block:</strong> Click the <img alt="adblock" src="' + config.images.commercial['ab-icon'] + '" width="20px"/> icon &#x2794; &quot;Don\'t run on pages on this domain&quot; &#x2794; &quot;Exclude&quot;</p><p class="survey-text__info"><strong>Ad Block Plus:</strong> Click the <img alt="adblock plus" src="' + config.images.commercial['abp-icon'] + '" width="20px"/> icon &#x2794; &quot;Disable on theguardian.com&quot;</p>',
                            surveyTextMembership: 'Already paying? <a class=\"text-link\" href=\"https://profile.theguardian.com/signin?INTCMP=ADB_RESP_no-close\" data-link-name=\"adblock supporter no-close\">supporter sign in</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a class=\"text-link\" href=\"/commercial/subscriber-number" data-link-name=\"adblock subscriber no-close\">subscriber sign in</a>',
                            subscriberLink: '/commercial/subscriber-number',
                            subscriberText: 'Subscriber number',
                            subscriberDataLink: 'adblock subscriber no-close',
                            showCloseBtn: false
                        });
                        surveyOverlay.attach();
                        surveyOverlay.show();
                    }
                });
            }
        }, {
            id: 'immediate-close',
            test: function () {
                detect.adblockInUse.then(function (adblockUsed) {
                    if (adblockUsed && isQualified()) {
                        var surveyOverlay = new SurveyAdBlock({
                            surveyHeader: 'Advertising helps fund our journalism',
                            surveyText: 'We know that advertising on the Internet can be frustrating. But we\'re continually working to make sure our ads are well behaved because we want to get it right and we depend on advertising revenue.',
                            surveyTextSecond: 'Please allow us to show you adverts.',
                            surveyTextThird: '<hr /><p class="survey-text__info">How to allow ads on the Guardian with AdBlock or AdBlock Plus (<a class="text-link" href="/info/2016/mar/21/how-to-disable-your-adblocker-for-theguardiancom?INTCMP=ADB_RESP_immediate-close">detailed instructions</a>)</p><div class="image-link-container"><img src="' + config.images.commercial['abp-whitelist-instruction-chrome'] + '"/></div><p class="survey-text__info"><strong>Ad Block:</strong> Click the <img alt="adblock" src="' + config.images.commercial['ab-icon'] + '" width="20px"/> icon &#x2794; &quot;Don\'t run on pages on this domain&quot; &#x2794; &quot;Exclude&quot;</p><p class="survey-text__info"><strong>Ad Block Plus:</strong> Click the <img alt="adblock plus" src="' + config.images.commercial['abp-icon'] + '" width="20px"/> icon &#x2794; &quot;Disable on theguardian.com&quot;</p>',
                            surveyTextMembership: 'Already paying? <a class=\"text-link\" href=\"https://profile.theguardian.com/signin?INTCMP=ADB_RESP_immediate-close\" data-link-name=\"adblock supporter immediate-close\">supporter sign in</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a class=\"text-link\" href=\"/commercial/subscriber-number" data-link-name=\"adblock subscriber immediate-close\">subscriber sign in</a>',
                            subscriberLink: '/commercial/subscriber-number',
                            subscriberText: 'Subscriber number',
                            subscriberDataLink: 'adblock subscriber immediate-close',
                            showCloseBtn: true
                        });
                        surveyOverlay.attach();
                        surveyOverlay.show();
                    }
                });
            }
        }, {
            id: 'delayed-close',
            test: function () {
                detect.adblockInUse.then(function (adblockUsed) {
                    if (adblockUsed && isQualified()) {
                        var surveyOverlay = new SurveyAdBlock({
                            surveyHeader: 'Advertising helps fund our journalism',
                            surveyText: 'We know that advertising on the Internet can be frustrating. But we\'re continually working to make sure our ads are well behaved because we want to get it right and we depend on advertising revenue.',
                            surveyTextSecond: 'Please allow us to show you adverts.',
                            surveyTextThird: '<hr /><p class="survey-text__info">How to allow ads on the Guardian with AdBlock or AdBlock Plus (<a class="text-link" href="/info/2016/mar/21/how-to-disable-your-adblocker-for-theguardiancom?INTCMP=ADB_RESP_delayed-close">detailed instructions</a>)</p><div class="image-link-container"><img src="' + config.images.commercial['abp-whitelist-instruction-chrome'] + '"/></div><p class="survey-text__info"><strong>Ad Block:</strong> Click the <img alt="adblock" src="' + config.images.commercial['ab-icon'] + '" width="20px"/> icon &#x2794; &quot;Don\'t run on pages on this domain&quot; &#x2794; &quot;Exclude&quot;</p><p class="survey-text__info"><strong>Ad Block Plus:</strong> Click the <img alt="adblock plus" src="' + config.images.commercial['abp-icon'] + '" width="20px"/> icon &#x2794; &quot;Disable on theguardian.com&quot;</p>',
                            surveyTextMembership: 'Already paying? <a class=\"text-link\" href=\"https://profile.theguardian.com/signin?INTCMP=ADB_RESP_delayed-close\" data-link-name=\"adblock supporter delayed-close\">supporter sign in</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a class=\"text-link\" href=\"/commercial/subscriber-number" data-link-name=\"adblock subscriber delayed-close\">subscriber sign in</a>',
                            subscriberLink: '/commercial/subscriber-number',
                            subscriberText: 'Subscriber number',
                            subscriberDataLink: 'adblock subscriber delayed-close',
                            showCloseBtn: 'delayed'
                        });
                        surveyOverlay.attach();
                        surveyOverlay.show();
                    }
                });
            }
        }];

    };

});
