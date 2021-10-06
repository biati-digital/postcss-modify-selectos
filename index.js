/**
 * PostCSS Modify Selectors
 *
 * @author biati.digital
 * @url https://www.biati.digital
 * @license MIT
 */

module.exports = (opts = {}) => {
    let options = {
        replace: null,
        prefix: null,
        suffix: null,
        modify: null,
        ...opts
    };

    return {
        postcssPlugin: 'modify-selectors',
        Once(css, { list }) {
            css.walkRules((rule) => {
                let updatedSelectors = [];
                rule.selectors.forEach((val, index) => {
                    val = val.trim();

                    if (options.replace && options.replace.length) {
                        options.replace.forEach((replacer) => {
                            const matches = checkSelectorMatch(val, replacer.match);
                            if (matches) {
                                val = replacer.with;
                            }
                        });
                    }

                    if (options.prefix && options.prefix.length) {
                        options.prefix.forEach((prefixer) => {
                            const matches = checkSelectorMatch(val, prefixer.match);
                            if (matches) {
                                val = `${prefixer.with} ${val}`;
                            }
                        });
                    }

                    if (options.suffix && options.suffix.length) {
                        options.suffix.forEach((suffixer) => {
                            const matches = checkSelectorMatch(val, suffix.match);
                            if (matches) {
                                val = `${val} ${suffix.with}`;
                            }
                        });
                    }

                    if (options.modify && options.modify.length) {
                        options.modify.forEach((modifier) => {
                            const matches = checkSelectorMatch(val, modifier.match);
                            if (matches && typeof modifier == 'function') {
                                val = modifier(val);
                            }
                        });
                    }

                    updatedSelectors.push(val);
                });

                if (updatedSelectors.length) {
                    rule.selectors = updatedSelectors;
                }
            });

            function checkSelectorMatch(selector, match) {
                let matches = false;
                if (typeof match == 'string' && match == selector) {
                    matches = true;
                } else {
                    try {
                        matches = selector.match(match);
                    } catch (error) {}
                }
                return matches;
            }
        }
    };
};

module.exports.postcss = true;
