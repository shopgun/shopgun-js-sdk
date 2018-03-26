(function () {
    function IncitoPublication (options) {
        this.options = options || {};
        this.popover = null;
        this.detailsId = null;
        this.details = null;
        this.bootstrapper = new SGN.IncitoPublicationKit.Bootstrapper({
            el: this.options.el,
            id: this.options.id,
            eventTracker: this.options.eventTracker
        });
    }

    IncitoPublication.prototype.start = function (callback) {
        var self = this;

        this.bootstrapper.fetch(function (err, res) {
            if (err) {
                callback(err);
            } else {
                var incito = res.data.node.incito;
                var viewer = self.createViewer(incito);

                viewer.start();

                callback(null, viewer);
            }
        });
    };

    IncitoPublication.prototype.closeDetails = function () {
        if (this.details) {
            this.details.destroy();
            this.detailsId = null;
            this.details = null;
        }
    };

    IncitoPublication.prototype.closePopover = function () {
        if (this.popover) {
            this.popover.destroy();
            this.popover = null;
        }
    };

    IncitoPublication.prototype.scrollTo = function (elementY, duration) {
        var startingY = window.pageYOffset;
        var diff = elementY - startingY;
        var start;

        window.requestAnimationFrame(function step (timestamp) {
            if (!start) start = timestamp;

            var time = timestamp - start;
            var percent = Math.min(time / duration, 1);

            window.scrollTo(0, startingY + diff * percent);

            if (time < duration) {
                window.requestAnimationFrame(step);
            }
        });
    };

    IncitoPublication.prototype.createViewer = function (incito) {
        return this.bootstrapper.createViewer({
            incito: incito
        });
    };

    IncitoPublication.prototype.pickProduct = function (e, callback) {
        this.closeDetails();
        this.closePopover();

        this.popover = SGN.CoreUIKit.singleChoicePopover({
            el: document.body,
            header: SGN.translations.t('incito_publication.product_picker.header'),
            x: e.originalEvent.clientX,
            y: e.originalEvent.clientY,
            items: e.meta.products.map(function (product) {
                return {
                    title: product.title
                };
            })
        }, callback);
    };

    IncitoPublication.prototype.showOffer = function (ctx) {
        if (incitoPublication.detailsId === ctx.id) {
            incitoPublication.closeDetails();

            return;
        }

        incitoPublication.closeDetails();

        var contentEl = document.createElement('div');
        var rect = ctx.el.getBoundingClientRect();

        contentEl.innerHTML = 'insert your custom HTML here';

        incitoPublication.detailsId = ctx.id;
        incitoPublication.details = new SGN.CoreUIKit.OfferDetails({
            anchorEl: ctx.el,
            contentEl: contentEl
        });
        incitoPublication.details.appendTo(document.body);

        var threshold = incitoPublication.details.el.offsetHeight;

        if (rect.height + rect.top > window.innerHeight - threshold) {
            incitoPublication.scrollTo(rect.top + window.pageYOffset - (window.innerHeight - rect.height) + threshold, 300);
        }
    };

    var el = document.querySelector('.sgn__incito');
    var incitoPublication = new IncitoPublication({
        el: el,
        id: SGN.util.getQueryParam('id'),
        eventTracker: SGN.config.get('eventTracker')
    });

    incitoPublication.start(function (err, viewer) {
        if (err) {
            return;
        }
        
        SGN.CoreUIKit.on(el, 'click', '.incito__view[data-role="offer"]', function (e) {
            var id = this.getAttribute('data-id');
            var meta = viewer.incito.ids[id];

            if (!meta) {
                return;
            }

            incitoPublication.showOffer({
                originalEvent: e,
                id: id,
                meta: meta,
                el: this
            });
        });
    
        SGN.CoreUIKit.on(el, 'contextmenu', '.incito__view[data-role="offer"]', function (e) {
            var id = this.getAttribute('data-id');
            var meta = viewer.incito.ids[id];

            if (!meta || !Array.isArray(meta.products)) {
                return false;
            }

            incitoPublication.pickProduct({
                originalEvent: e,
                id: id,
                meta: meta,
                el: this
            }, function (product) {
                console.log('product selected', product);
            });
    
            return false;
        });
    });
})();