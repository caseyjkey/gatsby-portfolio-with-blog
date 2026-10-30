import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  test('uses the conversation heading without the decorative Contact title', () => {
    const markup = renderToStaticMarkup(<ContactForm />);

    expect(markup).toContain('Start a Conversation');
    expect(markup).not.toContain('class="big"');
    expect(markup).not.toContain('>Contact</h1>');
  });
});
