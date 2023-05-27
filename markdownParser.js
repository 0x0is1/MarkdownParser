class MDParser {
    constructor() {
        // Regular expressions for Markdown syntax
        this.headersRegex = /^(#{1,6})\s(.+)$/;
        this.listsRegex = /^(\s*)(\*|-)\s(.+)$/;
        this.emphasisRegex = /(\*|_)(.*?)\1/;
        this.strongRegex = /(\*\*|__)(.*?)\1/;
        this.codeRegex = /`(.+?)`/;
        this.linksRegex = /\[([^\]]+)\]\(([^)]+)\)/;
        this.imagesRegex = /!\[([^\]]+)\]\(([^)]+)\)/;

        // HTML template tags
        this.tags = {
            h1: (text) => `<h1>${text}</h1>`,
            h2: (text) => `<h2>${text}</h2>`,
            h3: (text) => `<h3>${text}</h3>`,
            h4: (text) => `<h4>${text}</h4>`,
            h5: (text) => `<h5>${text}</h5>`,
            h6: (text) => `<h6>${text}</h6>`,
            p: (text) => `<p>${text}</p>`,
            ul: (text) => `<ul>${text}</ul>`,
            em: (text) => `<em>${text}</em>`,
            li: (text) => `<li>${text}</li>`,
            strong: (text) => `<strong>${text}</strong>`,
            code: (text) => `<code>${text}</code>`,
            a: (text, href) => `<a href="${href}">${text}</a>`,
            img: (alt, src) => `<img alt="${alt}" src="${src}">`
        };

    }

    MD2HTML(input) {
        const lines = input.split('\n');
        let output = '';
        let inList = false;

        lines.forEach((line) => {
            if (this.headersRegex.test(line)) {
                const matches = line.match(this.headersRegex);
                const level = matches[1].length;
                const text = matches[2];
                output += this.tags[`h${level}`](text);
            } else if (this.listsRegex.test(line)) {
                const matches = line.match(this.listsRegex);
                const indent = matches[1].length / 2;
                const text = matches[3];
                const listItem = `${'  '.repeat(indent)}${this.tags.li(text)}`;

                if (!inList) {
                    output += '<ul>\n';
                    inList = true;
                }

                output += listItem;
            } else {
                line = line.replace(this.strongRegex, (match, p1, p2) => this.tags.strong(p2));
                line = line.replace(this.emphasisRegex, (match, p1, p2) => this.tags.em(p2));
                line = line.replace(this.codeRegex, (match, p1) => this.tags.code(p1));
                line = line.replace(this.imagesRegex, (match, p1, p2) => this.tags.img(p1, p2));
                line = line.replace(this.linksRegex, (match, p1, p2) => this.tags.a(p1, p2));

                if (inList) {
                    output += '</ul>\n';
                    inList = false;
                }

                if (line.trim() !== '') {
                    output += this.tags.p(line);
                }
            }

            output += '\n';
        });

        if (inList) {
            output += '</ul>';
        }

        return output;
    }
    HTML2MD(input) {
        let output = input;

        // Replace HTML tags with Markdown equivalents
        const tags = [
            { regex: /<h1>(.*?)<\/h1>/gs, replacement: '# $1' },
            { regex: /<h2>(.*?)<\/h2>/gs, replacement: '## $1' },
            { regex: /<h3>(.*?)<\/h3>/gs, replacement: '### $1' },
            { regex: /<h4>(.*?)<\/h4>/gs, replacement: '#### $1' },
            { regex: /<h5>(.*?)<\/h5>/gs, replacement: '##### $1' },
            { regex: /<h6>(.*?)<\/h6>/gs, replacement: '###### $1' },
            { regex: /<p>(.*?)<\/p>/gs, replacement: '$1\n' },
            { regex: /<em>(.*?)<\/em>/gs, replacement: '*$1*' },
            { regex: /<strong>(.*?)<\/strong>/gs, replacement: '**$1**' },
            { regex: /<code>(.*?)<\/code>/gs, replacement: '`$1`' },
            { regex: /<a href="([^"]+)">([^<]+)<\/a>/gs, replacement: '[$2]($1)' },
            { regex: /<img alt="([^"]+)" src="([^"]+)"[^>]*>/gs, replacement: '![$1]($2)' },
            { regex: /<\/?ul>/gs, replacement: '' },
            { regex: /<li>(.*?)<\/li>/gs, replacement: '- $1' }
        ];

        tags.forEach(tag => {
            output = output.replace(tag.regex, tag.replacement);
        });

        // Remove extra empty lines
        output = output.replace(/\n{3,}/g, '\n\n');

        return output;
    }


}

module.exports = {
    MDParser
};
