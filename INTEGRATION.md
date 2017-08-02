# ShopGun Integration

The ShopGun JavaScript SDK allows you to make your PDF publications available on your own website without referring users to external sites or using iframes.

## Creating an App

First, you need to [create a ShopGun app](https://business.shopgun.com/developers/apps) allowing you to make API requests. You will be prompted to create a new user first.

When you've created the app please email CTO Morten Bo at mr@shopgun.com to get your app approved so that it doesn't get rate limited.

## Installing the SDK

To install the SDK, please see our [README](https://github.com/shopgun/shopgun-js-sdk/blob/develop/README.md) where to specifies how to install and configure the SDK.

## Making API Requests

Now that you have an approved API key and installed the SDK you are ready to start making API requests. The ShopGun API is purely JSON data based meaning you're in charge of doing the presentation of the data.

To get a list of publications you simply do:

```javascript
SGN.CoreKit.request({
    url: '/v2/catalogs',
    qs: {
        order_by: '-publication_date',
        dealer_id: 'YOUR_ID',
        limit: 20
    }
}, function (err, res) {
    if (err) {
        console.log('Present an error to the user.');
    } else {
        // Loop through `res` and present the data.
    }
});
```

As you can see it's rather easy to get the published publications. Each publication has 2 dates included (`run_from` and `run_till`) that can become handy if you want to present users with the currently active publication and the upcoming publication.

## Reading a Publication

When the user clicks one of the presented publications you can provide a reading experience using the `PagedPublicationKit`. The kit doesn't provide any chrome UI (header, back button, thumbnail overview etc.). It provides a barebone solution with reading support, hotspots, back/forward buttons, page label, progress bar etc. It's up to you to make it your own experience. To see an example of how to use the kit head to the [kitchensink example](https://github.com/shopgun/shopgun-js-sdk/tree/develop/kitchensink/kits/paged_publication/example1).

## Event Tracking

As you can see from the kitchensink example you can embed an event tracker allowing you to see how well the publication performs. The track identifier is the same value as your new API key.

## Clicking Offers

When the user clicks an offer it's up to you to define what should happen. You could add the offer to your website's shopping list, present the offer in a modal or a third option. It's up to you and that's one of the strengths of the kit.

## Mobile Optimization

Be sure to include this meta tag in your head:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```