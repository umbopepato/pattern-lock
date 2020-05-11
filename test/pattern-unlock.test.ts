import { html, fixture, expect } from '@open-wc/testing';

import {PatternLock} from '../src/pattern-lock.js';
import '../pattern-lock.js';
//
// describe('PatternUnlock', () => {
//   it('has a default title "Hey there" and counter 5', async () => {
//     const el: PatternUnlock = await fixture(html`
//       <pattern-lock></pattern-lock>
//     `);
//
//     expect(el.title).to.equal('Hey there');
//     expect(el.counter).to.equal(5);
//   });
//
//   it('increases the counter on button click', async () => {
//     const el: PatternUnlock = await fixture(html`
//       <pattern-lock></pattern-lock>
//     `);
//     el.shadowRoot!.querySelector('button')!.click();
//
//     expect(el.counter).to.equal(6);
//   });
//
//   it('can override the title via attribute', async () => {
//     const el: PatternUnlock = await fixture(html`
//       <pattern-lock title="attribute title"></pattern-lock>
//     `);
//
//     expect(el.title).to.equal('attribute title');
//   });
//
//   it('passes the a11y audit', async () => {
//     const el: PatternUnlock = await fixture(html`
//       <pattern-lock></pattern-lock>
//     `);
//
//     await expect(el).shadowDom.to.be.accessible();
//   });
// });
