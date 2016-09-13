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

    // TODO: move to standard, make generic
    function enhanceToButton() {
        var checkBox = $('.js-enhance-checkbox');
        var button = $.create('<button>');

        button.addClass('new-header__nav__button js-open-menu-button');
        button.attr('id', 'menu-toggle');
        button.attr('aria-controls', 'main-menu');
        button.attr('aria-expanded', 'false');

        fastdomPromise.write(function() {
            checkBox.replaceWith(button);
            button[0].addEventListener('click', veggieBurgerClickHandler);
        });
    }

    function veggieBurgerClickHandler() {
        var button = $('.js-open-menu-button');

        function menuIsOpen() {
            return (button.attr('aria-expanded') === 'true');
        }

        if (!menuIsOpen()) {
            fastdomPromise.write(function () {
                button.attr('aria-expanded', 'true');
                $('#main-menu').attr('aria-hidden', 'false');
                veggieBurgerLink.addClass('new-header__nav__menu-button--open');

                var firstButton = $('.main-navigation__item__button')[0];

                if (firstButton) {
                    firstButton.focus();
                }
                // No targetItem to put in as the parameter. All lists should close.
                closeAllOtherPrimaryLists();
                // Prevents scrolling on the body
                html.css('overflow', 'hidden');
            });
        } else {
            fastdomPromise.write(function () {
                button.attr('aria-expanded', 'false');
                $('#main-menu').attr('aria-hidden', 'true');
                veggieBurgerLink.removeClass('new-header__nav__menu-button--open');

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

        enhanceToButton();
        bindPrimaryItemClickEvents();
        bindPrimaryLinkClickEvents();

        editionPicker();
        editionaliseMenu();
    }

    return init;
});
