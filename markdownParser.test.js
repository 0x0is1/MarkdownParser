const { MDParser } = require('./markdownParser');
const { expect } = require('chai');

const markdownInput = `# Heading 1
Some **bold** and *italic* text.

- List item 1
- List item 2
- Sublist item

[Link](https://example.com)

![Image](https://example.com/image.jpg)`;

const expectedHTML = `<h1>Heading 1</h1>
<p>Some <strong>bold</strong> and <em>italic</em> text.</p>

<ul>
<li>List item 1</li>
<li>List item 2</li>
<li>Sublist item</li>
</ul>

<p><a href="https://example.com">Link</a></p>

<p><img alt="Image" src="https://example.com/image.jpg"></p>
`;

const htmlInput = `<h1>Heading 1</h1>
<p>Some <strong>bold</strong> and <em>italic</em> text.</p>

<ul>
<li>List item 1</li>
<li>List item 2</li>
<li>Sublist item</li>
</ul>

<p><a href="https://example.com">Link</a></p>

<p><img alt="Image" src="https://example.com/image.jpg"></p>`;

const expectedMarkdown = `# Heading 1
Some **bold** and *italic* text.

- List item 1
- List item 2
- Sublist item

[Link](https://example.com)

![Image](https://example.com/image.jpg)
`;

describe('Markdown Parser', () => {
    let parser;

    beforeEach(() => {
        parser = new MDParser();
    });

    describe('MD2HTML', () => {
        it('should convert Markdown to HTML', () => {
            const html = parser.MD2HTML(markdownInput);
            expect(html).to.equal(expectedHTML);
        });
    });

    describe('HTML2MD', () => {
        it('should convert HTML to Markdown', () => {
            const markdown = parser.HTML2MD(htmlInput);
            expect(markdown).to.equal(expectedMarkdown);
        });
    });
});
