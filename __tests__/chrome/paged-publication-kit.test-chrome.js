const {setDefaultOptions} = require('expect-puppeteer');
setDefaultOptions({timeout: 4000});

const PPPath = `file:${__dirname}/../../examples/paged-publication.html`;

describe('Chrome: Paged Publication', () => {
    let page;
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(PPPath);
    });
    it('Should display "Make your PDF alive with ShopGun." text on page', async () => {
        await expect(page).toMatch('Make your PDF alive with ShopGun.');
    });

    it('Should load with the intro active', async () => {
        await expect(page).toMatchElement('#intro[data-active="true"]');
    });

    it('Should go to next page when clicking the next page thingie', async () => {
        await expect(page).toMatchElement('#intro[data-active="true"]');
        await expect(page).toClick('.sgn-pp__control[data-direction="next"]');
        await expect(page).not.toMatchElement('#intro[data-active="true"]');
        await expect(page).toMatchElement(
            '[data-active="true"][data-id="double-0"]'
        );
    });
});
