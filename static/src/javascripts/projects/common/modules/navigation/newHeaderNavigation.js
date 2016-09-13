define([
    'common/utils/fastdom-promise',
    'common/utils/$',
    'common/modules/navigation/edition-picker',
    'common/modules/navigation/editionalise-menu',
    'common/utils/details-polyfill'
], function (
    fastdomPromise,
    $,
    editionPicker,
    editionaliseMenu,
    detailsPolyfill
) {
    var html = $('html');
    var veggieBurgerLink = $('.js-change-link');
    var primaryItems = $('.js-close-nav-list');

    function closeAllOtherPrimaryLists(targetItem) {
        primaryItems.each(function (item) {

            if (item !== targetItem) {
                item.removeAttribute('open');
            }
        });
    }

    function enhanceMenu() {
        if (!$('#new-header__nav__checkbox')[0].checked) {
            fastdomPromise.write(function () {
                var firstButton = $('.main-navigation__item__button')[0];

                if (firstButton) {
                    firstButton.focus();
                }
                // Prevents scrolling on the body
                html.css('overflow', 'hidden');
            });
        } else {
            fastdomPromise.write(function () {
                var mainListItems = $('.main-navigation__item');
                // Remove possible ordering for the lists
                mainListItems.removeAttr('style');
                // No targetItem to put in as the parameter. All lists should close.
                closeAllOtherPrimaryLists();
                // Users should be able to scroll again
                html.css('overflow', '');
            });
        }
    }

    function moveTargetListToTop(targetListId) {
        primaryItems.each(function (listItem, index) {

            fastdomPromise.read(function () {
                return listItem.getAttribute('id');
            }).then(function (itemId) {

                if (itemId === targetListId) {
                    fastdomPromise.write(function () {
                        var parent = listItem.parentNode;
                        var menuContainer = $('.js-reset-scroll-on-menu');

                        // Using flexbox to reorder lists based on what is clicked.
                        parent.style.order = '-' + index;

                        // Make sure when the menu is open, the user is always scrolled to the top
                        menuContainer[0].scrollTop = 0;
                    });
                }
            });
        });
    }

    function bindPrimaryLinkClickEvents() {
        var primaryLinks = $('.js-open-section-in-menu');

        primaryLinks.each(function (primaryLink) {

            primaryLink.addEventListener('click', function () {
                fastdomPromise
                    .read(function () {
                        return primaryLink.getAttribute('aria-controls');
                    })
                    .then(function (id) {
                        var menuToOpen = $('#' + id);
                        var menuButton = $('.main-navigation__item__button', menuToOpen);

                        fastdomPromise
                            .write(function () {
                                menuToOpen.attr('open', '');
                                return id;
                            })
                            .then(moveTargetListToTop.bind(id))
                            .then(function () {
                                menuButton.focus();
                            })
                            .then(function () {
                                // Prevents scrolling on the body
                                html.css('overflow', 'hidden');
                            });
                    });
            });
        });
    }

    function bindPrimaryItemClickEvents() {
        primaryItems.each(function (item) {
            item.addEventListener('click', closeAllOtherPrimaryLists.bind(null, item));
        });
    }

    function init() {
        detailsPolyfill.init('.main-navigation__item__button');

        veggieBurgerLink[0].addEventListener('click', enhanceMenu);

        bindPrimaryItemClickEvents();
        bindPrimaryLinkClickEvents();

        editionPicker();
        editionaliseMenu();
    }

    return init;
});
