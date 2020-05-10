import { html, fixture, expect } from '@open-wc/testing';

import {PatternUnlock} from '../src/PatternUnlock.js';
import '../pattern-unlock.js';

describe('PatternUnlock', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: PatternUnlock = await fixture(html`
      <pattern-unlock></pattern-unlock>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el: PatternUnlock = await fixture(html`
      <pattern-unlock></pattern-unlock>
    `);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el: PatternUnlock = await fixture(html`
      <pattern-unlock title="attribute title"></pattern-unlock>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el: PatternUnlock = await fixture(html`
      <pattern-unlock></pattern-unlock>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
